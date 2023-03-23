import {StockSummary} from "../stock-fetchers/Types";

/**
 * A cache client that stores stock-related data
 * @interface
 */
export default interface Cache {
	/**
	 * Retrieves the summary for the given stock ticker from the cache, if it exists and has not expired. Otherwise, returns null.
	 * @param {string} ticker - The ticker of the stock to retrieve a summary for
	 * @return {Promise<StockSummary | null>} A promise resolving to the StockSummary of the given ticker, or null if it does not exist in the cache or if it has expired
	 */
	getSummaryFromCache: (ticker: string) => Promise<StockSummary | null>

	/**
	 * Adds the summary for the given stock ticker to the cache.
	 * @param {string} ticker - The ticker of the stock to store a summary for in the cache.
	 * @param {StockSummary} summary - The summary to store in the cache.
	 */
	addSummaryToCache: (ticker: string, summary: StockSummary) => Promise<void>;
}
