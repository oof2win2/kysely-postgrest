export function isEmpty(obj: ArrayLike<unknown> | string | object): boolean {
	if (Array.isArray(obj) || isString(obj)) {
		return obj.length === 0;
	}
	if (obj) {
		return Object.keys(obj).length === 0;
	}

	return false;
}

export function isUndefined(obj: unknown): obj is undefined {
	return typeof obj === "undefined" || obj === undefined;
}

export function isString(obj: unknown): obj is string {
	return typeof obj === "string";
}

export function isNumber(obj: unknown): obj is number {
	return typeof obj === "number";
}

export function isBoolean(obj: unknown): obj is boolean {
	return typeof obj === "boolean";
}

export function isNull(obj: unknown): obj is null {
	return obj === null;
}

export function isDate(obj: unknown): obj is Date {
	return obj instanceof Date;
}

export function isBigInt(obj: unknown): obj is bigint {
	return typeof obj === "bigint";
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
	return typeof obj === "object" && obj !== null;
}

export function isArrayBufferOrView(
	obj: unknown,
): obj is ArrayBuffer | ArrayBufferView {
	return obj instanceof ArrayBuffer || ArrayBuffer.isView(obj);
}

export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
	if (!isObject(obj) || getTag(obj) !== "[object Object]") {
		return false;
	}

	if (Object.getPrototypeOf(obj) === null) {
		return true;
	}

	let proto = obj;
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto);
	}

	return Object.getPrototypeOf(obj) === proto;
}

export function getLast<T>(arr: ArrayLike<T>): T | undefined {
	return arr[arr.length - 1];
}

export function freeze<T>(obj: T): Readonly<T> {
	return Object.freeze(obj);
}

export function asArray<T>(arg: T | ReadonlyArray<T>): ReadonlyArray<T> {
	if (isReadonlyArray(arg)) {
		return arg;
	}
	return [arg];
}

export function isReadonlyArray(arg: unknown): arg is ReadonlyArray<unknown> {
	return Array.isArray(arg);
}

export function noop<T>(obj: T): T {
	return obj;
}

export function compare(obj1: unknown, obj2: unknown): boolean {
	if (isReadonlyArray(obj1) && isReadonlyArray(obj2)) {
		return compareArrays(obj1, obj2);
	}
	if (isObject(obj1) && isObject(obj2)) {
		return compareObjects(obj1, obj2);
	}

	return obj1 === obj2;
}

function compareArrays(
	arr1: ReadonlyArray<unknown>,
	arr2: ReadonlyArray<unknown>,
): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (let i = 0; i < arr1.length; ++i) {
		if (!compare(arr1[i], arr2[i])) {
			return false;
		}
	}

	return true;
}

function compareObjects(
	obj1: Record<string, unknown>,
	obj2: Record<string, unknown>,
): boolean {
	if (isDate(obj1) && isDate(obj2)) {
		return compareDates(obj1, obj2);
	}

	return compareGenericObjects(obj1, obj2);
}

function compareDates(date1: Date, date2: Date) {
	return date1.getTime() === date2.getTime();
}

function compareGenericObjects(
	obj1: Record<string, unknown>,
	obj2: Record<string, unknown>,
): boolean {
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!compare(obj1[key], obj2[key])) {
			return false;
		}
	}

	return true;
}

function getTag(value: unknown): string {
	if (value == null) {
		return value === undefined ? "[object Undefined]" : "[object Null]";
	}

	return toString.call(value);
}
