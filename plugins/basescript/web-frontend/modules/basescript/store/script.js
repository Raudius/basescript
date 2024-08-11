import { ScriptCollectionApplicationType } from '../applicationTypes'
import ScriptService from '../services/script'
export const mutations = {
  ADD_ITEM(state, { collection, script }) {
    collection.scripts.push(script)
  },
  UPDATE_ITEM(state, { script, values }) {
    Object.assign(script, { ...script, ...values })
  },
  DELETE_ITEM(state, { collection, script }) {
    const index = collection.scripts.findIndex((item) => item.id === script.id)
    collection.scripts.splice(index, 1)
  },
}
export const actions = {
  async selectById(
    { dispatch, getters, rootGetters },
    { collectionId, scriptId }
  ) {
    const collection = await dispatch('application/selectById', collectionId, {
      root: true,
    })

    const scriptCollectionType = ScriptCollectionApplicationType.getType()
    if (collection.type !== scriptCollectionType) {
      throw new Error(
        `The provided application doesn't have the required type "${scriptCollectionType}".`
      )
    }

    const script = collection.scripts.find((item) => item.id === scriptId)
    if (!script) {
      throw new Error('The script is not found in the selected application.')
    }

    return { collection, script }
  },

  async create({ commit, dispatch }, { collection, values }) {
    const scriptCollectionType = ScriptCollectionApplicationType.getType()
    if (collection.type !== scriptCollectionType) {
      throw new Error(
        `The provided application doesn't have the required type "${scriptCollectionType}".`
      )
    }

    const { data } = await ScriptService(this.$client).create(
      collection.id,
      values
    )

    dispatch('forceUpsert', { collection, data })
    return data
  },

  async delete({ commit, dispatch }, { collection, script }) {
    const { data } = await ScriptService(this.$client).delete(script.id)
    commit('DELETE_ITEM', { collection, script })

    return data
  },

  async update({ commit, dispatch }, { collection, script, values }) {
    const { data } = await ScriptService(this.$client).update(script.id, values)

    dispatch('forceUpsert', { collection, data })
    return data
  },

  forceUpsert({ commit }, { collection, data }) {
    const script = collection.scripts.find((item) => item.id === data.id)
    if (script === undefined) {
      commit('ADD_ITEM', { collection, script: data })
    } else {
      commit('UPDATE_ITEM', { collection, script, values: data })
    }

    return collection.scripts.find((item) => item.id === data.id)
  },
}

export const state = {}

export const getters = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
