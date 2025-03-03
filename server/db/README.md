# PirateGPT Chat Database

This directory contains database schema and migration files for the PirateGPT chat application.

## Schema

The `schema.sql` file defines the database structure for storing chat data, including:

- Users
- Conversations
- Messages
- Manga References to One Piece content

## Applying the Schema

To create the database tables defined in the schema, run:

```bash
npx wrangler d1 execute pirategpt-chat-db --file=./db/schema.sql
```

## Sample Data

The `sample_data.sql` file contains sample data for testing the application. To insert this data:

```bash
npx wrangler d1 execute pirategpt-chat-db --file=./db/sample_data.sql
```

The sample data includes:

- 3 example users
- 3 conversations
- 8 chat messages (4 from users, 4 from the assistant)
- 9 manga references linking to specific One Piece chapters

## Running Individual SQL Commands

You can also execute SQL commands directly:

```bash
npx wrangler d1 execute pirategpt-chat-db --command="SELECT * FROM users LIMIT 10;"
```

## Local Development

For local development, use:

```bash
npx wrangler d1 execute pirategpt-chat-db --local --file=./db/schema.sql
npx wrangler d1 execute pirategpt-chat-db --local --file=./db/sample_data.sql
```

## Troubleshooting

If you encounter SQL syntax errors:

- Avoid using reserved keywords as table or column names
- Use proper quotes for string values
- Check that all SQL statements end with semicolons
