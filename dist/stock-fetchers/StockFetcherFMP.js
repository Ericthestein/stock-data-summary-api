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
        this.realTimePriceEndpoint = "https://financialmodelingprep.com/api/v3/quote-short";
        this.historicalPriceEndpoint = "https://financialmodelingprep.com/api/v3/historical-price-full";
        this.priceChangeEndpoint = "https://financialmodelingprep.com/api/v3/stock-price-change";
        this.newsEndpoint = "https://financialmodelingprep.com/api/v3/stock_news";
        this.esgEndpoint = "https://financialmodelingprep.com/api/v4/esg-environmental-social-governance-data";
        this.companyProfileEndpoint = "https://financialmodelingprep.com/api/v3/profile";
        /* API Fetchers */
        this.fetchCurrentPrice = () => __awaiter(this, void 0, void 0, function* () {
            // Build URL
            const url = new URL(this.realTimePriceEndpoint);
            url.pathname += "/" + this._ticker;
            url.searchParams.append("apikey", this.fmpKey);
            // Fetch data
            const response = yield fetch(url.toString());
            const responseJSON = yield response.json();
            // Validate response
            // Get price
            const price = responseJSON[0]["price"];
            const priceRounded = Number.parseFloat(price.toFixed(2));
            return priceRounded;
        });
        this.fetchPriceOnDate = (date) => __awaiter(this, void 0, void 0, function* () {
            // Build URL
            const url = new URL(this.historicalPriceEndpoint);
            url.pathname += "/" + this._ticker;
            const dateString = date.toISOString().split("T")[0];
            url.searchParams.append("from", dateString);
            url.searchParams.append("to", dateString);
            url.searchParams.append("apikey", this.fmpKey);
            // Fetch data
            const response = yield fetch(url.toString());
            const responseJSON = yield response.json();
            // Validate response
            // Get price
            const price = responseJSON["historical"][0]["close"];
            const priceRounded = Number.parseFloat(price.toFixed(2));
            return priceRounded;
        });
        this.fetchPricePercentChange = (timeframe = "1Y") => __awaiter(this, void 0, void 0, function* () {
            // Build URL
            const url = new URL(this.priceChangeEndpoint);
            url.pathname += "/" + this._ticker;
            url.searchParams.append("apikey", this.fmpKey);
            // Fetch data
            const response = yield fetch(url.toString());
            const responseJSON = yield response.json();
            // Validate response
            // Get percent change
            const change = responseJSON[0][timeframe];
            const changeRounded = Number.parseFloat(change.toFixed(2));
            return changeRounded;
        });
        this.fetchESGRecords = () => __awaiter(this, void 0, void 0, function* () {
            // Build URL
            const url = new URL(this.esgEndpoint);
            url.searchParams.append("symbol", this._ticker);
            url.searchParams.append("apikey", this.fmpKey);
            // Fetch data
            const response = yield fetch(url.toString());
            const responseJSON = yield response.json();
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
        this.fetchNewsStories = (limit = 5) => __awaiter(this, void 0, void 0, function* () {
            // Build URL
            const url = new URL(this.newsEndpoint);
            url.searchParams.append("tickers", this._ticker);
            url.searchParams.append("limit", String(limit));
            url.searchParams.append("apikey", this.fmpKey);
            // Fetch data
            const response = yield fetch(url.toString());
            const responseJSON = yield response.json();
            // Validate response
            // Get news stories
            const news = [];
            for (let i = 0; i < responseJSON.length; i++) {
                const newsEntry = responseJSON[i];
                news.push({
                    title: newsEntry["title"],
                    summary: newsEntry["text"],
                    url: newsEntry["url"],
                    datePublished: newsEntry["publishedDate"]
                });
            }
            return news;
        });
        this.fetchCompanyProfile = () => __awaiter(this, void 0, void 0, function* () {
            // Build URL
            const url = new URL(this.companyProfileEndpoint);
            url.pathname += "/" + this._ticker;
            url.searchParams.append("apikey", this.fmpKey);
            // Fetch data
            const response = yield fetch(url.toString());
            const responseJSON = yield response.json();
            // Validate response
            // Get profile
            const companyData = responseJSON[0];
            const name = companyData["companyName"];
            const industry = companyData["industry"];
            const companyUrl = companyData["website"];
            const phoneNumber = companyData["phone"];
            const locationOfHQ = `${companyData["address"]}, ${companyData["city"]}, ${companyData["state"]} ${companyData["zip"]}, ${companyData["country"]}`;
            const ceo = companyData["ceo"];
            const ipoDate = companyData["ipoDate"];
            const yearFounded = this.extractYearFounded(companyData["description"]);
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
        });
        /* Helper methods */
        this.extractYearFounded = (text) => {
            // Search for keywords
            const keywordRegex = new RegExp("founded in |incorporated in ", "i");
            const textParts = text.split(keywordRegex, 2);
            // If keywords not found, return -1
            if (textParts.length == 1)
                return -1;
            // Use the next word as the year founded
            const nextWord = textParts[1].split(" ", 2)[0];
            const year = Number.parseInt(nextWord);
            if (Number.isNaN(year))
                return -1;
            return year;
        };
        /* Output */
        this.generateSummary = () => __awaiter(this, void 0, void 0, function* () {
            // Fetch price
            const price = yield this.fetchCurrentPrice();
            // Fetch price last year
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const lastYear = currentYear - 1;
            const dateLastYear = new Date();
            dateLastYear.setFullYear(lastYear);
            const priceLastYear = yield this.fetchPriceOnDate(dateLastYear);
            // Fetch yearly price percent change
            const yearlyPricePercentChange = yield this.fetchPricePercentChange("1Y");
            // Fetch company profile
            const profile = yield this.fetchCompanyProfile();
            // Return summary
            return {
                price,
                priceLastYear,
                yearlyPricePercentChange,
                profile
            };
        });
    }
    /* Getters */
    get ticker() {
        return this._ticker;
    }
}
exports.default = StockFetcherFMP;
