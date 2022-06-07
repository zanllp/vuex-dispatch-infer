import { ActionContext, DispatchOptions } from 'vuex'

type Shift <T extends any[]> = T extends [infer _, ... infer Rest] ? Rest : never
type Fn = (...args: any) => any
type Push<T extends any[], E> = [...T, E];

type Obj<V  = string , K extends string|number = string > = Record<K, V>

type ActionReduceFn <T, R> = R extends null ? T : R & T

type ForceAsync<T> = T extends Promise<any> ? T : Promise<T>

type RestrictedKey = 'mutations'|'actions'

type RestrictedStoreParams =  { modules: RequiredModule, mutations?: any, actions?: any, state?: any }

type ActionFn <
    ParamsTypeTuple extends any[],
    ReturnType,
    Payload = ParamsTypeTuple['length'] extends 1 ? undefined : ParamsTypeTuple[1]
  > =
  ParamsTypeTuple['length'] extends 1 // [ActionContext]
    ? (payload?: undefined, options?: DispatchOptions ) => ForceAsync<ReturnType>
    : ParamsTypeTuple[1] extends Exclude<Payload, undefined>
        // [ActionContext, string|number]
        ? (payload: Payload, options?: DispatchOptions ) => ForceAsync<ReturnType>
        // [ActionContext, ?string|number]
        : (payload?: Payload, options?: DispatchOptions ) => ForceAsync<ReturnType>
/**
 * 映射Action函数到Action的描述
 */
type MapFn2FnDesc<
    ModuleName extends string,
    Actions extends Obj<Fn>,
    Prefix = ModuleName extends '' ? '' : `${ModuleName}/`
> =
{
    [p in keyof Actions as `${Prefix & string}${p & string}`]: ActionFn<Parameters<Actions[p]>, ReturnType<Actions[p]>>
}

type RequiredModule = Obj<{ mutations: Obj<Fn>, actions: Obj<Fn>, modules?: RequiredModule }, string>

/**
 * 将所有模块的action函数转成action的描述
 */
type GetModulesFnDict<
    T extends RequiredModule,
    KeyType extends RestrictedKey = 'actions'
    > =
{
  [p in keyof T]: MapFn2FnDesc<p & string, T[p][KeyType]>
}

/**
 * 合并一个Stroe里面的所有module的action描述到一个数组
 *
 * @param T Store类型
 * @param keys Store里面所有module的key元组
 */
type MergeModuleFn <
    T extends Record<string,any>,
    Keys extends any[],
    R extends Fn | null = null
  > =
 Keys['length'] extends 0
   ? never
   : Keys['length'] extends 1
        ? R extends null
            ? T[Keys[0]]
            : R & T[Keys[0]]
        : Keys extends [infer C, ... infer Rest]
            ? C extends keyof T
                ? MergeModuleFn <T, Rest, R extends null ? T[C]: R & T[C]>
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
 * 获取type到函数的字典
 */
type DispatchOverloadDict<
    T extends RequiredModule,
    KeyType extends RestrictedKey,
    ModulesFnDict = GetModulesFnDict<T, KeyType>,
    ModuleKeyTuple = UnionToTuple<keyof T>
> = ModuleKeyTuple extends string[] ? MergeModuleFn<ModulesFnDict, ModuleKeyTuple> : never


type GetOverloadDict<
    StoreParams extends RestrictedStoreParams,
    KeyType extends RestrictedKey,
> = DispatchOverloadDict<StoreParams['modules'], KeyType> & MapFn2FnDesc<'', StoreParams[KeyType]>

type GetCommitOverload<T extends RestrictedStoreParams, MutationDict = GetOverloadDict<T, 'mutations'>> =
  <T extends keyof MutationDict, fn = MutationDict[T]> (type: T, ...args: fn extends Fn ? Parameters<fn>: []) => void

type GetDispatchOverload<T extends RestrictedStoreParams, ActionDict = GetOverloadDict<T, 'actions'>> =
  <T extends keyof ActionDict, fn = ActionDict[T]> (type: T,  ...args: fn extends Fn ? Parameters<fn>: []) => fn extends Fn ? ReturnType<fn> : never

type StateRequiredModule = Obj<{ modules?: RequiredModule, state?: any }>
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

type GetRootState <T extends RestrictedStoreParams> = Modules2RootState<T['modules']> & T['state']

type CommitStrict <Mutations extends Obj<Fn>> = <K extends keyof Mutations> (type: K, ...args: Shift<Parameters<Mutations[K]>>) => void
type ActionContextInfer<Commit extends Obj<Fn>> = { commit: CommitStrict<Commit> }
type StrictActionContext<State, Commit extends Obj<Fn>> = Omit<ActionContext<State, any>, 'commit'> & ActionContextInfer<Commit>
