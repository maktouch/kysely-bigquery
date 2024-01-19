import {
  Kysely,
  DatabaseIntrospector,
  DatabaseMetadata,
  DatabaseMetadataOptions,
  SchemaMetadata,
  TableMetadata,
  sql
} from 'kysely'
import { BigQueryDialectConfig } from '.'
import { BigQuery } from '@google-cloud/bigquery';
import Bluebird from 'bluebird'

function freeze<T>(obj: T): Readonly<T> {
  return Object.freeze(obj)
}

export class BigQueryIntrospector implements DatabaseIntrospector {
  readonly #db: Kysely<any>
  readonly #config: BigQueryDialectConfig;
  readonly #client: BigQuery

  constructor(db: Kysely<any>, config: BigQueryDialectConfig) {
    this.#db = db
    this.#config = config
    this.#client = new BigQuery(this.#config.options);
  }

  async getSchemas(): Promise<SchemaMetadata[]> {
    
    const [datasets] = await this.#client.getDatasets();

    return datasets.map(dataset => {
      return freeze({
        name: dataset.id ?? ''
      })
    })
  }

  async getTables(
    options: DatabaseMetadataOptions = { withInternalKyselyTables: false }
  ): Promise<TableMetadata[]> {
    
    const [datasets] = await this.#client.getDatasets();

    const map: Record<string, TableMetadata> = {}

    await Bluebird.map(datasets, async ({ id }) => {

      const from = sql.id(id ?? '', 'INFORMATION_SCHEMA', 'COLUMNS')

      const rows = await this.#db
        // @ts-expect-error: dynamic schema 
        .selectFrom(from)
        .selectAll()
        .$castTo<BigQueryInformationSchema>()
        .execute();

      for (const row of rows) {
        const { table_schema, table_name, column_name, is_nullable, data_type, column_default } = row

        const index = `${table_schema}.${table_name}`
        
        if (!map[index]) {
          map[index] = {
            isView: false,
            name: table_name,
            schema: table_schema,
            columns: []
          }
        }

        const col = freeze({
          name: column_name,
          dataType: data_type,
          hasDefaultValue: !!column_default,
          isAutoIncrementing: false,
          isNullable: is_nullable === "YES",
        })

        map[index].columns.push(col)
      }
      
    })

    return Object.values(map)
  }

  async getMetadata(
    options?: DatabaseMetadataOptions
  ): Promise<DatabaseMetadata> {
    return {
      tables: await this.getTables(options),
    }
  }
}

interface BigQueryInformationSchema {
  table_catalog: string
  table_schema: string
  table_name: string
  column_name: string
  ordinal_position: string
  is_nullable: string
  data_type: string
  is_generated: string
  is_hidden: string
  is_system_defined: string
  is_partitioning_column: string
  collation_name: string
  column_default: string
}