import { Colors } from '@ht6/react-ui/dist/styles';
import cx from 'classnames';
import { FormikProps, getIn } from 'formik';
import { isNil, omitBy } from 'lodash';
import { FC, ReactNode } from 'react';
import type { AnySchema } from 'yup';

import { NestedKey } from '../../types';

import styles from './ApplicationForm.module.scss';

export interface SectionProps<T> extends FormikProps<T> {
  readonly?: boolean;
}

export type ApplicationModule<T = any> = {
  default: FC<SectionProps<T>>;
  validate: AnySchema;
  initialValues: T;
};

export interface HandlerProps<T extends object> {
  label: ReactNode;
  name: NestedKey<T>;
  required?: boolean;
  omitOutline?: boolean;
  // Shared styles stuff
  className?: string;
  isFullWidth?: boolean;
  isNextRow?: boolean;
  isCheckbox?: boolean;
}

export function useFormikHelpers<T extends object>(formik: SectionProps<T>) {
  const { errors, touched, values, setFieldTouched, handleChange, handleBlur } =
    formik;

  const applyFieldProps = (props: HandlerProps<T>): any => {
    return omitBy(
      {
        className: cx(
          props.isFullWidth && styles['field--full-width'],
          props.isNextRow && styles['field--break'],
          props.className
        ),
        [props.isCheckbox ? 'checked' : 'value']: getIn(
          values,
          props.name as string
        ),
        onChange: handleChange,
        onBlur: (e: any) => {
          handleBlur(e);
          setFieldTouched(props.name, false);
        },
        outlineColor: props.omitOutline ? undefined : ('primary-3' as Colors),
        status:
          getIn(errors, props.name as string) &&
          getIn(touched, props.name as string)
            ? {
                state: 'error' as const,
                text: getIn(errors, props.name as string),
              }
            : undefined,
        disabled: formik.readonly,
        label: props.label,
        name: props.name,
        required: props.required,
      },
      isNil
    );
  };

  const getKeys = <T extends object>(initialValues: T): NestedKey<T>[] => {
    return Object.entries(initialValues)
      .map(([field, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          return getKeys<typeof value>(value);
        }
        return field;
      })
      .flat() as NestedKey<T>[];
  };

  const hasTouched = <T extends object>(initialValues: T) => {
    return getKeys(initialValues)
      .map((key) => getIn(formik.touched, key))
      .some(Boolean);
  };

  const hasError = <T extends object>(initialValues: T) => {
    return getKeys(initialValues)
      .map((key) => getIn(formik.errors, key))
      .some(Boolean);
  };

  return {
    applyFieldProps,
    hasTouched,
    hasError,
    getKeys,
  };
}
