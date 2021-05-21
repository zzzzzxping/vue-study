// Object.defineProperty()

// 给一个obj定义一个动态的响应式属性
function defineReactive (obj, key, value) {
  Object.defineProperty(obj, key, {
    get () {
      console.log('get', key)
      return value
    },
    set (newVal) {
      if (newVal !== value) {
        console.log('set', newVal)
        value = newVal
      }
    }
  })
}
var obj = {}
defineReactive(obj, 'foo', 'foo')
obj.foo = 1