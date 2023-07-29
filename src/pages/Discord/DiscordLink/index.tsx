import { Typography } from '@ht6/react-ui';
import { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { MdError } from 'react-icons/md';

import useAuth from '../../../components/Authentication/context';
import Card from '../../../components/Card';
import Section from '../../../components/Section';
import { ServerResponse, useRequest } from '../../../utils/useRequest';

import styles from './DiscordLink.module.scss';
import Protected from "../../../components/Authentication/Protected";

function DiscordLink() {
  const { makeRequest: getOAuthLink } = useRequest<
    ServerResponse<string>
  >(`/api/action/discordOAuthUrl`);
  const [error, setError] = useState<ServerResponse<string> | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if(auth.isAuthenticated) {
      getOAuthLink({
        method: 'POST',
        body: JSON.stringify({
          redirectUrl: window.location.protocol + "//" + window.location.host + "/discord/callback"
        }),
      }).then((res) => {
        if(res?.message) {
          window.location.href = res.message;
          return;
        }

        setError({
          message: (res?.message as any) ?? 'Unknown Error',
          status: res?.status ?? 501,
        });
      });
    }
  }, [auth, getOAuthLink]);

  return (
    <Protected>
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
                      textColor='copy-light'
                      textType='paragraph1'
                      textWeight={600}
                      as='p'
                  >
                    Looks like something unexpected has happened. Please reload the page or try again
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
                  <Typography textColor='warning-400' textType='heading3' as='h1'>
                    Hang in there!
                  </Typography>
                  <Typography textColor='copy-light' textType='paragraph1' as='p'>
                    You'll be redirected shortly...
                  </Typography>
                </div>
              </>
          )}
        </Card>
      </Section>
    </Protected>
  );
}

export default DiscordLink;
