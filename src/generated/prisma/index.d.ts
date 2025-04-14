
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model AnalysisResult
 * 
 */
export type AnalysisResult = $Result.DefaultSelection<Prisma.$AnalysisResultPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Documents
 * const documents = await prisma.document.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Documents
   * const documents = await prisma.document.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.analysisResult`: Exposes CRUD operations for the **AnalysisResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AnalysisResults
    * const analysisResults = await prisma.analysisResult.findMany()
    * ```
    */
  get analysisResult(): Prisma.AnalysisResultDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Document: 'Document',
    AnalysisResult: 'AnalysisResult'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "document" | "analysisResult"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      AnalysisResult: {
        payload: Prisma.$AnalysisResultPayload<ExtArgs>
        fields: Prisma.AnalysisResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnalysisResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnalysisResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          findFirst: {
            args: Prisma.AnalysisResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnalysisResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          findMany: {
            args: Prisma.AnalysisResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>[]
          }
          create: {
            args: Prisma.AnalysisResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          createMany: {
            args: Prisma.AnalysisResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnalysisResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>[]
          }
          delete: {
            args: Prisma.AnalysisResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          update: {
            args: Prisma.AnalysisResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          deleteMany: {
            args: Prisma.AnalysisResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnalysisResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AnalysisResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>[]
          }
          upsert: {
            args: Prisma.AnalysisResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnalysisResultPayload>
          }
          aggregate: {
            args: Prisma.AnalysisResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnalysisResult>
          }
          groupBy: {
            args: Prisma.AnalysisResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnalysisResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnalysisResultCountArgs<ExtArgs>
            result: $Utils.Optional<AnalysisResultCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    document?: DocumentOmit
    analysisResult?: AnalysisResultOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DocumentCountOutputType
   */

  export type DocumentCountOutputType = {
    cvAnalyses: number
    jobDescAnalyses: number
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cvAnalyses?: boolean | DocumentCountOutputTypeCountCvAnalysesArgs
    jobDescAnalyses?: boolean | DocumentCountOutputTypeCountJobDescAnalysesArgs
  }

  // Custom InputTypes
  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentCountOutputType
     */
    select?: DocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountCvAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisResultWhereInput
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountJobDescAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisResultWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    type: string | null
    content: string | null
    filename: string | null
    fileType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    type: string | null
    content: string | null
    filename: string | null
    fileType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    type: number
    content: number
    filename: number
    fileType: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentMinAggregateInputType = {
    id?: true
    type?: true
    content?: true
    filename?: true
    fileType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    type?: true
    content?: true
    filename?: true
    fileType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    type?: true
    content?: true
    filename?: true
    fileType?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    content?: boolean
    filename?: boolean
    fileType?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cvAnalyses?: boolean | Document$cvAnalysesArgs<ExtArgs>
    jobDescAnalyses?: boolean | Document$jobDescAnalysesArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    content?: boolean
    filename?: boolean
    fileType?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    content?: boolean
    filename?: boolean
    fileType?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    type?: boolean
    content?: boolean
    filename?: boolean
    fileType?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "content" | "filename" | "fileType" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cvAnalyses?: boolean | Document$cvAnalysesArgs<ExtArgs>
    jobDescAnalyses?: boolean | Document$jobDescAnalysesArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      cvAnalyses: Prisma.$AnalysisResultPayload<ExtArgs>[]
      jobDescAnalyses: Prisma.$AnalysisResultPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      content: string
      filename: string
      fileType: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cvAnalyses<T extends Document$cvAnalysesArgs<ExtArgs> = {}>(args?: Subset<T, Document$cvAnalysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    jobDescAnalyses<T extends Document$jobDescAnalysesArgs<ExtArgs> = {}>(args?: Subset<T, Document$jobDescAnalysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly type: FieldRef<"Document", 'String'>
    readonly content: FieldRef<"Document", 'String'>
    readonly filename: FieldRef<"Document", 'String'>
    readonly fileType: FieldRef<"Document", 'String'>
    readonly metadata: FieldRef<"Document", 'Json'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document.cvAnalyses
   */
  export type Document$cvAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    where?: AnalysisResultWhereInput
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    cursor?: AnalysisResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * Document.jobDescAnalyses
   */
  export type Document$jobDescAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    where?: AnalysisResultWhereInput
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    cursor?: AnalysisResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model AnalysisResult
   */

  export type AggregateAnalysisResult = {
    _count: AnalysisResultCountAggregateOutputType | null
    _avg: AnalysisResultAvgAggregateOutputType | null
    _sum: AnalysisResultSumAggregateOutputType | null
    _min: AnalysisResultMinAggregateOutputType | null
    _max: AnalysisResultMaxAggregateOutputType | null
  }

  export type AnalysisResultAvgAggregateOutputType = {
    score: number | null
  }

  export type AnalysisResultSumAggregateOutputType = {
    score: number | null
  }

  export type AnalysisResultMinAggregateOutputType = {
    id: string | null
    score: number | null
    createdAt: Date | null
    cvId: string | null
    jobDescriptionId: string | null
  }

  export type AnalysisResultMaxAggregateOutputType = {
    id: string | null
    score: number | null
    createdAt: Date | null
    cvId: string | null
    jobDescriptionId: string | null
  }

  export type AnalysisResultCountAggregateOutputType = {
    id: number
    score: number
    matchedSkills: number
    matchedKeywords: number
    missingSkills: number
    suggestions: number
    createdAt: number
    cvId: number
    jobDescriptionId: number
    _all: number
  }


  export type AnalysisResultAvgAggregateInputType = {
    score?: true
  }

  export type AnalysisResultSumAggregateInputType = {
    score?: true
  }

  export type AnalysisResultMinAggregateInputType = {
    id?: true
    score?: true
    createdAt?: true
    cvId?: true
    jobDescriptionId?: true
  }

  export type AnalysisResultMaxAggregateInputType = {
    id?: true
    score?: true
    createdAt?: true
    cvId?: true
    jobDescriptionId?: true
  }

  export type AnalysisResultCountAggregateInputType = {
    id?: true
    score?: true
    matchedSkills?: true
    matchedKeywords?: true
    missingSkills?: true
    suggestions?: true
    createdAt?: true
    cvId?: true
    jobDescriptionId?: true
    _all?: true
  }

  export type AnalysisResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisResult to aggregate.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AnalysisResults
    **/
    _count?: true | AnalysisResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnalysisResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnalysisResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnalysisResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnalysisResultMaxAggregateInputType
  }

  export type GetAnalysisResultAggregateType<T extends AnalysisResultAggregateArgs> = {
        [P in keyof T & keyof AggregateAnalysisResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnalysisResult[P]>
      : GetScalarType<T[P], AggregateAnalysisResult[P]>
  }




  export type AnalysisResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnalysisResultWhereInput
    orderBy?: AnalysisResultOrderByWithAggregationInput | AnalysisResultOrderByWithAggregationInput[]
    by: AnalysisResultScalarFieldEnum[] | AnalysisResultScalarFieldEnum
    having?: AnalysisResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnalysisResultCountAggregateInputType | true
    _avg?: AnalysisResultAvgAggregateInputType
    _sum?: AnalysisResultSumAggregateInputType
    _min?: AnalysisResultMinAggregateInputType
    _max?: AnalysisResultMaxAggregateInputType
  }

  export type AnalysisResultGroupByOutputType = {
    id: string
    score: number
    matchedSkills: string[]
    matchedKeywords: string[]
    missingSkills: string[]
    suggestions: string[]
    createdAt: Date
    cvId: string
    jobDescriptionId: string
    _count: AnalysisResultCountAggregateOutputType | null
    _avg: AnalysisResultAvgAggregateOutputType | null
    _sum: AnalysisResultSumAggregateOutputType | null
    _min: AnalysisResultMinAggregateOutputType | null
    _max: AnalysisResultMaxAggregateOutputType | null
  }

  type GetAnalysisResultGroupByPayload<T extends AnalysisResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnalysisResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnalysisResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnalysisResultGroupByOutputType[P]>
            : GetScalarType<T[P], AnalysisResultGroupByOutputType[P]>
        }
      >
    >


  export type AnalysisResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    score?: boolean
    matchedSkills?: boolean
    matchedKeywords?: boolean
    missingSkills?: boolean
    suggestions?: boolean
    createdAt?: boolean
    cvId?: boolean
    jobDescriptionId?: boolean
    cv?: boolean | DocumentDefaultArgs<ExtArgs>
    jobDescription?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisResult"]>

  export type AnalysisResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    score?: boolean
    matchedSkills?: boolean
    matchedKeywords?: boolean
    missingSkills?: boolean
    suggestions?: boolean
    createdAt?: boolean
    cvId?: boolean
    jobDescriptionId?: boolean
    cv?: boolean | DocumentDefaultArgs<ExtArgs>
    jobDescription?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisResult"]>

  export type AnalysisResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    score?: boolean
    matchedSkills?: boolean
    matchedKeywords?: boolean
    missingSkills?: boolean
    suggestions?: boolean
    createdAt?: boolean
    cvId?: boolean
    jobDescriptionId?: boolean
    cv?: boolean | DocumentDefaultArgs<ExtArgs>
    jobDescription?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["analysisResult"]>

  export type AnalysisResultSelectScalar = {
    id?: boolean
    score?: boolean
    matchedSkills?: boolean
    matchedKeywords?: boolean
    missingSkills?: boolean
    suggestions?: boolean
    createdAt?: boolean
    cvId?: boolean
    jobDescriptionId?: boolean
  }

  export type AnalysisResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "score" | "matchedSkills" | "matchedKeywords" | "missingSkills" | "suggestions" | "createdAt" | "cvId" | "jobDescriptionId", ExtArgs["result"]["analysisResult"]>
  export type AnalysisResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cv?: boolean | DocumentDefaultArgs<ExtArgs>
    jobDescription?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type AnalysisResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cv?: boolean | DocumentDefaultArgs<ExtArgs>
    jobDescription?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type AnalysisResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cv?: boolean | DocumentDefaultArgs<ExtArgs>
    jobDescription?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $AnalysisResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AnalysisResult"
    objects: {
      cv: Prisma.$DocumentPayload<ExtArgs>
      jobDescription: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      score: number
      matchedSkills: string[]
      matchedKeywords: string[]
      missingSkills: string[]
      suggestions: string[]
      createdAt: Date
      cvId: string
      jobDescriptionId: string
    }, ExtArgs["result"]["analysisResult"]>
    composites: {}
  }

  type AnalysisResultGetPayload<S extends boolean | null | undefined | AnalysisResultDefaultArgs> = $Result.GetResult<Prisma.$AnalysisResultPayload, S>

  type AnalysisResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AnalysisResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AnalysisResultCountAggregateInputType | true
    }

  export interface AnalysisResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AnalysisResult'], meta: { name: 'AnalysisResult' } }
    /**
     * Find zero or one AnalysisResult that matches the filter.
     * @param {AnalysisResultFindUniqueArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnalysisResultFindUniqueArgs>(args: SelectSubset<T, AnalysisResultFindUniqueArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AnalysisResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AnalysisResultFindUniqueOrThrowArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnalysisResultFindUniqueOrThrowArgs>(args: SelectSubset<T, AnalysisResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultFindFirstArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnalysisResultFindFirstArgs>(args?: SelectSubset<T, AnalysisResultFindFirstArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AnalysisResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultFindFirstOrThrowArgs} args - Arguments to find a AnalysisResult
     * @example
     * // Get one AnalysisResult
     * const analysisResult = await prisma.analysisResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnalysisResultFindFirstOrThrowArgs>(args?: SelectSubset<T, AnalysisResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AnalysisResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AnalysisResults
     * const analysisResults = await prisma.analysisResult.findMany()
     * 
     * // Get first 10 AnalysisResults
     * const analysisResults = await prisma.analysisResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const analysisResultWithIdOnly = await prisma.analysisResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AnalysisResultFindManyArgs>(args?: SelectSubset<T, AnalysisResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AnalysisResult.
     * @param {AnalysisResultCreateArgs} args - Arguments to create a AnalysisResult.
     * @example
     * // Create one AnalysisResult
     * const AnalysisResult = await prisma.analysisResult.create({
     *   data: {
     *     // ... data to create a AnalysisResult
     *   }
     * })
     * 
     */
    create<T extends AnalysisResultCreateArgs>(args: SelectSubset<T, AnalysisResultCreateArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AnalysisResults.
     * @param {AnalysisResultCreateManyArgs} args - Arguments to create many AnalysisResults.
     * @example
     * // Create many AnalysisResults
     * const analysisResult = await prisma.analysisResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnalysisResultCreateManyArgs>(args?: SelectSubset<T, AnalysisResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AnalysisResults and returns the data saved in the database.
     * @param {AnalysisResultCreateManyAndReturnArgs} args - Arguments to create many AnalysisResults.
     * @example
     * // Create many AnalysisResults
     * const analysisResult = await prisma.analysisResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AnalysisResults and only return the `id`
     * const analysisResultWithIdOnly = await prisma.analysisResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnalysisResultCreateManyAndReturnArgs>(args?: SelectSubset<T, AnalysisResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AnalysisResult.
     * @param {AnalysisResultDeleteArgs} args - Arguments to delete one AnalysisResult.
     * @example
     * // Delete one AnalysisResult
     * const AnalysisResult = await prisma.analysisResult.delete({
     *   where: {
     *     // ... filter to delete one AnalysisResult
     *   }
     * })
     * 
     */
    delete<T extends AnalysisResultDeleteArgs>(args: SelectSubset<T, AnalysisResultDeleteArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AnalysisResult.
     * @param {AnalysisResultUpdateArgs} args - Arguments to update one AnalysisResult.
     * @example
     * // Update one AnalysisResult
     * const analysisResult = await prisma.analysisResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnalysisResultUpdateArgs>(args: SelectSubset<T, AnalysisResultUpdateArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AnalysisResults.
     * @param {AnalysisResultDeleteManyArgs} args - Arguments to filter AnalysisResults to delete.
     * @example
     * // Delete a few AnalysisResults
     * const { count } = await prisma.analysisResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnalysisResultDeleteManyArgs>(args?: SelectSubset<T, AnalysisResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AnalysisResults
     * const analysisResult = await prisma.analysisResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnalysisResultUpdateManyArgs>(args: SelectSubset<T, AnalysisResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AnalysisResults and returns the data updated in the database.
     * @param {AnalysisResultUpdateManyAndReturnArgs} args - Arguments to update many AnalysisResults.
     * @example
     * // Update many AnalysisResults
     * const analysisResult = await prisma.analysisResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AnalysisResults and only return the `id`
     * const analysisResultWithIdOnly = await prisma.analysisResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AnalysisResultUpdateManyAndReturnArgs>(args: SelectSubset<T, AnalysisResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AnalysisResult.
     * @param {AnalysisResultUpsertArgs} args - Arguments to update or create a AnalysisResult.
     * @example
     * // Update or create a AnalysisResult
     * const analysisResult = await prisma.analysisResult.upsert({
     *   create: {
     *     // ... data to create a AnalysisResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AnalysisResult we want to update
     *   }
     * })
     */
    upsert<T extends AnalysisResultUpsertArgs>(args: SelectSubset<T, AnalysisResultUpsertArgs<ExtArgs>>): Prisma__AnalysisResultClient<$Result.GetResult<Prisma.$AnalysisResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AnalysisResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultCountArgs} args - Arguments to filter AnalysisResults to count.
     * @example
     * // Count the number of AnalysisResults
     * const count = await prisma.analysisResult.count({
     *   where: {
     *     // ... the filter for the AnalysisResults we want to count
     *   }
     * })
    **/
    count<T extends AnalysisResultCountArgs>(
      args?: Subset<T, AnalysisResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnalysisResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AnalysisResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AnalysisResultAggregateArgs>(args: Subset<T, AnalysisResultAggregateArgs>): Prisma.PrismaPromise<GetAnalysisResultAggregateType<T>>

    /**
     * Group by AnalysisResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnalysisResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AnalysisResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnalysisResultGroupByArgs['orderBy'] }
        : { orderBy?: AnalysisResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AnalysisResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnalysisResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AnalysisResult model
   */
  readonly fields: AnalysisResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AnalysisResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnalysisResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cv<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    jobDescription<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AnalysisResult model
   */
  interface AnalysisResultFieldRefs {
    readonly id: FieldRef<"AnalysisResult", 'String'>
    readonly score: FieldRef<"AnalysisResult", 'Int'>
    readonly matchedSkills: FieldRef<"AnalysisResult", 'String[]'>
    readonly matchedKeywords: FieldRef<"AnalysisResult", 'String[]'>
    readonly missingSkills: FieldRef<"AnalysisResult", 'String[]'>
    readonly suggestions: FieldRef<"AnalysisResult", 'String[]'>
    readonly createdAt: FieldRef<"AnalysisResult", 'DateTime'>
    readonly cvId: FieldRef<"AnalysisResult", 'String'>
    readonly jobDescriptionId: FieldRef<"AnalysisResult", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AnalysisResult findUnique
   */
  export type AnalysisResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult findUniqueOrThrow
   */
  export type AnalysisResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult findFirst
   */
  export type AnalysisResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisResults.
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisResults.
     */
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * AnalysisResult findFirstOrThrow
   */
  export type AnalysisResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResult to fetch.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AnalysisResults.
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AnalysisResults.
     */
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * AnalysisResult findMany
   */
  export type AnalysisResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter, which AnalysisResults to fetch.
     */
    where?: AnalysisResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AnalysisResults to fetch.
     */
    orderBy?: AnalysisResultOrderByWithRelationInput | AnalysisResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AnalysisResults.
     */
    cursor?: AnalysisResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AnalysisResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AnalysisResults.
     */
    skip?: number
    distinct?: AnalysisResultScalarFieldEnum | AnalysisResultScalarFieldEnum[]
  }

  /**
   * AnalysisResult create
   */
  export type AnalysisResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * The data needed to create a AnalysisResult.
     */
    data: XOR<AnalysisResultCreateInput, AnalysisResultUncheckedCreateInput>
  }

  /**
   * AnalysisResult createMany
   */
  export type AnalysisResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AnalysisResults.
     */
    data: AnalysisResultCreateManyInput | AnalysisResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AnalysisResult createManyAndReturn
   */
  export type AnalysisResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * The data used to create many AnalysisResults.
     */
    data: AnalysisResultCreateManyInput | AnalysisResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisResult update
   */
  export type AnalysisResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * The data needed to update a AnalysisResult.
     */
    data: XOR<AnalysisResultUpdateInput, AnalysisResultUncheckedUpdateInput>
    /**
     * Choose, which AnalysisResult to update.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult updateMany
   */
  export type AnalysisResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AnalysisResults.
     */
    data: XOR<AnalysisResultUpdateManyMutationInput, AnalysisResultUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisResults to update
     */
    where?: AnalysisResultWhereInput
    /**
     * Limit how many AnalysisResults to update.
     */
    limit?: number
  }

  /**
   * AnalysisResult updateManyAndReturn
   */
  export type AnalysisResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * The data used to update AnalysisResults.
     */
    data: XOR<AnalysisResultUpdateManyMutationInput, AnalysisResultUncheckedUpdateManyInput>
    /**
     * Filter which AnalysisResults to update
     */
    where?: AnalysisResultWhereInput
    /**
     * Limit how many AnalysisResults to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AnalysisResult upsert
   */
  export type AnalysisResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * The filter to search for the AnalysisResult to update in case it exists.
     */
    where: AnalysisResultWhereUniqueInput
    /**
     * In case the AnalysisResult found by the `where` argument doesn't exist, create a new AnalysisResult with this data.
     */
    create: XOR<AnalysisResultCreateInput, AnalysisResultUncheckedCreateInput>
    /**
     * In case the AnalysisResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnalysisResultUpdateInput, AnalysisResultUncheckedUpdateInput>
  }

  /**
   * AnalysisResult delete
   */
  export type AnalysisResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
    /**
     * Filter which AnalysisResult to delete.
     */
    where: AnalysisResultWhereUniqueInput
  }

  /**
   * AnalysisResult deleteMany
   */
  export type AnalysisResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AnalysisResults to delete
     */
    where?: AnalysisResultWhereInput
    /**
     * Limit how many AnalysisResults to delete.
     */
    limit?: number
  }

  /**
   * AnalysisResult without action
   */
  export type AnalysisResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AnalysisResult
     */
    select?: AnalysisResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AnalysisResult
     */
    omit?: AnalysisResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AnalysisResultInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    type: 'type',
    content: 'content',
    filename: 'filename',
    fileType: 'fileType',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const AnalysisResultScalarFieldEnum: {
    id: 'id',
    score: 'score',
    matchedSkills: 'matchedSkills',
    matchedKeywords: 'matchedKeywords',
    missingSkills: 'missingSkills',
    suggestions: 'suggestions',
    createdAt: 'createdAt',
    cvId: 'cvId',
    jobDescriptionId: 'jobDescriptionId'
  };

  export type AnalysisResultScalarFieldEnum = (typeof AnalysisResultScalarFieldEnum)[keyof typeof AnalysisResultScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    type?: StringFilter<"Document"> | string
    content?: StringFilter<"Document"> | string
    filename?: StringFilter<"Document"> | string
    fileType?: StringFilter<"Document"> | string
    metadata?: JsonNullableFilter<"Document">
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    cvAnalyses?: AnalysisResultListRelationFilter
    jobDescAnalyses?: AnalysisResultListRelationFilter
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    filename?: SortOrder
    fileType?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cvAnalyses?: AnalysisResultOrderByRelationAggregateInput
    jobDescAnalyses?: AnalysisResultOrderByRelationAggregateInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    type?: StringFilter<"Document"> | string
    content?: StringFilter<"Document"> | string
    filename?: StringFilter<"Document"> | string
    fileType?: StringFilter<"Document"> | string
    metadata?: JsonNullableFilter<"Document">
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    cvAnalyses?: AnalysisResultListRelationFilter
    jobDescAnalyses?: AnalysisResultListRelationFilter
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    filename?: SortOrder
    fileType?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    type?: StringWithAggregatesFilter<"Document"> | string
    content?: StringWithAggregatesFilter<"Document"> | string
    filename?: StringWithAggregatesFilter<"Document"> | string
    fileType?: StringWithAggregatesFilter<"Document"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Document">
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type AnalysisResultWhereInput = {
    AND?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    OR?: AnalysisResultWhereInput[]
    NOT?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    id?: StringFilter<"AnalysisResult"> | string
    score?: IntFilter<"AnalysisResult"> | number
    matchedSkills?: StringNullableListFilter<"AnalysisResult">
    matchedKeywords?: StringNullableListFilter<"AnalysisResult">
    missingSkills?: StringNullableListFilter<"AnalysisResult">
    suggestions?: StringNullableListFilter<"AnalysisResult">
    createdAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    cvId?: StringFilter<"AnalysisResult"> | string
    jobDescriptionId?: StringFilter<"AnalysisResult"> | string
    cv?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
    jobDescription?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }

  export type AnalysisResultOrderByWithRelationInput = {
    id?: SortOrder
    score?: SortOrder
    matchedSkills?: SortOrder
    matchedKeywords?: SortOrder
    missingSkills?: SortOrder
    suggestions?: SortOrder
    createdAt?: SortOrder
    cvId?: SortOrder
    jobDescriptionId?: SortOrder
    cv?: DocumentOrderByWithRelationInput
    jobDescription?: DocumentOrderByWithRelationInput
  }

  export type AnalysisResultWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    OR?: AnalysisResultWhereInput[]
    NOT?: AnalysisResultWhereInput | AnalysisResultWhereInput[]
    score?: IntFilter<"AnalysisResult"> | number
    matchedSkills?: StringNullableListFilter<"AnalysisResult">
    matchedKeywords?: StringNullableListFilter<"AnalysisResult">
    missingSkills?: StringNullableListFilter<"AnalysisResult">
    suggestions?: StringNullableListFilter<"AnalysisResult">
    createdAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    cvId?: StringFilter<"AnalysisResult"> | string
    jobDescriptionId?: StringFilter<"AnalysisResult"> | string
    cv?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
    jobDescription?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }, "id">

  export type AnalysisResultOrderByWithAggregationInput = {
    id?: SortOrder
    score?: SortOrder
    matchedSkills?: SortOrder
    matchedKeywords?: SortOrder
    missingSkills?: SortOrder
    suggestions?: SortOrder
    createdAt?: SortOrder
    cvId?: SortOrder
    jobDescriptionId?: SortOrder
    _count?: AnalysisResultCountOrderByAggregateInput
    _avg?: AnalysisResultAvgOrderByAggregateInput
    _max?: AnalysisResultMaxOrderByAggregateInput
    _min?: AnalysisResultMinOrderByAggregateInput
    _sum?: AnalysisResultSumOrderByAggregateInput
  }

  export type AnalysisResultScalarWhereWithAggregatesInput = {
    AND?: AnalysisResultScalarWhereWithAggregatesInput | AnalysisResultScalarWhereWithAggregatesInput[]
    OR?: AnalysisResultScalarWhereWithAggregatesInput[]
    NOT?: AnalysisResultScalarWhereWithAggregatesInput | AnalysisResultScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AnalysisResult"> | string
    score?: IntWithAggregatesFilter<"AnalysisResult"> | number
    matchedSkills?: StringNullableListFilter<"AnalysisResult">
    matchedKeywords?: StringNullableListFilter<"AnalysisResult">
    missingSkills?: StringNullableListFilter<"AnalysisResult">
    suggestions?: StringNullableListFilter<"AnalysisResult">
    createdAt?: DateTimeWithAggregatesFilter<"AnalysisResult"> | Date | string
    cvId?: StringWithAggregatesFilter<"AnalysisResult"> | string
    jobDescriptionId?: StringWithAggregatesFilter<"AnalysisResult"> | string
  }

  export type DocumentCreateInput = {
    id?: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    cvAnalyses?: AnalysisResultCreateNestedManyWithoutCvInput
    jobDescAnalyses?: AnalysisResultCreateNestedManyWithoutJobDescriptionInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    cvAnalyses?: AnalysisResultUncheckedCreateNestedManyWithoutCvInput
    jobDescAnalyses?: AnalysisResultUncheckedCreateNestedManyWithoutJobDescriptionInput
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvAnalyses?: AnalysisResultUpdateManyWithoutCvNestedInput
    jobDescAnalyses?: AnalysisResultUpdateManyWithoutJobDescriptionNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvAnalyses?: AnalysisResultUncheckedUpdateManyWithoutCvNestedInput
    jobDescAnalyses?: AnalysisResultUncheckedUpdateManyWithoutJobDescriptionNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisResultCreateInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    cv: DocumentCreateNestedOneWithoutCvAnalysesInput
    jobDescription: DocumentCreateNestedOneWithoutJobDescAnalysesInput
  }

  export type AnalysisResultUncheckedCreateInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    cvId: string
    jobDescriptionId: string
  }

  export type AnalysisResultUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cv?: DocumentUpdateOneRequiredWithoutCvAnalysesNestedInput
    jobDescription?: DocumentUpdateOneRequiredWithoutJobDescAnalysesNestedInput
  }

  export type AnalysisResultUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvId?: StringFieldUpdateOperationsInput | string
    jobDescriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type AnalysisResultCreateManyInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    cvId: string
    jobDescriptionId: string
  }

  export type AnalysisResultUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AnalysisResultUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvId?: StringFieldUpdateOperationsInput | string
    jobDescriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AnalysisResultListRelationFilter = {
    every?: AnalysisResultWhereInput
    some?: AnalysisResultWhereInput
    none?: AnalysisResultWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AnalysisResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    filename?: SortOrder
    fileType?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    filename?: SortOrder
    fileType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    content?: SortOrder
    filename?: SortOrder
    fileType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DocumentScalarRelationFilter = {
    is?: DocumentWhereInput
    isNot?: DocumentWhereInput
  }

  export type AnalysisResultCountOrderByAggregateInput = {
    id?: SortOrder
    score?: SortOrder
    matchedSkills?: SortOrder
    matchedKeywords?: SortOrder
    missingSkills?: SortOrder
    suggestions?: SortOrder
    createdAt?: SortOrder
    cvId?: SortOrder
    jobDescriptionId?: SortOrder
  }

  export type AnalysisResultAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type AnalysisResultMaxOrderByAggregateInput = {
    id?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    cvId?: SortOrder
    jobDescriptionId?: SortOrder
  }

  export type AnalysisResultMinOrderByAggregateInput = {
    id?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    cvId?: SortOrder
    jobDescriptionId?: SortOrder
  }

  export type AnalysisResultSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type AnalysisResultCreateNestedManyWithoutCvInput = {
    create?: XOR<AnalysisResultCreateWithoutCvInput, AnalysisResultUncheckedCreateWithoutCvInput> | AnalysisResultCreateWithoutCvInput[] | AnalysisResultUncheckedCreateWithoutCvInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutCvInput | AnalysisResultCreateOrConnectWithoutCvInput[]
    createMany?: AnalysisResultCreateManyCvInputEnvelope
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
  }

  export type AnalysisResultCreateNestedManyWithoutJobDescriptionInput = {
    create?: XOR<AnalysisResultCreateWithoutJobDescriptionInput, AnalysisResultUncheckedCreateWithoutJobDescriptionInput> | AnalysisResultCreateWithoutJobDescriptionInput[] | AnalysisResultUncheckedCreateWithoutJobDescriptionInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutJobDescriptionInput | AnalysisResultCreateOrConnectWithoutJobDescriptionInput[]
    createMany?: AnalysisResultCreateManyJobDescriptionInputEnvelope
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
  }

  export type AnalysisResultUncheckedCreateNestedManyWithoutCvInput = {
    create?: XOR<AnalysisResultCreateWithoutCvInput, AnalysisResultUncheckedCreateWithoutCvInput> | AnalysisResultCreateWithoutCvInput[] | AnalysisResultUncheckedCreateWithoutCvInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutCvInput | AnalysisResultCreateOrConnectWithoutCvInput[]
    createMany?: AnalysisResultCreateManyCvInputEnvelope
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
  }

  export type AnalysisResultUncheckedCreateNestedManyWithoutJobDescriptionInput = {
    create?: XOR<AnalysisResultCreateWithoutJobDescriptionInput, AnalysisResultUncheckedCreateWithoutJobDescriptionInput> | AnalysisResultCreateWithoutJobDescriptionInput[] | AnalysisResultUncheckedCreateWithoutJobDescriptionInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutJobDescriptionInput | AnalysisResultCreateOrConnectWithoutJobDescriptionInput[]
    createMany?: AnalysisResultCreateManyJobDescriptionInputEnvelope
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AnalysisResultUpdateManyWithoutCvNestedInput = {
    create?: XOR<AnalysisResultCreateWithoutCvInput, AnalysisResultUncheckedCreateWithoutCvInput> | AnalysisResultCreateWithoutCvInput[] | AnalysisResultUncheckedCreateWithoutCvInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutCvInput | AnalysisResultCreateOrConnectWithoutCvInput[]
    upsert?: AnalysisResultUpsertWithWhereUniqueWithoutCvInput | AnalysisResultUpsertWithWhereUniqueWithoutCvInput[]
    createMany?: AnalysisResultCreateManyCvInputEnvelope
    set?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    disconnect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    delete?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    update?: AnalysisResultUpdateWithWhereUniqueWithoutCvInput | AnalysisResultUpdateWithWhereUniqueWithoutCvInput[]
    updateMany?: AnalysisResultUpdateManyWithWhereWithoutCvInput | AnalysisResultUpdateManyWithWhereWithoutCvInput[]
    deleteMany?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
  }

  export type AnalysisResultUpdateManyWithoutJobDescriptionNestedInput = {
    create?: XOR<AnalysisResultCreateWithoutJobDescriptionInput, AnalysisResultUncheckedCreateWithoutJobDescriptionInput> | AnalysisResultCreateWithoutJobDescriptionInput[] | AnalysisResultUncheckedCreateWithoutJobDescriptionInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutJobDescriptionInput | AnalysisResultCreateOrConnectWithoutJobDescriptionInput[]
    upsert?: AnalysisResultUpsertWithWhereUniqueWithoutJobDescriptionInput | AnalysisResultUpsertWithWhereUniqueWithoutJobDescriptionInput[]
    createMany?: AnalysisResultCreateManyJobDescriptionInputEnvelope
    set?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    disconnect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    delete?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    update?: AnalysisResultUpdateWithWhereUniqueWithoutJobDescriptionInput | AnalysisResultUpdateWithWhereUniqueWithoutJobDescriptionInput[]
    updateMany?: AnalysisResultUpdateManyWithWhereWithoutJobDescriptionInput | AnalysisResultUpdateManyWithWhereWithoutJobDescriptionInput[]
    deleteMany?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
  }

  export type AnalysisResultUncheckedUpdateManyWithoutCvNestedInput = {
    create?: XOR<AnalysisResultCreateWithoutCvInput, AnalysisResultUncheckedCreateWithoutCvInput> | AnalysisResultCreateWithoutCvInput[] | AnalysisResultUncheckedCreateWithoutCvInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutCvInput | AnalysisResultCreateOrConnectWithoutCvInput[]
    upsert?: AnalysisResultUpsertWithWhereUniqueWithoutCvInput | AnalysisResultUpsertWithWhereUniqueWithoutCvInput[]
    createMany?: AnalysisResultCreateManyCvInputEnvelope
    set?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    disconnect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    delete?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    update?: AnalysisResultUpdateWithWhereUniqueWithoutCvInput | AnalysisResultUpdateWithWhereUniqueWithoutCvInput[]
    updateMany?: AnalysisResultUpdateManyWithWhereWithoutCvInput | AnalysisResultUpdateManyWithWhereWithoutCvInput[]
    deleteMany?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
  }

  export type AnalysisResultUncheckedUpdateManyWithoutJobDescriptionNestedInput = {
    create?: XOR<AnalysisResultCreateWithoutJobDescriptionInput, AnalysisResultUncheckedCreateWithoutJobDescriptionInput> | AnalysisResultCreateWithoutJobDescriptionInput[] | AnalysisResultUncheckedCreateWithoutJobDescriptionInput[]
    connectOrCreate?: AnalysisResultCreateOrConnectWithoutJobDescriptionInput | AnalysisResultCreateOrConnectWithoutJobDescriptionInput[]
    upsert?: AnalysisResultUpsertWithWhereUniqueWithoutJobDescriptionInput | AnalysisResultUpsertWithWhereUniqueWithoutJobDescriptionInput[]
    createMany?: AnalysisResultCreateManyJobDescriptionInputEnvelope
    set?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    disconnect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    delete?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    connect?: AnalysisResultWhereUniqueInput | AnalysisResultWhereUniqueInput[]
    update?: AnalysisResultUpdateWithWhereUniqueWithoutJobDescriptionInput | AnalysisResultUpdateWithWhereUniqueWithoutJobDescriptionInput[]
    updateMany?: AnalysisResultUpdateManyWithWhereWithoutJobDescriptionInput | AnalysisResultUpdateManyWithWhereWithoutJobDescriptionInput[]
    deleteMany?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
  }

  export type AnalysisResultCreatematchedSkillsInput = {
    set: string[]
  }

  export type AnalysisResultCreatematchedKeywordsInput = {
    set: string[]
  }

  export type AnalysisResultCreatemissingSkillsInput = {
    set: string[]
  }

  export type AnalysisResultCreatesuggestionsInput = {
    set: string[]
  }

  export type DocumentCreateNestedOneWithoutCvAnalysesInput = {
    create?: XOR<DocumentCreateWithoutCvAnalysesInput, DocumentUncheckedCreateWithoutCvAnalysesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutCvAnalysesInput
    connect?: DocumentWhereUniqueInput
  }

  export type DocumentCreateNestedOneWithoutJobDescAnalysesInput = {
    create?: XOR<DocumentCreateWithoutJobDescAnalysesInput, DocumentUncheckedCreateWithoutJobDescAnalysesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutJobDescAnalysesInput
    connect?: DocumentWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AnalysisResultUpdatematchedSkillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AnalysisResultUpdatematchedKeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AnalysisResultUpdatemissingSkillsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AnalysisResultUpdatesuggestionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DocumentUpdateOneRequiredWithoutCvAnalysesNestedInput = {
    create?: XOR<DocumentCreateWithoutCvAnalysesInput, DocumentUncheckedCreateWithoutCvAnalysesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutCvAnalysesInput
    upsert?: DocumentUpsertWithoutCvAnalysesInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutCvAnalysesInput, DocumentUpdateWithoutCvAnalysesInput>, DocumentUncheckedUpdateWithoutCvAnalysesInput>
  }

  export type DocumentUpdateOneRequiredWithoutJobDescAnalysesNestedInput = {
    create?: XOR<DocumentCreateWithoutJobDescAnalysesInput, DocumentUncheckedCreateWithoutJobDescAnalysesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutJobDescAnalysesInput
    upsert?: DocumentUpsertWithoutJobDescAnalysesInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutJobDescAnalysesInput, DocumentUpdateWithoutJobDescAnalysesInput>, DocumentUncheckedUpdateWithoutJobDescAnalysesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AnalysisResultCreateWithoutCvInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    jobDescription: DocumentCreateNestedOneWithoutJobDescAnalysesInput
  }

  export type AnalysisResultUncheckedCreateWithoutCvInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    jobDescriptionId: string
  }

  export type AnalysisResultCreateOrConnectWithoutCvInput = {
    where: AnalysisResultWhereUniqueInput
    create: XOR<AnalysisResultCreateWithoutCvInput, AnalysisResultUncheckedCreateWithoutCvInput>
  }

  export type AnalysisResultCreateManyCvInputEnvelope = {
    data: AnalysisResultCreateManyCvInput | AnalysisResultCreateManyCvInput[]
    skipDuplicates?: boolean
  }

  export type AnalysisResultCreateWithoutJobDescriptionInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    cv: DocumentCreateNestedOneWithoutCvAnalysesInput
  }

  export type AnalysisResultUncheckedCreateWithoutJobDescriptionInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    cvId: string
  }

  export type AnalysisResultCreateOrConnectWithoutJobDescriptionInput = {
    where: AnalysisResultWhereUniqueInput
    create: XOR<AnalysisResultCreateWithoutJobDescriptionInput, AnalysisResultUncheckedCreateWithoutJobDescriptionInput>
  }

  export type AnalysisResultCreateManyJobDescriptionInputEnvelope = {
    data: AnalysisResultCreateManyJobDescriptionInput | AnalysisResultCreateManyJobDescriptionInput[]
    skipDuplicates?: boolean
  }

  export type AnalysisResultUpsertWithWhereUniqueWithoutCvInput = {
    where: AnalysisResultWhereUniqueInput
    update: XOR<AnalysisResultUpdateWithoutCvInput, AnalysisResultUncheckedUpdateWithoutCvInput>
    create: XOR<AnalysisResultCreateWithoutCvInput, AnalysisResultUncheckedCreateWithoutCvInput>
  }

  export type AnalysisResultUpdateWithWhereUniqueWithoutCvInput = {
    where: AnalysisResultWhereUniqueInput
    data: XOR<AnalysisResultUpdateWithoutCvInput, AnalysisResultUncheckedUpdateWithoutCvInput>
  }

  export type AnalysisResultUpdateManyWithWhereWithoutCvInput = {
    where: AnalysisResultScalarWhereInput
    data: XOR<AnalysisResultUpdateManyMutationInput, AnalysisResultUncheckedUpdateManyWithoutCvInput>
  }

  export type AnalysisResultScalarWhereInput = {
    AND?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
    OR?: AnalysisResultScalarWhereInput[]
    NOT?: AnalysisResultScalarWhereInput | AnalysisResultScalarWhereInput[]
    id?: StringFilter<"AnalysisResult"> | string
    score?: IntFilter<"AnalysisResult"> | number
    matchedSkills?: StringNullableListFilter<"AnalysisResult">
    matchedKeywords?: StringNullableListFilter<"AnalysisResult">
    missingSkills?: StringNullableListFilter<"AnalysisResult">
    suggestions?: StringNullableListFilter<"AnalysisResult">
    createdAt?: DateTimeFilter<"AnalysisResult"> | Date | string
    cvId?: StringFilter<"AnalysisResult"> | string
    jobDescriptionId?: StringFilter<"AnalysisResult"> | string
  }

  export type AnalysisResultUpsertWithWhereUniqueWithoutJobDescriptionInput = {
    where: AnalysisResultWhereUniqueInput
    update: XOR<AnalysisResultUpdateWithoutJobDescriptionInput, AnalysisResultUncheckedUpdateWithoutJobDescriptionInput>
    create: XOR<AnalysisResultCreateWithoutJobDescriptionInput, AnalysisResultUncheckedCreateWithoutJobDescriptionInput>
  }

  export type AnalysisResultUpdateWithWhereUniqueWithoutJobDescriptionInput = {
    where: AnalysisResultWhereUniqueInput
    data: XOR<AnalysisResultUpdateWithoutJobDescriptionInput, AnalysisResultUncheckedUpdateWithoutJobDescriptionInput>
  }

  export type AnalysisResultUpdateManyWithWhereWithoutJobDescriptionInput = {
    where: AnalysisResultScalarWhereInput
    data: XOR<AnalysisResultUpdateManyMutationInput, AnalysisResultUncheckedUpdateManyWithoutJobDescriptionInput>
  }

  export type DocumentCreateWithoutCvAnalysesInput = {
    id?: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    jobDescAnalyses?: AnalysisResultCreateNestedManyWithoutJobDescriptionInput
  }

  export type DocumentUncheckedCreateWithoutCvAnalysesInput = {
    id?: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    jobDescAnalyses?: AnalysisResultUncheckedCreateNestedManyWithoutJobDescriptionInput
  }

  export type DocumentCreateOrConnectWithoutCvAnalysesInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutCvAnalysesInput, DocumentUncheckedCreateWithoutCvAnalysesInput>
  }

  export type DocumentCreateWithoutJobDescAnalysesInput = {
    id?: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    cvAnalyses?: AnalysisResultCreateNestedManyWithoutCvInput
  }

  export type DocumentUncheckedCreateWithoutJobDescAnalysesInput = {
    id?: string
    type: string
    content: string
    filename: string
    fileType: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    cvAnalyses?: AnalysisResultUncheckedCreateNestedManyWithoutCvInput
  }

  export type DocumentCreateOrConnectWithoutJobDescAnalysesInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutJobDescAnalysesInput, DocumentUncheckedCreateWithoutJobDescAnalysesInput>
  }

  export type DocumentUpsertWithoutCvAnalysesInput = {
    update: XOR<DocumentUpdateWithoutCvAnalysesInput, DocumentUncheckedUpdateWithoutCvAnalysesInput>
    create: XOR<DocumentCreateWithoutCvAnalysesInput, DocumentUncheckedCreateWithoutCvAnalysesInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutCvAnalysesInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutCvAnalysesInput, DocumentUncheckedUpdateWithoutCvAnalysesInput>
  }

  export type DocumentUpdateWithoutCvAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobDescAnalyses?: AnalysisResultUpdateManyWithoutJobDescriptionNestedInput
  }

  export type DocumentUncheckedUpdateWithoutCvAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobDescAnalyses?: AnalysisResultUncheckedUpdateManyWithoutJobDescriptionNestedInput
  }

  export type DocumentUpsertWithoutJobDescAnalysesInput = {
    update: XOR<DocumentUpdateWithoutJobDescAnalysesInput, DocumentUncheckedUpdateWithoutJobDescAnalysesInput>
    create: XOR<DocumentCreateWithoutJobDescAnalysesInput, DocumentUncheckedCreateWithoutJobDescAnalysesInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutJobDescAnalysesInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutJobDescAnalysesInput, DocumentUncheckedUpdateWithoutJobDescAnalysesInput>
  }

  export type DocumentUpdateWithoutJobDescAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvAnalyses?: AnalysisResultUpdateManyWithoutCvNestedInput
  }

  export type DocumentUncheckedUpdateWithoutJobDescAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvAnalyses?: AnalysisResultUncheckedUpdateManyWithoutCvNestedInput
  }

  export type AnalysisResultCreateManyCvInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    jobDescriptionId: string
  }

  export type AnalysisResultCreateManyJobDescriptionInput = {
    id?: string
    score: number
    matchedSkills?: AnalysisResultCreatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultCreatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultCreatemissingSkillsInput | string[]
    suggestions?: AnalysisResultCreatesuggestionsInput | string[]
    createdAt?: Date | string
    cvId: string
  }

  export type AnalysisResultUpdateWithoutCvInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobDescription?: DocumentUpdateOneRequiredWithoutJobDescAnalysesNestedInput
  }

  export type AnalysisResultUncheckedUpdateWithoutCvInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobDescriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type AnalysisResultUncheckedUpdateManyWithoutCvInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    jobDescriptionId?: StringFieldUpdateOperationsInput | string
  }

  export type AnalysisResultUpdateWithoutJobDescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cv?: DocumentUpdateOneRequiredWithoutCvAnalysesNestedInput
  }

  export type AnalysisResultUncheckedUpdateWithoutJobDescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvId?: StringFieldUpdateOperationsInput | string
  }

  export type AnalysisResultUncheckedUpdateManyWithoutJobDescriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    matchedSkills?: AnalysisResultUpdatematchedSkillsInput | string[]
    matchedKeywords?: AnalysisResultUpdatematchedKeywordsInput | string[]
    missingSkills?: AnalysisResultUpdatemissingSkillsInput | string[]
    suggestions?: AnalysisResultUpdatesuggestionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cvId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}