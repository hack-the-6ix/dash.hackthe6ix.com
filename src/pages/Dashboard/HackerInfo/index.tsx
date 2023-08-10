import { Button, Link, Typography } from '@ht6/react-ui';
import cx from 'classnames';
import { MouseEvent } from 'react';
import toast from 'react-hot-toast';
import { HiClipboard, HiLocationMarker } from 'react-icons/hi';

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
  const firstName = authCtx.user.firstName;
  
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
      
  const welcomeMessage = (authCtx.user.status.checkedIn) ? "Thanks for checking in" : "Welcome back";
  // TODO: Not sure what field checks for attendance, assuming it's canRSVP?
  const attending = authCtx.user.status.canRSVP;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <Typography
        className={styles.title}
        textType='heading1'
        as='h1'
        textColor='neutral-50'>
          {`${welcomeMessage}, ${firstName}!`}
        </Typography>
        <div className={styles.heading}>
          <Typography
            className={styles.subheading}
            textType='paragraph1'
            as='p'
            textColor='neutral-50'>
            Explore your dashboard to find out what you can do before the event starts on <span className={styles.date}>August 18th.</span>
          </Typography>
          <Typography
          className={styles.location}
          textType='paragraph1'
          as='p'
          textColor='neutral-50'>
            <HiLocationMarker /> Event Location:&nbsp;
            <a 
            href="https://goo.gl/maps/i3afDdq7F39HeGRu7"
            className={styles.link}
            rel='noreferrer noopener'
            target='_blank'>
              George Vari Engineering and Computing Centre, Toronto, ON
            </a>
          </Typography>
        </div>
        <div className={styles.row_border}></div>
        <div className={styles.status}>
          <Typography
           textType='heading3'
           as='h3'
           textColor='neutral-50'>
            Your Status: 
          </Typography>
          {/*{qrCode && (*/}
          {/*  <>*/}
          {/*    <Typography*/}
          {/*      textColor='primary-700'*/}
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
          <Typography textColor='neutral-50' textType='paragraph-regular' as='p'>
            If you can no longer attend Hack the 6ix, please let us know so we can
            pass this opportunity to a waitlisted participant.
          </Typography>
          <Button
            buttonVariant='tertiary'
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
                      buttonColor='error-600'
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
            I can no longer attend
          </Button>
        </div>
        <div className={styles.discord}>
          <Typography textColor='primary-700' textType='heading3' as='h3'>
            JOIN OUR DISCORD
          </Typography>
          <Typography textColor='primary-700' textType='paragraph1' as='p'>
            Join our Discord server to get the latest updates and meet fellow
            hackers!
          </Typography>
          <Typography textColor='primary-700' textType='paragraph1' as='p'>
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
              textColor='primary-700'
              textType='heading4'
              value={`!verify ${email}`}
              as='input'
              readOnly
            />
            <HiClipboard className={styles.icon} />
          </div>
        </div>
        <div className={styles.links}>
          <Typography textColor='primary-700' textType='heading3' as='h3'>
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
    </div>
  );
}

export default HackerInfo;
