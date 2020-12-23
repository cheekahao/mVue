
import { UnwrapNestedRefs, Target, TrackOpTypes, ReactiveFlags, TriggerOpTypes} from '../../types'
import { isArray, isIntegerKey, hasOwn } from '../util'
import { track, trigger} from './effect'

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean =>
    value !== oldValue && (value === value || oldValue === oldValue)

export const ITERATE_KEY = Symbol('iterate')
export const MAP_KEY_ITERATE_KEY = Symbol('Map key iterate')

const proxyMap = new WeakMap<Target, any>()

export function toRaw<T>(observed: T): T {
    return (
        (observed && toRaw((observed as Target)[ReactiveFlags.RAW])) || observed
    )
}

const handlers = {
    get(target: Target, key: string | symbol, receiver: object){
        const res = Reflect.get(target, key, receiver)

        track(target, TrackOpTypes.GET, key)
    },
    set(target: object, key: string | symbol, value: unknown, receiver: object): boolean{
        const oldValue = (target as any)[key]
        const hadKey =
            isArray(target) && isIntegerKey(key)
                ? Number(key) < target.length
                : hasOwn(target, key)
        const result = Reflect.set(target, key, value, receiver)
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, TriggerOpTypes.ADD, key, value)
            } else if (hasChanged(value, oldValue)) {
                trigger(target, TriggerOpTypes.SET, key, value)
            }
        }

        return result
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