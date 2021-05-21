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
  // 递归响应式
  observe(value)
  // 创建Dep实例
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get () {
      console.log('get', key)
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return value
    },
    set (newVal) {
      if (newVal !== value) {
        console.log('set', newVal)
        value = newVal
        // 新的值是一个对象的话也要响应式处理
        observe(newVal)
        // update()
        dep.notify()
      }
    }
  })
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

// 实现Gvue类
class GVue {
  constructor (options) {
    this.$options = options
    this.$data = options.data
    // 1. 对options的data做响应式处理
    observe(options.data)
    // 2. 代理到实例上
    proxy(this)
    // 3. 编译
    new Compile(options.el, this)
  }
}

class Compile {
  constructor (el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)
    this.compile(this.$el)
  }
  compile (node) {
    const childNodes = node.childNodes
    childNodes.forEach(n => {
      if(this.isElement(n)) {
        // 编译元素
        this.compileElement(n)
        // 如果有子元素则递归
        if(n.childNodes.length > 0) {
          this.compile(n)
        }
      } else if (this.isInter(n)) {
        // 编译文本
        this.compileText(n)
      }
    })
  }

  isElement (node) {
    return node.nodeType === 1
  }

  // {{xxxx}}
  isInter (node) {
    const reg = /\{\{(.*)\}\}/
    return node.nodeType === 3 && reg.test(node.textContent)
  }

  compileText (n) {
    // n.textContent = this.$vm[RegExp.$1]
    this.update(n, RegExp.$1, 'text')
  }

  compileElement (n) {
    // 遍历attributes
    const attrs = n.attributes
    Array.from(attrs).forEach(attr => {
      // attr.name, attr.value
      const attrName = attr.name
      const attrVal = attr.value
      if(this.isDir(attrName)) {
        // 执行特定指令
        const dir = attrName.substring(2)
        this[dir] && this[dir](n, attrVal)
      }
    })
  }

  update (node, exp, dir) {
    // init
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])
    // update
    new Watcher(this.$vm, exp, val => {
      fn && fn(node, val)
    })
  }

  // k-text
  text (node, exp) {
    this.update(node, exp, 'text')
  }

  textUpdater (node, val) {
    node.textContent = val
  }
  
  // k-html
  html (node, exp) {
    this.update(node, exp, 'html')
  }

  htmlUpdater (node, val) {
    node.innerHTML = val
  }

  isDir(attrName) {
    return attrName.startsWith('g-')
  }
}

// 负责做dom的更新
class Watcher {
  constructor(vm, key, updater) {
    this.vm = vm
    this.key = key
    this.updater = updater

    // 触发get
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
  }
  // 将来会被Dep调用
  update () {
    // 更新视图
    this.updater.call(this.vm, this.vm[this.key])
  }
}
// 保存所有watcher的依赖类
class Dep {
  constructor() {
    this.deps = []
  }
  // 此处的dep为watcher实例
  addDep (dep) {
    this.deps.push(dep)
  }

  notify () {
    this.deps.forEach(dep => dep.update())
  }
}