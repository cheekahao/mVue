type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>

export const enum TrackOpTypes {
    GET = 'get',
    HAS = 'has',
    ITERATE = 'iterate'
}

export const enum TriggerOpTypes {
    SET = 'set',
    ADD = 'add',
    DELETE = 'delete',
    CLEAR = 'clear'
}

export interface ReactiveEffect<T = any> {
    (): T
    _isEffect: true
    id: number
    active: boolean
    raw: () => T
    deps: Array<Dep>
    options: ReactiveEffectOptions
    allowRecurse: boolean
}

export interface ReactiveEffectOptions {
    lazy?: boolean
    scheduler?: (job: ReactiveEffect) => void
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    onStop?: () => void
    allowRecurse?: boolean
}

export type DebuggerEvent = {
    effect: ReactiveEffect
    target: object
    type: TrackOpTypes | TriggerOpTypes
    key: any
} & DebuggerEventExtraInfo

export interface DebuggerEventExtraInfo {
    newValue?: any
    oldValue?: any
    oldTarget?: Map<any, any> | Set<any>
}