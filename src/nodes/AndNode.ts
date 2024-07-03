import type { AndNode } from "kysely";
import { parseOperationNode } from "./OperationNode";

export default function parseAndNode(node: AndNode): string {
	const left = parseOperationNode(node.left);
	const right = parseOperationNode(node.right);
	return `and(${left},${right})`;
}
