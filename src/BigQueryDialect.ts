import {
  DatabaseIntrospector,
  Dialect,
  Driver,
  Kysely,
  MysqlAdapter,
  MysqlQueryCompiler,
  QueryCompiler
} from 'kysely';

import { BigQueryOptions } from '@google-cloud/bigquery';
import { BigQueryDriver } from './BigQueryDriver';
import { BigQueryIntrospector } from './BigQueryIntrospector';

export interface BigQueryDialectConfig {
  options?: BigQueryOptions;
}

export class BigQueryDialect implements Dialect {
  #config: BigQueryDialectConfig;

  constructor(config?: BigQueryDialectConfig) {
    this.#config = config ?? {};
  }

  createAdapter() {
    return new MysqlAdapter();
  }

  createDriver(): Driver {
    return new BigQueryDriver(this.#config);
  }

  createQueryCompiler(): QueryCompiler {
    return new MysqlQueryCompiler();
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new BigQueryIntrospector(db, this.#config);
  }
}



