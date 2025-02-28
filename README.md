# PirateGPT

chat with One Piece 🏴‍☠️

a fun chat app using AI to chat with the entire One Piece manga.

> ⚠️ important: this project is still in development

# todo: front-end

- [ ] setup drizzle with d1 for client-side data management
- [ ] create responsive chat interface with message history
- [ ] implement streaming responses from AI
- [ ] add character selection interface (chat with specific characters)
- [ ] auth? clerk? maybe phase 2
- [ ] integrate AI SDK for front-end interactions with the model
- [ ] add loading states and error handling for API requests

# todo: data processing

- [x] scrape one piece chapters
- [x] put them in store (D1 database)
- [x] chunk manga content for efficient retrieval
- [x] setup vector store for embeddings

# todo: back-end implementation

- [ ] design and implement API endpoints for chat interactions
- [ ] create serverless functions on Cloudflare Workers
- [ ] implement authentication and session management
- [ ] set up database models and relationships
- [ ] configure Durable Objects for stateful conversation management
- [ ] develop middleware for request validation and processing

# todo: RAG implementation

- [ ] implement retrieval logic to fetch relevant manga content
- [ ] optimize vector search for speed and relevance
- [ ] create prompt engineering templates for consistent AI responses
- [ ] implement context window management for long conversations
- [ ] add character-specific knowledge and personality filters

# todo: pipeline & deployment

- [ ] build CI/CD pipeline for Cloudflare deployment
- [ ] implement caching strategy for frequent queries
- [ ] setup monitoring and analytics for usage patterns
- [ ] optimize Cloudflare Workers for performance
- [ ] connect front-end to back-end through API endpoints
- [ ] implement rate limiting and usage quotas

# todo: testing & polish

- [ ] create automated tests for RAG accuracy
- [ ] perform user testing for UI/UX improvements
- [ ] benchmark performance across different load scenarios
- [ ] documentation for API endpoints and usage
