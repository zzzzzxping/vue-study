class Grouter {
  constructor (options) {
    this.options = options
    console.log('options', this.options)
    Vue.util.defineReactive(
      this,
      'current',
      window.location.hash.slice(1) || '/'
    )
    window.addEventListener('hashchange', () => {
      // 匹配当前的hash对应的component
      this.current = window.location.hash.slice(1)
    })
  }
}
let Vue
Grouter.install = function (_Vue) {
  Vue = _Vue

  // router 实例全局注册
  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  Vue.component('router-view', {
    render (h) {
      let component = null
      const route = this.$router.options.routes.find(route => route.path === this.$router.current)
      if (route) {
        component = route.component
      }
      return h(component)
    }
  })
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render (h) {
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    }
  })
}
export default Grouter
