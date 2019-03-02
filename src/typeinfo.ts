interface TypeInfo<T> {
  name: string;

  validate(value: unknown): value is T;
  assert(value: unknown): value is T; // raises errors if value is invalid
}

export function typeinfo<T>(_value?: T): Readonly<TypeInfo<T>> {
  const moduleName = require("../package.json").name;
  throw new Error(`[${moduleName}] No transformer is installed to the TypeScript compiler`);
}
