# vuex-dispatch-infer
## Install
`yarn add vuex-dispatch-infer --dev`
## Vue3 Example
[Click here](./example)
```typescript
const modules = {
    cart,
    products
}

type Modules = typeof modules
type RS = Modules2RootState<Modules>
const store = createStore<RS>({
    modules
})

export const dispatch = store.dispatch.bind(store) as DispatchOverloadFunc<Modules>

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

export const dispatchDegenerate = store.dispatch.bind(store) as DispatchOverloadFuncDegenerate<Modules>
dispatchDegenerate('cart/product2/component/assembly')

```
## Preview
### Full feature
![image](https://user-images.githubusercontent.com/25872019/105982567-68a56300-60d2-11eb-955f-c9bcf4f21695.png)
### Degenerate
![image](https://user-images.githubusercontent.com/25872019/106233591-cef4c780-6231-11eb-9421-8ec36d046216.png)


