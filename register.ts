#!ts-node

import { register } from "ts-node";
import { transformerFactory } from "./src/transformer";

register({
  transformers: {
    before: [transformerFactory()],
  },
});
