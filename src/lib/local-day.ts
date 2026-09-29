const MIDNIGHT_SAFETY_MARGIN_MS = 1_000;

function getMillisecondsUntilNextLocalMidnight(now: Date): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime() + MIDNIGHT_SAFETY_MARGIN_MS;
}

export function toLocalIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Timers are throttled or frozen while the device sleeps, so returning to the tab also triggers a recount.
export function subscribeToLocalDayChange(notifyDayChange: () => void): () => void {
  let midnightTimeoutId: number | undefined;

  const scheduleNextMidnight = () => {
    midnightTimeoutId = window.setTimeout(() => {
      notifyDayChange();
      scheduleNextMidnight();
    }, getMillisecondsUntilNextLocalMidnight(new Date()));
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible") return;
    window.clearTimeout(midnightTimeoutId);
    notifyDayChange();
    scheduleNextMidnight();
  };

  scheduleNextMidnight();
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.clearTimeout(midnightTimeoutId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
