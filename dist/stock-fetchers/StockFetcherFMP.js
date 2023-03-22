"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class StockFetcherFMP {
    constructor(fmpKey, _ticker) {
        this.fmpKey = fmpKey;
        this._ticker = _ticker;
        // FinancialModelingPrep API Endpoints
        this.esgEndpoint = "https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data-ratings";
        this.fetchESGRecords = () => __awaiter(this, void 0, void 0, function* () {
            // Build URL
            const url = new URL(this.esgEndpoint);
            url.searchParams.append("symbol", this._ticker);
            url.searchParams.append("apikey", this.fmpKey);
            // Fetch data
            const response = yield fetch(url.toString());
            const responseJSON = yield response.json();
            console.log(responseJSON);
            // Validate response
            // Get ESG records by year
            const esgScores = {};
            for (let i = 0; i < responseJSON.length; i++) {
                const entry = responseJSON[i];
                // Get year of current ESG entry
                const date = new Date(entry["date"]);
                const year = date.getFullYear();
                // Store the current year's ESG score
                esgScores[year] = entry["ESGScore"];
            }
            return esgScores;
        });
        this.generateSummary = () => __awaiter(this, void 0, void 0, function* () {
            // Fetch summary components
            const esgScores = yield this.fetchESGRecords();
            const stockProfile = {
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
            };
        });
    }
    // getters
    get ticker() {
        return this._ticker;
    }
}
exports.default = StockFetcherFMP;
