import { DispatchOptions, Module } from 'vuex'

type Shift <T extends any[]> = T extends [infer _, ... infer Rest] ? Rest : never
type Fn = (...args: any) => any
type Push<T extends any[], E> = [...T, E];

type ActionReduceFn <T, R> = R extends null ? T : R & T

type ActionFn <
    ActionDegenerateralType,
    ParamsTypeTuple extends any[],
    ReturnType,
    R = null,
    Payload = ParamsTypeTuple['length'] extends 1 ? never : ParamsTypeTuple[1]
  > =
  ParamsTypeTuple['length'] extends 1 // [ActionContext]
    ? ActionReduceFn<(type: ActionDegenerateralType, payload?: undefined, options?: DispatchOptions ) => ReturnType, R>
    : ParamsTypeTuple[1] extends Exclude<Payload, undefined>
        // [ActionContext, string|number]
        ? ActionReduceFn<(type: ActionDegenerateralType, payload: Payload, options?: DispatchOptions ) => ReturnType, R>
        // [ActionContext, ?string|number]
        : ActionReduceFn<(type: ActionDegenerateralType, payload?: Payload, options?: DispatchOptions ) => ReturnType, R>
/**
 * 映射Action函数到Action的描述
 */
export type MapAction2ActionDesc<
    T extends Array<any>,
    ModuleName extends string | number,
    Actions extends Record<string, Fn>,
    Res extends Fn | null = null
  > =
  T['length'] extends 0
    ? Res
    : T['length'] extends 1
        ? ActionFn<`${ModuleName}/${T[0]}`, Parameters<Actions[T[0]]>, ReturnType<Actions[T[0]]>, Res>
        : T extends [infer C, ... infer Rest]
            ? C extends keyof Actions
                ? MapAction2ActionDesc<
                    Rest,
                    ModuleName,
                    Actions,
                    ActionFn<`${ModuleName}/${C & string}`, Parameters<Actions[C]>, ReturnType<Actions[C]>, Res>
                  >
                : never
            : never

export type RequiredModule = Record<string, { actions: Record<string, Fn>, modules?: RequiredModule }>

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
    R extends Fn| null = null
  > =
 Keys['length'] extends 0
   ? never
   : Keys['length'] extends 1
        ? R extends null
            ? T[Keys[0]]
            : R & T[Keys[0]]
        : Keys extends [infer C, ... infer Rest]
            ? C extends keyof T
                ? MergeActions<T, Rest, R extends null ? T[C]: R & T[C]>
                : never
            : never

/**
 * 联合类型转元组 ，利用了重载函数的优先级
 *
 * https://github.com/microsoft/TypeScript/issues/13298
 * like https://github.com/sindresorhus/type-fest/blob/f16d4d09effc814ce4ab1b6902e73a6f8b102cf8/source/union-to-tuple.d.ts
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type LastOfUnion<T> = UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

/**
 * 性能消耗巨大尽可能避免使用
 */
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
    ModuleKeyTuple = UnionToTuple<keyof T>
> = ModuleKeyTuple extends string[] ? MergeActions<ModulesActions, ModuleKeyTuple> : never


/*************************性能不足时的退化版本***********************************/

type GetModuleActionsDegenerate<T extends RequiredModule> =
{
  [p in keyof T]: p extends string
    ? T[p]['modules'] extends infer NextModules
        ? NextModules extends RequiredModule
            ? `${p}/${keyof T[p]['actions'] & string}` | `${p}/${DispatchActionsDegenerate<NextModules>}`
            : `${p}/${keyof T[p]['actions'] & string}`
        : never
    : never
}

/**
 * 合并一个Stroe里面的所有module的action描述到一个数组
 *
 * @param T Store类型
 * @param keys Store里面所有module的key元组
 */
type MergeActionsDegenerate <T extends Record<string, any>, Keys extends any[], R extends string[] = []> =
Keys['length'] extends 0
  ? R
  : Keys extends [infer C, ... infer Rest]
    ? C extends keyof T
      ? MergeActionsDegenerate<T, Rest, [...R, T[C]]>
      : never
    : R

type DispatchActionsDegenerate<
    T extends RequiredModule,
    ModulesActions = GetModuleActionsDegenerate<T>,
    ModuleKeyTuple = UnionToTuple<keyof T>
> = ModuleKeyTuple extends any [] ? MergeActionsDegenerate<ModulesActions, ModuleKeyTuple>[number] : never

/**
 * 使用单个Store的类型生成Store::Dispatch的重载函数类型，支持无限推导
 *
 * @example
 * const dispatch = store.dispatch.bind(store) as DispatchOverloadFuncDegenerate<S>
 */
type DispatchOverloadFuncDegenerate<T extends RequiredModule> = (type: DispatchActionsDegenerate<T>, payload?: any) => any

type StateRequiredModule = Record<string, { modules?: RequiredModule, state?: any }>
type Modules2RootState <T extends StateRequiredModule> = {
  [p in keyof T]: T[p]['state'] extends infer U
      ? U extends undefined
          ? never
          : (U extends Fn
              ? ReturnType<U>
              : U) &
              (T[p]['modules'] extends infer M
                ? M extends StateRequiredModule
                  ? Modules2RootState<M>
                  : {}
                : never)
      : never
}
