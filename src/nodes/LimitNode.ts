import type { LimitNode } from "kysely";
import { parseOperationNode } from "./OperationNode";

export default function parseLimitNode(node: LimitNode): URLSearchParams {
	const limit = parseOperationNode(node.limit);
	return new URLSearchParams(`?limit=${limit}`);
}
