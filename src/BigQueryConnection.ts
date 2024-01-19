import {
  CompiledQuery,
  DatabaseConnection,
  QueryResult
} from 'kysely';

import { BigQuery } from '@google-cloud/bigquery';
import { BigQueryDialectConfig } from '.';


export class BigQueryConnection implements DatabaseConnection {
  #client: BigQuery

  constructor(config: BigQueryDialectConfig) {
    this.#client = new BigQuery(config.options)
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {

    const options = {
      query: compiledQuery.sql,
      params: [...compiledQuery.parameters],
    };

    const [rows] = await this.#client.query(options);

    return {
      insertId: undefined,
      rows: (rows as O[]) || [],
      numAffectedRows: undefined,
      // @ts-ignore deprecated in kysely >= 0.23, keep for backward compatibility.
      numUpdatedOrDeletedRows: undefined,
    };
  }

  async beginTransaction() {
    throw new Error('Transactions are not supported.');
  }

  async commitTransaction() {
    throw new Error('Transactions are not supported.');
  }

  async rollbackTransaction() {
    throw new Error('Transactions are not supported.');
  }

  async *streamQuery<O>(compiledQuery: CompiledQuery, chunkSize: number): AsyncIterableIterator<QueryResult<O>> {

    const options = {
      query: compiledQuery.sql,
      params: {...compiledQuery.parameters},
    };

    const stream = await this.#client.createQueryStream(options);


    for await (const row of stream) {
      yield {
        rows: [row],
      }
    }
  }
}