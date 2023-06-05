import cx from 'classnames';

import styles from './Card.module.scss';

export type CardProps<T extends ElementLike> = ComponentWithAs<
  {
    className?: string;
  },
  T
>;

function Card<T extends ElementLike>({
  as,
  className,
  ...props
}: CardProps<T>) {
  const Component = as ?? 'div';
  return <Component {...props} className={cx(styles.root, className)} />;
}

export default Card;
