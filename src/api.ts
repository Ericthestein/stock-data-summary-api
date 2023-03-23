import redis from "redis";
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import StockFetcherFMP from "./stock-fetchers/StockFetcherFMP";
import StockFetcher from "./stock-fetchers/StockFetcher";
import Cache from "./caches/Cache";
import {StockSummary} from "./stock-fetchers/Types";
import RedisCache from "./caches/RedisCache";
import {APILimitReachedError, InvalidAPIKeyError, TickerNotFoundError } from "./stock-fetchers/Errors";

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
    port = "80";
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
 * Get a summary of a stock's data, including both price data and company data
 * @route GET /stocks/:ticker
 * @param {string} ticker.path.required - The ticker of the stock to summarize
 * @returns {StockSummary} 200 - A summary of the stock's data
 * @returns {Error} 404 - Ticker not found
 */
app.get('/stocks/:ticker', async (req: Request, res: Response) => {
    // Validate input
    const ticker: string = req.params["ticker"];
    if (!ticker) {
        res.status(400).send(`Missing required paramater: ticker`);
    }

    // Attempt to fetch summary from cache
    try {
        const cachedSummary: StockSummary | null = await cache.getSummaryFromCache(ticker);
        if (cachedSummary !== null) {  // If summary is in cache, return it
            res.send(cachedSummary);
            return;
        }
    } catch (e: any) {
        console.log(`Error fetching cached summary: ${e.message}`);  // Do not end execution, since we can still satisfy the request by generating the summary from scratch
    }

    // Generate summary
    try {
        const fetcher: StockFetcher = new StockFetcherFMP(ticker, fmpKey);
        const summary: StockSummary = await fetcher.generateSummary();

        // Return summary
        res.send(summary);

        // Store summary in cache
        try {
            await cache.addSummaryToCache(ticker, summary);
        } catch (e: any) {
            console.log(`Error adding summary to cache: ${e.message}`);
        }
    } catch (e: any) {
        if (e instanceof TickerNotFoundError) {
            res.status(404).send(e.message);
        } else if (e instanceof InvalidAPIKeyError || e instanceof APILimitReachedError) {
            res.status(500).send(e.message);
        } else {
            console.log(`Error generating summary: ${e.message}`);
            res.status(500).send();
        }
    }
});

// Listen on user-defined port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
