import axios from "axios";
import { isNumber, isObjectLike } from "lodash";
import { CovidNumbers } from "../types/covid";
import { SourceExtractor } from "../types/sources";
import { neutralizeNumber } from "../utils/number";

/**
 * Extracts case, death and recovery numbers by using cheerio to parse the given HTML.
 */
export default class WorldometerNumberExtractor extends SourceExtractor<CovidNumbers> {
    public url: string;

    /**
     * Builds a new covid19-api.vost.pt extractor.
     * @param url The URL that should be scraped.
     */
    constructor(url: string) {
        super();
        this.url = url.replace(/^(https?:)?\/\//, "https://");
    }

    /**
     * Runs numbers and returns a data object.
     */
    public async execute(): Promise<CovidNumbers> {
        const data = await this.fetchJson(this.url);

        const cases = this.getFirstValue(data, "confirmados");
        const deaths = this.getFirstValue(data, "obitos");
        const hospitalized = this.getFirstValue(data, "internados");
        const recoveries = this.getFirstValue(data, "recuperados");
        const active = cases - deaths - recoveries;

        return {
            cases: neutralizeNumber(cases),
            deaths: neutralizeNumber(deaths),
            hospitalized: neutralizeNumber(hospitalized),
            recoveries: neutralizeNumber(recoveries),
            active: neutralizeNumber(active)
        };
    }

    /**
     * Attempts to fetch JSON from the given URL.
     * @param url URL to fetch.
     */
    private async fetchJson(url: string): Promise<string> {
        return await axios
            .get(url)
            .then(response => response.data)
            .catch(error => {
                error.status = (error.response && error.response.status) || 500;
                throw error;
            });
    }

    /**
     * Attempts to return a numeric value from Vost's COVID data object.
     * @param data The full data set.
     * @param key The key to pick the value from.
     */
    private getFirstValue(data: any, key: string): number {
        const obj = data[key];
        if (isObjectLike(obj)) {
            const keys = Object.keys(obj);
            if (keys.length >= 1 && isNumber(obj[keys[0]])) {
                return obj[keys[0]];
            }
        }
        return 0;
    }
}
