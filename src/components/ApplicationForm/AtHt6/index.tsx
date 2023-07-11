import { Checkbox, Input, InputLayout, Textarea } from '@ht6/react-ui';
import { isNil, omitBy } from 'lodash';
import * as yup from 'yup';

import { useApplicationData } from '..';
import ApplicationFormSection from '../../ApplicationFormSection';
import { SectionProps, useFormikHelpers } from '../helpers';

import sharedStyles from '../ApplicationForm.module.scss';
import styles from './AtHt6.module.scss';

export const initialValues = {
  interest: [] as string[],
  otherInterest: '',
  whyHT6: '',
  creative: '',
  mlh: false,
  mlhEmail: false,
  mlhShare: false,
};

export const validate = yup.lazy((value) =>
  yup.object(
    omitBy(
      {
        interest: yup
          .array()
          .of(yup.string())
          .length(3, 'Please provide exactly 3 workshop interests'),
        otherInterest: value.interest.includes('other')
          ? yup.string().required('Please provide a value')
          : undefined,
        whyHT6: yup
          .string()
          // @ts-ignore-next-line
          .maxCount(200, 'Why HT6 Essay must be within 200 words')
          // @ts-ignore-next-line
          .minCount(50, 'Why HT6 Essay must be at least 50 words')
          .required("Why HT6 Essay can't be blank"),
        creative: yup
          .string()
          // @ts-ignore-next-line
          .maxCount(200, 'Creative Essay must be within 200 words')
          // @ts-ignore-next-line
          .minCount(50, 'Creative Essay must be at least 50 words')
          .required("Creative Essay can't be blank"),
        mlh: yup.bool().isTrue('Please accept the MLH Code of Conduct'),
        mlhShare: yup.bool().isTrue('Please accept the MLH Privacy Policy'),
      },
      isNil
    )
  )
) as any;

function AtHt6(props: SectionProps<typeof initialValues>) {
  const { applyFieldProps } = useFormikHelpers<typeof initialValues>(props);
  const { enums } = useApplicationData();

  const { status, ...interestProps } = applyFieldProps({
    name: 'interest',
    omitOutline: true,
    label: '',
  });

  return (
    <ApplicationFormSection>
      <InputLayout
        className={sharedStyles['field--full-width']}
        label='Please choose 3 workshops that you are interested in'
        status={status}
        name='interest'
        required
      >
        <div className={styles.workshops}>
          {enums.requestedWorkshops.map((workshop, key) => (
            <Checkbox
              {...interestProps}
              label={workshop}
              checked={props.values.interest.includes(workshop) as any}
              onChange={(e) => {
                const isChecked = e.currentTarget.checked;
                const newValue = props.values.interest.filter(
                  (i) => i !== workshop
                );
                props.setFieldValue(
                  'interest',
                  isChecked ? [...newValue, workshop] : newValue
                );
              }}
              disabled={
                props.readonly ||
                (!props.values.interest.includes(workshop) &&
                  props.values.interest.length >= 3)
              }
              color='primary-700'
              key={key}
            />
          ))}
          <Checkbox
            {...interestProps}
            label={
              <Input
                {...applyFieldProps({
                  name: 'otherInterest',
                  label: 'Other',
                })}
                disabled={
                  props.readonly || !props.values.interest.includes('other')
                }
                placeholder='Other'
                hideLabel
              />
            }
            checked={props.values.interest.includes('other') as any}
            onChange={(e) => {
              const isChecked = e.currentTarget.checked;
              const newValue = props.values.interest.filter(
                (i) => i !== 'other'
              );

              if (!isChecked) {
                props.setFieldError('otherInterest', undefined);
                props.setFieldValue('otherInterest', '');
              }
              props.setFieldValue(
                'interest',
                isChecked ? [...newValue, 'other'] : newValue
              );
            }}
            disabled={
              props.readonly ||
              (!props.values.interest.includes('other') &&
                props.values.interest.length >= 3)
            }
            color='primary-700'
          />
        </div>
      </InputLayout>
      <Textarea
        {...applyFieldProps({
          label: 'What would you like to accomplish at Hack the 6ix?',
          name: 'whyHT6',
          omitOutline: true,
          isFullWidth: true,
          required: true,
        })}
        limit={200}
        rows={5}
      />
      <Textarea
        {...applyFieldProps({
          label:
            'If you were to live in a fictional world of your choosing one day, what would it be and why? This could be from any show, anime or even a novel of your choosing, be creative!',
          name: 'creative',
          omitOutline: true,
          isFullWidth: true,
          required: true,
        })}
        limit={200}
        rows={5}
      />
      <Checkbox
        {...applyFieldProps({
          name: 'mlh',
          omitOutline: true,
          label: (
            <span>
              I have read and agree to the{' '}
              <a
                href='https://static.mlh.io/docs/mlh-code-of-conduct.pdf'
                className={sharedStyles.link}
                rel='noreferrer noopener'
                target='_blank'
              >
                Major League Hacking (MLH) Code of Conduct
              </a>
              .*
            </span>
          ),
          required: true,
          isFullWidth: true,
          isNextRow: true,
        })}
        color='primary-700'
      />
      <Checkbox
        {...applyFieldProps({
          label:
            'I authorize MLH to send me pre- and post-event informational emails, which contain free credit and opportunities from their partners.',
          name: 'mlhEmail',
          omitOutline: true,
          isFullWidth: true,
          isNextRow: true,
        })}
        color='primary-700'
      />
      <Checkbox
        {...applyFieldProps({
          label: (
            <span>
              I authorize Hack the 6ix to share my application/registration
              information with Major League Hacking for event administration,
              ranking, and MLH administration in-line with the MLH Privacy
              Policy. I further agree to the terms of both the{' '}
              <a
                href='https://github.com/MLH/mlh-policies/blob/main/contest-terms.md'
                className={sharedStyles.link}
                rel='noreferrer noopener'
                target='_blank'
              >
                MLH Contest Terms and Conditions
              </a>{' '}
              and the{' '}
              <a
                href='https://mlh.io/privacy'
                className={sharedStyles.link}
                rel='noreferrer noopener'
                target='_blank'
              >
                MLH Privacy Policy
              </a>
              .*
            </span>
          ),
          name: 'mlhShare',
          omitOutline: true,
          isFullWidth: true,
          isNextRow: true,
          required: true,
        })}
        color='primary-700'
      />
    </ApplicationFormSection>
  );
}

/*AtHt6.validate = (values: FormValuesType) => {
  return {};
};*/

export default AtHt6;
