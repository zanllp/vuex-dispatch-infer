import { ActionContext } from 'vuex'
import shop, { Product } from '../../api/shop'

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
  getAllProducts ({ commit }: Action ) {
    shop.getProducts(products => {
      commit('setProducts', products)
    })
  }
}

// mutations
const mutations = {
  setProducts (state: S, products: Product[]) {
    state.all = products
  },

  decrementProductInventory (state: S, { id }: Product) {
    const product = state.all.find(product => product.id === id)
    product!.inventory--
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
