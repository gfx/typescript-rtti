interface TypeInfo<T> {
  name: string;

  validate(value: unknown): value is T;
}

export function typeinfo<T>(_value?: T): Readonly<TypeInfo<T>> {
  // A dummy impl:
  const moduleName = require("../package.json").name;
  throw new Error(`[${moduleName}] No transformer is installed to the TypeScript compiler`);
}
