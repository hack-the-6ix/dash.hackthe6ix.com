import { getIn, setIn } from 'formik';
import { isEmpty } from 'lodash';

import { ApplicationEnumType } from '../../components/ApplicationForm';
import { initialValues as about } from '../../components/ApplicationForm/About';
import { initialValues as atHt6 } from '../../components/ApplicationForm/AtHt6';
import { initialValues as experience } from '../../components/ApplicationForm/Experience';
import { NestedKey } from '../../types';

type ClientApplication = typeof about & typeof experience & typeof atHt6;

type ServerApplication = {
  // About
  emailConsent: boolean;
  phoneNumber: string;
  gender: string;
  pronouns: string;
  ethnicity: string;
  country: string;
  city: string;
  province: string;
  shirtSize: string;

  // Experience
  school: string;
  program: string;
  levelOfStudy: string;
  hackathonsAttended: string;
  resumeFileName: string;
  friendlyResumeFileName: string;
  resumeSharePermission: boolean;
  githubLink: string;
  portfolioLink: string;
  linkedinLink: string;
  projectEssay: string;

  // At Ht6
  requestedWorkshops: string;
  whyHT6Essay: string;
  creativeResponseEssay: string;
  mlhCOC: boolean;
  mlhEmail: boolean;
  mlhData: boolean;
  emergencyContact: {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    relationship: string
  }
};

function remap<A extends object, B extends object>(
  mappings: [NestedKey<A>, NestedKey<B>][],
  obj: A
): B {
  return mappings.reduce((acc, [field1, field2 = field1]) => {
    acc = setIn(acc, field2, getIn(obj, field1));
    return acc;
  }, {} as any);
}

export function serializeApplication(
  values: ClientApplication
): Partial<ServerApplication> {
  let serializedData = remap(
    [
      // About you
      ['phone', 'phoneNumber'],
      ['canEmail', 'emailConsent'],
      ['gender', 'gender'],
      ['pronouns', 'pronouns'],
      ['ethnicity', 'ethnicity'],
      ['size', 'shirtSize'],
      ['city', 'city'],
      ['province', 'province'],
      ['country', 'country'],
      ['emergencyContact.firstName', 'emergencyContact.firstName'],
      ['emergencyContact.lastName', 'emergencyContact.lastName'],
      ['emergencyContact.phoneNumber', 'emergencyContact.phoneNumber'],
      ['emergencyContact.relationship', 'emergencyContact.relationship'],

      // Experience
      ['school', 'school'],
      ['study', 'program'],
      ['level', 'levelOfStudy'],
      ['hackathons', 'hackathonsAttended'],
      ['canDistribute', 'resumeSharePermission'],
      ['github', 'githubLink'],
      ['portfolio', 'portfolioLink'],
      ['linkedin', 'linkedinLink'],
      ['project', 'projectEssay'],

      // At Ht6
      ['interest', 'requestedWorkshops'],
      ['whyHT6', 'whyHT6Essay'],
      ['creative', 'creativeResponseEssay'],
      ['mlh', 'mlhCOC'],
      ['mlhEmail', 'mlhEmail'],
      ['mlhShare', 'mlhData'],
    ],
    values
  );

  // Apply some special rules
  const workshops = values.interest ?? [];
  if (values.otherInterest)
    workshops.push(values.otherInterest.replace(/ *, */g, ','));
  serializedData.requestedWorkshops = workshops.join(',');

  // ! Missing following fields for this year
  // phoneNumber, pronouns
  return {
    ...serializedData,
    phoneNumber: serializedData.phoneNumber,
  };
}

export function deserializeApplication(
  values: ServerApplication,
  enums: ApplicationEnumType
): ClientApplication {
  let deserializedData = {
    // Apply initialValues
    ...about,
    ...experience,
    ...atHt6,
    ...remap(
      [
        // About you
        ['phoneNumber', 'phone'],
        ['emailConsent', 'canEmail'],
        ['gender', 'gender'],
        ['pronouns', 'pronouns'],
        ['ethnicity', 'ethnicity'],
        ['shirtSize', 'size'],
        ['city', 'city'],
        ['province', 'province'],
        ['country', 'country'],
        ['emergencyContact.firstName', 'emergencyContact.firstName'],
        ['emergencyContact.lastName', 'emergencyContact.lastName'],
        ['emergencyContact.phoneNumber', 'emergencyContact.phoneNumber'],
        ['emergencyContact.relationship', 'emergencyContact.relationship'],

        // Experience
        ['school', 'school'],
        ['program', 'study'],
        ['levelOfStudy', 'level'],
        ['hackathonsAttended', 'hackathons'],
        ['resumeSharePermission', 'canDistribute'],
        ['githubLink', 'github'],
        ['portfolioLink', 'portfolio'],
        ['linkedinLink', 'linkedin'],
        ['projectEssay', 'project'],

        // At Ht6
        ['whyHT6Essay', 'whyHT6'],
        ['creativeResponseEssay', 'creative'],
        ['mlhCOC', 'mlh'],
        ['mlhEmail', 'mlhEmail'],
        ['mlhData', 'mlhShare'],
      ],
      values
    ),
  };

  // Apply special rules

  if (values.resumeFileName && values.friendlyResumeFileName) {
    deserializedData.resume = values.friendlyResumeFileName as any;
  }

  return deserializedData;
}
