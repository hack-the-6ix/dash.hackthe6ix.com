import { Typography, BasicLink } from "@ht6/react-ui";
import { Colors } from '@ht6/react-ui/dist/styles';
import { IconType } from '@react-icons/all-files';
import { CSSProperties, HTMLAttributes } from 'react';
import cx from 'classnames';
import { colorClassName } from '../../utils/colorClassName';
import styles from './Socials.module.scss';

const mediaIcons: { [type: string]: IconType } = {
  facebook: require('@react-icons/all-files/fa/FaFacebook').FaFacebook,
  instagram: require('@react-icons/all-files/fa/FaInstagram').FaInstagram,
  twitter: require('@react-icons/all-files/fa/FaTwitter').FaTwitter,
  linkedin: require('@react-icons/all-files/fa/FaLinkedin').FaLinkedin,
};

const socials = [
  {
    type: 'facebook',
    link: 'https://www.facebook.com/HackThe6ix',
  },
  {
    type: 'instagram',
    link: 'https://www.instagram.com/hackthe6ix',
  },
  {
    type: 'twitter',
    link: 'https://twitter.com/hackthe6ix?lang=en',
  },
  {
    type: 'linkedin',
    link: 'https://linkedin.com/company/hackthe6ixofficial',
  },
];

export type SocialsProps = {
  baseColor: Colors;
  activeColor?: Colors;
  gap: `${number}rem`;
} & HTMLAttributes<HTMLUListElement>;

function Socials({ baseColor, activeColor, gap, ...props }: SocialsProps) {
  return (
    <div className={styles.socialsContainer}>
    <Typography textColor='neutral-50' textType='p' as='p' className={styles.socialsHeading}>
      Stay updated with us!
    </Typography>
    <ul
      {...props}
      style={{ '--socials-g': gap } as CSSProperties}
      className={cx(props.className, styles.icons)}
    >
      {socials.map((social, key) => {
        const Icon = mediaIcons[social!.type!];
        return (
          <li className={styles.iconItem} key={key}>
            <BasicLink
              rel='noopener noreferrer'
              className={cx(
                styles[colorClassName(baseColor, 'link')],
                styles.link
              )}
              linkColor={activeColor ?? baseColor}
              linkStyle='styled'
              href={social!.link!}
              target='_blank'
            >
              <Icon className={styles.icon} />
            </BasicLink>
          </li>
        );
      })}
    </ul>
    </div>
  );
}

export default Socials;
