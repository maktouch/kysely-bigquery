# @maktouch/kysely-bigquery

[Kysely](https://github.com/koskimas/kysely) adapter for [BigQuery](https://cloud.google.com/bigquery?hl=en).

```bash
npm i @google-cloud/bigquery @maktouch/kysely-bigquery
```

This project was largely adapted from [kysely-planetscale](https://github.com/depot/kysely-planetscale).

## Usage

Pass your BigQuery connection options into the dialect in order to configure the Kysely client. Follow [these docs](https://www.npmjs.com/package/@google-cloud/bigquery) for instructions on how to do so.

```typescript
import { Kysely } from 'kysely';
import { BigQueryDialect } from '@maktouch/kysely-bigquery';

interface SomeTable {
  key: string;
  value: string;
}

interface Database {
  some_datasets.some_table: SomeTable
}

const db = new Kysely<Database>({ dialect: new BigQueryDialect() });
```

