export type ComputedOptions = Record<
    string,
    ComputedGetter<any> | WritableComputedOptions<any>
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