import axios from "axios";
import { CovidNumbers } from "./types/covid";
import { SourceContext, SourceExtractor, SourceLoggerMethod, SourceRunnerResult } from "./types/sources";
import * as colors from "./utils/colors";

export enum ScraperResult {
    UNKNOWN,
    FAIL,
    SKIPPED,
    POSTED,
    UPDATED
}

/**
 * Runs every extractor in a given array and returns an array with each instance's results.
 * @param extractors The array of data extractors to execute.
 */
export async function runExtractors(extractors: SourceExtractor<CovidNumbers>[]): Promise<CovidNumbers[]> {
    const results: CovidNumbers[] = [];
    for (const extractor of extractors) {
        try {
            const result = await extractor.execute();
            results.push(result);
        }
        catch (e) {
            log(`Extractor ${extractor} failed.`)
        }
    }
    return results;
}

/**
 * Given a source runner's result, posts it to Discord.
 * @param context Configuration context needed to run the scraping process.
 * @param log Method to log results to the console.
 * @param result Object containing results from the configuration context's runner.
 */
export async function postToDiscord(context: SourceContext, log: SourceLoggerMethod, result: SourceRunnerResult | null): Promise<ScraperResult> {
    if (!result || !result.message) {
        return ScraperResult.SKIPPED;
    }
    const messageResult = await axios.post(context.webhook, result.message);
    if (messageResult.status >= 200 && messageResult.status < 400) {
        return ScraperResult.POSTED;
    }
    return ScraperResult.FAIL;
}

/**
 * Runs a given configuration by scraping the given URL, extracting the data, and executing the runner.
 * @param context Configuration context needed to run the scraping process.
 * @param log Method to log results to the console.
 */
export async function runConfig(context: SourceContext, log: SourceLoggerMethod): Promise<ScraperResult> {
    const extractorResults = await runExtractors(context.extractors);
    if (extractorResults.length > 0) {
        const extractorLatest = extractorResults[0]; //TODO logic to merge results? for now we'll only support one extractor.
        const runnerResult = await context.runner.execute(extractorLatest, context, log);
        return await postToDiscord(context, log, runnerResult);
    }
    return Promise.reject(ScraperResult.UNKNOWN);
}

/**
 * Runs each configuration context in the given array.
 * @param configs Array of configuration contexts to run.
 */
export async function runAllConfigs(...configs: SourceContext[]) {
    log("Running configs...");
    for (const config of configs) {
        log(`Running config "${config.id}"...`);
        const result = await runConfig(config, log);
        log(`Result for config "${config.id}": ${result}`);
    }
    log("All done.\n");
}

/**
 * Logs a message to the app's console.
 * @param message Message to log.
 * @param context Configuration context.
 */
export function log(message: string, context?: SourceContext): void {
    let contextStr = "";
    if (context) {
        contextStr = `${context.logColor ?? colors.Reset}["${context.id}"]${colors.Reset} `;
    }
    console.log(`[${new Date().toISOString()}] ${contextStr}${message}`);
}
