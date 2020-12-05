const { scrapeUrl } = require("./source/scraper");
const { extractCovidNumbers } = require("./source/utils");

scrapeUrl("https://www.worldometers.info/coronavirus/", extractCovidNumbers)
	.then((results) => console.log(results));
