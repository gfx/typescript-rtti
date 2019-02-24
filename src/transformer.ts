import * as ts from "typescript";

function createVisitor(
  context: ts.TransformationContext,
  sourceFile: ts.SourceFile
): ts.Visitor {
  console.log("sourceFile", sourceFile.fileName);

  const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}

export function transformerFactory(): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sourceFile: ts.SourceFile) => {
      return ts.visitNode(sourceFile, createVisitor(context, sourceFile));
    };
  };
}
