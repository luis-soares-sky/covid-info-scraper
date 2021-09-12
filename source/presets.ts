import VostNumberExtractor from "./extractors/VostNumberExtractor";
import WorldometerNumberExtractor from "./extractors/WorldometerNumberExtractor";
import DailyStatsRunner from "./runners/DailyStatsRunner";
import DailyThresholdRunner from "./runners/DailyThresholdRunner";
import { SourceContext } from "./types/sources";
import * as colors from "./utils/colors";
import { formatDateIntl } from "./utils/date";

export function generateDailyThresholdConfig(webhook: string, skipDeltaCheck: boolean, scaleFactor: number): Pick<SourceContext, "runner" | "webhook"> {
    return {
        runner: new DailyThresholdRunner({ scaleFactor, skipDeltaCheck }),
        webhook
    }
}

export function getConfigWorld(webhook: string, skipDeltaCheck: boolean, scaleFactor: number): SourceContext {
    return {
        ...generateDailyThresholdConfig(webhook, skipDeltaCheck, scaleFactor),
        id: "world",
        title: ":globe_with_meridians: World",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/")
        ],
        linesBefore: [
            "https://www.worldometers.info/coronavirus/\n",
            "The number of worldwide cases has grown by at least 1 million.",
            "It took **{time}** to reach from **{valueBefore}m** to **{valueNow}m**."
        ],
        logColor: colors.FgMagenta
    }
}

export function generateDailyStatsConfig(webhook: string, skipDeltaCheck: boolean): Pick<SourceContext, "runner" | "webhook"> {
    return {
        runner: new DailyStatsRunner({ skipDeltaCheck }),
        webhook
    }
}

export function getConfigBelgium(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "belgium",
        title: ":flag_be: Belgium",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/country/belgium/")
        ],
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
        title: ":flag_ca: Canada",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/country/canada/")
        ],
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
        title: ":flag_dk: Denmark",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/country/denmark/")
        ],
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
        id: "germany",
        title: ":flag_de: germany",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/country/germany/")
        ],
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/germany/",
            "https://interaktiv.tagesspiegel.de/lab/karte-sars-cov-2-in-deutschland-landkreise/"
        ],
        logColor: colors.FgYellow
    }
}

export function getConfigPortugal(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "portugal",
        title: ":flag_pt: Portugal",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/country/portugal/")
            // new VostNumberExtractor("https://covid19-api.vost.pt/Requests/get_entry/" + formatDateIntl(new Date(), "pt", [{ day: "2-digit" }, { month: "2-digit" }, { year: "numeric" }], "-"))
        ],
        linesBefore: [
            "https://www.worldometers.info/coronavirus/country/portugal/",
            "https://covid19.min-saude.pt/relatorio-de-situacao/",
            "https://covid19-api.vost.pt/"
        ],
        logColor: colors.FgGreen
    }
}

export function getConfigUnitedKingdom(webhook: string, skipDeltaCheck: boolean): SourceContext {
    return {
        ...generateDailyStatsConfig(webhook, skipDeltaCheck),
        id: "uk",
        title: ":flag_gb: United Kingdom",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/country/uk/")
        ],
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
        title: ":flag_us: United States",
        extractors: [
            new WorldometerNumberExtractor("https://www.worldometers.info/coronavirus/country/us/")
        ],
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
