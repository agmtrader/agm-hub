// One queue per mounted application. A failed attempt does not poison later
// attempts; callers still receive its rejection and must surface it.
export function createApplicationSyncQueue() {
  let tail: Promise<unknown> = Promise.resolve()
  return {
    enqueue<T>(work: () => Promise<T>): Promise<T> {
      const attempt = tail.then(work)
      tail = attempt.catch(() => undefined)
      return attempt
    },
  }
}
