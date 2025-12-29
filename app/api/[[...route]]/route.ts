import { Hono } from "hono";
import { handle } from "hono/vercel";
import { redis } from "@/app/lib/redis";

const app = new Hono().basePath("/api");

app.get("/search", async (context) => {
    try {
        const query = context.req.query("q");

        if (!query) {
            return context.json({ message: "Missing query parameter" }, 400);
        }

        const queryUpperCase = query.toUpperCase();

        const timeStart = performance.now();

        const results = [];
        const rank = await redis.zrank("terms", queryUpperCase);

        if (rank !== null && rank !== undefined) {
            const SEARCH_LIMIT = 100;
            const temp = await redis.zrange("terms", rank, rank + SEARCH_LIMIT);
            for (const item of temp) {
                if (!item.startsWith(queryUpperCase)) {
                    break;
                }

                if (item.endsWith("*")) {
                    results.push(item.substring(0, item.length - 1));
                }
            }
        }

        const timeEnd = performance.now();
        const time = timeEnd - timeStart;

        return context.json({ results: results, duration: time });
    } catch (error) {
        console.error(error);
        return context.json({ message: "Internal Server Error" }, 500);
    }
});

export const GET = handle(app);
export default app as never;
