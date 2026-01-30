import "@testing-library/jest-dom/vitest";

class IntersectionObserverMock implements IntersectionObserver {
  private callback: IntersectionObserverCallback;
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? "0px";
    const threshold = options?.threshold ?? 0;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
  }

  observe(target: Element) {
    const boundingClientRect =
      "getBoundingClientRect" in target
        ? target.getBoundingClientRect()
        : new DOMRect();
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          boundingClientRect,
          intersectionRatio: 1,
          intersectionRect: boundingClientRect,
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }

  unobserve() {}

  disconnect() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});
