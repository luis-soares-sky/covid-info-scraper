require("dotenv").config();

// Basic imports.
import { isString } from "lodash";
import { runAllConfigs } from "./source/scraper";

// Preset imports.
import * as presets from "./source/presets";

// DO NOT ADD SENSITIVE INFORMATION TO THIS FILE.
// Webhooks/credentials belong in a ".env" file that should not be commited, please use it.
// If you do not have a ".env" file, please check ".env-sample".
const DISCORD_WEBHOOK_URL = isString(process.env.DISCORD_WEBHOOK_URL) ? process.env.DISCORD_WEBHOOK_URL : "";

// Easy configs for the runners.
const STATS_SKIP_DELTA_CHECK = false;
const THRESHOLD_SCALE_FACTOR = 1000000;
const THRESHOLD_SKIP_DELTA_CHECK = false;

// Finally, execute.
runAllConfigs(...[
    presets.getConfigWorld(DISCORD_WEBHOOK_URL, THRESHOLD_SKIP_DELTA_CHECK, THRESHOLD_SCALE_FACTOR),
    presets.getConfigPortugal(DISCORD_WEBHOOK_URL, STATS_SKIP_DELTA_CHECK),
    presets.getConfigUnitedKingdom(DISCORD_WEBHOOK_URL, STATS_SKIP_DELTA_CHECK),
    presets.getConfigBelgium(DISCORD_WEBHOOK_URL, STATS_SKIP_DELTA_CHECK)
]);
