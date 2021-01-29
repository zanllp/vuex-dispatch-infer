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
### Full feature
![image](https://user-images.githubusercontent.com/25872019/105982567-68a56300-60d2-11eb-955f-c9bcf4f21695.png)
### Degenerate
![image](https://user-images.githubusercontent.com/25872019/106232834-f185e100-622f-11eb-9e21-d775488d6505.png)

