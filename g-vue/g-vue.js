// 实现Gvue类
class GVue {
  constructor (options) {
    this.$options = options
    this.$data = options.data
    // 对options的data做响应式处理
    observe(options.data)
    proxy(this)
  }
}
// 能够将传入的对象的所有key代理到指定对象上
function proxy (vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get () {
        return vm.$data[key]
      },
      set (newVal) {
        vm.$data[key] = newVal
      }
    })
  })
}

function defineReactive (obj, key, value) {
  observe(value)
  Object.defineProperty(obj, key, {
    get () {
      console.log('get', key)
      return value
    },
    set (newVal) {
      if (newVal !== value) {
        console.log('set', newVal)
        value = newVal
        observe(newVal)
        // update()
      }
    }
  })
}

function update () {
  // app.innerText = obj.foo
}

// 遍历响应式处理，递归的对obj的所有属性定义响应式
function observe (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  new Observer(obj)
}

function set (obj, key, value) {
  defineReactive(obj, key, value)
}

class Observer {
  constructor (obj) {
    // 判断传入的obj的类型，做相应的处理
    if (Array.isArray(obj)) {
      // todo
    } else {
      this.walk(obj)
    }
  }
  
  walk (obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}