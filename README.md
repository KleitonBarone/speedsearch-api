# SpeedSearch ⚡

SpeedSearch is a high-performance, real-time search API built with **Next.js**, **Hono**, and **Redis**. It demonstrates sub-millisecond search capabilities by leveraging Redis sorted sets for prefix matching, providing a "search-as-you-type" experience with extreme efficiency.

## 🚀 Features

- **Blazing Fast**: Sub-millisecond search performance.
- **Search-as-you-type**: Real-time results as the user inputs text.
- **Modern Tech Stack**: Built with Next.js, Hono (as API framework), and Redis.
- **Beautiful UI**: Clean, responsive interface with dark mode support and smooth animations using Tailwind CSS 4.
- **Developer Friendly**: Fully typed with TypeScript, linted with Biome, and tested with Vitest.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **API Runtime**: [Hono](https://hono.dev/)
- **Database**: [Redis](https://redis.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Code Quality**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (check `.nvmrc` for version)
- [Docker](https://www.docker.com/) (for running local Redis)
- [npm](https://www.npmjs.com/) or any other package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd speedsearch-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   *Modify `.env` if your Redis configuration differs.*

### Running the Services

1. Spin up the Redis container:
   ```bash
   npm run dev:services:up
   ```

2. Seed the database (populates Redis with a list of countries):
   ```bash
   npm run dev:seed
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run dev:services:up`: Starts the local Redis service via Docker.
- `npm run dev:services:down`: Stops the local Redis service.
- `npm run dev:seed`: Seeds the Redis database with sample data.
- `npm run build`: Creates an optimized production build.
- `npm run lint`: Checks for linting errors using Biome.
- `npm run lint:fix`: Automatically fixes linting errors.
- `npm run test`: Runs the test suite once.
- `npm run test:watch`: Runs tests in watch mode.

## 🧪 Testing

The project uses Vitest for unit and integration testing.

```bash
npm run test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
