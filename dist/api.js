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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const StockFetcherFMP_1 = __importDefault(require("./stock-fetchers/StockFetcherFMP"));
// Load env variables
dotenv_1.default.config();
const port = process.env.PORT;
const fmpKey = process.env.FMP_KEY;
// Validate env variables
if (typeof port === 'undefined') {
    console.error('PORT is undefined');
    process.exit(1);
}
if (typeof fmpKey === 'undefined') {
    console.error('FMP_KEY is undefined');
    process.exit(1);
}
// Create express app
const app = (0, express_1.default)();
/**
 *
 */
app.get('/stocks/:ticker', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate input
    const ticker = req.params["ticker"];
    // Generate summary
    const fetcher = new StockFetcherFMP_1.default(fmpKey, ticker);
    const summary = yield fetcher.generateSummary();
    // Return summary
    res.send(summary);
}));
// Listen on user-defined port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
