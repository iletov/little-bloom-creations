export declare abstract class BaseRepository {
    protected get db(): (import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof import("./schema")> & {
        $client: import("postgres").Sql<{}>;
    }) | import("./transaction.manager").DrizzleTransaction;
}
