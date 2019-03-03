import "./typeInfoStorage";
import "./builtinTypes";

import { TypeInfo } from "./types";

export function typeinfo<T>(_value?: T): Readonly<TypeInfo<T>> {
  // A dummy impl.
  // Never called unless the transformer is installed.
  const moduleName = require("../package.json").name;
  throw new Error(`[${moduleName}] No transformer is installed to the TypeScript compiler`);
}
