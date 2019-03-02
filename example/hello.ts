#!npx ts-node -r ./register.ts example/hello.ts

import * as util from "util";
import { typeinfo } from "../src/typeinfo";

function say(s: string) {
  console.log(util.inspect(s));
}

// name: string

say(typeinfo<string>().name);

// validate(value: T): value is T

const foo: unknown = "foo";

if (!typeinfo<string>().validate(foo)) {
  throw new Error("foo is not string");
}
// here foo is string
console.log(foo.toLocaleUpperCase());

