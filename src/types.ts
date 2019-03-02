// Built-in TypeInfo objects.

import { __TYPEINFO__ } from "./storage";

export interface TypeInfo<T> {
  /**
   * A source of the type `T`.
   * The source representation depends on the compiler and its version.
   */
  source: string;

  sourceFile: string | null;

  /**
   * It checks if a value is a valid `T`.
   * @param value A value to validate.
   */
  validate(value: unknown): value is T;
}

class BuiltInTypeInfo<T> implements TypeInfo<T> {
  readonly sourceFile = null;

  private constructor(readonly source: string, readonly validate: TypeInfo<T>["validate"]) {
  }

  static register<T>(id: string, validate: TypeInfo<T>["validate"]) {
    __TYPEINFO__[id] = new BuiltInTypeInfo(id, validate);
  }
}

BuiltInTypeInfo.register(
  "null",
  (value: unknown): value is null => {
    return value === null;
  },
);

BuiltInTypeInfo.register(
  "undefined",
  (value: unknown): value is undefined => {
    return value === undefined;
  },
);

BuiltInTypeInfo.register(
  "string",
  (value: unknown): value is string => {
    return typeof value === "string";
  },
);

BuiltInTypeInfo.register(
  "number",
  (value: unknown): value is number => {
    return typeof value === "number";
  },
);

BuiltInTypeInfo.register(
  "boolean",
  (value: unknown): value is number => {
    return typeof value === "boolean";
  },
);

