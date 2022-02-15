import { createStore } from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import { GetRootState, GetDispatchOverload, GetCommitOverload, GetOverloadDict } from '../../../'
import { Store } from 'vuex'

const storeParams = {
  modules: {
    cart,
    products
  },
  state: {
    hello : 'world'
  },
  mutations: {
    setHello (s: any, foo: string) {

    }
  }
}
type StoreParams = typeof storeParams
const store = createStore(storeParams) as Store<GetRootState<StoreParams>>

export const dispatch = store.dispatch as GetDispatchOverload<StoreParams> // 单独导出相对hook能检查的更严格
export const commit = store.commit as GetCommitOverload<StoreParams>

dispatch('cart/addProductToCart', {
    id: 2,
    title: '22',
    price: 1,
    inventory: 1
})

dispatch('products/getAllProducts').then(all => {
    console.log(all.map(prod => prod.title).join())
})
dispatch('products/getone', 1)

commit('setHello', 'bar')


/**
 * 可选的给hook函数增加重载
 */
declare module 'vuex' {
  type MutationDict = GetOverloadDict<StoreParams, 'mutations'>
  type ActionDict = GetOverloadDict<StoreParams, 'actions'>
  export interface Dispatch {
    <T extends keyof ActionDict> (type: T, ...args: Parameters<ActionDict[T]>): ReturnType<ActionDict[T]>
  }
  export function useStore<S = GetRootState<StoreParams>>(): Store<S>
  export interface Commit {
    <T extends keyof MutationDict> (type: T, ...args: Parameters<MutationDict[T]>) : void
  }
}

export default store
