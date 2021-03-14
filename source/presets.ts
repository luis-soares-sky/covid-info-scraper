import WorldometerNumberExtractor from "./extractors/WorldometerNumberExtractor";
import DailyStatsRunner from "./runners/DailyStatsRunner";
import DailyThresholdRunner from "./runners/DailyThresholdRunner";
import { SourceContext } from "./types/sources";
import * as colors from "./utils/colors";

export function generateDailyThresholdConfig(webhook: string, skipDeltaCheck: boolean, scaleFactor: number): Pick<SourceContext, "extractor" | "runner" | "webhook"> {
    return {
        extractor: new WorldometerNumberExtractor(),
        runner: new DailyThresholdRunner({ scaleFactor, skipDeltaCheck }),
        webhook
    }
}

export function getConfigWorld(webhook: string, skipDeltaCheck: boolean, scaleFactor: number): SourceContext {
    return {
        ...generateDailyThresholdConfig(webhook, skipDeltaCheck, scaleFactor),
        id: "world",
        url: "https://www.worldometers.info/coronavirus/",
        title: ":globe_with_meridians: World",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/\n",
            "The number of worldwide cases has grown by at least 1 million.",
            "It took **{time}** to reach from **{valueBefore}m** to **{valueNow}m**."
        ],
        logColor: colors.FgMagenta
    }
}

export function generateDailyStatsConfig(webhook: string, skipDeltaCheck: boolean): Pick<SourceContext, "extractor" | "runner" | "webhook"> {
    return {
        extractor: new WorldometerNumberExtractor(),
        runner: new DailyStatsRunner({ skipDeltaCheck }),
        webhook
    }
}

export function getConfigBelgium(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "belgium",
        url: "https://www.worldometers.info/coronavirus/country/belgium/",
        title: ":flag_be: Belgium",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/belgium/",
            "https://epistat.wiv-isp.be/covid/covid-19.html"
        ],
        logColor: colors.FgYellow
    }
}

export function getConfigCanada(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "canada",
        url: "https://www.worldometers.info/coronavirus/country/canada/",
        title: ":flag_ca: Canada",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/canada/",
            "https://www.ctvnews.ca/health/coronavirus/tracking-every-case-of-covid-19-in-canada-1.4852102"
        ],
        logColor: colors.FgRed
    }
}

export function getConfigDenmark(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "denmark",
        url: "https://www.worldometers.info/coronavirus/country/denmark/",
        title: ":flag_dk: Denmark",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/denmark/",
            "https://www.ssi.dk/covid19data"
        ],
        logColor: colors.FgRed
    }
}

export function getConfigGermany(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "denmark",
        url: "https://www.worldometers.info/coronavirus/country/denmark/",
        title: ":flag_dk: Denmark",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/denmark/",
            "https://www.ssi.dk/covid19data"
        ],
        logColor: colors.FgYellow
    }
}

export function getConfigPortugal(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "portugal",
        url: "https://www.worldometers.info/coronavirus/country/portugal/",
        title: ":flag_pt: Portugal",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/portugal/",
            "https://covid19.min-saude.pt/relatorio-de-situacao/"
        ],
        logColor: colors.FgGreen
    }
}

export function getConfigUnitedKingdom(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "uk",
        url: "https://www.worldometers.info/coronavirus/country/uk/",
        title: ":flag_gb: United Kingdom",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/uk/",
            "https://coronavirus.data.gov.uk/"
        ],
        linesAfter: [
            "_Note: the UK may report several metrics at different times of the day._"
        ],
        logColor: colors.FgCyan
    }
}

export function getConfigUnitedStates(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "us",
        url: "https://www.worldometers.info/coronavirus/country/us/",
        title: ":flag_us: United States",
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/us/"
        ],
        linesAfter: [
            "_Note: the US posts cumulative stats at different times of the day._",
            "_This results in some spam for now. Sorry._"
        ],
        logColor: colors.FgBlue
    }
}
