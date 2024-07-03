import type { SelectionNode } from "kysely";
import parseReferenceNode from "./ReferenceNode";
import parseAliasNode from "./AliasNode";
import parseColumnNode from "./ColumnNode";

export default function parseSelectionNode(node: SelectionNode): string {
	const selectionType = node.selection.kind;
	if (selectionType === "SelectAllNode") return "*";
	if (selectionType === "ReferenceNode")
		return parseReferenceNode(node.selection);
	if (selectionType === "AliasNode") return parseAliasNode(node.selection);
	if (selectionType === "ColumnNode") return parseColumnNode(node.selection);

	throw new Error(`Unhandled selection type: ${selectionType}`);
}
