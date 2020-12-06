require("dotenv").config();

// Basic imports.
import { isString } from "lodash";
import { runAllConfigs } from "./source/scraper";

// Config dependencies.
import WorldometerNumberExtractor from "./source/extractors/WorldometerNumberExtractor";
import DailyStatsRunner from "./source/runners/DailyStatsRunner";
import DailyThresholdRunner from "./source/runners/DailyThresholdRunner";
import * as colors from "./source/utils/colors";

// DO NOT ADD SENSITIVE INFORMATION TO THIS FILE.
// Webhooks/credentials belong in a ".env" file that should not be commited, please use it.
// If you do not have a ".env" file, please check ".env-sample".
const DISCORD_WEBHOOK_URL = isString(process.env.DISCORD_WEBHOOK_URL) ? process.env.DISCORD_WEBHOOK_URL : "";
const DAILY_SKIP_DELTA_CHECK = false;
const DAILY_SKIP_THRESHOLD_CHECK = false;

runAllConfigs(...[
	{
		id: "world",
		url: "https://www.worldometers.info/coronavirus/",
		extractor: new WorldometerNumberExtractor(),
		runner: new DailyThresholdRunner({ skipDeltaCheck: DAILY_SKIP_THRESHOLD_CHECK }),
		webhook: DISCORD_WEBHOOK_URL,
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
		extractor: new WorldometerNumberExtractor(),
		runner: new DailyStatsRunner({ skipDeltaCheck: DAILY_SKIP_DELTA_CHECK }),
		webhook: DISCORD_WEBHOOK_URL,
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
		extractor: new WorldometerNumberExtractor(),
		runner: new DailyStatsRunner({ skipDeltaCheck: DAILY_SKIP_DELTA_CHECK }),
		webhook: DISCORD_WEBHOOK_URL,
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
		extractor: new WorldometerNumberExtractor(),
		runner: new DailyStatsRunner({ skipDeltaCheck: DAILY_SKIP_DELTA_CHECK }),
		webhook: DISCORD_WEBHOOK_URL,
		title: ":flag_be: Belgium",
		linesBefore: [
			"https://www.worldometers.info/coronavirus/country/belgium/",
			"https://epistat.wiv-isp.be/covid/covid-19.html"
		],
		logColor: colors.FgYellow
	}
]);
