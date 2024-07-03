import { Kysely, type Generated } from "kysely";
import { PostgrestDialect } from "./src/index";

interface DB {
	flashcard: { id: string; created_at: Date; front: string; back: string };
}

const db = new Kysely<DB>({
	dialect: new PostgrestDialect({
		REST_API_URL: process.env.REST_API_URL!,
		API_AUTH: process.env.API_AUTH!,
	}),
});
const data = await db
	.selectFrom("flashcard")
	.select(["id", "front", "back"])
	.where("id", "=", "000027be-0e0d-42e9-8e3b-78c52c5146d5")
	.limit(5)
	.execute();
console.log(`data is: `, data);
