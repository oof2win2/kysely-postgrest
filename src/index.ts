import {
	PostgresAdapter,
	PostgresIntrospector,
	PostgresQueryCompiler,
	SelectQueryNode,
	type CompiledQuery,
	type DatabaseConnection,
	type DatabaseIntrospector,
	type Dialect,
	type DialectAdapter,
	type Driver,
	type Kysely,
	type QueryCompiler,
	type QueryResult,
	type TransactionSettings,
} from "kysely";
import parseSelectQueryNode from "./SelectQuery";

export interface PostgrestDialectConfig {
	REST_API_URL: string;
	API_AUTH: string;
}

export class PostgrestDialect implements Dialect {
	#config: PostgrestDialectConfig;

	constructor(config: PostgrestDialectConfig) {
		this.#config = config;
	}

	createAdapter(): DialectAdapter {
		return new PostgresAdapter();
	}

	createDriver(): Driver {
		return new PostgrestDriver(this.#config);
	}

	createQueryCompiler(): QueryCompiler {
		return new PostgresQueryCompiler();
	}

	createIntrospector(db: Kysely<any>): DatabaseIntrospector {
		return new PostgresIntrospector(db);
	}
}

class PostgrestDriver implements Driver {
	#config: PostgrestDialectConfig;

	constructor(config: PostgrestDialectConfig) {
		this.#config = config;
	}

	async init(): Promise<void> {}

	async acquireConnection(): Promise<DatabaseConnection> {
		return new PostgrestConnection(this.#config);
	}

	async beginTransaction(
		_: DatabaseConnection,
		__: TransactionSettings,
	): Promise<void> {
		throw new Error(
			"Transactions are not supported with Neon HTTP connections",
		);
	}

	async commitTransaction(_: DatabaseConnection): Promise<void> {
		throw new Error(
			"Transactions are not supported with Neon HTTP connections",
		);
	}

	async rollbackTransaction(_: DatabaseConnection): Promise<void> {
		throw new Error(
			"Transactions are not supported with Neon HTTP connections",
		);
	}

	async releaseConnection(_: DatabaseConnection): Promise<void> {
		// noop
	}

	async destroy(): Promise<void> {
		// noop
	}
}

class PostgrestConnection implements DatabaseConnection {
	readonly #config: PostgrestDialectConfig;

	constructor(config: PostgrestDialectConfig) {
		this.#config = config;
	}

	async executeQuery<R>(
		query: CompiledQuery<unknown>,
	): Promise<QueryResult<R>> {
		let url = new URL(this.#config.REST_API_URL);
		const node = query.query;
		if (SelectQueryNode.is(node)) url = parseSelectQueryNode(node, url);

		const request = await fetch(url, {
			headers: { apikey: this.#config.API_AUTH },
		});
		const data = await request.json();
		return {
			rows: data,
		};
	}

	// biome-ignore lint/correctness/useYield: <explanation>
	async *streamQuery<O>(
		_compiledQuery: CompiledQuery,
		_chunkSize: number,
	): AsyncIterableIterator<QueryResult<O>> {
		throw new Error("Postgrest Driver does not support streaming");
	}
}
