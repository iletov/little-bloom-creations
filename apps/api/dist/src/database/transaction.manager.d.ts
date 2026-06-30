import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
export type DrizzleTransaction = PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;
export declare class TransactionManager {
    private static readonly storage;
    static getTransaction(): DrizzleTransaction | undefined;
    static runInTransaction<T>(operation: () => Promise<T>): Promise<T>;
}
