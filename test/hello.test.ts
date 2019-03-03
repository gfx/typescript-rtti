import { typeinfo } from "../src/typeinfo";
import * as assert from "assert";

describe("typeinfo", () => {
  describe("#name", () => {
    it("return TypeInfo of string", () => {
      assert.deepStrictEqual(typeinfo<string>().source, "string");
    });

    it("return TypeInfo of a string literal", () => {
      assert.deepStrictEqual(typeinfo("foo").source, '"foo"');
    });

    it("return TypeInfo of a struct", () => {
      assert.deepStrictEqual(typeinfo<{ foo: boolean }>().source, '{ foo: boolean; }');
    });
  });
});
