import {
  DatabaseConnection,
  Driver
} from 'kysely';
import { BigQueryDialectConfig } from '.';
import { BigQueryConnection } from './BigQueryConnection';

export class BigQueryDriver implements Driver {
  #config: BigQueryDialectConfig;

  constructor(config: BigQueryDialectConfig) {
    this.#config = config;
  }

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    return new BigQueryConnection(this.#config);
  }

  async beginTransaction(conn: BigQueryConnection): Promise<void> {
    return await conn.beginTransaction();
  }

  async commitTransaction(conn: BigQueryConnection): Promise<void> {
    return await conn.commitTransaction();
  }

  async rollbackTransaction(conn: BigQueryConnection): Promise<void> {
    return await conn.rollbackTransaction();
  }

  async releaseConnection(_conn: BigQueryConnection): Promise<void> {}

  async destroy(): Promise<void> {}
}