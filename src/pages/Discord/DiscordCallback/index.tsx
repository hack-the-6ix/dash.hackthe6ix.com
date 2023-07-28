import { Typography } from '@ht6/react-ui';
import { useEffect, useState } from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import { CgSpinner, CgCheckO } from 'react-icons/cg';
import { MdError } from 'react-icons/md';

import Card from '../../../components/Card';
import Section from '../../../components/Section';
import getQueryParams from '../../../utils/getQueryParams';
import { ServerResponse, useRequest } from '../../../utils/useRequest';

import styles from './DiscordCallback.module.scss';
import Protected from "../../../components/Authentication/Protected";

type QueryParams = {
  code: string;
  session_state: string;
  state: string;
};

function DiscordCallback() {
  const { makeRequest: associateDiscord } = useRequest<
    ServerResponse<string>
  >(`/api/action/associateDiscord`);
  const [error, setError] = useState<ServerResponse<string> | null>(null);
  const [success, setSuccess] = useState(false);

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = getQueryParams<QueryParams>();
    associateDiscord({
      method: 'POST',
      body: JSON.stringify({
        state: params.state,
        code: params.code,
      }),
    }).then((res) => {
      if (res?.status === 200) {
        setSuccess(true);
        setSearchParams(new URLSearchParams());
        return;
      }

      setError({
        message: (res?.message as any) ?? 'Unknown Error',
        status: res?.status ?? 501,
      });
    })
  }, [associateDiscord]);

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
              success ? (
                      <>
                        <CgCheckO className={styles.success} />
                        <div className={styles.content}>
                          <Typography textColor='warning-400' textType='heading3' as='h1'>
                            Success!
                          </Typography>
                          <Typography textColor='copy-light' textType='paragraph1' as='p'>
                            Your account has been successfully linked.
                          </Typography>
                          <Typography
                              textColor='copy-light'
                              textType='paragraph3'
                              textWeight={600}
                              as='p'
                          >
                            Feel free to close this tab.
                          </Typography>
                        </div>
                      </>
                  ) :
                  (
                      <>
                        <CgSpinner className={styles.spinner} />
                        <div className={styles.content}>
                          <Typography textColor='warning-400' textType='heading3' as='h1'>
                            Hang in there!
                          </Typography>
                          <Typography textColor='copy-light' textType='paragraph1' as='p'>
                            We're processing your Discord association...
                          </Typography>
                        </div>
                      </>
                  )
          )}
        </Card>
      </Section>
    </Protected>
  );
}

export default DiscordCallback;
