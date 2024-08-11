# BaseScript

Scripting plugin for Baserow.

## Demo

https://github.com/user-attachments/assets/f2156f4f-d0b1-4a8f-982b-da6f2b8d1596


## Scripting API

This plugin is still in early development and the API is not finalised. The following functions are currently implemented but may be subject to change in future versions of the plugin.

### `getBase({ id, name }): Promise<Database>`
Will find a matching database in the current workspace with the given ID and/or name. If only the name is provided and there are more than one matching databases in the workspace, it will fail.

### `[Database]->getTable({ id, name }): Promise<Table>`
Will find a matching table in the database.

### `[Table]->select(queryProps: Object): Promise<ResultSet>`
The `queryProps` are similar to the ones listed (and work in the way described) in the api-docs of the table's `List rows` endpoint.

See: https://api.baserow.io/api/redoc/#tag/Database-table-rows/operation/list_database_table_rows

```js
{ 
    page,           // Number
    size,           // Number
    userFieldNames, // Boolean
    search,         // String
    order_by,       // String
    filters,        // Object
    include,        // String
    exclude         // String
}
```

### `[ResultSet]->next(): Promise<ResultSet>`
Returns the next page of query results.

### `io.text(text: String): Promise<void>`
Displays the `text` on screen.

### `io.table(table: QueryResult): Promise<void>`
Displays the `table` on screen.

### `io.button(text: String): Promise<void> `
Displays a button with the given `text` on screen.

### `io.pickRow(table: Table): Promise<Object>`
Displays a button on screen, which allows the user to pick a row from the given `table`. Returns the selected row object.