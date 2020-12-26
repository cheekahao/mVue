import {ReactiveFlags} from './reactive'
export interface RendererNode {
    [key: string]: any
}

export interface RendererElement extends RendererNode { }

export type Fragment = Symbol
export type Text = Symbol
export type Comment = Symbol
export type Static = Symbol

export type VNodeTypes =
    | string
    | VNode
    | Component
    | typeof Text
    | typeof Static
    | typeof Comment
    | typeof Fragment
    | typeof TeleportImpl
    | typeof SuspenseImpl

export interface VNode<
    HostNode = RendererNode,
    HostElement = RendererElement,
    ExtraProps = { [key: string]: any }
    > {
    /**
     * @internal
     */
    __v_isVNode: true
    /**
     * @internal
     */
    [ReactiveFlags.SKIP]: true
    type: VNodeTypes
    props: (VNodeProps & ExtraProps) | null
    key: string | number | null
    ref: VNodeNormalizedRef | null
    scopeId: string | null // SFC only
    children: VNodeNormalizedChildren
    component: ComponentInternalInstance | null
    dirs: DirectiveBinding[] | null
    transition: TransitionHooks<HostElement> | null

    // DOM
    el: HostNode | null
    anchor: HostNode | null // fragment anchor
    target: HostElement | null // teleport target
    targetAnchor: HostNode | null // teleport target anchor
    staticCount: number // number of elements contained in a static vnode

    // suspense
    suspense: SuspenseBoundary | null
    ssContent: VNode | null
    ssFallback: VNode | null

    // optimization only
    shapeFlag: number
    patchFlag: number
    dynamicProps: string[] | null
    dynamicChildren: VNode[] | null

    // application root node only
    appContext: AppContext | null
}