/// <reference types="react-scripts" />

declare module '@ht6/react-ui/dist/esm';

// Experimental typing for as prop inspired from @types/styled-components
declare type ElementLike = string | React.ComponentType;
declare type ComponentProps<T extends ElementLike> = T extends string
  ? React.IntrinsicElements<T>
  : T extends ComponentType
  ? React.ComponentPropsWithoutRef<T>
  : never;

declare type ComponentWithAs<Props, T extends ElementLike> = Props & {
  as?: T;
} & ComponentProps<T>;
