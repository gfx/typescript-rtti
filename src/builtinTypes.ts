import { TypeInfo } from "./types";
import { typeInfoStorage } from './typeInfoStorage';

class BuiltInTypeInfo<T> implements TypeInfo<T> {
  readonly sourceFile = null;

  private constructor(readonly source: string, readonly validate: TypeInfo<T>["validate"]) {
  }

  static register<T>(id: string, validate: TypeInfo<T>["validate"]) {
    typeInfoStorage[id] = new BuiltInTypeInfo(id, validate);
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

