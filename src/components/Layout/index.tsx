import { Typography } from '@ht6/react-ui/dist/esm';
import { HTMLAttributes } from 'react';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { useConfig } from '../Configuration/context';
import Highlight from '../Highlight';
import Section from '../Section';

import styles from './Layout.module.scss';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {}

function Layout({ children }: LayoutProps) {
  const { startDate, endDate } = useConfig();
  const formatStart = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    timeZone: 'est',
  });
  const formatEnd = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    timeZone: 'est',
    ...(startDate.getMonth() !== endDate.getMonth()
      ? {
          month: 'short',
        }
      : {}),
  });

  return (
    <div className={styles.root}>
      <Section
        containerClassName={styles.nav}
        className={styles.content}
        type='page'
        as='nav'
      >
        <div className={styles.logo}>
          <Logo width='24' />
          <Typography textColor='primary-1' textType='heading3' as='span'>
            Hack the 6ix
          </Typography>
        </div>
        <Typography textColor='copy-dark' textType='heading3' as='p'>
          <Highlight highlightColor='primary-4'>
            {formatStart.format(startDate)} - {formatEnd.format(endDate)}
          </Highlight>
        </Typography>
      </Section>
      {children}
    </div>
  );
}

export default Layout;
