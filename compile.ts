// Compile `ts` files using transformer
// Originally comes from https://github.com/longlho/ts-transform-img

import ts from "typescript";
import fs from "fs";

import { createTransformerFactory } from "./src/transformer";

function formatDiagnostics(diagnostics: ReadonlyArray<ts.Diagnostic>) {
  const messages: Array<string> = [];
  for (const diagnostic of diagnostics) {
    let signature: string;
    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      signature = `${diagnostic.file!.fileName} (${line + 1},${character + 1})`;
    } else {
      signature = "(unknown)";
    }
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );
    messages.push(`[compile.ts] ${signature}: ${message}`);
  }
  return messages;
}

function readTsConfig(filename = "./tsconfig.json"): ts.CompilerOptions {
  const tsConfig = ts.readConfigFile(filename, path =>
    fs.readFileSync(path).toString()
  );
  if (tsConfig.error) {
    throw new Error(formatDiagnostics([tsConfig.error]).join("\n"));
  }

  const basePath = __dirname;
  const result = ts.convertCompilerOptionsFromJson(
    tsConfig.config.compilerOptions,
    basePath,
    filename
  );
  if (result.errors.length > 0) {
    throw new Error(formatDiagnostics(result.errors).join("\n"));
  }
  return result.options;
}

export function compile(
  files: ReadonlyArray<string>,
  options: ts.CompilerOptions = readTsConfig()
) {
  const compilerHost = ts.createCompilerHost(options);
  const program = ts.createProgram(files, options, compilerHost);

  const emitResult = program.emit(undefined, undefined, undefined, undefined, {
    before: [createTransformerFactory(program)]
  });

  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (diagnostics.length > 0) {
    throw new Error(formatDiagnostics(diagnostics).join("\n"));
  }
}

if (require.main === module) {
  const [_nodejs, _compiler_ts, ...args] = process.argv;
  compile(args);
}
