import { Checkbox, Typography } from '@ht6/react-ui';
import { FormikProps, useFormik, yupToFormErrors } from 'formik';
import {
  FC,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import ApplicationFooter, {
  ApplicationFooterProps,
} from '../../components/ApplicationFooter';
import {
  ApplicationDataProvider, ApplicationEnumType,
  useApplicationData,
} from '../../components/ApplicationForm';
import * as About from '../../components/ApplicationForm/About';
import * as AtHt6 from '../../components/ApplicationForm/AtHt6';
import * as Experience from '../../components/ApplicationForm/Experience';
import * as TeamFormation from '../../components/ApplicationForm/TeamFormation';
import { ApplicationModule } from '../../components/ApplicationForm/helpers';
import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import { useConfig } from '../../components/Configuration/context';
import HeadingSection from '../../components/HeadingSection';
import InfoBanner from '../../components/InfoBanner';
import TabSection, { Tab } from '../../components/TabSection';
import { ServerResponse, useRequest } from '../../utils/useRequest';
import InfoPage from './InfoPage';
import { deserializeApplication, serializeApplication } from './helpers';

import styles from './Application.module.scss';
import {useNavigationManager} from "../../components/NavigationManager/context";

interface TabContentProps<T> {
  element: FC<any>;
  formik?: FormikProps<T>;
  footerProps?: ApplicationFooterProps;
  message?: ReactNode;
  readonly?: boolean;
}
function TabContent<T>({
  element: Element,
  footerProps,
  message,
  formik,
  readonly,
}: TabContentProps<T>) {
  return (
    <>
      {message && (
        <InfoBanner className={styles.banner} children={message} type='error' />
      )}
      <Element {...formik} readonly={readonly} />
      {footerProps && (
        <ApplicationFooter className={styles.footer} {...footerProps} />
      )}
    </>
  );
}

interface BannerProps {
  message: React.ReactNode
}
function Banner({ message }: BannerProps) {
  return (
    <InfoBanner className={styles.banner} children={message} type='info'/>
  )
}

const tabs: (Omit<Tab, 'element'> & {
  element: ReactElement;
  module?: ApplicationModule;
  ref: string;
  id: string;
})[] = [
  {
    label: (
      <span>
        1<span className={styles.label}>. Team Formation</span>
      </span>
    ),
    element: <TabContent element={TeamFormation.default} />,
    id: 'team-formation',
    ref: 'team',
  },
  {
    label: (
      <span>
        2<span className={styles.label}>. About You</span>
      </span>
    ),
    module: About,
    element: <TabContent element={About.default} />,
    id: 'about-you',
    ref: 'about',
  },
  {
    label: (
      <span>
        3<span className={styles.label}>. Your Experience</span>
      </span>
    ),
    module: Experience,
    element: <TabContent element={Experience.default} />,
    id: 'your-experience',
    ref: 'experience',
  },
  {
    label: (
      <span>
        4<span className={styles.label}>. At HT6</span>
      </span>
    ),
    module: AtHt6,
    element: <TabContent element={AtHt6.default} />,
    id: 'at-ht6',
    ref: 'at',
  },
];

type PageState = {
  message?: ReactNode;
  readonly: boolean;
};

function ApplicationContent() {
  const [inPerson, setInPerson] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const { makeRequest: rsvp, isLoading } =
    useRequest<ServerResponse>('/api/action/rsvp');
  const { abort, makeRequest } = useRequest<ServerResponse<string>>(
    '/api/action/updateapp'
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const { enums } = useApplicationData();
  const authCtx = useAuth();
  const timer = useRef<number>();
  const { endDate } = useConfig();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationManager = useNavigationManager();

  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });

  // get application deadlines
  const { makeRequest: makeSettingsRequest, abort: settingsAbort, data: settingsData } = useRequest<
      ServerResponse<ApplicationEnumType>
  >('/api/action/applicationSettings');

  // useEffect(() => {
  //   navigationManager.setNavigationEntries([{
  //     id: "test",
  //     text: "adfasdf"
  //   }])
  //
  //   if(navigationManager.onNavigation) {
  //     navigationManager.onNavigation.current = (entry) => {
  //       console.log(entry)
  //     }
  //   }
  // }, [navigationManager]);

  useEffect(() => {
    makeSettingsRequest();
    return () => settingsAbort();
  }, [makeSettingsRequest, settingsAbort]);

  const applicationSettings = settingsData?.message ?? {} as any;
  const applicationDeadline = applicationSettings?.[0]?.universe?.public?.globalApplicationDeadline;

  const formattedApplicationEndDate = applicationDeadline ? {
    date:new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      timeZone: 'est',
    }).format(new Date(applicationDeadline)),
    time: new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'est',
    }).format(new Date(applicationDeadline))
  } : {
    date: "Loading...",
    time: "Loading..."
  };

  const isLast = selected === tabs.length - 1;

  const formik = useFormik({
    initialValues: {
      ...About.initialValues,
      ...Experience.initialValues,
      ...AtHt6.initialValues,
    },
    validateOnChange: false,
    validateOnBlur: false,
    async validate(values) {
      try {
        if (isLast) {
          await Promise.all(
            tabs.map((tab) =>
              tab.module?.validate.validate(values, {
                abortEarly: false,
              })
            )
          );
        } else {
          await tabs[selected].module?.validate.validate(values, {
            abortEarly: false,
          });
        }
      } catch (err) {
        return yupToFormErrors(err);
      }
    },
    async onSubmit(values) {
      window.clearTimeout(timer.current);
      abort();
      toast.loading(`${isLast ? 'Submitting' : 'Saving'} application...`, {
        id: 'application',
      });

      const [res, isValid] = await Promise.all([
        makeRequest({
          method: 'POST',
          body: JSON.stringify({
            application: serializeApplication(values),
            submit: isLast,
          }),
        }),
        tabs[selected].module?.validate.isValid(formik.values),
      ]);

      if ((res?.status ?? 500) < 399 && isValid && !isLast) updateUrl(selected + 1);

      timer.current = window.setTimeout(() => {
        if (res?.status === 200) {
          if(isLast) {
            setShowCompleted(true);
          }

          toast.success(`Application ${isLast ? 'Submitted' : 'Saved'}!`, {
            id: 'application',
          });

          if (isLast) {
            setReadOnly(true);
          }

        } else {
          toast.error(res?.message ?? 'Unexpected error submitting application.', {
            id: 'application',
          });
          setReadOnly(false);
        }
      }, 500);
    },
  });

  const readOnlyBannerMessage = "Your application has been submitted. The HT6 team will review your application soon. Keep an eye on your inbox for your application results! Updates can be made to your teams until July 21 at 11:59PM EST. While you aren’t able to make any more edits, you can still review your submission details below.";

  const generatePageStates = (values = formik.values) => {
    const pagesIsValid = tabs.map(
      (tab) => tab.module?.validate.isValidSync(values) ?? true
    );
    return pagesIsValid.map((_, i) => {
      const hasPageErrors = !pagesIsValid.slice(0, i).every(Boolean);
      return {
        readonly: hasPageErrors,
        message: hasPageErrors ? (
          <>
            <Typography textType='heading4' textColor='copy-dark' as='h3'>
              Please resolve the following pages before you submit.
            </Typography>
            <Typography className={styles.list} textType='heading4' as='ul'>
              {pagesIsValid.map((isValid, idx) =>
                !isValid && idx < i ? (
                  <li onClick={() => updateUrl(idx)} key={idx}>
                    {tabs[idx].label}
                  </li>
                ) : null
              )}
            </Typography>
          </>
        ) : null,
      };
    });
  };

  const [pageStates, setPageStates] = useState<PageState[]>(generatePageStates);

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

    setPageStates(generatePageStates());

    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    setSelected(idx);
  };

  useEffect(() => {
    navigationManager.takeoverNavigation("application", [{
      id: "team-formation",
      text: "1. Team Formation",
      data: 0
    },
      {
        id: "about-you",
        text: "2. About You",
        data: 1
      },
      {
        id: "your-experience",
        text: "3. Your Experience",
        data: 2
      },
      {
        id: "at-ht6",
        text: "4. At HT6",
        data: 3
      }], (entry) => {
      updateUrl(entry.data);
    })
  }, [navigationManager]);

  // Fetching application from user
  useEffect(() => {
    if (!authCtx.isAuthenticated) return;
    const payload = {
      ...deserializeApplication(authCtx.user.hackerApplication, enums),
      firstName: authCtx.user.firstName,
      lastName: authCtx.user.lastName,
      email: authCtx.user.email,
    };
    formik.initialValues = payload;
    formik.setValues(payload, false);
    setPageStates(generatePageStates(payload));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx, formik.setValues]);

  // Handling error stuff
  useEffect(() => {
    formik.setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, formik.setErrors]);

  const formattedDate = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    timeZone: 'est',
  }).format(endDate);
  const formattedTime = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'est',
  }).format(endDate);

  if (!authCtx.isAuthenticated) {
    return null;
  }

  if (authCtx.user.status.confirmed) {
    return <Navigate to='/home' replace />;
  }

  if (authCtx.user.status.canRSVP) {
    return (
      <InfoPage
        heading='Hacker Invitation'
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Congratulations and welcome to Hack the 6ix 2022! We are excited
              to offer you the opportunity to hack with us! To confirm your
              attendance, please RSVP below.
            </Typography>
            <Checkbox
              label='I would like to be notified through e-mail when in-person hacking RSVPs are open on August 14th at 1PM EST'
              onChange={(e) => setInPerson(!inPerson)}
              name='remind-in-person'
              checked={inPerson}
              color='primary-700'
            />
          </>
        }
        action={{
          rightAction: {
            children: 'Accept Invitation',
            disabled: isLoading,
            async onClick() {
              toast.loading('Updating RSVP...', { id: 'rsvp' });
              const res = await rsvp({
                method: 'POST',
                body: JSON.stringify({
                  rsvp: {
                    attending: true,
                    form: {
                      remindInPersonRSVP: inPerson,
                    },
                  },
                }),
              });

              if (res?.status !== 200) {
                toast.error(res?.message ?? 'Unexpected error accepting RSVP.', {
                  id: 'rsvp',
                });
              } else {
                toast.success('Attendance Accepted!', { id: 'rsvp' });
                authCtx.updateUser({
                  status: {
                    ...authCtx.user.status,
                    confirmed: true,
                  },
                })
                navigate('/home');
              }
            },
          },
          leftAction: {
            children: 'Decline',
            buttonVariant: 'tertiary',
            disabled: isLoading,
            async onClick() {
              toast.loading('Updating RSVP...', { id: 'rsvp' });
              const res = await rsvp({
                method: 'POST',
                body: JSON.stringify({
                  attending: false,
                }),
              });

              if (res?.status !== 200) {
                toast.error(res?.message ?? 'Unexpected error declining RSVP.', {
                  id: 'rsvp',
                });
              } else {
                toast.success('Attendance Declined :c', { id: 'rsvp' });
                window.location.reload();
              }
            },
          },
        }}
      />
    );
  }

  if (authCtx.user.status.declined) {
    return (
      <InfoPage
        heading='You have declined'
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              We're sorry to hear that you aren't able to attend Hack the 6ix
              this year. Thank you for applying and we hope to see you again
              next year!
            </Typography>
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            href: 'https://hackthe6ix.com',
            as: 'a',
          },
        }}
      />
    );
  }

  if (authCtx.user.status.waitlisted) {
    return (
      <InfoPage
        heading="You're on the waitlist"
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Thank you for your application for Hack the 6ix. We were very
              impressed with your application, resume, and accomplishments.
              However, due to the immense number of applications that we
              received this year, we are only able to offer you a conditional
              waitlist acceptance at this time.
            </Typography>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              We would love to see you at our event and you will be notified via
              e-mail as soon as more space opens up!
            </Typography>
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            href: 'https://hackthe6ix.com',
            as: 'a',
          },
        }}
      />
    );
  }

  if (authCtx.user.status.rejected) {
    return (
      <InfoPage
        heading='Application Status'
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Unfortunately, due to the overwhelming number of applications that
              we have received, we are not able to offer you admission to this
              year's hackathon. We know putting together an application takes
              time and effort, and we sincerely appreciate your interest.
            </Typography>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Thank you once again for your time and interest in Hack the 6ix;
              we wish you all the best and hope to see you next year!
            </Typography>
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            href: 'https://hackthe6ix.com',
            as: 'a',
          },
        }}
      />
    );
  }

  if (!authCtx.user.status.canApply) {
    const tooEarly = authCtx.user.computedApplicationOpen > new Date().getTime();
    const formattedOpenDate = new Intl.DateTimeFormat('en', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(authCtx.user.computedApplicationOpen);

    return (
      <InfoPage
        heading={tooEarly ? 'Applications are not yet open!' : (authCtx.user.status.applied ? 'Thanks for applying!' : 'Applications are closed!')}
        content={
          <>
            {tooEarly ?
                <Typography textType='paragraph1' textColor='copy-dark' as='p'>
                  Thank you for your interest in Hack the 6ix! Applications aren't
                  open yet, though. Come back on <strong>{formattedOpenDate}</strong> to start
                  your application!
                </Typography> :
                (authCtx.user.status.applied ?
                        <Typography textType='paragraph1' textColor='copy-dark' as='p'>
                          Thank you for applying to Hack the 6ix! Your application is
                          currently being reviewed by our team. Keep an eye on your
                          inbox within the next few weeks for your application results.
                        </Typography>
                        :
                        <Typography textType='paragraph1' textColor='copy-dark' as='p'>
                          Thank you for your interest in Hack the 6ix! Unfortunately,
                          applications are now closed. We hope to see you next year!
                        </Typography>
                )
            }
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            href: 'https://hackthe6ix.com',
            as: 'a',
          },
        }}
      />
    );
  }

  const userIsEligible = [
    !authCtx.user.status.rejected,
    !authCtx.user.status.declined,
    authCtx.user.status.applied,
    authCtx.user.status.isRSVPOpen,
  ].every(Boolean);

  if (showCompleted || userIsEligible) {
    return (
      <InfoPage
        heading='Application Submitted!'
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Thank you for completing the application! You will receive an
              email confirmation soon.
            </Typography>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              We will send your application results to your email within a few
              weeks.
            </Typography>
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            to: '/home',
            as: Link,
          },
        }}
      />
    );
  }

  if (!authCtx.user.status.canApply) {
    return (
      <InfoPage
        heading='Applications are now closed!'
        content={
          <>
            <Typography textType='paragraph1' textColor='copy-dark' as='p'>
              Thank you for applying to Hack the 6ix! Unfortunately applications
              are currently closed. We look forward to seeing you next year!
            </Typography>
          </>
        }
        action={{
          rightAction: {
            children: 'Back to Home',
            href: 'https://hackthe6ix.com',
            as: 'a',
          },
        }}
      />
    );
  }

  return (
    <main>
      {readOnly && <Banner message={readOnlyBannerMessage} />}
      <form onSubmit={ readOnly? undefined : formik?.handleSubmit} className={styles.root} noValidate>
        {/*<HeadingSection*/}
        {/*  title='Hacker Application'*/}
        {/*  description={`Applications close on ${formattedApplicationEndDate.date} at ${formattedApplicationEndDate.time}.*/}
        {/*    Your progress is saved after every step. Once you've submitted*/}
        {/*    your application, keep an eye on your inbox for your application results!`}*/}
        {/*  action={{*/}
        {/*    onClick: async () => {*/}
        {/*      await authCtx.revokeAuth();*/}
        {/*      navigate('/');*/}
        {/*    },*/}
        {/*    children: 'Sign Out',*/}
        {/*  }}*/}
        {/*  textType='heading1'*/}
        {/*  as='h1'*/}
        {/*/>*/}
        <TabSection
          onChange={(_, idx) => {
            updateUrl(idx);
          }}
          value={selected}
          tabs={tabs.map((tab, key) => {
            const isFirst = key === 1;
            const isLast = key + 1 === tabs.length;
            let tabProps;

            const sharedProps = {
              ...pageStates?.[key],
              formik,
            };

            switch (tab.ref) {
              case 'team':
                tabProps = {
                  ...sharedProps,
                  formik: {
                    ...formik,
                    onNext: {
                      onClick: () => updateUrl(key + 1),
                    },
                  } as any,
                };
                break;
              default:
                tabProps = {
                  ...sharedProps,
                  footerProps: {
                    leftAction: isFirst
                      ? undefined
                      : {
                          onClick() {
                            updateUrl(key - 1);
                          },
                          children: 'Back',
                        },
                    rightAction: {
                      children: isLast ? 'Save & Submit' : 'Save & Continue',
                      type: 'submit',
                    },
                  },
                };
                break;
            }

            return { ...tab, element: cloneElement(tab.element, tabProps) };
          })}
        />
      </form>
    </main>
  );
}

function Application() {
  return (
    <Protected>
      <ApplicationDataProvider>
        <ApplicationContent />
      </ApplicationDataProvider>
    </Protected>
  );
}

export default Application;
