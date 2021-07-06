# vuex-dispatch-infer
vuex 字面量类型推导。
支持推导vuex的所有用到字面量类型的地方及RootState。
纯类型实现，无侵入性，易回退，无需单独写类型。
## Install
`yarn add vuex-dispatch-infer --dev`
## Vue3 Example
[Click here](./example)
### 一个简单的dispatch及store类型推导例子
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

type ActionDict = DispatchOverloadDict<Modules, 'actions'>
export const dispatch : <T extends keyof ActionDict> (type: T, ...args: Parameters<ActionDict[T]>) => ReturnType<ActionDict[T]> = store.dispatch as any

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
```
### 实用类型
可以为其他库提供一些类型上的支持
使用`keyof DispatchOverloadDict<Modules, 'mutations'>`可以获取到所有mutations字面量的联合
![image](https://user-images.githubusercontent.com/25872019/121627208-81bf1700-caa9-11eb-90e0-5d8f51c372dd.png)
`keyof DispatchOverloadDict<Modules, 'actions'>`则是可以获取所有actions字面量的联合

## Preview
### Full feature
![image](https://user-images.githubusercontent.com/25872019/105982567-68a56300-60d2-11eb-955f-c9bcf4f21695.png)

### Commit
![image](https://user-images.githubusercontent.com/25872019/118070670-ecacfd80-b3d8-11eb-923b-2d338c6a12fa.png)



