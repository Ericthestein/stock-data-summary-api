import StockFetcher from "./StockFetcher";
import {CompanyProfile, ESGScoresByYear, NewsStory, StockSummary} from "./Types";


export default class StockFetcherFMP implements StockFetcher {
    // FinancialModelingPrep API Endpoints
    private readonly realTimePriceEndpoint = "https://financialmodelingprep.com/api/v3/quote-short";
    private readonly historicalPriceEndpoint = "https://financialmodelingprep.com/api/v3/historical-price-full";
    private readonly priceChangeEndpoint = "https://financialmodelingprep.com/api/v3/stock-price-change";
    private readonly newsEndpoint = "https://financialmodelingprep.com/api/v3/stock_news";
    private readonly esgEndpoint = "https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data";
    private readonly companyProfileEndpoint = "https://financialmodelingprep.com/api/v3/profile";

    constructor(
        private fmpKey: string,
        private _ticker: string
    ) {}

    /* API Fetchers */

    fetchCurrentPrice = async (): Promise<number> => {
        // Build URL
        const url = new URL(this.realTimePriceEndpoint);
        url.pathname += "/" + this._ticker;
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response

        // Get price
        const price: number = responseJSON[0]["price"];
        const priceRounded: number = Number.parseFloat(price.toFixed(2));

        return priceRounded;
    }

    fetchPriceOnDate = async (date: Date): Promise<number> => {
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

        // Get price
        const price: number = responseJSON["historical"][0]["close"];
        const priceRounded: number = Number.parseFloat(price.toFixed(2));

        return priceRounded;
    }

    fetchPricePercentChange = async (timeframe: string = "1Y"): Promise<number> => {
        // Build URL
        const url = new URL(this.priceChangeEndpoint);
        url.pathname += "/" + this._ticker;
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response

        // Get percent change
        const change: number = responseJSON[0][timeframe];
        const changeRounded: number = Number.parseFloat(change.toFixed(2));

        return changeRounded;
    }

    fetchESGRecords = async (): Promise<ESGScoresByYear> => {
        // Build URL
        const url = new URL(this.esgEndpoint);
        url.searchParams.append("symbol", this._ticker);
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response

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

    fetchNewsStories = async (limit: number = 5): Promise<NewsStory[]> => {
        // Build URL
        const url = new URL(this.newsEndpoint);
        url.searchParams.append("tickers", this._ticker);
        url.searchParams.append("limit", String(limit));
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response


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

    fetchCompanyProfile = async (): Promise<CompanyProfile> => {
        // Build URL
        const url = new URL(this.companyProfileEndpoint);
        url.pathname += "/" + this._ticker;
        url.searchParams.append("apikey", this.fmpKey);

        // Fetch data
        const response = await fetch(url.toString());
        const responseJSON = await response.json();

        // Validate response


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

    extractYearFounded = (text: string): number => {
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

    generateSummary = async (): Promise<StockSummary> => {
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

    public get ticker(): string {
        return this._ticker;
    }
}
