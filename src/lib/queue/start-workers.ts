import { startLLMWorker } from './llm-worker'
import { startEmailWorker } from './email-worker'
import { startMatcherWorker } from './matcher-worker'
import { startTailorWorker } from './tailor-worker'

startLLMWorker()
startEmailWorker()
startMatcherWorker()
startTailorWorker()
