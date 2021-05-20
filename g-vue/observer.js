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
      defineReactive(obj, key, val)
    })
  }
}