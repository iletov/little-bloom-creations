import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { db } from './database.provider';

export type DrizzleTransaction = PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

@Injectable()
export class TransactionManager {
  private static readonly storage = new AsyncLocalStorage<DrizzleTransaction>();

  static getTransaction(): DrizzleTransaction | undefined {
    return this.storage.getStore();
  }

  static async runInTransaction<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    const currentTx = this.getTransaction();
    if (currentTx) {
      return operation(); // Already in a transaction
    }

    return db.transaction(async (tx) => {
      return this.storage.run(tx, operation);
    });
  }
}
