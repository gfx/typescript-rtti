import ts from "typescript";
import * as utils from "tsutils";

const TYPEINFO_FUNC_NAME = "typeinfo";
const PATH_PREFIX = __dirname + "/";

function p(node: ts.Node) {
  console.warn(
    ts.SyntaxKind[node.kind],
    node.getText(),
    node.getSourceFile().fileName
  );
}

function isTypeInfoCallExpr(
  node: ts.Node,
  typeChecker: ts.TypeChecker
): node is ts.CallExpression {
  if (!utils.isCallExpression(node)) {
    return false;
  }
  const signature = typeChecker.getResolvedSignature(node);
  if (!signature) {
    return false;
  }
  const { declaration } = signature;
  if (!declaration) {
    return false;
  }

  return (
    declaration.getSourceFile().fileName.startsWith(PATH_PREFIX) &&
    (declaration as any).name &&
    (declaration as any).name.getText() === TYPEINFO_FUNC_NAME
  );
}

function createVisitor(
  context: ts.TransformationContext,
  sourceFile: ts.SourceFile,
  program: ts.Program,
): ts.Visitor {
  console.warn("sourceFile", sourceFile.fileName);
  const typeChecker = program.getTypeChecker();

  const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    // Detect a call expression for typescript-rtti's typeinfo()
    if (isTypeInfoCallExpr(node, typeChecker)) {
      const propertyAccessExpr = node.expression;

        p(propertyAccessExpr);
    }
    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}

export function createTransformerFactory(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sourceFile: ts.SourceFile) => {
      return ts.visitNode(sourceFile, createVisitor(context, sourceFile, program));
    };
  };
}
