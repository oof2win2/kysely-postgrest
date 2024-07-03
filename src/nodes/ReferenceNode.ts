import {
	OperatorNode,
	type BinaryOperationNode,
	type OperationNode,
	type ReferenceNode,
} from "kysely";
import parseTableNode from "./TableNode";

export default function parseReferenceNode(node: ReferenceNode): string {
	let identifier = "";
	// select from a specific table and possibly schema
	if (node.table) {
		identifier += parseTableNode(node.table);
		identifier += ".";
	}

	if (node.column.kind === "ColumnNode") {
		// select a specific column
		identifier += node.column.column.name;
	} else {
		// select all node
		identifier += "*";
	}

	return identifier;
}
