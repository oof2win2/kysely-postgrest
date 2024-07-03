import type { ColumnNode } from "kysely";
import parseIdentifierNode from "./IdentifierNode";

export default function parseColumnNode(node: ColumnNode): string {
	return parseIdentifierNode(node.column);
}
