export type ComputedGetter<T> = (ctx?: any) => T
export type ComputedSetter<T> = (v: T) => void
export interface WritableComputedOptions<T> {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
}

export type ComputedOptions = Record<
    string,
    ComputedGetter<any> | WritableComputedOptions<any>
>

export interface MethodOptions {
    [key: string]: Function
}

export interface ComponentOptionsBase<
    Props,
    RawBindings,
    D,
    C extends ComputedOptions,
    M extends MethodOptions,
    Mixin extends ComponentOptionsMixin,
    Extends extends ComponentOptionsMixin,
    E extends EmitsOptions,
    EE extends string = string,
    Defaults = {}
    >
    extends LegacyOptions<Props, D, C, M, Mixin, Extends>,
    ComponentInternalOptions,
    ComponentCustomOptions {
    setup?: (
        this: void,
        props: Props,
        ctx: SetupContext<E, Props>
    ) => Promise<RawBindings> | RawBindings | RenderFunction | void
    name?: string
    template?: string | object // can be a direct DOM node
    // Note: we are intentionally using the signature-less `Function` type here
    // since any type with signature will cause the whole inference to fail when
    // the return expression contains reference to `this`.
    // Luckily `render()` doesn't need any arguments nor does it care about return
    // type.
    render?: Function
    components?: Record<string, Component>
    directives?: Record<string, Directive>
    inheritAttrs?: boolean
    emits?: (E | EE[]) & ThisType<void>
    // TODO infer public instance type based on exposed keys
    expose?: string[]
    serverPrefetch?(): Promise<any>

    // Internal ------------------------------------------------------------------

    /**
     * SSR only. This is produced by compiler-ssr and attached in compiler-sfc
     * not user facing, so the typing is lax and for test only.
     *
     * @internal
     */
    ssrRender?: (
        ctx: any,
        push: (item: any) => void,
        parentInstance: ComponentInternalInstance,
        attrs: Data | undefined,
        // for compiler-optimized bindings
        $props: ComponentInternalInstance['props'],
        $setup: ComponentInternalInstance['setupState'],
        $data: ComponentInternalInstance['data'],
        $options: ComponentInternalInstance['ctx']
    ) => void

    /**
     * marker for AsyncComponentWrapper
     * @internal
     */
    __asyncLoader?: () => Promise<ConcreteComponent>
    /**
     * cache for merged $options
     * @internal
     */
    __merged?: ComponentOptions

    // Type differentiators ------------------------------------------------------

    // Note these are internal but need to be exposed in d.ts for type inference
    // to work!

    // type-only differentiator to separate OptionWithoutProps from a constructor
    // type returned by defineComponent() or FunctionalComponent
    call?: (this: unknown, ...args: unknown[]) => never
    // type-only differentiators for built-in Vnode types
    __isFragment?: never
    __isTeleport?: never
    __isSuspense?: never

    __defaults?: Defaults
}

export type ComponentOptionsMixin = ComponentOptionsBase<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
>

export type ComponentOptions<
    Props = {},
    RawBindings = any,
    D = any,
    C extends ComputedOptions = any,
    M extends MethodOptions = any,
    Mixin extends ComponentOptionsMixin = any,
    Extends extends ComponentOptionsMixin = any,
    E extends EmitsOptions = any
    > = ComponentOptionsBase<Props, RawBindings, D, C, M, Mixin, Extends, E> &
    ThisType<
        CreateComponentPublicInstance<
            {},
            RawBindings,
            D,
            C,
            M,
            Mixin,
            Extends,
            E,
            Readonly<Props>
        >
    >

export type Component<
    Props = any,
    RawBindings = any,
    D = any,
    C extends ComputedOptions = ComputedOptions,
    M extends MethodOptions = MethodOptions
    > =
    | ConcreteComponent<Props, RawBindings, D, C, M>
    | ComponentPublicInstanceConstructor<Props>