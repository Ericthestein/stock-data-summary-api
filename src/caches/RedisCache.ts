import Cache from "./Cache";
import {createClient, RedisClientType} from "redis";
import {StockSummary} from "../stock-fetchers/Types";

export default class RedisCache implements Cache {
	static readonly MAX_CACHE_LIFE = 86400000;  // The maximum time (in milliseconds) that a cached value is valid

	private client: RedisClientType;
	private connected: boolean = false;

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

	public addSummaryToCache = async (ticker: string, summary: StockSummary): Promise<void> => {
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

	private waitForConnection = async () => {
		if (this.connected) return;
		await this.client.connect();
		console.log("Connected to Redis")
		this.connected = true;
	}
}
