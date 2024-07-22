export function tostring(value: unknown): string {
	if (typeof value === "string") {
		return `'${value}'`;
	}
	if (typeof value === "number" || typeof value === "bigint") {
		return value.toString();
	}
	if (value === null) {
		return "null";
	}
	if (value instanceof Date) {
		return value.toISOString();
	}
	throw new Error(`invalid  value ${value}`);
}
