import redis from "redis";
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import StockFetcherFMP from "./stock-fetchers/StockFetcherFMP";
import StockFetcher from "./stock-fetchers/StockFetcher";
import Cache from "./caches/Cache";
import {StockSummary} from "./stock-fetchers/Types";
import RedisCache from "./caches/RedisCache";

// Load env variables
dotenv.config();
const fmpKey: string | undefined = process.env.FMP_KEY;
let port: string | undefined = process.env.PORT;
let redisHost: string | undefined = process.env.REDIS_HOST;
let redisPort: string | undefined = process.env.REDIS_PORT;

// Validate env variables
if (typeof fmpKey === 'undefined') {
    console.error('FMP_KEY is undefined');
    process.exit(1);
}
if (typeof port === 'undefined') {
    port = "8000";
}
if (typeof redisHost === 'undefined') {
    redisHost = "localhost";
}
if (typeof redisPort === 'undefined') {
    redisPort = "6379";
}

// Initialize cache
const cache: Cache = new RedisCache(redisHost, redisPort);

// Create express app
const app: Express = express();

/**
 *
 */
app.get('/stocks/:ticker', async (req: Request, res: Response) => {
    // Validate input
    const ticker: string = req.params["ticker"];

    // Attempt to fetch summary from cache
    const cachedSummary: StockSummary | null = await cache.getSummaryFromCache(ticker);
    if (cachedSummary !== null) {  // If summary is in cache, return it
        res.send(cachedSummary);
        return;
    }

    // Otherwise, generate summary
    const fetcher: StockFetcher = new StockFetcherFMP(fmpKey, ticker);
    const summary: StockSummary = await fetcher.generateSummary();

    // Return summary
    res.send(summary);

    // Store summary in cache
    await cache.addSummaryToCache(ticker, summary);
});

// Listen on user-defined port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
