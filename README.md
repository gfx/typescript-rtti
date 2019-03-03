# TypeScript RTTI (Run-Time Type Information)

## SYNOPSIS

With [ttypescript](https://github.com/cevek/ttypescript):

```tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "@gfx/typescript-rtti/src/transformer.ts",
        "type": "program"
      }
    ]
  }
}
```

```typescript
console.log(typeinfo<string>().source); // "string"
console.log(typeinfo({ foo: 42 }).source); // "{ foo: number }"
```

## How it works

TBD

## See Also

* https://github.com/kimamula/ts-transformer-keys
* https://github.com/firede/ts-transform-graphql-tag

## Authors

FUJI Goro (gfx) https://github.com/gfx/
