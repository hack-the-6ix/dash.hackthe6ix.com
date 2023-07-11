export type NestedKey<O extends object> = {
  [K in Extract<keyof O, string>]: O[K] extends Array<any>
    ? K
    : O[K] extends Record<string, unknown>
    ? // @ts-ignore
      `${K}.${NestedKey<O[K]>}`
    : K;
}[Extract<keyof O, string>];
