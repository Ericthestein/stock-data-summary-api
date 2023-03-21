"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// load env variables
dotenv_1.default.config();
// create express app
const app = (0, express_1.default)();
app.get('/stocks/:ticker', (req, res) => {
    const ticker = req.params["ticker"];
    res.send(ticker);
});
// listen on user-defined port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
