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
        this.generateSummary = () => __awaiter(this, void 0, void 0, function* () {
            const stockProfile = {
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
            };
        });
    }
    // getters
    get ticker() {
        return this._ticker;
    }
}
exports.default = StockFetcherFMP;
