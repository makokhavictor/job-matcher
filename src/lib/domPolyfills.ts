export function setupDOMPolyfills() {
  if (typeof globalThis.DOMMatrix === 'undefined') {
    class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      constructor(init?: string | number[]) {
        if (Array.isArray(init) && init.length === 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = init;
        }
      }
    }
    
    type DOMMatrixConstructor = {
      new(init?: string | number[]): DOMMatrix;
      prototype: DOMMatrix;
    };

    (globalThis as unknown as { DOMMatrix: DOMMatrixConstructor }).DOMMatrix = DOMMatrix as unknown as DOMMatrixConstructor;
  }
}
