require("dotenv").config();

// DO NOT ADD SENSITIVE INFORMATION TO THIS FILE.
// Webhooks/credentials belong in a ".env" file, please use it.
// If you do not have a ".env" file, please check ".env-sample".

const extractors = require("./dist/source/extractors");
const runners = require("./dist/source/runners");
const colors = require("./dist/source/utils/colors");

require("./dist/source/scraper").runAllConfigs(...[
	{
		id: "portugal",
		url: "https://www.worldometers.info/coronavirus/country/portugal/",
		extractor: extractors.extractCovidNumbers,
		runner: runners.runDailyStats,
		webhook: process.env.DISCORD_WEBHOOK_URL,
		title: ":flag_pt: Portugal",
		content: "Worldometer has reported new daily stats for Portugal.",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/country/portugal/",
			"https://covid19.min-saude.pt/relatorio-de-situacao/"
		],
		logColor: colors.FgGreen
	},
	{
		id: "uk",
		url: "https://www.worldometers.info/coronavirus/country/uk/",
		extractor: extractors.extractCovidNumbers,
		runner: runners.runDailyStats,
		webhook: process.env.DISCORD_WEBHOOK_URL,
		title: ":flag_gb: United Kingdom",
		content: "Worldometer has reported new daily stats for the UK.",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/country/uk/",
			"https://coronavirus.data.gov.uk/"
		],
		linesAfter: [
			"_Notice: the UK does not report recoveries._"
		],
		logColor: colors.FgCyan
	},
	{
		id: "belgium",
		url: "https://www.worldometers.info/coronavirus/country/belgium/",
		extractor: extractors.extractCovidNumbers,
		runner: runners.runDailyStats,
		webhook: process.env.DISCORD_WEBHOOK_URL,
		title: ":flag_be: Belgium",
		content: "Worldometer has reported new daily stats for Belgium.",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/country/belgium/",
			"https://epistat.wiv-isp.be/covid/covid-19.html"
		],
		logColor: colors.FgYellow
	}
]);
