import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import StockFetcherFMP from "./stock-fetchers/StockFetcherFMP";
import StockFetcher from "./stock-fetchers/StockFetcher";
import {StockSummary} from "./stock-fetchers/Types";

// Load env variables
dotenv.config();
const port: string | undefined = process.env.PORT;
const fmpKey: string | undefined = process.env.FMP_KEY;

// Validate env variables
if (typeof port === 'undefined') {
    console.error('PORT is undefined');
    process.exit(1);
}
if (typeof fmpKey === 'undefined') {
    console.error('FMP_KEY is undefined');
    process.exit(1);
}

// Create express app
const app: Express = express();

/**
 *
 */
app.get('/stocks/:ticker', async (req: Request, res: Response) => {
    // Validate input
    const ticker = req.params["ticker"];

    // Generate summary
    const fetcher: StockFetcher = new StockFetcherFMP(fmpKey, ticker);
    const summary: StockSummary = await fetcher.generateSummary();

    // Return summary
    res.send(summary);
});

// Listen on user-defined port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});