import { Typography } from '@ht6/react-ui/dist/esm';
import { HTMLAttributes } from 'react';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import { useConfig } from '../Configuration/context';
import Highlight from '../Highlight';
import Section from '../Section';

import styles from './Layout.module.scss';
import {useNavigationManager} from "../NavigationManager/context";

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

  const navigationManager = useNavigationManager();

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
          <Typography textColor='primary-500' textType='heading3' as='span'>
            Hack the 6ix
          </Typography>
        </div>
        <Typography textColor='copy-dark' textType='heading3' as='p'>
          <Highlight highlightColor='warning-200'>
            {formatStart.format(startDate)} - {formatEnd.format(endDate)}
          </Highlight>
        </Typography>
          {navigationManager.owner}
          <ul>
              {
                  navigationManager.navigationEntries.map((entry) => <li style={{
                      cursor: "pointer",
                      fontSize: "24px"
                  }} onClick={() => navigationManager.onNavigation?.current(entry)}>{entry.text}</li>)
              }
          </ul>

      </Section>
      <div className={styles.appContainer}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
