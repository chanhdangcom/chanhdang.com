// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReactLikeElement = any;
type ReactLikeAttributes = Record<string, unknown>;

declare global {
  namespace JSX {
    // Provide a minimal fallback so TSX compiles even when the official
    // React type declarations are not hoisted into node_modules/@types.
    type Element = ReactLikeElement;
    interface ElementClass {
      render: (...args: unknown[]) => ReactLikeElement;
    }
    interface ElementAttributesProperty {
      props: ReactLikeAttributes;
    }
    interface ElementChildrenAttribute {
      children: ReactLikeElement;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type LibraryManagedAttributes<C, P> = P & Record<string, unknown>;
    interface IntrinsicAttributes {
      key?: string | number;
    }
    interface IntrinsicElements {
      [elemName: string]: ReactLikeAttributes;
    }
  }
}

export {};

