import ts from "typescript";

export const DEBUG = (() => {
  try {
    return !!(JSON.parse(process.env.TS_RTTI_DEBUG!));
  } catch {
    return false;
  }
})();

export function print(node: ts.Node, sourceFile = node.getSourceFile()) {
  const printer = ts.createPrinter();
  const s = printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile());

  const fileName = sourceFile
    ? ` ${sourceFile.fileName}`
    : "";
  console.log(`[${ts.SyntaxKind[node.kind]}${fileName}] ${s}`);
}

export function printType(type: ts.Type, typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile) {
  print(typeChecker.typeToTypeNode(type)!, sourceFile);
}
