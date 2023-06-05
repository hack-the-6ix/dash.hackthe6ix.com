import { Typography } from '@ht6/react-ui';
import { ReactNode } from 'react';

import ApplicationFooter, {
  ApplicationFooterProps,
} from '../../../components/ApplicationFooter';
import Card from '../../../components/Card';
import Section from '../../../components/Section';

import styles from './InfoPage.module.scss';

interface InfoPageProps {
  heading: ReactNode;
  content: ReactNode;
  action?: ApplicationFooterProps;
}
function InfoPage({ heading, content, action }: InfoPageProps) {
  return (
    <Section type='form'>
      <Card className={styles.card}>
        <div className={styles.content}>
          <div className={styles.heading}>
            <Typography textType='heading4' textColor='grey' as='span'>
              Hack the 6ix Application
            </Typography>
            <Typography textType='heading2' textColor='primary-3' as='h1'>
              {heading}
            </Typography>
          </div>
          {content}
          {action && (
            <ApplicationFooter className={styles.footer} {...action} />
          )}
        </div>
      </Card>
    </Section>
  );
}

export default InfoPage;
