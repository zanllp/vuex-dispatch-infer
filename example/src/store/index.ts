import { createStore, Module } from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import { DispatchOverloadFunc, DispatchOverloadFuncDegenerate, Modules2RootState } from '../../../'

const modules = {
    cart,
    products
}

type Modules = typeof modules
type RS = Modules2RootState<Modules>
const store = createStore<RS>({
    modules
})
console.log(store.state.cart.product2.component.ee)
export const dispatch = store.dispatch as DispatchOverloadFunc<Modules>

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
export const dispatchDegenerate = store.dispatch as DispatchOverloadFuncDegenerate<Modules>
dispatchDegenerate('cart/product2/component/assembly')

export default store