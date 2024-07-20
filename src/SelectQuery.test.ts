import {
	DummyDriver,
	Kysely,
	PostgresAdapter,
	PostgresIntrospector,
	PostgresQueryCompiler,
	type Generated,
} from "kysely";
import parseSelectQuery from "./SelectQuery";
import { describe, it, expect } from "bun:test";

interface User {
	id: Generated<number>;
	first_name: string;
	last_name: string | null;
}

interface Post {
	id: Generated<number>;
	title: string;
	author_id: number;
}

interface Database {
	user: User;
	post: Post;
}

const kysely = new Kysely<Database>({
	dialect: {
		createAdapter: () => new PostgresAdapter(),
		createDriver: () => new DummyDriver(),
		createIntrospector: (db) => new PostgresIntrospector(db),
		createQueryCompiler: () => new PostgresQueryCompiler(),
	},
});

describe("parseSelectQuery", () => {
	it("Should throw an error if there are multiple tables", () => {
		// compiles to select "post".*, "user".* from "post", "user"
		const query = kysely
			.selectFrom(["post", "user"])
			.selectAll(["post", "user"]);
		const node = query.toOperationNode();

		expect(() => parseSelectQuery(node, "http://localhost")).toThrow(
			"Multiple tables not supported",
		);
	});

	it("Should throw an error if no selections are provided", () => {
		const query = kysely.selectFrom("post");
		const node = query.toOperationNode();

		expect(() => parseSelectQuery(node, "http://localhost")).toThrow(
			"No selections provided",
		);
	});

	it("Should correctly parse a select * from one table", () => {
		const select = kysely.selectFrom("post").selectAll();
		const url = parseSelectQuery(select.toOperationNode(), "http://localhost")
			.toString()
			.slice("http://localhost".length);

		expect(decodeURIComponent(url)).toBe("/post?select=*");
	});

	it("Should correctly parse a selection of one column from one table", () => {
		const select = kysely.selectFrom("post").select("id");
		const url = parseSelectQuery(select.toOperationNode(), "http://localhost")
			.toString()
			.slice("http://localhost".length);

		expect(decodeURIComponent(url)).toBe("/post?select=id");
	});

	it("Should correctly parse selections from multiple columns in one table", () => {
		const select = kysely.selectFrom("post").select(["id", "author_id"]);
		const url = parseSelectQuery(select.toOperationNode(), "http://localhost")
			.toString()
			.slice("http://localhost".length);

		expect(decodeURIComponent(url)).toBe("/post?select=id,author_id");
	});

	it("Should correctly parse select as alias paramters with one table as input", () => {
		const select = kysely
			.selectFrom("post")
			.select(["id as post_id", "title as post_title"]);
		const url = parseSelectQuery(select.toOperationNode(), "http://localhost")
			.toString()
			.slice("http://localhost".length);

		expect(decodeURIComponent(url)).toBe(
			"/post?select=post_id:id,post_title:title",
		);
	});
});
