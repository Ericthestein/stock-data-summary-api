import StockFetcher from "./StockFetcher";
import {ESGScoresByYear, StockProfile, StockSummary} from "./Types";


export default class StockFetcherFMP implements StockFetcher {
    // FinancialModelingPrep API Endpoints
    private readonly esgEndpoint = "https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data";


    constructor(
        private fmpKey: string,
        private _ticker: string
    ) {}

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

    generateSummary = async (): Promise<StockSummary> => {
        // Fetch price
        const currentPrice = await this.fetchCurrentPrice();

        // Fetch price last year
        const currentDate: Date = new Date();
        const currentYear = currentDate.getFullYear();
        const lastYear = currentYear - 1;
        const dateLastYear: Date = new Date()
        dateLastYear.setFullYear(lastYear);
        const priceLastYear = await this.fetchPriceOnDate(dateLastYear);

        // Fetch esg scores
        const esgScores: ESGScoresByYear = await this.fetchESGRecords();

        const stockProfile: StockProfile = {
            company: "",
            location: "",
            yearFounded: -1
        };

        // Return summary
        return {
            price: -1,
            priceLastYear: -1,
            yearlyPriceChange: -1,
            newsStories: [],
            ESGScores: esgScores,
            stockProfile: stockProfile
        }
    }

    // getters

    public get ticker(): string {
        return this._ticker;
    }
}
