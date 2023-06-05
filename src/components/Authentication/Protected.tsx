import { ReactElement, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { ServerResponse, useRequest } from '../../utils/useRequest';
import useAuth from './context';

export interface ProtectedProps {
  redirect?: `/${string}`;
  children: ReactElement;
  fallback?: ReactElement | null;
}
function Protected({ children, redirect, fallback = null }: ProtectedProps) {
  const { makeRequest } = useRequest<ServerResponse<{ url: string }>>(
    `/auth/${process.env.REACT_APP_API_AUTH_PROVIDER}/login`
  );
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If auth already updating or is authenticated. Then ignore
    if (isAuthenticated || !isReady) return;

    makeRequest({
      method: 'POST',
      body: JSON.stringify({
        callbackURL: `${window.location.origin}/callback`,
        redirectTo: redirect ?? location.pathname,
      }),
    }).then((res) => {
      if (res?.status === 200) {
        window.location.replace(res.message.url);
      }
    });
  }, [makeRequest, isAuthenticated, isReady, redirect, location]);

  return isAuthenticated && isReady ? children : fallback;
}

export default Protected;
