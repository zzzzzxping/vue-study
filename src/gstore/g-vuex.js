// 实现一个插件

// 实现store
let Vue
class Store {
  constructor (options) {
    this._mutations = options.mutations
    this._actions = options.actions
    this._getters = options.getters
    // Vue.util.defineReactive(this, 'state', options.state)
    // this.state = new Vue({
    //   data: options.state
    // })

    const computed = {}
    this.getters = {}
    for (const key in this._getters) {
      computed[key] = () => {
        return this._getters[key](this.state)
      }
      Object.defineProperty(this.getters, key, {
        get: () => {
          return this._vm[key]
        }
      })
    }

    this._vm = new Vue({
      data: {
        // 添加$$，vue就不会代理
        $$state: options.state
      },
      computed: computed
    })
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    console.error('不能设置state')
  }

  // this.$commit('add', state)
  commit (type, params) {
    // 1. 根据type获取mutation
    const mutation = this._mutations[type]
    if (!mutation) {
      console.error('不存在mutation')
      return
    }
    mutation(this.state, params)
  }

  dispatch (type, payload) {
    const action = this._actions[type]
    if (!action) {
      console.error('不存在action')
      return
    }
    action(this, payload)
  }
}

function install (_vue) {
  Vue = _vue

  //  注册$store
  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
