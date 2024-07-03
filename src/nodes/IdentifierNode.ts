import type { IdentifierNode } from "kysely";

export default function parseIdentifierNode(node: IdentifierNode): string {
	return node.name;
}
