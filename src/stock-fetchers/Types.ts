type ESGScoresByYear = {
    [key: number]: number
}

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
    ESGScores: ESGScoresByYear,
    stockProfile: StockProfile
}

export {ESGScoresByYear, StockProfile, StockSummary}
