import type { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import type { WhereNode, OperationNode } from "kysely";
import { parseOperationNode } from "./OperationNode";

export default function parseWhereNode(node: WhereNode): string {
	return parseOperationNode(node.where);
}
