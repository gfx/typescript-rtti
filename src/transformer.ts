import ts from "typescript";
import { isCallExpression, isSignatureDeclaration } from 'tsutils';
import { DEBUG, printType } from './debugUtils';

const TYPEINFO_FUNC_NAME = "typeinfo";
const PATH_PREFIX = __dirname + "/";

function typeToSource(type: ts.Type, typeChecker: ts.TypeChecker, sourceFile: ts.SourceFile) {
  const typeNode = typeChecker.typeToTypeNode(type);
  if (!typeNode) {
    throw new Error("[BUG] Failed to convert a Type to a TypeNode");
  }
  const printer = ts.createPrinter();
  return printer.printNode(ts.EmitHint.Unspecified, typeNode, sourceFile);
}

function isTypeinfoCallExpr(
  node: ts.Node,
  typeChecker: ts.TypeChecker
): node is ts.CallExpression {
  if (!isCallExpression(node)) {
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

  if (!isSignatureDeclaration(declaration)) {
    return false;
  }

  if (
    !(declaration.name && declaration.name.getText() === TYPEINFO_FUNC_NAME)
  ) {
    return false;
  }

  return declaration.getSourceFile().fileName.startsWith(PATH_PREFIX);
}

function createVisitor(
  context: ts.TransformationContext,
  sourceFile: ts.SourceFile,
  program: ts.Program
): ts.Visitor {
  if (DEBUG) {
    console.log("sourceFile", sourceFile.fileName);
  }
  const typeChecker = program.getTypeChecker();

  const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    if (isTypeinfoCallExpr(node, typeChecker)) {
      let type: ts.Type;
      if (node.typeArguments) {
        const typeNode = node.typeArguments[0];
        type = typeChecker.getTypeFromTypeNode(typeNode);
      } else {
        // get type from expr
        const argExpr = node.arguments[0];
        type = typeChecker.getTypeAtLocation(argExpr);
      }

      if (DEBUG) {
        printType(type, typeChecker, sourceFile);
      }

      const typeInfoExpr = ts.createObjectLiteral([
        ts.createPropertyAssignment(
          "source",
          ts.createLiteral(typeToSource(type, typeChecker, sourceFile)),
        ),

        ts.createPropertyAssignment(
          "sourceFile",
          ts.createLiteral(sourceFile.fileName),
        ),
      ]);
      return typeInfoExpr;
    }
    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}

export function createTransformerFactory(
  program: ts.Program
): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      return ts.visitNode(
        sourceFile,
        createVisitor(context, sourceFile, program)
      );
    };
  };
}
