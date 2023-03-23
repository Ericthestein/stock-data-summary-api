/**
 * Represents the history of ESG scores given to a company by year.
 * @typedef {object} ESGScoresByYear
 */
type ESGScoresByYear = {
    [key: number]: number
}

/**
 * Represents a stock company's profile.
 * @typedef {object} CompanyProfile
 * @property {string} name - The name of the company.
 * @property {string} industry - The industry the company belongs to.
 * @property {string} url - The company's URL.
 * @property {string} phoneNumber - The company's phone number.
 * @property {string} locationOfHQ - The location of the company's headquarters.
 * @property {string} ceo - The name of the current CEO of the company.
 * @property {string} ipoDate - The date at which the company released its IPO.
 * @property {string} yearFounded - The year in which the company was founded.
 */
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

/**
 * Represents a news story relating to a particular stock.
 * @typedef {object} NewsStory
 * @property {string} title - The title of the article.
 * @property {string} summary - A summary of the article.
 * @property {string} url - The URL at which the article can be found.
 * @property {string} datePublished - The date on which the article was published.
 */
type NewsStory = {
    title: string,
    summary: string,
    url: string,
    datePublished: string
}

/**
 * Represents a summary of a stock's data.
 * @typedef {object} StockSummary
 * @property {number} price - The current price of the stock.
 * @property {number} priceLastYear - The price of the stock exactly a year ago.
 * @property {number} yearlyPricePercentChange - The percentage change in price of the stock over the past year.
 * @property {NewsStory[]} news - A list of recent news stories relating to the stock.
 * @property {ESGScoresByYear} ESGScores - A history of ESG scores given to the company by year.
 * @property {CompanyProfile} profile - The company's profile.
 */
type StockSummary = {
    price: number,
    priceLastYear: number,
    yearlyPricePercentChange: number,
    news?: NewsStory[],
    ESGScores?: ESGScoresByYear,
    profile: CompanyProfile
}

export {ESGScoresByYear, CompanyProfile, NewsStory, StockSummary}
