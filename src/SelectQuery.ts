import type { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { WhereNode, type OperationNode, type SelectQueryNode } from "kysely";
import parseSelectionNode from "./nodes/SelectionNode";
import parseWhereNode from "./nodes/WhereNode";
import { parseOperationNode } from "./nodes/OperationNode";
import parseLimitNode from "./nodes/LimitNode";

const addToUrl = (base: URL, added: URLSearchParams) => {
	// biome-ignore lint/complexity/noForEach: <explanation>
	added.forEach((value, key) => base.searchParams.append(key, value));
	return base;
};

export default function parseSelectQueryNode(
	node: SelectQueryNode,
	url: URL,
): URL {
	let newUrl = url;
	const selections = node.selections?.map((s) => parseSelectionNode(s)) ?? [];
	if (selections) newUrl.searchParams.set("select", selections.join(","));

	const from = node.from?.froms.map((n) => parseOperationNode(n)) ?? [];
	if (from.length !== 1) throw new Error("Must supply one from paramter");
	newUrl.pathname += "/" + from[0];

	const whereClauses = node.where ? parseWhereNode(node.where) : "";
	newUrl = addToUrl(newUrl, new URLSearchParams(whereClauses));

	const limit = node.limit && parseLimitNode(node.limit);
	if (limit) newUrl = addToUrl(newUrl, limit);

	return url;
}
