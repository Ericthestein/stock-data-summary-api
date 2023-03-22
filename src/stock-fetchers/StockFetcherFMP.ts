import StockFetcher from "./StockFetcher";
import {StockProfile, StockSummary} from "./Types";


export default class StockFetcherFMP implements StockFetcher {
    constructor(
        private fmpKey: string,
        private _ticker: string
    ) {}

    // getters

    public get ticker(): string {
        return this._ticker;
    }

    generateSummary = async (): Promise<StockSummary> => {
        const stockProfile: StockProfile = {
            company: "",
            location: "",
            yearFounded: -1
        };

        return {
            price: -1,
            priceLastYear: -1,
            yearlyPriceChange: -1,
            newsStories: [],
            ESGScores: [],
            stockProfile: stockProfile
        }
    }
}