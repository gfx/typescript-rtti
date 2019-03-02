# TypeScript RTTI (Run-Time Type Information)

## How it works

A TypeScript code:

```typescript
function say(s: string) {
  // ...
}

say("Hello");
```

is transformed into:

```typescript
import * as t from "typescript-rtti/types";

@checkParameters({ s: t.string })
function say(s: string) {

}
```
