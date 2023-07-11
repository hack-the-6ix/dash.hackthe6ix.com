import { merge } from 'lodash';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
  ServerResponse,
  TokenController,
  abortRequest,
  request,
} from '../../utils/useRequest';
import {
  AuthenticatedAuthContext,
  AuthenticationContext,
  UnAuthenticatedAuthContext,
  User,
} from './context';

export interface AuthenticationProviderProps {
  children: ReactNode;
}

export default function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const [state, setState] = useState<
    AuthenticatedAuthContext | UnAuthenticatedAuthContext
  >(() => {
    const { refreshToken, token } = TokenController.get();
    if (refreshToken && token) {
      return {
        isAuthenticating: true,
        isAuthenticated: false,
        isRefreshing: false,
        refreshToken,
        token,
      };
    } else {
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        isRefreshing: false,
      };
    }
  });

  const _state = useRef(state);
  _state.current = state;

  const revokeAuth = useCallback(async () => {
    if (_state.current.isAuthenticating) {
      console.warn('User authentication in progress. Cancelling...');
      abortRequest('authentication__profile');
    }

    if (_state.current.isAuthenticated) {
      await request(
        `/auth/${process.env.REACT_APP_API_AUTH_PROVIDER}/logout`,
        {
          method: 'POST',
          headers: {
            'x-access-token': _state.current.token,
          },
          body: JSON.stringify({
            refreshToken: _state.current.refreshToken,
          }),
        },
        'authentication__logout'
      );
    }

    TokenController.clear();
    setState({
      isAuthenticating: false,
      isAuthenticated: false,
      isRefreshing: false,
    });
  }, []);

  const refreshAuth = useCallback(async () => {
    const { token, refreshToken } = _state.current as any;
    const res = await request(
      `/auth/${process.env.REACT_APP_API_AUTH_PROVIDER}/refresh`,
      {
        method: 'POST',
        headers: {
          'x-access-token': token,
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      },
      'authentication__refresh'
    );

    if (res?.status !== 200) {
      console.warn('Unable to refresh auth. Logging user out');
      await revokeAuth();
      return;
    }

    const payload: ServerResponse<{ refreshToken: string; token: string }> =
      await res.json();

    TokenController.set(payload.message);
    setState((_state) => ({ ..._state, ...payload.message }));
    return payload.message;
  }, [revokeAuth]);

  const setAuth = useCallback(
    async (token: string, refreshToken: string) => {
      if (_state.current.isAuthenticated) return;
      if (_state.current.isAuthenticating) await await revokeAuth();

      TokenController.set({ token, refreshToken });
      setState({
        isAuthenticating: true,
        isAuthenticated: false,
        isRefreshing: false,
        refreshToken,
        token,
      });
    },
    [revokeAuth]
  );

  const updateUser = useCallback(
    (payload: Partial<Pick<User, 'hackerApplication' | 'status'>>) => {
      setState((s) => {
        if (!s.isAuthenticated) {
          console.warn('No user session found. Unable to update');
          return s;
        }
        return {
          ...s,
          user: merge(s.user, payload),
        };
      });
    },
    []
  );

  const { isAuthenticating, refreshToken, token } = state as any;
  useEffect(() => {
    if (!isAuthenticating) return;

    // TODO: Add fetch request for user
    (async () => {
      const run = (token?: string) =>
        request(
          '/api/action/profile',
          token
            ? {
                headers: {
                  'x-access-token': token,
                },
              }
            : {},
          'authentication__profile'
        );
      let res = await run(token);
      if (res.status === 401) {
        const { token } = (await refreshAuth()) ?? {};
        res = await run(token);
      }

      const data = await res.json();
      setState((_state) => ({
        ..._state,
        isAuthenticating: false,
        isAuthenticated: true,
        user: data.message,
        refreshToken,
        token,
      }));
    })();

    return () => {
      abortRequest('authentication__profile');
    };
  }, [refreshAuth, isAuthenticating, refreshToken, token]);

  return (
    <AuthenticationContext.Provider
      value={{
        ...state,
        isReady: !state.isAuthenticating && !state.isRefreshing,
        updateUser,
        refreshAuth,
        revokeAuth,
        setAuth,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
