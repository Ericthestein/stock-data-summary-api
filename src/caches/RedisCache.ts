import Cache from "./Cache";
import {createClient, RedisClientType} from "redis";
import {StockSummary} from "../stock-fetchers/Types";

/**
 * A cache client that stores stock-related data using a Redis server.
 * @class
 */
export default class RedisCache implements Cache {
	/**
	 * The maximum time (in milliseconds) that a cached value is valid.
	 */
	static readonly MAX_CACHE_LIFE = 86400000;

	private client: RedisClientType;
	private connected: boolean = false;

	/**
	 * Creates a RedisCache.
	 * @param {string} host - The host of the Redis server.
	 * @param {string} port - The port of the Redis server.
	 */
	constructor(
		private host: string,
		private port: string,
	)
	{
		this.client = createClient({
			url: `redis://${host}:${port}`
		});
	}

	/* Cache retrieval */

	/**
	 * Retrieves the summary for the given stock ticker from the cache, if it exists and has not expired. Otherwise, returns null.
	 * @param {string} ticker - The ticker of the stock to retrieve a summary for
	 * @return {Promise<StockSummary | null>} A promise resolving to the StockSummary of the given ticker, or null if it does not exist in the cache or if it has expired
	 */
	public getSummaryFromCache = async (ticker: string): Promise<StockSummary | null>  => {
		// Connect to redis server
		await this.waitForConnection();

		// Check when the cached summary for this ticker was last updated (if at all)
		const lastUpdatedTimestampKey: any = `summary-updated-${ticker}`
		const lastUpdatedTimestampValue: string | null = await this.client.get(lastUpdatedTimestampKey);
		if (lastUpdatedTimestampValue === null) return null;  // If last updated time could not be found, the summary for this ticker was never cached
		const lastUpdatedTimestamp: number = Number.parseInt(lastUpdatedTimestampValue);
		console.log(`The summary for ${ticker} was last updated on ${new Date(lastUpdatedTimestamp).toString()}`);
		const currentTimestamp = new Date().getTime();
		const timeSinceLastUpdated = currentTimestamp - lastUpdatedTimestamp;
		if (timeSinceLastUpdated > RedisCache.MAX_CACHE_LIFE) return null;  // If this summary has expired, return null

		// Retrieve the cached summary
		const summaryKey: any = `summary-${ticker}`
		const summaryValue = await this.client.get(summaryKey);
		if (summaryValue === null) return summaryValue;
		const decodedSummaryValue: StockSummary = JSON.parse(summaryValue);  // Parse the encoded value as a StockSummary
		console.log("Retrieved summary from cache");
		return decodedSummaryValue;
	}

	/* Cache insertion */

	/**
	 * Adds the summary for the given stock ticker to the cache.
	 * @param {string} ticker - The ticker of the stock to store a summary for in the cache.
	 * @param {StockSummary} summary - The summary to store in the cache.
	 */
	public addSummaryToCache = async (ticker: string, summary: StockSummary) => {
		// Connect to redis server
		await this.waitForConnection();

		// Update the time at which the summary for this ticker was cached
		const lastUpdatedTimestampKey: any = `summary-updated-${ticker}`;
		const lastUpdatedTimestampValue: any = String(new Date().getTime());
		await this.client.set(lastUpdatedTimestampKey, lastUpdatedTimestampValue);

		// Add summary to cache
		const summaryKey: any = `summary-${ticker}`
		const summaryValue: any = JSON.stringify(summary);
		await this.client.set(summaryKey, summaryValue);

		console.log(`Added summary for ${ticker} to cache on ${new Date().toString()}`);
	}

	/* Helper methods */

	/**
	 * Waits for a connection to be established with the Redis server. Returns true if the connection has previously been established.
	 */
	private waitForConnection = async () => {
		if (this.connected) return;
		await this.client.connect();
		console.log("Connected to Redis")
		this.connected = true;
	}
}
