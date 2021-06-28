import { CovidNumbers } from "./covid";
import { DiscordMessage } from "./discord";

export type SourceLoggerMethod = (message: string, context: SourceContext) => void;

export type SourceContext = {
    id: string;
    extractors: SourceExtractor<CovidNumbers>[];
    runner: SourceRunner;
    webhook: string;
    title: string;
    content?: string;
    linesBefore?: string[];
    linesAfter?: string[];
    logColor?: string;
};

export abstract class SourceExtractor<T> {
    public abstract execute(): Promise<T>;
}

export type SourceRunnerResult = {
    message?: DiscordMessage;
};

export abstract class SourceRunner {
    public abstract execute(latest: CovidNumbers, context: SourceContext, log: SourceLoggerMethod): Promise<SourceRunnerResult | null>;
}
