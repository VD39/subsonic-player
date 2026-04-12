export class AudioPreloader {
  get size() {
    return this.pool.size;
  }

  private readonly pool = new Map<string, HTMLAudioElement>();

  // Dispose of all pre-loaded elements.
  clear() {
    for (const [, audio] of this.pool) {
      this.detach(audio);
    }

    this.pool.clear();
  }

  // Retrieve and remove a pre-loaded element for the given URL.
  // Returns `null` if no element is pre-loaded for this URL.
  consume(url: string) {
    const audio = this.pool.get(url);

    if (!audio) {
      return null;
    }

    this.pool.delete(url);

    // Discard elements that failed to load.
    if (audio.error) {
      this.detach(audio);
      return null;
    }

    return audio;
  }

  has(url: string) {
    return this.pool.has(url);
  }

  // Pre-load audio for a given stream URL.
  // If already pre-loaded, this is a no-op.
  preload(url: string) {
    if (import.meta.server || this.pool.has(url)) {
      return;
    }

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;

    this.pool.set(url, audio);
  }

  // Remove all pre-loaded entries whose URL is not in the given set of URLs to keep.
  prune(urlsToKeep: Set<string>) {
    for (const [url, audio] of this.pool) {
      if (!urlsToKeep.has(url)) {
        this.detach(audio);
        this.pool.delete(url);
      }
    }
  }

  private detach(audio: HTMLAudioElement) {
    audio.src = '';
    audio.removeAttribute('src');
    audio.load();
  }
}
