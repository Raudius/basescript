export default (client) => {
  return {
    create(collectionId, values) {
      return client.post(`/basescript/collection/${collectionId}/`, values)
    },

    update(scriptId, values) {
      return client.patch(`/basescript/script/${scriptId}/`, values)
    },

    delete(scriptId) {
      return client.delete(`/basescript/script/${scriptId}/`)
    },
  }
}
