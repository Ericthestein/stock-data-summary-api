import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();
const port = process.env.PORT;
const fmpKey = process.env.FMP_KEY;

// Create express app
const app: Express = express();

/**
 *
 */
app.get('/stocks/:ticker', (req: Request, res: Response) => {
    // Validate input
    const ticker = req.params["ticker"];

    // Create summary


    // Return summary
    res.send(ticker);
});

// Listen on user-defined port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});