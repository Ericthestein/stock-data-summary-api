import {StockSummary} from "../stock-fetchers/Types";

export default interface Cache {
	getSummaryFromCache: (ticker: string) => Promise<StockSummary | null>

	addSummaryToCache: (ticker: string, summary: StockSummary) => Promise<void>;
}
