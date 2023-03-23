import {StockSummary} from "./Types";

/**
 * Fetches stock-related data using external APIs
 * @interface
 */
export default interface StockFetcher {
    /**
     * The name of the API used by the StockFetcher.
     */
    apiName: string;

    /**
     * The ticker that this instance fetches data for.
     */
    ticker: string;

    /**
     * Generates a summary of the stock data (both price-related and company-related) for the ticker used when initializing the StockFetcher.
     * @return {Promise<StockSummary>} A promise resolving to the StockSummary of the ticker
     */
    generateSummary: () => Promise<StockSummary>
}
