# EPAS CNTV

Official web platform for the European Parliament Ambassador School (EPAS) program at Colegiul Național „Tudor Vladimirescu” (CNTV), built for the 2023–2024 school year and the **Made for Europe** national contest.

> The website is no longer hosted live, but archived snapshots can be viewed on the [Internet Archive](https://web.archive.org/web/*/https://epas-cntv.com).

## Features

- **Interactive EU Trivia**: Session-based quiz with randomized questions, scoring, and an admin leaderboard.
- **Educational Tools**: Study flashcards, European Parliament guides, and MEP meeting summaries.
- **Activities & Blog**: School initiatives, project showcases, and team archives.

## Tech Stack

Node.js, Express, TypeScript, MongoDB (Mongoose), and EJS.

## Setup

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run in development
npm run dev

# Build and run in production
npm run build
npm start
```

## Environment Variables

See [.env.example](.env.example) for all available options:

- `DATABASE_URI` - MongoDB connection string
- `ADMIN_USER` / `ADMIN_PASS` - Credentials for `/admin` routes
- `PORT` - Server port (defaults to `3000`)
- `MAINTENANCE_MODE` - Enable maintenance notice (`true`/`false`)

## License

[MIT](LICENSE)
