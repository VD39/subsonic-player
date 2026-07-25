export class TransitionScheduler {
  private isTriggered = false;

  private knownDuration = 0;

  private lastCurrentTime = -1;

  private onTriggerCallback: () => void = () => ({});

  monitor(currentTime: number, duration: number, crossfadeDuration: number) {
    if (this.isTriggered) {
      return;
    }

    const effectiveDuration =
      Number.isFinite(duration) && duration > 0 ? duration : this.knownDuration;

    if (effectiveDuration <= 0) {
      return;
    }

    // Seek jumping inside the crossfade window locks the trigger without firing,
    // seek landing before the window falls through to the normal timer.
    if (
      this.lastCurrentTime >= 0 &&
      Math.abs(currentTime - this.lastCurrentTime) > SEEK_JUMP_THRESHOLD
    ) {
      if (effectiveDuration - currentTime <= crossfadeDuration) {
        this.isTriggered = true;
        return;
      }
    }

    this.lastCurrentTime = currentTime;

    if (effectiveDuration - currentTime <= crossfadeDuration) {
      this.isTriggered = true;
      this.onTriggerCallback();
    }
  }

  onTrigger(callback: () => void) {
    this.onTriggerCallback = callback;
  }

  reset() {
    this.isTriggered = false;
    this.lastCurrentTime = -1;
    this.knownDuration = 0;
  }

  setKnownDuration(d: number) {
    this.knownDuration = d;
  }
}
