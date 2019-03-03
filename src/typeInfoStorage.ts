const g: object = (() => {
  return typeof global !== "undefined" ? global : self;
})();

type TypeInfoStorageType = { [id: string]: object };

export const TypeInfoStorageName = "__TYPEINFO__";

g[TypeInfoStorageName] = {};

export const typeInfoStorage: TypeInfoStorageType = g[TypeInfoStorageName];

