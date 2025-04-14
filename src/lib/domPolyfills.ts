export function setupDOMPolyfills() {
  if (typeof globalThis.DOMMatrix === 'undefined') {
    // Basic DOMMatrix polyfill
    class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      constructor(init?: string | number[]) {
        if (Array.isArray(init) && init.length === 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = init;
        }
      }
    }
    globalThis.DOMMatrix = DOMMatrix as any;
  }
}
