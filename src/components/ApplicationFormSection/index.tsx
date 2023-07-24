import cx from 'classnames';
import { ReactNode } from 'react';

import styles from './ApplicationFormSection.module.scss';

export interface ApplicationFormSectionProps {
  className?: string;
  children: ReactNode;
}

function ApplicationFormSection({
  className,
  children,
  ...props
}: ApplicationFormSectionProps) {
  return (
    <div {...props} className={cx(styles.section, className)}>
      {children}
    </div>
  );
}

export default ApplicationFormSection;
