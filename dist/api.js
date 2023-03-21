"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load env variables
dotenv_1.default.config();
const port = process.env.PORT;
const fmpKey = process.env.FMP_KEY;
// Create express app
const app = (0, express_1.default)();
/**
 *
 */
app.get('/stocks/:ticker', (req, res) => {
    // Validate input
    const ticker = req.params["ticker"];
    // Create summary
    // Return summary
    res.send(ticker);
});
// Listen on user-defined port
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
