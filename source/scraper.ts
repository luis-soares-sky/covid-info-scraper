import axios from "axios";
import { SourceContext, SourceLoggerMethod, SourceRunnerResult } from "./types/sources";
import * as colors from "./utils/colors";

export enum ScraperResult {
    FAIL,
    SKIPPED,
    POSTED,
    UPDATED
}

/**
 * Attempts to fetch HTML from the given URL.
 * @param url URL to fetch.
 */
export async function fetchHtml(url: string): Promise<string> {
    url = url.replace(/^(https?:)?\/\//, "https://");

    return await axios
        .get(url)
        .then(response => response.data)
        .catch(error => {
            error.status = (error.response && error.response.status) || 500;
            throw error;
        });
};

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
    const html = await fetchHtml(context.url);
    const extractorResult = context.extractor.execute(html);
    const runnerResult = await context.runner.execute(extractorResult, context, log);
    return await postToDiscord(context, log, runnerResult);
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
