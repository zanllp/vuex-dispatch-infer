# vuex-dispatch-infer
vuex 字面量类型推导。支持推导嵌套模块的dispatch，commit字面量类型的type及StoreState。纯类型实现，无侵入性，易回退，无需单独写类型。
## Install
`yarn add vuex-dispatch-infer --dev`
## Vue3 Example
[Click here](./example)
### dispatch及store类型推导
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

```
## Preview
### Full feature
![image](https://user-images.githubusercontent.com/25872019/105982567-68a56300-60d2-11eb-955f-c9bcf4f21695.png)
### Degenerate
![image](https://user-images.githubusercontent.com/25872019/106233591-cef4c780-6231-11eb-9421-8ec36d046216.png)

### Commit
![image](https://user-images.githubusercontent.com/25872019/118070670-ecacfd80-b3d8-11eb-923b-2d338c6a12fa.png)



