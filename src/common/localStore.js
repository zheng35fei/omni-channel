class Store {
    constructor(name) {
        this.store = window[name]
        this.prefix = 'sendinfo_ui_'
    }

    set(key, value, fn) {
        value = JSON.stringify(value)
        this.store.setItem(this.prefix + key, value)

        fn && fn()
    }

    get(key) {
        if (!key) {
            throw new Error('没有找到key。')
        }
        if (typeof key === 'object') {
            throw new Error('key不能是一个对象。')
        }
        let value = this.store.getItem(this.prefix + key)
        if (value !== null && 'undefined' != value) {
            value = JSON.parse(value)
        }
        return value
    }

    remove(key) {
        this.store.removeItem(this.prefix + key)
    }
}

export const sessionStorage = new Store('sessionStorage')
export const localStorage = new Store('localStorage')
