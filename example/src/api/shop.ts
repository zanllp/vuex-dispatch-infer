/**
 * Mocking client-server processing
 */
const _products = [
  { 'id': 1, 'title': 'iPad 4 Mini', 'price': 500.01, 'inventory': 2 },
  { 'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'inventory': 10 },
  { 'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'inventory': 5 }
]
type Unpack <T> = T extends Array<infer U> ? U : never 
export type Product = Unpack<typeof _products>

type CB = (...args: any[]) => any 
export default {
  getProducts (cb: CB) {
    setTimeout(() => cb(_products), 100)
  },

  buyProducts (products: Product, cb: CB, errorCb: CB) {
    setTimeout(() => {
      // simulate random checkout failure.
      (Math.random() > 0.5 || navigator.webdriver)
        ? cb()
        : errorCb()
    }, 100)
  }
}
