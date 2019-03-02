const g: any = (() => {
  return typeof global !== "undefined" ? global : self;
})();

type TypeInfoStorage = { [id: string]: object };

g.__TYPEINFO__ = {};

export const __TYPEINFO__: TypeInfoStorage = g.__TYPEINFO__;
