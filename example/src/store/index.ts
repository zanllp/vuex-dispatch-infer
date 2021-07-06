import { createStore, Module } from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import {  Modules2RootState, DispatchOverloadDict } from '../../../'

const modules = {
    cart,
    products
}

type Modules = typeof modules
type RS = Modules2RootState<Modules>
const store = createStore<RS>({
    modules
})


type ActionDict = DispatchOverloadDict<Modules, 'actions'>
type ActionTypes = keyof ActionDict

export const dispatch : <T extends ActionTypes> (type: T, ...args: Parameters<ActionDict[T]>) => ReturnType<ActionDict[T]> = store.dispatch as any

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

export default store