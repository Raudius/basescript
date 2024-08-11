import ApplicationService from '@baserow/modules/core/services/application'
import TableService from '@baserow/modules/database/services/table'
import FieldService from '@baserow/modules/database/services/field'
import RowService from '@basescript/services/row'

const models = {
  Database(id, name) {
    return {
      id,
      name,
      type: 'database',
    }
  },

  Table(id, name, fields, database) {
    return {
      id,
      name,
      database,
      fields,
      type: 'table',
    }
  },

  ResultSet(results, table, searchProps) {
    return {
      rows: results,
      table,
      searchProps,
      type: 'results_set',
    }
  },
}

export const BasescriptClient = (workspaceId, baserowClient, ioHandler) => {
  return {
    getBase: async function (cb, props = {}) {
      const applicationsResult = await ApplicationService(
        baserowClient
      ).fetchAll(workspaceId)

      props.type = 'database'
      const match = getMatchingObject(applicationsResult.data, props)

      cb(models.Database(match.id, match.name))
    },

    async database_getTable(self, cb, props = {}) {
      const tablesResult = await TableService(baserowClient).fetchAll(self.id)

      const match = getMatchingObject(tablesResult.data, props)
      const fieldsResult = await FieldService(baserowClient).fetchAll(match.id)

      cb(models.Table(match.id, match.name, fieldsResult.data, self))
    },

    async table_select(self, cb, props = {}) {
      props.filters = props.filters ? JSON.stringify(props.filters) : null
      props.page = props.page ?? 1
      const rowsResult = await RowService(baserowClient).fetchFiltered({
        ...props,
        tableId: self.id,
      })

      cb(models.ResultSet(rowsResult.data.results, self, props))
    },

    async results_set_next(self, cb) {
      const props = self.searchProps
      props.page += 1
      await this.table_select(cb, self.table, props)
    },

    io_button(self, cb, text) {
      ioHandler.push(cb, 'button', { text })
    },

    io_pickRow(self, cb, table) {
      const cbWrap = (result) => {
        const row = result.row
        delete row._
        cb(row)
      }

      ioHandler.push(cbWrap, 'select-row', { tableId: table.id })
    },

    io_text(self, cb, text) {
      ioHandler.push(cb, 'text', { text })
    },

    io_table(self, cb, resultSet) {
      ioHandler.push(cb, 'table', {
        rows: resultSet.rows,
        fields: resultSet.table.fields,
      })
    },

    handleMessage(data, cb) {
      if (!data.name) {
        return
      }
      const args = data.args ?? []
      args.unshift(cb)
      if (data.subject) {
        args.unshift(data.subject)
      }

      if (!Object.hasOwn(this, data.name)) {
        const methodName = data.name.split('_').pop()
        const scope = data.subject
          ? `${data.subject.type}.${methodName}`
          : methodName
        throw new Error(`function '${scope}' does not exist`)
      }
      this[data.name](...args)
    },
  }
}

/**
 * Helper function which finds an object in an array that contain the given props.
 *
 * If exactly one item is not found an exception is thrown.
 *
 * @param objects An array of objects.
 * @param props An object of props which we expect to find.
 * @returns {Object} The matching object in the array.
 */
function getMatchingObject(objects, props) {
  const matches = objects.filter((object) => {
    for (const prop of Object.keys(props)) {
      if (object[prop] !== props[prop]) {
        return false
      }
    }

    return true
  })

  if (matches.length === 0) {
    throw new Error('could not be find a match with the given properties')
  }

  if (matches.length > 1) {
    throw new Error('founds too many matches with the given properties')
  }

  return matches[0]
}
