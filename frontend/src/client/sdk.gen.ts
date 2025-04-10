// This file is auto-generated by @hey-api/openapi-ts

import {
  type Options as ClientOptions,
  type TDataShape,
  type Client,
  urlSearchParamsBodySerializer,
} from '@hey-api/client-fetch'
import type {
  AuthLoginAccessTokenData,
  AuthLoginAccessTokenResponse,
  AuthLoginAccessTokenError,
  UsersGetOwnUserData,
  UsersGetOwnUserResponse,
  UsersTestAuthData,
  PrivateCreateUserData,
  PrivateCreateUserResponse,
  PrivateCreateUserError,
} from './types.gen'
import { client as _heyApiClient } from './client.gen'

export type Options<
  TData extends TDataShape = TDataShape,
  ThrowOnError extends boolean = boolean,
> = ClientOptions<TData, ThrowOnError> & {
  /**
   * You can provide a client instance returned by `createClient()` instead of
   * individual options. This might be also useful if you want to implement a
   * custom client.
   */
  client?: Client
  /**
   * You can pass arbitrary values through the `meta` object. This can be
   * used to access values that aren't defined as part of the SDK function.
   */
  meta?: Record<string, unknown>
}

export class AuthService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for requests
   */
  public static authLoginAccessToken<ThrowOnError extends boolean = false>(
    options: Options<AuthLoginAccessTokenData, ThrowOnError>,
  ) {
    return (options.client ?? _heyApiClient).post<
      AuthLoginAccessTokenResponse,
      AuthLoginAccessTokenError,
      ThrowOnError
    >({
      ...urlSearchParamsBodySerializer,
      url: '/api/v1/login/access-token',
      ...options,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options?.headers,
      },
    })
  }
}

export class UsersService {
  /**
   * Get Own User
   * get own user
   */
  public static usersGetOwnUser<ThrowOnError extends boolean = false>(
    options?: Options<UsersGetOwnUserData, ThrowOnError>,
  ) {
    return (options?.client ?? _heyApiClient).get<
      UsersGetOwnUserResponse,
      unknown,
      ThrowOnError
    >({
      security: [
        {
          scheme: 'bearer',
          type: 'http',
        },
      ],
      url: '/api/v1/user/me',
      ...options,
    })
  }

  /**
   * Test Auth
   * test auth
   */
  public static usersTestAuth<ThrowOnError extends boolean = false>(
    options?: Options<UsersTestAuthData, ThrowOnError>,
  ) {
    return (options?.client ?? _heyApiClient).get<
      unknown,
      unknown,
      ThrowOnError
    >({
      security: [
        {
          scheme: 'bearer',
          type: 'http',
        },
      ],
      url: '/api/v1/test',
      ...options,
    })
  }
}

export class PrivateService {
  /**
   * Create User
   * Create a new user.
   */
  public static privateCreateUser<ThrowOnError extends boolean = false>(
    options: Options<PrivateCreateUserData, ThrowOnError>,
  ) {
    return (options.client ?? _heyApiClient).post<
      PrivateCreateUserResponse,
      PrivateCreateUserError,
      ThrowOnError
    >({
      url: '/api/v1/private/users/',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  }
}
