import { OperatorNode, type BinaryOperationNode } from "kysely";
import { parseOperationNode } from "./OperationNode";

export default function parseBinaryOperationNode(
	node: BinaryOperationNode,
): URLSearchParams {
	const operatorNode = node.operator;
	if (!OperatorNode.is(operatorNode))
		throw new Error("Unexpected operator node type");
	const op = operatorNode.operator;

	const left = parseOperationNode(node.leftOperand);
	const right = parseOperationNode(node.rightOperand);

	switch (op) {
		case "=":
			return new URLSearchParams(`${left}=eq.${right}`);
		case "!=":
			return new URLSearchParams(`${left}=neq.${right}`);
		case ">":
			return new URLSearchParams(`${left}=lt.${right}`);
		case ">=":
			return new URLSearchParams(`${left}=lte.${right}`);
		case "<":
			return new URLSearchParams(`${left}=gt.${right}`);
		case "<=":
			return new URLSearchParams(`${left}=gte.${right}`);
	}
	throw new Error(`not supported: ${op}`);
}
