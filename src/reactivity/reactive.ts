
import { UnwrapNestedRefs, Target} from '../../types'

const proxyMap = new WeakMap<Target, any>()

const handlers = {
    get(target: object, key: string, value, receiver){

    },
    set(target: object, key: string, value, receiver): boolean{
        return true
    },
    deleteProperty(){

    }
}

/**
 * ```js
 * const count = ref(0)
 * const obj = reactive({
 *   count
 * })
 *
 * obj.count++
 * obj.count // -> 1
 * count.value // -> 1
 * ```
 */
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
    const proxy = new Proxy(target, handlers)

    proxyMap.set(target, proxy)

    return proxy
}