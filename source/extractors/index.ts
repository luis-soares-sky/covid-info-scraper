import { load } from "cheerio";
import { CovidNumbers } from "../types";
import { neutralizeNumber, sanitizeNumber } from "../utils/number";

/**
 * Extracts case, death and recovery numbers by using cheerio to parse the given HTML.
 * @param html Scraped HTML from the request.
 */
export function extractCovidNumbers(html: string): CovidNumbers {
	const $ = load(html);

	const cases = sanitizeNumber($(".maincounter-number").eq(0).text());
	const deaths = sanitizeNumber($(".maincounter-number").eq(1).text());
	const recoveries = sanitizeNumber($(".maincounter-number").eq(2).text());
	const active = cases - deaths - recoveries;

	return {
		cases: neutralizeNumber(cases),
		deaths: neutralizeNumber(deaths),
		recoveries: neutralizeNumber(recoveries),
		active: neutralizeNumber(active)
	};
};
