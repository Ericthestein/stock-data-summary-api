/**
 * An error thrown when a stock ticker cannot be found by a StockFetcher
 */
class TickerNotFoundError extends Error {
	/**
	 * Creates a TickerNotFoundError.
	 * @param {string} ticker - The stock ticker that cannot be found.
	 */
	constructor(ticker: string) {
		super(`Ticker ${ticker} could not be found`);
		this.name = "TickerNotFound";
		Object.setPrototypeOf(this, TickerNotFoundError.prototype);
	}
}

/**
 * An error thrown when an api key used by a StockFetcher is invalid
 */
class InvalidAPIKeyError extends Error {
	/**
	 * Creates an InvalidAPIKeyError.
	 * @param {string} apiName - The name of the API service throwing this error.
	 */
	constructor(apiName: string) {
		super(`The provided API key for ${apiName} is invalid`);
		this.name = "InvalidAPIKeyError";
		Object.setPrototypeOf(this, InvalidAPIKeyError.prototype);
	}
}

/**
 * An error thrown when an api key used by a StockFetcher reaches its usage limit
 */
class APILimitReachedError extends Error {
	/**
	 * Creates an APILimitReachedError.
	 * @param apiName - The name of the API service throwing this error.
	 */
	constructor(apiName: string) {
		super(`The API limit for ${apiName} has been reached for the provided key`);
		this.name = "APILimitReachedError";
		Object.setPrototypeOf(this, APILimitReachedError.prototype);
	}
}

export {TickerNotFoundError, InvalidAPIKeyError, APILimitReachedError}
