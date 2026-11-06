const globalTaskTimers = new Map<string, ReturnType<typeof setTimeout>[]>();

export function runTaskOnSchedule(
  key: string,
  milestonesSeconds: number[],
  task: () => Promise<unknown> | unknown,
) {
  if (!milestonesSeconds.length) {
    return;
  }

  globalTaskTimers.get(key)?.forEach(clearTimeout);

  const timers = milestonesSeconds.map((seconds, index) =>
    setTimeout(() => {
      try {
        task();
      } finally {
        if (index === milestonesSeconds.length - 1) {
          globalTaskTimers.delete(key);
        }
      }
    }, seconds * 1000),
  );

  globalTaskTimers.set(key, timers);
}
