import {
  Checkbox,
  Dropdown,
  FileUpload,
  Input,
  SearchDropdown,
  Textarea,
} from '@ht6/react-ui';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import stringSimilarity from 'string-similarity';
import * as yup from 'yup';

import { useApplicationData } from '..';
import {ServerResponse, useRequest} from '../../../utils/useRequest';
import ApplicationFormSection from '../../ApplicationFormSection';
import { SectionProps, useFormikHelpers } from '../helpers';

export const initialValues = {
  school: '',
  study: '',
  level: '',
  hackathons: '',
  resume: null,
  canDistribute: false,
  github: '',
  portfolio: '',
  linkedin: '',
  project: '',
};

export const validate = yup.object({
  school: yup.string().required("Your School can't be blank"),
  study: yup.string().required("Your Program of Study can't be blank"),
  level: yup.string().required("Level of Study can't be blank"),
  hackathons: yup
    .string()
    .required("Number of Hackathons Attended can't be blank"),
  resume: yup.mixed().required("Resume can't be blank"),
  project: yup
    .string()
    // @ts-ignore-next-line
    .maxCount(200, 'Project Description must be within 200 words')
    // @ts-ignore-next-line
    .minCount(50, 'Project Description must be at least 50 words')
    .required("Project Description can't be blank"),
});

function Experience(props: SectionProps<typeof initialValues> & { readonly? : boolean }) {
  const { applyFieldProps } = useFormikHelpers<typeof initialValues>(props);
  const { makeRequest } = useRequest<ServerResponse>('/api/action/updateResume');
  const { enums } = useApplicationData();

  useEffect(() => {
    const file = (props.values.resume as unknown as FileList)?.item?.(0);
    if (!file) return;
    toast.loading('Uploading resume...', { id: 'experience-resume' });
    const body = new FormData();
    body.append('resume', file);
    (async () => {
      const res = await makeRequest({
        headers: {
          'content-type': undefined,
        } as any,
        method: 'PUT',
        body,
      });
      const responseStatus = res?.status ?? 500;

      if(responseStatus > 399) {
          if(responseStatus === 403) {
              toast.error(res?.message, { id: 'experience-resume' });
          }
          else {
              toast.error('Unexpected error uploading resume.', { id: 'experience-resume' });
          }

          props.setFieldValue('resume', '');
      }
      else {
          toast.success('Resume Uploaded', { id: 'experience-resume' });
      }

    })();
  }, [makeRequest, props.values.resume]);

  const schoolSubset = stringSimilarity
    .findBestMatch(props.values.school, enums.school)
    .ratings.sort((a, b) => b.rating - a.rating);

  return (
    <ApplicationFormSection>
      <SearchDropdown
        {...applyFieldProps({
          name: 'school',
          label: 'Your School (Most Recently Attended)',
          omitOutline: true,
          required: true,
        })}
        placeholder='Select an option'
        options={schoolSubset.slice(0, 10).map((school) => ({
          value: school.target,
          label: school.target,
        }))}
        onChange={(e) => {
          props.setFieldValue('school', e.currentTarget.value);
        }}
        disabled={props.readonly}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'study',
          label: 'Your Program of Study',
          omitOutline: true,
          required: true,
        })}
        options={enums.programOfStudy.map((label) => ({
          value: label,
          label,
        }))}
        disabled={props.readonly}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'level',
          label: 'Level of Study',
          omitOutline: true,
          required: true,
        })}
        options={enums.levelOfStudy.map((label) => ({
          value: label,
          label,
        }))}
        disabled={props.readonly}
      />
      <Dropdown
        {...applyFieldProps({
          name: 'hackathons',
          label: 'Number of Hacakthons Attended',
          omitOutline: true,
          required: true,
        })}
        options={enums.hackathonsAttended.map((label) => ({
          value: label,
          label,
        }))}
        disabled={props.readonly}
      />
      <FileUpload
        {...applyFieldProps({
          name: 'resume',
          label: 'Your Resume',
          omitOutline: true,
          required: true,
          isFullWidth: true,
        })}
        accept={['application/pdf']}
        value={props.values.resume}
        onChange={(e) => {
          props.setFieldValue('resume', e.currentTarget.files);
        }}
        disabled={props.readonly}
      />
      <Checkbox
        {...applyFieldProps({
          name: 'canDistribute',
          label:
            'I allow Hack the 6ix to distribute my resume to its event sponsors.',
          omitOutline: true,
          isFullWidth: true,
          isNextRow: true,
        })}
        color='primary-700'
        disabled={props.readonly}
      />
      <Input
        {...applyFieldProps({
          name: 'github',
          label: 'Github Link',
        })}
        placeholder='Ex. https://github.com/fpunny'
        type='url'
        disabled={props.readonly}
      />
      <Input
        {...applyFieldProps({
          name: 'portfolio',
          label: 'Personal Website or Portfolio',
          isNextRow: true,
        })}
        placeholder='Ex. https://fpunny.xyz'
        type='url'
        disabled={props.readonly}
      />
      <Input
        {...applyFieldProps({
          name: 'linkedin',
          label: 'LinkedIn',
          isNextRow: true,
        })}
        placeholder='Ex. https://linkedin.com/fpunny'
        type='url'
        disabled={props.readonly}
      />
      <Textarea
        {...applyFieldProps({
          name: 'project',
          label:
            'What is a project you hope to accomplish in the future? And why not now?.',
          omitOutline: true,
          isNextRow: true,
          isFullWidth: true,
          required: true,
        })}
        limit={200}
        rows={5}
        disabled={props.readonly}
      />
    </ApplicationFormSection>
  );
}

export default Experience;
