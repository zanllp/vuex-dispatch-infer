import { ActionContext } from 'vuex'
import store from '..'
import shop, { Product } from '../../api/shop'
import cart from './cart'

// initial state
const state = () => ({
  all: [] as Array<Product>
})

type S = ReturnType<typeof state>
type Action = ActionContext<S, any>
// getters
const getters = {}

// actions
const actions = {
  async getAllProducts({ commit, state }: Action) {
    shop.getProducts(products => {
      commit('setProducts', products)
    })
    return state.all
  },
  getone({ commit, state }: Action, id?: number) {
    return state.all.find(p => p.id === id)
  },
}

// mutations
const mutations = {
  setProducts(state: S, products: Product[]) {
    state.all = products
  },

  decrementProductInventory(state: S, { id }: Product) {
    const product = state.all.find(product => product.id === id)
    product!.inventory--
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    component: {
      actions: {
        assembly(_: Action) {

        }
      }
    }
  }
}
