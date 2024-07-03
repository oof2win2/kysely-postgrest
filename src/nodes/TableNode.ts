import type { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import {
	OperatorNode,
	type BinaryOperationNode,
	type OperationNode,
	type ReferenceNode,
	type TableNode,
} from "kysely";

export default function parseTableNode(node: TableNode): string {
	let identifier = "";
	if (node.table.schema) {
		identifier += node.table.schema.name;
		identifier += ".";
	}
	identifier += node.table.identifier.name;
	return identifier;
}
