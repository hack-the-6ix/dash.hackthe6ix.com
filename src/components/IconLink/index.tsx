import { Typography } from '@ht6/react-ui';

import styles from './IconLink.module.scss';

interface IconLinkProps {
  logo: string;
  title: string;
  description: string;
  link: string;
}

function IconLink({ logo, title, link, description }: IconLinkProps) {
  return (
    <a
      href={link}
      target='_blank'
      rel='noreferrer noopener'
      className={styles.container}
    >
      <img className={styles.icon} alt={title} src={logo} />
      <div className={styles.content}>
        <Typography textColor='primary-3' textType='heading4' as='h4'>
          {title}
        </Typography>
        <Typography textColor='primary-3' textType='paragraph1' as='p'>
          {description}
        </Typography>
      </div>
    </a>
  );
}

export default IconLink;
