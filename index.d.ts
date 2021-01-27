import { DispatchOptions } from 'vuex'

type Shift <T extends any[]> = T extends [infer _, ... infer Rest] ? Rest : never


type Push<T extends any[], E> = [...T, E];
/**
 * 映射Action函数到Action的描述
 */
export type MapAction2ActionDesc<
    T extends Array<any>,
    ModuleName extends string | number,
    Actions extends Record<string, (...args: any) => any>,
    Res extends Array<any> = []
  > =
  T['length'] extends 0
    ? Res
    : T extends [infer C, ... infer Rest]
      ? C extends string | number
        ? C extends keyof Actions
        ? MapAction2ActionDesc<Rest, ModuleName, Actions, [
          [`${ModuleName}/${C}`, Shift<Parameters<Actions[C]>>, ReturnType<Actions[C]> ],
           ...Res]>
        : never
      : never
    : never

export type RequiredModule = Record<string, { actions: Record<string, (...args: any) => any> }>

/**
 * 将所有模块的action函数转成action的描述
 */
export type GetModuleActions<T extends RequiredModule> =
{
  [p in keyof T]:
    p extends string
      ? MapAction2ActionDesc<UnionToTuple<keyof T[p]['actions']>, p, T[p]['actions']>
      : never
}

/**
 * 合并一个Stroe里面的所有module的action描述到一个数组
 *
 * @param T Store类型
 * @param keys Store里面所有module的key元组
 */
export type MergeActions <
    T extends Record<string,any>,
    Keys extends any[],
    R extends string[] = []
  > =
 Keys['length'] extends 0
   ? R
   : Keys extends [infer C, ... infer Rest]
     ? C extends keyof T
       ? MergeActions<T, Rest, [...R, ...T[C]]>
       : never
     : R

/**
 * action 函数的描述
 * @param ActionLiteralType 即action的函数名，Store::Dispatch的第一个参数type
 * @param ParamsType payload 的类型 ，如果有payload的话，类似[string]，没[]
 * @param ReturnType 返回类型
 */
type ActionDesc<
    ActionLiteralType extends string = string,
    ParamsType extends any[] = any[],
    ReturnType extends any = any
  > = [ActionLiteralType, ParamsType, ReturnType]

/**
 * 函数描述转函数
 */
type ActionDesc2Func <A extends ActionDesc>  =
  A[1]['length'] extends 0
    ? (type: A[0], payload?: undefined, options?: DispatchOptions) => A[2]
    : (type: A[0], payload: A[1][0], options?: DispatchOptions) => A[2]

/**
 * 将所有的action函数的描述合并成一个重载函数
 */
export type ActionDesc2OverloadFunc <T extends ActionDesc[], Res = ActionDesc2Func<T[0]>> =
   T['length'] extends 0
    ? never
    : T['length'] extends 1
      ? Res & ActionDesc2Func<T[0]>
      : Shift<T> extends infer N
          ? N extends ActionDesc[]
            ? ActionDesc2OverloadFunc<N , Res & ActionDesc2Func<T[0]>>
            : never
        : never

type FilterNullModule <T extends any[], R extends ActionDesc[] = []> =
  T extends [infer C, ... infer Rest]
    ? C extends ActionDesc
      ? FilterNullModule<Rest, [C, ...R]>
      : FilterNullModule<Rest, R>
    : R

/**
 * 联合类型转元组 ，利用了重载函数的优先级
 *
 * https://github.com/microsoft/TypeScript/issues/13298
 * like https://github.com/sindresorhus/type-fest/blob/f16d4d09effc814ce4ab1b6902e73a6f8b102cf8/source/union-to-tuple.d.ts
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type LastOfUnion<T> = UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

type UnionToTuple<T, L = LastOfUnion<T>, N = [T] extends [never] ? true : false> =
  true extends N
    ? []
    : Push<UnionToTuple<Exclude<T, L>>, L>

/**
 * 使用单个Store的类型生成Store::Dispatch的重载函数类型
 *
 * @example
 * export const dispatch = store.dispatch.bind(store) as DispatchOverloadFunc<S>
 */
type DispatchOverloadFunc<
    T extends RequiredModule, 
    ModulesActions = GetModuleActions<T>, 
    ModuleKeyTuple = UnionToTuple<keyof T>,
    Actions = ModuleKeyTuple extends string[] ? MergeActions<ModulesActions, ModuleKeyTuple> : never
> = Actions extends ActionDesc[] ? ActionDesc2OverloadFunc<Actions> : never


/*************************性能不足时的退化版本***********************************/
/**
 * 映射Action函数到Action的描述
 */
type MapAction2DispacthTypeLite<C, S extends string | number> = C extends string ? `${S}/${C}` : never

/**
 * 将所有模块的action函数转成action的描述
 */
type GetModuleActionsLite<T extends RequiredModule> =
{
  [p in keyof T]:
  p extends string
    ? MapAction2DispacthTypeLite<keyof T[p]['actions'], p>
    : never
}

/**
 * 合并一个Stroe里面的所有module的action描述到一个数组
 *
 * @param T Store类型
 * @param keys Store里面所有module的key元组
 */
type MergeActionsLite <T extends Record<string, any>, Keys extends any[], R extends string[] = []> =
Keys['length'] extends 0
  ? R
  : Keys extends [infer C, ... infer Rest]
    ? C extends keyof T
      ? MergeActionsLite<T, Rest, [...R, T[C]]>
      : never
    : R

/**
 * 使用单个Store的类型生成Store::Dispatch的重载函数类型
 *
 * @example
 * const dispatch = store.dispatch.bind(store) as DispatchOverloadFuncLite<S>
 */
export type DispatchOverloadFuncLite<
    T extends RequiredModule, 
    ModulesActions = GetModuleActionsLite<T>, 
    ModuleKeyTuple = UnionToTuple<keyof T>,
    Actions = ModuleKeyTuple extends any [] ? MergeActionsLite<ModulesActions, ModuleKeyTuple>[number] : never
> = (type: Actions, payload?: any) => any
