import { GoogleGenerativeAI } from '@google/generative-ai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { SYSTEM_PROMPT, formatContextMessage } from './prompts';

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
			// Log the structure of our IDs
			console.log('[PirateGPT] Analyzing section IDs structure:', sectionIds.map(id => {
				const [chapterNum, sectionType, sectionNum] = id.split('-');
				return { id, chapterNum, sectionType, sectionNum };
			}));

			// Extract chapter numbers and section types
			const chapterNumbers = sectionIds.map(id => parseInt(id.split('-')[0], 10));
			const sectionTypes = [...new Set(sectionIds.map(id => id.split('-')[1]))];

			// Try to get content by chapter numbers and section types
			const query = `
				WITH chapter_data AS (
					SELECT 
						c.id,
						c.chapter_number,
						c.title AS chapter_title
					FROM chapters c
					WHERE c.chapter_number IN (${chapterNumbers.map(() => '?').join(',')})
				)
				SELECT 
					cs.id AS section_id,
					cs.section_name,
					cs.content,
					cd.chapter_number,
					cd.chapter_title
				FROM 
					chapter_sections cs
				JOIN
					chapter_data cd ON cs.chapter_id = cd.id
				WHERE 
					cs.section_name LIKE ?
			`;

			console.log('[PirateGPT] Executing D1 query:', {
				query,
				chapterNumbers,
				sectionTypes,
				params: [...chapterNumbers, `%${sectionTypes[0]}%`]
			});

			try {
				const { results } = await c.env.OP_SCRAPER_DB.prepare(query)
					.bind(...chapterNumbers, `%${sectionTypes[0]}%`)
					.all();

				console.log('[PirateGPT] D1 query results:', {
					resultsLength: results?.length || 0,
					results: results
				});

				if (results && results.length > 0) {
					// Type safe mapping of database results
					mangaContent = results.map((item) => ({
						chapterInfo: `Chapter ${String(item.chapter_number || '')}${item.chapter_title ? `: "${String(item.chapter_title)}"` : ''}`,
						sectionName: String(item.section_name || ''),
						content: String(item.content || ''),
					}));
					console.log('[PirateGPT] Mapped manga content:', mangaContent);
				} else {
					console.log('[PirateGPT] No results found with chapter numbers and section types');
					
					// Try a simpler query just by chapter numbers
					const simpleQuery = `
						WITH chapter_data AS (
							SELECT 
								c.id,
								c.chapter_number,
								c.title AS chapter_title
							FROM chapters c
							WHERE c.chapter_number IN (${chapterNumbers.map(() => '?').join(',')})
						)
						SELECT 
							cs.id AS section_id,
							cs.section_name,
							cs.content,
							cd.chapter_number,
							cd.chapter_title
						FROM 
							chapter_sections cs
						JOIN
							chapter_data cd ON cs.chapter_id = cd.id
					`;

					console.log('[PirateGPT] Trying simpler query:', {
						query: simpleQuery,
						chapterNumbers
					});

					const { results: simpleResults } = await c.env.OP_SCRAPER_DB.prepare(simpleQuery)
						.bind(...chapterNumbers)
						.all();

					if (simpleResults && simpleResults.length > 0) {
						mangaContent = simpleResults.map((item) => ({
							chapterInfo: `Chapter ${String(item.chapter_number || '')}${item.chapter_title ? `: "${String(item.chapter_title)}"` : ''}`,
							sectionName: String(item.section_name || ''),
							content: String(item.content || ''),
						}));
						console.log('[PirateGPT] Found content with simpler query:', mangaContent);
					} else {
						console.log('[PirateGPT] No results found with simpler query for chapter numbers:', chapterNumbers);
						
						// Try one last time with just the chapter numbers directly
						const directQuery = `
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
								c.chapter_number IN (${chapterNumbers.map(() => '?').join(',')})
						`;

						console.log('[PirateGPT] Trying direct query:', {
							query: directQuery,
							chapterNumbers
						});

						const { results: directResults } = await c.env.OP_SCRAPER_DB.prepare(directQuery)
							.bind(...chapterNumbers)
							.all();

						if (directResults && directResults.length > 0) {
							mangaContent = directResults.map((item) => ({
								chapterInfo: `Chapter ${String(item.chapter_number || '')}${item.chapter_title ? `: "${String(item.chapter_title)}"` : ''}`,
								sectionName: String(item.section_name || ''),
								content: String(item.content || ''),
							}));
							console.log('[PirateGPT] Found content with direct query:', mangaContent);
						} else {
							console.log('[PirateGPT] No results found with any query strategy');
						}
					}
				}
			} catch (error) {
				console.error('[PirateGPT] Error executing D1 query:', error);
			}
		}

		// Format the context message with chapter and section information
		let contextParts: string[] = [];
		if (mangaContent.length > 0) {
			// Sort content by chapter number for better context flow
			mangaContent.sort((a, b) => {
				const aNum = parseInt(a.chapterInfo.split(' ')[1]);
				const bNum = parseInt(b.chapterInfo.split(' ')[1]);
				return aNum - bNum;
			});

			mangaContent.forEach((content) => {
				const sectionHeader = `${content.chapterInfo} - ${content.sectionName}`;
				const formattedContent = `${sectionHeader}\n${content.content}`;
				contextParts.push(formattedContent);
			});
		}

		console.log('[PirateGPT] Context parts:', contextParts);
		const contextMessage = formatContextMessage(contextParts);
		console.log('[PirateGPT] Context message:', contextMessage);

		// Before AI response
		console.log('[PirateGPT] Generating AI response');

		// Initialize Google AI Studio
		const genAI = new GoogleGenerativeAI(c.env.GOOGLE_API_KEY);
		const model = genAI.getGenerativeModel(
			{ model: "gemini-2.0-flash-lite	" },
			{
				baseUrl: `https://gateway.ai.cloudflare.com/v1/${c.env.CLOUDFLARE_ACCOUNT_ID}/${c.env.CLOUDFLARE_GATEWAY_NAME}/google-ai-studio`,
			}
		);

		// Prepare the prompt with context and system message
		const prompt = [
			...(contextMessage ? [contextMessage] : []),
			SYSTEM_PROMPT,
			question
		].join('\n\n');

		// Generate response
		const result = await model.generateContent(prompt);
		const response = result.response;
		const answer = response.text() || 'No response generated';

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
