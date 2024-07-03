import {
	AndNode,
	BinaryOperationNode,
	ReferenceNode,
	SelectQueryNode,
	TableNode,
	ValueNode,
	type OperationNode,
} from "kysely";
import parseAndNode from "./AndNode";
import parseBinaryOperationNode from "./BinaryOperationNode";
import parseReferenceNode from "./ReferenceNode";
import parseValueNode from "./ValueNode";
import parseTableNode from "./TableNode";

export function parseOperationNode(node: OperationNode): string {
	if (node.kind === "AddColumnNode")
		throw new Error("Adding columns is not supported");
	if (node.kind === "AddConstraintNode")
		throw new Error("Adding constraints is not supported");
	if (node.kind === "AddIndexNode")
		throw new Error("Adding indexes is not supported");
	if (node.kind === "AlterColumnNode")
		throw new Error("Altering columns is not supported");
	if (node.kind === "AlterTableNode")
		throw new Error("Altering tables is not supported");
	if (node.kind === "CheckConstraintNode")
		throw new Error("Adding columns is not supported");
	if (node.kind === "CreateIndexNode")
		throw new Error("Adding columns is not supported");
	if (node.kind === "CreateSchemaNode")
		throw new Error("Adding columns is not supported");
	if (node.kind === "CreateTableNode")
		throw new Error("Adding columns is not supported");
	if (node.kind === "CreateTypeNode")
		throw new Error("Creating types is not supported");
	if (node.kind === "CreateViewNode")
		throw new Error("Creating views is not supported");
	if (node.kind === "RawNode")
		throw new Error("Using raw nodes is not supported");
	if (node.kind === "DropColumnNode")
		throw new Error("Dropping columns is not supported");
	if (node.kind === "DropConstraintNode")
		throw new Error("Dropping constraints is not supported");

	if (AndNode.is(node)) return parseAndNode(node);
	if (BinaryOperationNode.is(node)) return parseBinaryOperationNode(node);
	if (ReferenceNode.is(node)) return parseReferenceNode(node);
	if (ValueNode.is(node)) return parseValueNode(node);
	if (TableNode.is(node)) return parseTableNode(node);

	throw new Error(`Unhandled: ${node.kind}`);
}
