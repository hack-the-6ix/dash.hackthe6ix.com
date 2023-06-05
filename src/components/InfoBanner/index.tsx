import { Colors } from '@ht6/react-ui/dist/styles';
import cx from 'classnames';
import { MouseEventHandler, ReactNode } from 'react';
import { IconType } from 'react-icons';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

import styles from './InfoBanner.module.scss';

export interface InfoBannerProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  type: 'error' | 'success' | 'info';
  children: ReactNode;
  className?: string;
}

const typeToConfig: {
  [type in InfoBannerProps['type']]: {
    color: Colors;
    icon: IconType;
  };
} = {
  error: {
    color: 'error',
    icon: FaExclamationCircle,
  },
  success: {
    color: 'success',
    icon: FaCheckCircle,
  },
  info: {
    color: 'copy-dark',
    icon: FaExclamationCircle,
  },
};

function InfoBanner({
  className,
  children,
  onClose,
  type,
  ...props
}: InfoBannerProps) {
  const { icon: Icon, color } = typeToConfig[type];
  return (
    <div
      {...props}
      className={cx(styles[`root--c-${color}`], styles.root, className)}
    >
      <Icon className={styles.icon} />
      <div>{children}</div>
      {onClose && (
        <button className={styles.close} onClick={onClose} type='button'>
          <FaTimes className={styles.icon} />
        </button>
      )}
    </div>
  );
}

export default InfoBanner;
