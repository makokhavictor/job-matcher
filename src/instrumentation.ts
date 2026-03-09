export async function register() {
    console.log('[Instrumentation] Registering workers...', process.env.NEXT_RUNTIME);
   if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startWorkers } = await import("@/lib/queue/start-workers");
    startWorkers();
  }
}