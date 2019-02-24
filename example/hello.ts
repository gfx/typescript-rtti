import * as util from "util";

function say(s: string) {
  console.log(util.inspect(s));
}

say("hello");
