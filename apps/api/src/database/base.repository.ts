import { db } from './database.provider';
import { TransactionManager } from './transaction.manager';

export abstract class BaseRepository {
  /**
   * Returns the transaction object if a transaction is currently active.
   * Otherwise, returns the default global Drizzle database instance.
   * This ensures repositories are entirely transaction-agnostic.
   */
  protected get db() {
    const tx = TransactionManager.getTransaction();
    return tx ?? db;
  }
}
