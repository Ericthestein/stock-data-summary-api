type ESGScoresByYear = {
    [key: number]: number
}

type CompanyProfile = {
    name: string,
    industry: string,
    url: string,
    phoneNumber: string,
    locationOfHQ: string,
    ceo: string,
    ipoDate: string,
    yearFounded: number
}

type NewsStory = {
    title: string,
    summary: string,
    url: string,
    datePublished: string
}

type StockSummary = {
    price: number,
    priceLastYear: number,
    yearlyPricePercentChange: number,
    news?: NewsStory[],
    ESGScores?: ESGScoresByYear,
    profile: CompanyProfile
}

export {ESGScoresByYear, CompanyProfile, NewsStory, StockSummary}
