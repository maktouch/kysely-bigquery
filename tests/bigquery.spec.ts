import { expect, test } from 'vitest'

import { BigQueryDialect } from '../src'
import { Kysely } from 'kysely';

const kysely = new Kysely<any>({
  dialect: new BigQueryDialect()
})

test('simple select', async () => {
  const query = kysely.selectFrom('features.metadata').where('id', '>', 10).selectAll().limit(1);

  expect(query.compile()).toMatchInlineSnapshot(`
    {
      "parameters": [
        10,
        1,
      ],
      "query": {
        "from": {
          "froms": [
            {
              "kind": "TableNode",
              "table": {
                "identifier": {
                  "kind": "IdentifierNode",
                  "name": "metadata",
                },
                "kind": "SchemableIdentifierNode",
                "schema": {
                  "kind": "IdentifierNode",
                  "name": "features",
                },
              },
            },
          ],
          "kind": "FromNode",
        },
        "kind": "SelectQueryNode",
        "limit": {
          "kind": "LimitNode",
          "limit": {
            "kind": "ValueNode",
            "value": 1,
          },
        },
        "selections": [
          {
            "kind": "SelectionNode",
            "selection": {
              "kind": "SelectAllNode",
            },
          },
        ],
        "where": {
          "kind": "WhereNode",
          "where": {
            "kind": "BinaryOperationNode",
            "leftOperand": {
              "column": {
                "column": {
                  "kind": "IdentifierNode",
                  "name": "id",
                },
                "kind": "ColumnNode",
              },
              "kind": "ReferenceNode",
              "table": undefined,
            },
            "operator": {
              "kind": "OperatorNode",
              "operator": ">",
            },
            "rightOperand": {
              "kind": "ValueNode",
              "value": 10,
            },
          },
        },
      },
      "sql": "select * from \`features\`.\`metadata\` where \`id\` > ? limit ?",
    }
  `)

  const row = await query.execute();

  expect(row).toMatchInlineSnapshot(`
    [
      {
        "agg_universe": "n.a.",
        "category": "cac",
        "compounding": "n.a.",
        "created_at": BigQueryTimestamp {
          "value": "2022-06-24T06:28:56.000Z",
        },
        "description": "Monthly customer acquisition cost (CAC). Marketing costs only.",
        "id": 28,
        "inserted_at": BigQueryTimestamp {
          "value": "2023-11-14T00:01:53.000Z",
        },
        "interval_measured_quantity": 1,
        "interval_measured_units": "month",
        "name": "cac",
        "name_raw": "cac_marketing",
        "public": 0,
        "subcategory": "amount",
        "type": "feature",
        "updated_at": BigQueryTimestamp {
          "value": "2023-11-13T23:10:54.000Z",
        },
      },
    ]
  `)

  
})
