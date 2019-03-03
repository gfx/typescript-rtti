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

  describe("#validate", () => {
    it("validates string", () => {
      assert.ok(typeinfo<string>().validate("foo"));
      assert.ok(!typeinfo<string>().validate(42));
    });

    it("validates number", () => {
      assert.ok(typeinfo<number>().validate(42));
      assert.ok(!typeinfo<number>().validate("foo"));
    });
  });
});
