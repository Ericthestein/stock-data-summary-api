import {APILimitReachedError, InvalidAPIKeyError, TickerNotFoundError } from "./Errors";
import StockFetcher from "./StockFetcher";
import {CompanyProfile, ESGScoresByYear, NewsStory, StockSummary} from "./Types";

/**
 * A StockFetcher that fetches data from Financial Modeling Prep.
 * @class
 */
export default class StockFetcherFMP implements StockFetcher {
    /* FinancialModelingPrep API Endpoints */
    private readonly realTimePriceEndpoint = "https://financialmodelingprep.com/api/v3/quote-short";
    private readonly historicalPriceEndpoint = "https://financialmodelingprep.com/api/v3/historical-price-full";
    private readonly priceChangeEndpoint = "https://financialmodelingprep.com/api/v3/stock-price-change";
    private readonly newsEndpoint = "https://financialmodelingprep.com/api/v3/stock_news";
    private readonly esgEndpoint = "https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data";
    private readonly companyProfileEndpoint = "https://financialmodelingprep.com/api/v3/profile";

    private readonly _apiName: string = "Financial Modeling Prep";

    /**
     * Creates a StockFetcherFMP.
     * @param {string} _ticker - The stock ticker that this instance will fetch data for.
     * @param {string} fmpKey - The API key to use for calls to Financial Modeling Prep.
     */
    constructor(
        private _ticker: string,
        private fmpKey: string,
    ) {}

    /* API Fetchers */

    /**
     * Fetches the current price of the stock.
     * @return {Promise<number>} A promise resolving to the current price.
     */
    private fetchCurrentPrice = async (): Promise<number> => {
        // Build URL
        const url = new URL(this.realTimePriceEndpoint);
        url.pathname += "/" + this._ticker;
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response
        this.validateResponse(responseJSON);

        // Get price
        const price: number = responseJSON[0]["price"];
        const priceRounded: number = Number.parseFloat(price.toFixed(2));

        return priceRounded;
    }

    /**
     * Fetches the price of the stock on a given date.
     * @param {Date} date - The date at which to fetch the price data.
     * @return {Promise<number>} A promise resolving to the price.
     */
    private fetchPriceOnDate = async (date: Date): Promise<number> => {
        // Build URL
        const url = new URL(this.historicalPriceEndpoint);
        url.pathname += "/" + this._ticker;
        const dateString: string = date.toISOString().split("T")[0];
        url.searchParams.append("from", dateString);
        url.searchParams.append("to", dateString);
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response
        this.validateResponse(responseJSON);

        // Get price
        const price: number = responseJSON["historical"][0]["close"];
        const priceRounded: number = Number.parseFloat(price.toFixed(2));

        return priceRounded;
    }

    /**
     * Fetches the percent change in price of the stock over a given timeframe
     * @param {string} timeframe - The timeframe to calculate percent change over. Valid values: 1D, 5D, 1M, 3M, 6M, ytd, 1Y, 3Y, 5Y, 10Y, max
     * @return {Promise<number>} The percent change in price.
     */
    private fetchPricePercentChange = async (timeframe: string = "1Y"): Promise<number> => {
        // Build URL
        const url = new URL(this.priceChangeEndpoint);
        url.pathname += "/" + this._ticker;
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response
        this.validateResponse(responseJSON);

        // Get percent change
        const change: number = responseJSON[0][timeframe];
        const changeRounded: number = Number.parseFloat(change.toFixed(2));

        return changeRounded;
    }

    /**
     * Fetches ESG records of the stock.
     * @return {Promise<ESGScoresByYear>} A promise resolving to the ESG scores of the stock by year.
     */
    private fetchESGRecords = async (): Promise<ESGScoresByYear> => {
        // Build URL
        const url = new URL(this.esgEndpoint);
        url.searchParams.append("symbol", this._ticker);
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response
        this.validateResponse(responseJSON);

        // Get ESG records by year
        const esgScores: ESGScoresByYear = {};
        for (let i = 0; i < responseJSON.length; i++) {
            const entry = responseJSON[i];

            // Get year of current ESG entry
            const date: Date = new Date(entry["date"]);
            const year: number = date.getFullYear();

            // Store the current year's ESG score
            esgScores[year] = entry["ESGScore"];
        }

        return esgScores;
    }

    /**
     * Fetches recent news stories for the stock.
     * @param {number} limit - The maximum number of news stories to fetch.
     * @return {Promise<NewsStory[]>} A promise resolving to a list of new stories.
     */
    private fetchNewsStories = async (limit: number = 5): Promise<NewsStory[]> => {
        // Build URL
        const url = new URL(this.newsEndpoint);
        url.searchParams.append("tickers", this._ticker);
        url.searchParams.append("limit", String(limit));
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response
        this.validateResponse(responseJSON);

        // Get news stories
        const news: NewsStory[] = [];
        for (let i = 0; i < responseJSON.length; i++) {
            const newsEntry = responseJSON[i];
            news.push({
                title: newsEntry["title"],
                summary: newsEntry["text"],  // consider summarizing the full text from the url using a language model
                url: newsEntry["url"],
                datePublished: newsEntry["publishedDate"]
            })
        }

        return news;
    }

    /**
     * Fetches the stock company's profile.
     * @return {Promise<CompanyProfile>} A promise resolving to the stock company's profile.
     */
    private fetchCompanyProfile = async (): Promise<CompanyProfile> => {
        // Build URL
        const url = new URL(this.companyProfileEndpoint);
        url.pathname += "/" + this._ticker;
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response
        this.validateResponse(responseJSON);

        // Get profile
        const companyData = responseJSON[0];
        const name = companyData["companyName"];
        const industry = companyData["industry"];
        const companyUrl = companyData["website"];
        const phoneNumber = companyData["phone"];
        const locationOfHQ = `${companyData["address"]}, ${companyData["city"]}, ${companyData["state"]} ${companyData["zip"]}, ${companyData["country"]}`;
        const ceo = companyData["ceo"]
        const ipoDate = companyData["ipoDate"]
        const yearFounded = this.extractYearFounded(companyData["description"])

        return {
            name,
            industry,
            url: companyUrl,
            phoneNumber,
            locationOfHQ,
            ceo,
            ipoDate,
            yearFounded
        };
    }

    /* Helper methods */

    /**
     * Validates the response returned by Financial Modeling Prep.
     * @param {any} responseJSON - The response returned by the API in JSON
     * @throws {TickerNotFoundError} If the instance's ticker cannot be found by the API.
     * @throws {APILimitReachedError} If the usage limit has been reached for the API key.
     * @throws {InvalidAPIKeyError} If the API key is invalid.
     */
    private validateResponse = (responseJSON: any) => {
        if (Array.isArray(responseJSON)) {
            if (responseJSON.length === 0) {
                throw new TickerNotFoundError(this._ticker);
            }
        } else {
            const errorMessage = responseJSON["Error Message"]
            if (errorMessage) {
                if (errorMessage.includes("Limit")) {
                    throw new APILimitReachedError(this._apiName);
                } else if (errorMessage.includes("Invalid API KEY")) {
                    throw new InvalidAPIKeyError(this._apiName);
                }
            } else {
                const keys = Object.keys(responseJSON);
                if (keys.length === 0) {
                    throw new TickerNotFoundError(this._ticker);
                }
            }
        }
    }

    /**
     * Extracts the year in which the company was founded from a given string.
     * @param {string} text - The text to search for the founding year in.
     * @return {number} - The year in which the company was founded, or -1 if the year cannot be extracted.
     */
    private extractYearFounded = (text: string): number => {
        // Search for keywords
        const keywordRegex: RegExp = new RegExp("founded in |incorporated in ", "i");
        const textParts = text.split(keywordRegex, 2);

        // If keywords not found, return -1
        if (textParts.length == 1) return -1;

        // Use the next word as the year founded
        const nextWord: string = textParts[1].split(" ", 2)[0];
        const year: number = Number.parseInt(nextWord);
        if (Number.isNaN(year)) return -1;
        return year;
    }

    /* Output */

    /**
     * Generates a summary of the stock data (both price-related and company-related) for the ticker used when initializing the StockFetcher.
     * @return {Promise<StockSummary>} A promise resolving to the StockSummary of the ticker
     */
    public generateSummary = async (): Promise<StockSummary> => {
        // Fetch price
        const price: number = await this.fetchCurrentPrice();

        // Fetch price last year
        const currentDate: Date = new Date();
        const currentYear = currentDate.getFullYear();
        const lastYear = currentYear - 1;
        const dateLastYear: Date = new Date()
        dateLastYear.setFullYear(lastYear);
        const priceLastYear: number = await this.fetchPriceOnDate(dateLastYear);

        // Fetch yearly price percent change
        const yearlyPricePercentChange: number = await this.fetchPricePercentChange("1Y");

        // Fetch company profile
        const profile: CompanyProfile = await this.fetchCompanyProfile();

        // Return summary
        return {
            price,
            priceLastYear,
            yearlyPricePercentChange,
            profile
        }
    }

    /* Getters */

    /**
     * Returns the ticker that this instance fetches data for.
     * @return {string} The instance's ticker.
     */
    public get ticker(): string {
        return this._ticker;
    }

    /**
     * Returns the name of the API used by the StockFetcher.
     * @return {string} The instance's API name.
     */
    public get apiName(): string {
        return this._apiName;
    }
}
