require("dotenv").config();

// DO NOT ADD SENSITIVE INFORMATION TO THIS FILE.
// Webhooks/credentials belong in a ".env" file, please use it.
// If you do not have a ".env" file, please check ".env-sample".

const extractors = require("./dist/source/extractors");
const runners = require("./dist/source/runners");
const colors = require("./dist/source/utils/colors");

require("./dist/source/scraper").runAllConfigs(...[
	{
		id: "world",
		url: "https://www.worldometers.info/coronavirus/",
		extractor: extractors.extractWorldometerNumbers,
		runner: runners.runThresholdCheck,
		webhook: process.env.DISCORD_WEBHOOK_URL,
		title: ":globe_with_meridians: World",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/\n",
			"{days} later, the number of worldwide cases has grown by at least 1 million.",
			"Here are the global numbers so far:"
		],
		logColor: colors.FgMagenta
	},
	{
		id: "portugal",
		url: "https://www.worldometers.info/coronavirus/country/portugal/",
		extractor: extractors.extractWorldometerNumbers,
		runner: runners.runDailyStats,
		webhook: process.env.DISCORD_WEBHOOK_URL,
		title: ":flag_pt: Portugal",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/country/portugal/",
			"https://covid19.min-saude.pt/relatorio-de-situacao/"
		],
		logColor: colors.FgGreen
	},
	{
		id: "uk",
		url: "https://www.worldometers.info/coronavirus/country/uk/",
		extractor: extractors.extractWorldometerNumbers,
		runner: runners.runDailyStats,
		webhook: process.env.DISCORD_WEBHOOK_URL,
		title: ":flag_gb: United Kingdom",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/country/uk/",
			"https://coronavirus.data.gov.uk/"
		],
		linesAfter: [
			"_Note: the UK does not report recoveries nor active cases._"
		],
		logColor: colors.FgCyan
	},
	{
		id: "belgium",
		url: "https://www.worldometers.info/coronavirus/country/belgium/",
		extractor: extractors.extractWorldometerNumbers,
		runner: runners.runDailyStats,
		webhook: process.env.DISCORD_WEBHOOK_URL,
		title: ":flag_be: Belgium",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/country/belgium/",
			"https://epistat.wiv-isp.be/covid/covid-19.html"
		],
		logColor: colors.FgYellow
	}
]);
