import { isNil, omitBy } from 'lodash';
import { useCallback, useRef, useState } from 'react';

import { useAuth } from '../components/Authentication/context';

type TokenState = {
  refreshToken: string;
  token: string;
};

export type ServerResponse<T = any, F = number> = {
  message: T;
  status: F;
};

export class RequestError extends Error {
    public readonly status: number;
    public readonly data: any;
    constructor(message: string, status: number, data: any) {
        super(message);
        this.name = 'RequestError';
        this.status = status;
        this.data = data;
    }
}

export class TokenController {
  static get(): Partial<TokenState> {
    return {
      refreshToken: localStorage.getItem('refreshToken') ?? undefined,
      token: localStorage.getItem('token') ?? undefined,
    };
  }

  static set(state: TokenState) {
    localStorage.setItem('refreshToken', state.refreshToken);
    localStorage.setItem('token', state.token);
  }

  static clear() {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
  }
}

const controllers: { [ref: string]: AbortController } = {};
export function abortRequest(ref: string) {
  controllers[ref]?.abort();
}
export function request(path: string, payload?: RequestInit, ref?: string) {
  if (ref) {
    abortRequest(ref);
    controllers[ref] = new AbortController();
  }

  return fetch(`${process.env.REACT_APP_API_URL}${path ?? ''}`, {
    ...payload,
    headers: omitBy(
      {
        'content-type': 'application/json',
        ...payload?.headers,
      },
      isNil
    ) as any,
    signal: ref ? controllers[ref]?.signal : null,
  });
}

type UseRequestOptions<T> = {
  payload?: RequestInit;
  debounce?: boolean;
  initData?: T;
};

/**
 * API hook for making requests. ONE REQUEST PER HOOK as we have additional
 * logic for dealing with making requests which are already outbound
 * @param path string - The endpoint of the api (Host set by ENV)
 * @param payload RequestInit - Default request stuff
 */
export function useRequest<T>(
  path: string,
  options: UseRequestOptions<T> = {}
) {
  const { initData, payload, debounce = true } = options;
  const controller = useRef<AbortController>();
  const authContext = useAuth();

  const [state, setState] = useState<{ data?: T; isLoading: boolean }>({
    isLoading: false,
    data: initData,
  });

  const requestCtx = useRef({
    isLoading: state.isLoading,
    ...authContext,
  });

  requestCtx.current = {
    isLoading: state.isLoading,
    ...authContext,
  };

  const makeRequest = useCallback(
    async (_payload?: RequestInit) => {
      // Clean up stuff
      if (requestCtx.current.isLoading) {
        console.warn(`Request to ${path} is already in progress`);
        if (debounce) return;
      }

      controller.current?.abort();

      // Setup request overhead stuff
      controller.current = new AbortController();
      setState({ isLoading: true });

      const run = () =>
        request(path, {
          ...payload,
          ..._payload,
          headers: {
            ...payload?.headers,
            ..._payload?.headers,
            ...(requestCtx.current.isAuthenticated
              ? {
                  'x-access-token': requestCtx.current.token,
                }
              : {}),
          },
          signal: controller.current?.signal,
        });

      let res = await run();

      // Token has failed, refresh it
      if (res.status === 401) {
        await requestCtx.current.refreshAuth();
        res = await run();
      }

      // Done
      const _data = await res.json();
      setState({
        isLoading: false,
        data: _data,
      });

      return _data as T;
    },
    [debounce, path, payload]
  );

  const abort = useCallback(() => {
    controller.current?.abort();
  }, []);

  return {
    makeRequest,
    abort,
    ...state,
  };
}
