import { createStore } from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import { DispatchOverloadFunc, DispatchOverloadFuncLite } from 'vuex-dispatch-infer'

const modules = {
    cart,
    products
}

export type RS = typeof modules 
const store = createStore<RS>({
    modules
})

export const dispatch = store.dispatch.bind(store) as DispatchOverloadFunc<RS> 

export const dispatchl = store.dispatch.bind(store) as DispatchOverloadFuncLite<RS> 

export default store