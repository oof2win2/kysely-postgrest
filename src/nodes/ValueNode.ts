import type { ValueNode } from "kysely";
import {
	isString,
	isNumber,
	isBoolean,
	isNull,
	isDate,
	isBigInt,
} from "../util/object-utils";

function parseImmediateValue(value: unknown) {
	if (isString(value)) {
		return `${value}`;
	}
	if (isNumber(value) || isBoolean(value)) {
		return value.toString();
	}
	if (isNull(value)) {
		return "null";
	}
	if (isDate(value)) {
		return value.toISOString();
	}
	if (isBigInt(value)) {
		return value.toString();
	}

	throw new Error(`invalid immediate value ${value}`);
}

export default function parseValueNode(node: ValueNode): string {
	// we can't send in non-immediate values
	return parseImmediateValue(node.value);
}
