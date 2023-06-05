import { Typography } from '@ht6/react-ui';
import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { MdError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import useAuth from '../../components/Authentication/context';
import Card from '../../components/Card';
import Section from '../../components/Section';
import getQueryParams from '../../utils/getQueryParams';
import { ServerResponse, useRequest } from '../../utils/useRequest';

import styles from './Callback.module.scss';

type QueryParams = {
  code: string;
  session_state: string;
  state: string;
};

function Callback() {
  const { makeRequest: getAuth } = useRequest<
    ServerResponse<{
      redirectTo: string;
      refreshToken: string;
      token: string;
    }>
  >(`/auth/${process.env.REACT_APP_API_AUTH_PROVIDER}/callback`);
  const [error, setError] = useState<ServerResponse<string> | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const params = getQueryParams<QueryParams>();
    const completeAuth = async () => {
      const res = await getAuth({
        method: 'POST',
        body: JSON.stringify({
          state: params.state,
          code: params.code,
        }),
      });
      if (res?.status === 200) {
        await setAuth(res.message.token, res.message.refreshToken);
        navigate(res.message.redirectTo, { replace: true });
        return;
      }

      setError({
        message: (res?.message as any) ?? 'Unknown Error',
        status: res?.status ?? 501,
      });
    };

    const timer = window.setTimeout(completeAuth, 500);
    return () => {
      window.clearTimeout(timer);
    };
  }, [navigate, setAuth, getAuth]);

  return (
    <Section type='form'>
      <Card className={styles.card}>
        {error ? (
          <>
            <MdError className={styles.error} />
            <div className={styles.content}>
              <Typography textColor='error' textType='heading3' as='h1'>
                Something is bonked D:
              </Typography>
              <Typography
                textColor='copy-dark'
                textType='paragraph1'
                textWeight={600}
                as='p'
              >
                Looks like something unexpected have happened. Please try again
                later...
              </Typography>
              <Typography
                textColor='grey'
                textType='paragraph3'
                textWeight={600}
                as='p'
              >
                [{error.status} - {error.message}]
              </Typography>
            </div>
          </>
        ) : (
          <>
            <CgSpinner className={styles.spinner} />
            <div className={styles.content}>
              <Typography textColor='primary-3' textType='heading3' as='h1'>
                Hang in there!
              </Typography>
              <Typography textColor='copy-dark' textType='paragraph1' as='p'>
                You will be redirected shortly...
              </Typography>
            </div>
          </>
        )}
      </Card>
    </Section>
  );
}

export default Callback;
