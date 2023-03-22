import {StockSummary} from "../stock-fetchers/Types";

export default interface Cache {
	getSummaryFromCache: (ticker: string) => Promise<StockSummary | undefined>

	addSummaryToCache: (ticker: string, summary: StockSummary) => Promise<void>;
}
