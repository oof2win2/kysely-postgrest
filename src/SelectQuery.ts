import {
	AliasNode,
	IdentifierNode,
	ReferenceNode,
	TableNode,
	WhereNode,
	type OperationNode,
	type SelectQueryNode,
} from "kysely";

const addToUrl = (base: URL, added: URLSearchParams) => {
	// biome-ignore lint/complexity/noForEach: <explanation>
	added.forEach((value, key) => base.searchParams.append(key, value));
	return base;
};

export default function parseSelectQuery(
	rootNode: SelectQueryNode,
	baseUrl: string,
): URL {
	const url = new URL(baseUrl);

	if (!rootNode.from || rootNode.from.froms.length > 1) {
		throw new Error("Multiple tables not supported");
	}
	const fromNode = rootNode.from.froms[0];
	if (!TableNode.is(fromNode)) {
		throw new Error("Only table nodes are selectable");
	}
	url.pathname = fromNode.table.identifier.name;

	if (!rootNode.selections?.length) throw new Error("No selections provided");
	const selectParams = rootNode.selections.map((node): string => {
		const selection = node.selection;

		if (selection.kind === "ColumnNode") {
			return selection.column.name;
		}

		if (selection.kind === "AliasNode") {
			const alias = selection.alias;
			const ref = selection.node;
			if (!IdentifierNode.is(alias))
				throw new Error("Alias must be an identifier");
			if (!ReferenceNode.is(ref))
				throw new Error("Alias must reference a node");
			if (ref.column.kind === "SelectAllNode") return `${alias.name}:*`;
			return `${alias.name}:${ref.column.column.name}`;
		}

		if (selection.kind === "SelectAllNode") {
			return "*";
		}

		if (selection.kind === "ReferenceNode") {
			const col = selection.column;
			if (col.kind === "ColumnNode") return col.column.name;
			return "*";
		}

		throw new Error("Unsupported selection kind");
	});
	url.searchParams.set("select", selectParams.join(","));

	return url;
}
