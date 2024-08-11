export default (client) => {
  return {
    fetchFiltered({
      tableId,
      userFieldNames,
      filters,
      search,
      include,
      exclude,
      page = 1,
      size = 10,
    }) {
      const config = {
        params: {
          page,
          size,
          include,
          exclude,
        },
      }

      if (search !== null && search !== '') {
        config.params.search = search
      }

      if (filters !== null) {
        config.params.filters = filters
      }

      if (userFieldNames) {
        config.params.user_field_names = true
      }

      return client.get(`/database/rows/table/${tableId}/`, config)
    },
  }
}
