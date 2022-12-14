export { paths, components } from './api-openapi'

/** Automatically-generated date type */
export type Date = string & { [key: string]: any }

export type OpenAPIRouteRequestBodyMethod<
  T,
  TMethod extends string = 'post',
  TDefault = unknown
> = T extends {
  [key in TMethod]: {
    requestBody: { content: { 'application/json': infer U } }
  }
}
  ? U
  : TDefault
export type OpenAPIRouteRequestBody<
  T,
  TMethod extends string = 'post'
> = OpenAPIRouteRequestBodyMethod<
  T,
  TMethod,
  OpenAPIRouteRequestBodyMethod<
    T,
    'put',
    OpenAPIRouteRequestBodyMethod<
      T,
      'delete',
      OpenAPIRouteRequestBodyMethod<T, 'patch'>
    >
  >
>

export type OpenAPIRouteResponseBodyMethod<
  T,
  TMethod extends string = 'get',
  TDefault = unknown
> = T extends {
  [key in TMethod]: {
    responses: { 200: { content: { 'application/json': infer U } } }
  }
}
  ? U
  : TDefault
export type OpenAPIRouteResponseBody<
  T,
  TMethod extends string = 'get'
> = OpenAPIRouteResponseBodyMethod<
  T,
  TMethod,
  OpenAPIRouteResponseBodyMethod<
    T,
    'post',
    OpenAPIRouteResponseBodyMethod<
      T,
      'put',
      OpenAPIRouteResponseBodyMethod<T, 'delete'>
    >
  >
>

export type OpenAPIRoutePathParam<T> = T extends {
  get: { parameters: { path: infer U } }
}
  ? U
  : T extends { post: { parameters: { path: infer U } } }
  ? U
  : T extends { put: { parameters: { path: infer U } } }
  ? U
  : unknown
export type OpenAPIRouteQueryParam<T> = T extends {
  get: { parameters: { query: infer U } }
}
  ? U
  : T extends { post: { parameters: { query: infer U } } }
  ? U
  : unknown
export type OpenAPIRouteParam<T> = OpenAPIRoutePathParam<T> &
  OpenAPIRouteQueryParam<T>
