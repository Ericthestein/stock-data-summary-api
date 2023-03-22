import Cache from "./Cache";
import redis, {RedisClientType} from "redis";
import {StockSummary} from "../stock-fetchers/Types";

export default class RedisCache implements Cache {
	private client: RedisClientType;
	private connected: boolean = false;

	constructor(
		private host: string,
		private port: string,
	)
	{
		this.client = redis.createClient({
			url: `redis://${host}:${port}`
		});
	}

	/* Cache retrieval */

	public getSummaryFromCache = async (ticker: string): Promise<StockSummary | undefined>  => {
		await this.waitForConnection();
		const summary: StockSummary | undefined = await this.client.getAsync(`summary:${ticker}`);
	}

	/* Cache insertion */

	public addSummaryToCache = async (ticker: string, summary: StockSummary): Promise<void> => {
		await this.waitForConnection();
	}

	/* Helper methods */

	private waitForConnection = async () => {
		if (this.connected) return;
		await this.client.connect();
		this.connected = true;
	}
}
