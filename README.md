# vuex-dispatch-infer
## Install
`yarn add vuex-dispatch-infer --dev`
## Vue3 Example
[Click here](./example)
```typescript
import { createStore } from 'vuex'
import cart from './modules/cart'
import products from './modules/products'
import { DispatchOverloadFunc } from 'vuex-dispatch-infer'

const modules = {
    cart,
    products
}

export type RS = typeof modules 
const store = createStore<RS>({
    modules
})

export const dispatch = store.dispatch.bind(store) as DispatchOverloadFunc<RS> 

```
## Preview
![image](https://user-images.githubusercontent.com/25872019/105981363-f3855e00-60d0-11eb-92bc-997273678b8e.png)
