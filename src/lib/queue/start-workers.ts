import { startLLMWorker } from "./llm-worker";
import { startEmailWorker } from "./email-worker";
import { startMatcherWorker } from "./matcher-worker";
import { startTailorWorker } from "./tailor-worker";

let started = false;

export function startWorkers(): void {
  if (started) return;
  started = true;
  startLLMWorker();
  startEmailWorker();
  startMatcherWorker();
  startTailorWorker();
}
