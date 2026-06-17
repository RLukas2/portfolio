export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type Branded<T, Brand extends string> = T & { __brand: Brand };
export type NonNullableProps<T> = { [K in keyof T]-?: NonNullable<T[K]> };
export type Nullable<T> = { [K in keyof T]: T[K] | null };
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
