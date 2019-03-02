interface TypeInfo<T> {
  /**
   * A source of the type `T`.
   * The source representation depends on the compiler and its version.
   */
  source: string;

  sourceFile: string;

  /**
   * It checks if a value is a valid `T`.
   * @param value A value to validate.
   */
  validate(value: unknown): value is T;
}

export function typeinfo<T>(_value?: T): Readonly<TypeInfo<T>> {
  // A dummy impl:
  const moduleName = require("../package.json").name;
  throw new Error(`[${moduleName}] No transformer is installed to the TypeScript compiler`);
}
