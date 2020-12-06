import { load } from "cheerio";
import { CovidNumbers } from "../types/covid";
import { SourceExtractor } from "../types/sources";
import { neutralizeNumber, sanitizeNumber } from "../utils/number";

/**
 * Extracts case, death and recovery numbers by using cheerio to parse the given HTML.
 */
export default class WorldometerNumberExtractor extends SourceExtractor {
	/**
	 * Runs numbers and returns a data object.
	 * @param html Scraped HTML from the request.
	 */
	public execute(html: string): CovidNumbers {
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
	}
}
