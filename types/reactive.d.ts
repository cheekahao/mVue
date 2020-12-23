import { Ref, UnwrapRef } from './ref'
// only unwrap nested ref
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>

export const enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    RAW = '__v_raw'
}

export interface Target {
    [ReactiveFlags.SKIP]?: boolean
    [ReactiveFlags.IS_REACTIVE]?: boolean
    [ReactiveFlags.IS_READONLY]?: boolean
    [ReactiveFlags.RAW]?: any
}