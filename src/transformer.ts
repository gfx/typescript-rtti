import ts from "typescript";
import { isCallExpression, isSignatureDeclaration } from "tsutils";
import { DEBUG, printType } from "./debugUtils";
import { TypeInfoStorageName } from "./typeInfoStorage";

const TYPEINFO_FUNC_NAME = "typeinfo";
const PATH_PREFIX = __dirname + "/";

function typeToSource(
  type: ts.Type,
  typeChecker: ts.TypeChecker,
  sourceFile: ts.SourceFile
) {
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

function createTypeInfoStorageExpr(): ts.Expression {
  return ts.createIdentifier(TypeInfoStorageName);
}

function checkTypeFlags(type: ts.Type, flags: ts.TypeFlags) {
  return !!(type.flags & flags);
}

function isStringType(type: ts.Type): boolean {
  return checkTypeFlags(type, ts.TypeFlags.String);
}

function isNumberType(type: ts.Type): boolean {
  return checkTypeFlags(type, ts.TypeFlags.Number);
}

function createTypeStorageAccess(id: string): ts.Expression {
  return ts.createElementAccess(
    createTypeInfoStorageExpr(),
    ts.createStringLiteral(id)
  );
}

function isBuiltInType(type: ts.Type) {
  return checkTypeFlags(
    type,
    ts.TypeFlags.String |
      ts.TypeFlags.Number |
      ts.TypeFlags.Boolean |
      ts.TypeFlags.Null |
      ts.TypeFlags.Undefined
  );
}

function createTypeInfo(
  type: ts.Type,
  typeChecker: ts.TypeChecker,
  sourceFile: ts.SourceFile
) {
  if (isBuiltInType(type)) {
    return createTypeStorageAccess(typeToSource(type, typeChecker, sourceFile));
  }

  const typeSource = typeToSource(type, typeChecker, sourceFile);
  const typeInfoExpr = ts.createObjectLiteral([
    ts.createPropertyAssignment("source", ts.createStringLiteral(typeSource)),

    ts.createPropertyAssignment(
      "sourceFile",
      ts.createStringLiteral(sourceFile.fileName)
    ),

    ts.createPropertyAssignment(
      "validate",
      // FIXME
      ts.createArrowFunction(
        undefined,
        undefined,
        [],
        ts.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
        undefined,
        ts.createBlock([
          ts.createThrow(
            ts.createNew(ts.createIdentifier("Error"), undefined, [
              ts.createStringLiteral(
                `Not yet implemented: typeinfo<${typeSource}>().validate()`
              )
            ])
          )
        ])
      )
    )
  ]);

  const typeId = `${typeSource}@${sourceFile.fileName}`;

  return ts.createConditional(
    createTypeStorageAccess(typeId),
    createTypeStorageAccess(typeId),
    ts.createAssignment(createTypeStorageAccess(typeId), typeInfoExpr)
  );
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

      return createTypeInfo(type, typeChecker, sourceFile);
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

// for ttypescript
export default createTransformerFactory;
