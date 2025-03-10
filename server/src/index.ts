import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Create a new Hono app with typed environment from worker-configuration.d.ts
const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware to allow requests from the NextJS app
app.use(
	'*',
	cors({
		origin: (origin) => {
			// Allow localhost for development
			if (origin?.includes('localhost')) return origin;
			// Allow preview deployments on Vercel
			if (origin?.endsWith('agnilabs.vercel.app')) return origin;
			// Allow production domain
			if (origin === 'https://pirategpt.agnilabs.xyz') return origin;
			// Default: deny other origins
			return null;
		},
		allowMethods: ['GET', 'POST'],
		allowHeaders: ['Content-Type'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	})
);

app.get('/', (c) => c.text('Hello Pirate GPT!'));

// Define interfaces for the One Piece database schema
interface Chapter {
	id: number;
	chapter_number: number;
	title: string;
	url: string;
	processed_at: string;
	chunks_count: number;
}

interface ChapterSection {
	id: number;
	chapter_id: number;
	section_name: string;
	content: string;
}

// Define interface for the query result
interface QueryResult {
	section_id: number;
	section_name: string;
	content: string;
	chapter_number: number;
	chapter_title: string | null;
}

// Query endpoint for One Piece manga RAG
app.get('/query', async (c) => {
	const question = c.req.query('text');
	console.log('[PirateGPT] Received query:', {
		text: question,
		url: c.req.url,
		method: c.req.method,
		headers: c.req.header(),
		origin: c.req.header('origin'),
	});

	if (!question) {
		console.log('[PirateGPT] Error: No question provided');
		return c.text('No question provided', 400);
	}

	try {
		console.log('[PirateGPT] Generating embeddings for query');
		// Generate embeddings for the query
		const embeddings = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', { text: question });
		const vectors = embeddings.data[0];
		console.log('[PirateGPT] Embeddings generated successfully');

		console.log('[PirateGPT] Querying vector index');
		// Query the vector index to find relevant manga information
		const vectorQuery = await c.env.OP_VECTOR_INDEX.query(vectors, { topK: 5 });
		console.log('[PirateGPT] Vector query complete, matches:', vectorQuery.matches?.length || 0);

		let sectionIds: string[] = [];
		if (vectorQuery.matches && vectorQuery.matches.length > 0) {
			sectionIds = vectorQuery.matches.map((match) => match.id);
			console.log('[PirateGPT] Found section IDs:', sectionIds);
		} else {
			console.log('[PirateGPT] No matching vectors found or vectorQuery.matches is empty');
		}

		// Array to hold the formatted manga content
		let mangaContent: { chapterInfo: string; sectionName: string; content: string }[] = [];

		if (sectionIds.length > 0) {
			// Using placeholders for multiple IDs
			const placeholders = sectionIds.map(() => '?').join(',');

			// Join chapter_sections with chapters to get complete information
			const query = `
				SELECT 
					cs.id AS section_id,
					cs.section_name,
					cs.content,
					c.chapter_number,
					c.title AS chapter_title
				FROM 
					chapter_sections cs
				JOIN
					chapters c ON cs.chapter_id = c.id
				WHERE 
					cs.id IN (${placeholders})
			`;

			const { results } = await c.env.OP_SCRAPER_DB.prepare(query)
				.bind(...sectionIds)
				.all();

			if (results && results.length > 0) {
				// Type safe mapping of database results
				mangaContent = results.map((item) => ({
					chapterInfo: `Chapter ${String(item.chapter_number || '')}${item.chapter_title ? `: "${String(item.chapter_title)}"` : ''}`,
					sectionName: String(item.section_name || ''),
					content: String(item.content || ''),
				}));
			}
		}

		// Format the context message with chapter and section information
		let contextParts: string[] = [];
		if (mangaContent.length > 0) {
			mangaContent.forEach((content) => {
				const sectionHeader = `${content.chapterInfo} - ${content.sectionName}`;
				const formattedContent = `${sectionHeader}\n${content.content}`;
				contextParts.push(formattedContent);
			});
		}

		const contextMessage = contextParts.length > 0 ? `Context from One Piece manga:\n\n${contextParts.join('\n\n')}` : '';

		// Create a One Piece specific system prompt
		const systemPrompt = `You are PirateGPT, an AI assistant specialized in the One Piece manga. 
You are an expert on the world of One Piece, the characters, plot developments, and the lore.
When answering questions, use the provided context from the manga when relevant.
If you don't know the answer or it's not in the context, be honest about it.
Answer in the style of a knowledgeable One Piece fan, but remain factual and accurate.
You can reference specific chapters when that information is available in the context.`;

		// Before AI response
		console.log('[PirateGPT] Generating AI response');

		// Generate AI response using the manga context
		const aiResponse: any = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', {
			messages: [
				...(contextMessage ? [{ role: 'system', content: contextMessage }] : []),
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: question },
			],
		});

		// Extract the answer from the AI response
		const answer = aiResponse.response || aiResponse.text || 'No response generated';

		// After AI response
		console.log('[PirateGPT] AI response generated successfully');

		return c.text(answer);
	} catch (error) {
		console.error('[PirateGPT] Error processing query:', error);
		return c.text('Error processing your question about One Piece. Please try again.', 500);
	}
});

export default app;

export class RAGWorkflow {
	async run(event: any, step: { do: (arg0: string, arg1: () => Promise<void>) => any }) {
		await step.do('example step', async () => {
			console.log('Hello World!');
		});
	}
}
