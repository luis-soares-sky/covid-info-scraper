import { CovidNumbers } from "./covid";
import { DiscordMessage } from "./discord";

export type SourceLoggerMethod = (message: string, context: SourceContext) => void;

export type SourceContext = {
    id: string;
    url: string;
    extractor: SourceExtractor;
    runner: SourceRunner;
    webhook: string;
    title: string;
    content?: string;
    linesBefore?: string[];
    linesAfter?: string[];
    logColor?: string;
};

export abstract class SourceExtractor {
    public abstract execute(html: string): CovidNumbers;
}

export type SourceRunnerResult = {
    message?: DiscordMessage;
};

export abstract class SourceRunner {
    public abstract execute(latest: CovidNumbers, context: SourceContext, log: SourceLoggerMethod): Promise<SourceRunnerResult | null>;
}
