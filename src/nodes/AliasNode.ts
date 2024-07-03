import type { AliasNode } from "kysely";
import { parseOperationNode } from "./OperationNode";

export default function parseAliasNode(node: AliasNode): string {
	return `(${parseOperationNode(node.node)}):${node.alias}`;
}
