import {StockSummary} from "./Types";

export default interface StockFetcher {
    generateSummary: () => Promise<StockSummary>
}