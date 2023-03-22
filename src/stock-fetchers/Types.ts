type StockProfile = {
    company: string,
    location: string,
    yearFounded: number
}

type StockSummary = {
    price: number,
    priceLastYear: number,
    yearlyPriceChange: number,
    newsStories: string[],
    ESGScores: number[],
    stockProfile: StockProfile
}

export {StockProfile, StockSummary}