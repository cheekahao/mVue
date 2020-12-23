import { Target, TrackOpTypes, TriggerOpTypes, KeyToDepMap, ReactiveEffect } from '../../types'
import { isArray, isMap, isIntegerKey} from '../util'
import { ITERATE_KEY, MAP_KEY_ITERATE_KEY} from './reactive'
const targetMap = new WeakMap<any, KeyToDepMap>()
let activeEffect: ReactiveEffect | undefined
let shouldTrack = true

export function track(target: Target, type: TrackOpTypes, key: unknown) {
    if (!shouldTrack || activeEffect === undefined) {
        return
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
        activeEffect.deps.push(dep)
    }
}

export function trigger(
    target: object,
    type: TriggerOpTypes,
    key?: unknown,
    newValue?: unknown
) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        // never been tracked
        return
    }

    const effects = new Set<ReactiveEffect>()
    const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                if (effect !== activeEffect || effect.allowRecurse) {
                    effects.add(effect)
                }
            })
        }
    }

    if (type === TriggerOpTypes.CLEAR) {
        // collection being cleared
        // trigger all effects for target
        depsMap.forEach(add)
    } else if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= (newValue as number)) {
                add(dep)
            }
        })
    } else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            add(depsMap.get(key))
        }

        // also run for iteration key on ADD | DELETE | Map.SET
        switch (type) {
            case TriggerOpTypes.ADD:
                if (!isArray(target)) {
                    add(depsMap.get(ITERATE_KEY))
                    if (isMap(target)) {
                        add(depsMap.get(MAP_KEY_ITERATE_KEY))
                    }
                } else if (isIntegerKey(key)) {
                    // new index added to array -> length changes
                    add(depsMap.get('length'))
                }
                break
            case TriggerOpTypes.DELETE:
                if (!isArray(target)) {
                    add(depsMap.get(ITERATE_KEY))
                    if (isMap(target)) {
                        add(depsMap.get(MAP_KEY_ITERATE_KEY))
                    }
                }
                break
            case TriggerOpTypes.SET:
                if (isMap(target)) {
                    add(depsMap.get(ITERATE_KEY))
                }
                break
        }
    }

    const run = (effect: ReactiveEffect) => {
        if (effect.options.scheduler) {
            effect.options.scheduler(effect)
        } else {
            effect()
        }
    }

    effects.forEach(run)
}