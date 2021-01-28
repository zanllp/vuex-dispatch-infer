import { createStore } from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import { DispatchOverloadFunc, DispatchOverloadFuncDegenerate, ActionFn } from '../../../'

const modules = {
    cart,
    products
}

export type RS = typeof modules
const store = createStore<RS>({
    modules
})
export const dispatch = store.dispatch.bind(store) as DispatchOverloadFunc<RS>

dispatch('cart/addProductToCart', {
    id: 2,
    title: '22',
    price: 1,
    inventory: 1
})

dispatch('products/getAllProducts').then(all => {
    console.log(all.map(prod => prod.title).join())
})
dispatch('products/getone',1)
export const dispatchDegenerate = store.dispatch.bind(store) as DispatchOverloadFuncDegenerate<RS>
dispatchDegenerate('cart/addProductToCart')
export default store