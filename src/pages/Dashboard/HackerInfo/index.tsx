import { Button, Typography } from '@ht6/react-ui';
import cx from 'classnames';
import { MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { HiClipboard } from 'react-icons/hi';

import useAuth from '../../../components/Authentication/context';
import IconLink from '../../../components/IconLink';
import { ServerResponse, useRequest } from '../../../utils/useRequest';

import styles from './HackerInfo.module.scss';

const links = [
  {
    logo: require('../../../assets/discord.png'),
    title: 'Discord',
    link: 'https://discord.com/invite/ZZm2Ycu7UH',
    description: 'Connect with hackers, mentors and sponsors!',
    disabled: false
  },
  {
    logo: require('../../../assets/hopin.png'),
    title: 'Hopin',
    link: 'https://hopin.com/events/hack-the-6ix-2022?code=x251djeXmLiKPglrQsBHavu3B',
    description: 'All our live events and workshops are here!',
    disabled: false
  },
  {
    logo: require('../../../assets/devpost.png'),
    title: 'Devpost',
    link: 'https://hackthe6ix2022.devpost.com/',
    description: 'Submit your projects here!',
    disabled: false
  },
];

function HackerInfo() {
  // const { makeRequest: getQrCode, data: qrCode } = useRequest<
  //   ServerResponse<string>
  // >('/api/action/checkInQR');
  const { makeRequest, isLoading } =
    useRequest<ServerResponse>('/api/action/rsvp');
  const authCtx = useAuth();

  // useEffect(() => {
  //   getQrCode();
  // }, [getQrCode]);

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const email = authCtx.user.email;

  // const dateFormat = new Intl.DateTimeFormat('en-CA', {
  //   month: 'short',
  //   day: 'numeric',
  // });

  const unrsvp = async () => {
    toast.loading('Cancelling RSVP...', { id: 'rsvp-home' });
    const res = await makeRequest({
      method: 'POST',
      body: JSON.stringify({
        rsvp: {
          attending: false,
        },
      }),
    });

    if (res?.status === 200) {
      toast.success('RSVP cancelled', { id: 'rsvp-home' });
      window.location.reload();
    } else {
      toast.error(
        `${res?.message ?? 'An error occurred.'} Please try again later.`,
        { id: 'rsvp-home' }
      );
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <Typography textColor='primary-3' textType='heading3' as='h3'>
          APPLICATION STATUS
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          Welcome to Hack the 6ix 2022! Thanks for confirming your attendance as
          a hacker!
        </Typography>
        {/*{qrCode && (*/}
        {/*  <>*/}
        {/*    <Typography*/}
        {/*      textColor='primary-3'*/}
        {/*      textType='paragraph1'*/}
        {/*      textWeight='bold'*/}
        {/*      as='p'*/}
        {/*    >*/}
        {/*      Scan the QR code on {dateFormat.format(inPersonDate)} to check in:*/}
        {/*    </Typography>*/}
        {/*    <Card className={styles.qrBox}>*/}
        {/*      <img*/}
        {/*        src={qrCode.message}*/}
        {/*        alt='Your QR code'*/}
        {/*        className={styles.qr}*/}
        {/*      />*/}
        {/*    </Card>*/}
        {/*  </>*/}
        {/*)}*/}
      </div>
      <div>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          If you can no longer attend Hack the 6ix, please let us know so we can
          pass this opportunity to a waitlisted participant.
        </Typography>
        <Button
          buttonVariant='outline'
          disabled={isLoading}
          onClick={() =>
            toast(
              <div>
                <p>Are you sure you want to un-RSVP?</p>
                <div className={styles.actions}>
                  <Button
                    onClick={unrsvp}
                    className={styles.action}
                    buttonColor='success'
                  >
                    Yes
                  </Button>
                  <Button
                    onClick={() => toast.dismiss('rsvp-home')}
                    className={styles.action}
                    buttonColor='error'
                  >
                    No
                  </Button>
                </div>
              </div>,
              {
                id: 'rsvp-home',
                duration: 30000,
              }
            )
          }
        >
          I CAN NO LONGER ATTEND HT6
        </Button>
      </div>
      <div>
        <Typography textColor='primary-3' textType='heading3' as='h3'>
          JOIN OUR DISCORD
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          Join our Discord server to get the latest updates and meet fellow
          hackers!
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          Issue the following command in the <b>#verification</b> channel to
          gain access:
        </Typography>
        <div className={styles.copy}>
          <Typography
            onClick={(e: MouseEvent<HTMLInputElement>) => {
              navigator.clipboard.writeText(e.currentTarget.value);
              toast.success('Copied to clipboard!');
            }}
            className={styles.command}
            textColor='primary-3'
            textType='heading4'
            value={`!verify ${email}`}
            as='input'
            readOnly
          />
          <HiClipboard className={styles.icon} />
        </div>
      </div>
      <div>
        <Typography textColor='primary-3' textType='heading3' as='h3'>
          USEFUL LINKS
        </Typography>
        <div>
          <ul className={styles.links}>
            {links.map((link, idx) => (
              <li className={cx(link.disabled && styles.disabled)} key={idx}>
                <IconLink {...link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HackerInfo;
