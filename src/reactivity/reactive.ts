
import { UnwrapNestedRefs} from '../../types'

const proxyMap = new WeakMap<Target, any>()

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
    return createReactiveObject(
        target,
        false,
        mutableHandlers,
        mutableCollectionHandlers
    )
}