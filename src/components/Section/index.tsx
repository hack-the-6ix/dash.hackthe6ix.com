import cx from 'classnames';
import { ReactNode } from 'react';

import styles from './Section.module.scss';

type SectionTypes = 'page' | 'form';

export type SectionProps<T extends ElementLike> = ComponentWithAs<
  {
    containerClassName?: string;
    children?: ReactNode;
    append?: ReactNode;
    className?: string;
    type: SectionTypes;
  },
  T
>;

export default function Section<T extends ElementLike>({
  containerClassName,
  className,
  children,
  append,
  type,
  as,
  ...props
}: SectionProps<T>) {
  const Component = as ?? 'section';
  return (
    <Component {...props} className={cx(containerClassName, styles.container)}>
      <div
        className={cx(styles[`content--${type}`], styles.content, className)}
      >
        {children}
      </div>
      {append}
    </Component>
  );
}
