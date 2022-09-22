import { StrictActionContext } from '../../../..'
import shop, { Product } from '../../api/shop'
import products  from './products'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
  items: [] as { id: number; quantity: number }[],
  checkoutStatus: null as null | string
})
type S = ReturnType<typeof state>
type Action = StrictActionContext<S, typeof mutations>
// getters
const getters = {
  cartProducts: (state: S, getters: any, rootState: any) => {
    return state.items.map(({ id, quantity }) => {
      const product = rootState.products.all.find((product: { id: number }) => product.id === id)
      return {
        title: product.title,
        price: product.price,
        quantity
      }
    })
  },

  cartTotalPrice: (state: any, getters: { cartProducts: any[] }) => {
    return getters.cartProducts.reduce((total: number, product: { price: number; quantity: number }) => {
      return total + product.price * product.quantity
    }, 0)
  }
}


// actions
const actions = {

   checkout ({ commit, state }: Action, products: Product) {
    const savedCartItems = [...state.items]
    commit('setCheckoutStatus', null)
    // empty cart
    commit('setCartItems', { items: [] })

    shop.buyProducts(
      products,
      () => commit('setCheckoutStatus', 'successful'),
      () => {
        commit('setCheckoutStatus', 'failed')
        // rollback to the cart saved before sending the request
        commit('setCartItems', { items: savedCartItems })
      }
    )
  },

  async addProductToCart ({ state, commit }: Action, product: Product) {
    commit('setCheckoutStatus', null)
    if (product.inventory > 0) {
      const cartItem = state.items.find(item => item.id === product.id)
      if (!cartItem) {
        commit('pushProductToCart', { id: product.id })
      } else {
        commit('incrementItemQuantity', cartItem)
      }
      // remove 1 item from stock
      commit('products/decrementProductInventory', { id: product.id }, { root: true })
    }
  }
}

// mutations
const mutations = {
  pushProductToCart (state: S, { id }: { id: number }) {
    state.items.push({
      id,
      quantity: 1
    })
  },

  incrementItemQuantity (state: S, { id }: { id: number }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem!.quantity++
  },

  setCartItems (state: S, { items }: S) {
    state.items = items
  },

  setCheckoutStatus (state: S, status: S['checkoutStatus']) {
    state.checkoutStatus = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
// hello
