import {Checkbox, Dropdown, Input, SearchDropdown, Typography} from '@ht6/react-ui';
import { useEffect } from 'react';
import * as yup from 'yup';

import { useApplicationData } from '..';
import ApplicationFormSection from '../../ApplicationFormSection';
import { SectionProps, useFormikHelpers } from '../helpers';

import sharedStyles from '../ApplicationForm.module.scss';

export const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  canEmail: false,
  gender: '',
  pronouns: '',
  ethnicity: '',
  size: '',
  city: '',
  province: '',
  country: '',
  emergencyContact: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    relationship: ''
  }
};

export const validate = yup.lazy((values) => {
  let schema = {
    firstName: yup.string().required("First Name can't be blank"),
    lastName: yup.string().required("Last Name can't be blank"),
    email: yup
      .string()
      .email('Please provide a valid email.')
      .required("Email can't be blank"),
    phone: yup.string().required("Phone Number can't be blank"),
    canEmail: yup.boolean(),
    gender: yup.string().required("Gender can't be blank"),
    ethnicity: yup.string().required("Ethnicity can't be blank"),
    size: yup.string().required("Size can't be blank"),
    city: yup.string().required("City can't be blank"),
    province: yup.string().required("Province/State can't be blank"),
    country: yup.string().required("Country can't be blank"),
    emergencyContact: yup.object({
        firstName: yup.string().required("Emergency contact first name can't be blank"),
        lastName: yup.string().required("Emergency contact last name can't be blank"),
        phoneNumber: yup.string().required("Emergency contact phone number can't be blank"),
        relationship: yup.string().required("Emergency contact relationship can't be blank")
    })
  } as any;

  return yup.object({
    ...schema
  });
}) as any;

function About(props: SectionProps<typeof initialValues>) {
  const { applyFieldProps } = useFormikHelpers<typeof initialValues>(props);
  const { enums } = useApplicationData();

  return (
    <ApplicationFormSection>
      <Input
        {...applyFieldProps({
          name: 'firstName',
          label: 'First Name',
          required: true,
        })}
        placeholder='Enter first name'
        disabled
      />
      <Input
        {...applyFieldProps({
          name: 'lastName',
          label: 'Last Name',
          required: true,
        })}
        placeholder='Enter last name'
        disabled
      />
      <Input
        {...applyFieldProps({
          name: 'email',
          label: 'Email',
          required: true,
        })}
        placeholder='name@gmail.com'
        type='email'
        disabled
      />
      <Input
        {...applyFieldProps({
          name: 'phone',
          label: 'Phone Number',
          required: true,
        })}
        placeholder='1234567890'
        type='phone'
      />
      <Checkbox
        {...applyFieldProps({
          name: 'canEmail',
          label:
            'I give permission to Hack the 6ix for sending me emails containing information from the event sponsors.',
          omitOutline: true,
          isFullWidth: true,
          isCheckbox: true,
        })}
        color='primary-3'
      />
      <Dropdown
        {...applyFieldProps({
          name: 'gender',
          label: 'Gender',
          omitOutline: true,
          required: true,
        })}
        options={enums.gender.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'pronouns',
          label: 'Pronouns',
          omitOutline: true,
          required: true,
        })}
        options={enums.pronouns.map((label) => ({
          value: label,
          label,
        }))}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'ethnicity',
          label: 'Ethnicity',
          omitOutline: true,
          required: true,
        })}
        options={enums.ethnicity.map((label) => ({
          value: label,
          label,
        }))}
      />
        <Dropdown
            {...applyFieldProps({
                name: 'size',
                label: 'Shirt Size',
                omitOutline: true,
                required: true,
            })}
            options={enums.shirt.map((label) => ({
                value: label,
                label,
            }))}
        />
        <div className={sharedStyles['field--full-width']}>
            <Typography textColor='primary-3' textType='heading3' as='h2'>
                Your Location
            </Typography>
            <Typography textColor='copy-dark' textType='paragraph1' as='p'>
                If you are travelling far from the Toronto area, you may be eligible to apply for a travel reimbursement. We'll reach out with more details if that's the case.
            </Typography>
        </div>
        <Input
            {...applyFieldProps({
                name: 'city',
                label: 'City',
                required: true,
            })}
            placeholder='Enter city name'
        />

        <SearchDropdown
            {...applyFieldProps({
                name: 'province',
                label: 'Province / State',
                required: true,
                omitOutline: true,
            })}
            placeholder='Select an option'
            options={enums.province.map((label) => ({
                value: label,
                label,
            }))}
            onChange={(e) => {
                props.setFieldValue('province', e.currentTarget.value);
            }}
        />
        <Dropdown
            {...applyFieldProps({
                name: 'country',
                label: 'Country',
                required: true,
                omitOutline: true,
            })}
            disabled={props.readonly}
            options={enums.countries.map((label) => ({
                value: label,
                label,
            }))}
        />
        <div className={sharedStyles['field--full-width']}>
            <Typography textColor='primary-3' textType='heading3' as='h2'>
                Emergency Contact
            </Typography>
            <Typography textColor='copy-dark' textType='paragraph1' as='p'>
                Your safety is our priority. In the case of an emergency, the person below will be contacted.
                We respect your privacy and guarantee that this information will only be accessed by authorized personnel on an as-needed basis.
            </Typography>
        </div>
        <Input
            {...applyFieldProps({
                name: 'emergencyContact.firstName',
                label: 'First Name',
                required: true,
            })}
            placeholder='Enter emergency contact first name'
        />
        <Input
            {...applyFieldProps({
                name: 'emergencyContact.lastName',
                label: 'Last Name',
                required: true,
            })}
            placeholder='Enter emergency contact last name'
        />
        <Input
            {...applyFieldProps({
                name: 'emergencyContact.phoneNumber',
                label: 'Phone Number',
                required: true,
            })}
            placeholder='1234567890'
            type='phone'
        />
        <Dropdown
            {...applyFieldProps({
                name: 'emergencyContact.relationship',
                label: 'Relationship',
                required: true,
                omitOutline: true,
            })}
            disabled={props.readonly}
            options={enums.emergencyContactRelationship.map((label) => ({
                value: label,
                label,
            }))}
        />

    </ApplicationFormSection>
  );
}

export default About;
