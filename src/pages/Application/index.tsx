import { Button, Checkbox, Typography } from '@ht6/react-ui';
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
import InfoBanner, {InfoBannerProps} from '../../components/InfoBanner';
import TabSection, { Tab } from '../../components/TabSection';
import { ServerResponse, useRequest } from '../../utils/useRequest';
import InfoPage from './InfoPage';
import { deserializeApplication, serializeApplication } from './helpers';

import styles from './Application.module.scss';
import {useNavigationManager} from "../../components/NavigationManager/context";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

interface TabContentProps<T> {
  element: FC<any>;
  formik?: FormikProps<T>;
  footerProps?: ApplicationFooterProps;
  message?: ReactNode;
  messageBannerType?: InfoBannerProps['type'];
  readonly?: boolean;
}
function TabContent<T>({
  element: Element,
  footerProps,
  message,
  formik,
  messageBannerType,
  readonly,
}: TabContentProps<T>) {
  return (
    <>
      {message && (
        <InfoBanner className={styles.banner} children={message} type={messageBannerType ?? "error"} />
      )}
      <Element {...formik} readonly={readonly} />
      {footerProps && (
        <ApplicationFooter className={styles.footer} {...footerProps} />
      )}
    </>
  );
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
  const { makeRequest: rsvp, isLoading } =
    useRequest<ServerResponse>('/api/action/rsvp');
  const { abort, makeRequest } = useRequest<ServerResponse<string>>(
    '/api/action/updateapp'
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const [formattedApplicationEndDate, setFormattedApplicationEndDate] = useState({
    date: "Loading...",
    time: "Loading..."
  });
  const [userIsApplied, setUserIsApplied] = useState(false);

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

  const [needToUpdateNav, setNeedToUpdateNav] = useState(-1);

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

  useEffect(() => {
    if(settingsData?.message) {
      const applicationSettings = settingsData?.message as any;
      const applicationDeadline = applicationSettings?.[0]?.universe?.public?.globalApplicationDeadline;

      setFormattedApplicationEndDate({
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
      });
    }
  }, [settingsData]);

  useEffect(() => {
    setUserIsApplied(authCtx.isAuthenticated && authCtx.user.status.applied);
  }, [authCtx]);

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
        } else {
          toast.error(res?.message ?? 'Unexpected error submitting application.', {
            id: 'application',
          });
        }
      }, 500);
    },
  });


  const generatePageStates = (values = formik.values) => {
    const pagesIsValid = tabs.map(
      (tab) => tab.module?.validate.isValidSync(values) ?? true
    );

    return pagesIsValid.map((_, i) => {
      const hasPageErrors = !pagesIsValid.slice(0, i).every(Boolean);
      return {
        readonly: hasPageErrors || userIsApplied,
        messageBannerType: userIsApplied ? 'warning' : 'error',
        message: hasPageErrors ? (
          <>
            <Typography textType='heading4' textColor='copy-light' as='h3'>
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
        ) : (userIsApplied ? <>
          <Typography textType='heading4' textColor='warning-400' as='h3'>
            Your application has been submitted.
          </Typography>
          <Typography textType='paragraph2' textColor='warning-400' as='p'>
            The Hack the 6ix team will review your application soon. Keep an eye on your inbox for your application results!
          </Typography>
          <br />
          <Typography textType='paragraph2' textColor='warning-400' as='p'>
            Updates can be made to your teams until {formattedApplicationEndDate.date}. While you aren't able to make any more edits, you can still review your submission details below.
          </Typography>
        </> : null),
      };
    });
  };

  const [pageStates, setPageStates] = useState<PageState[]>(generatePageStates);

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

    setPageStates(generatePageStates());

    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    navigationManager.setActiveEntry(idx);
    setSelected(idx);
  };

  useEffect(() => {
    if(needToUpdateNav !== -1) {
      updateUrl(needToUpdateNav);
      setNeedToUpdateNav(-1);
    }
  }, [needToUpdateNav]);

  const showApplication = authCtx.isAuthenticated &&
      !authCtx.user.status.confirmed &&
      !authCtx.user.status.canRSVP &&
      !authCtx.user.status.declined &&
      !authCtx.user.status.waitlisted &&
      !authCtx.user.status.rejected &&
      (authCtx.user.status.canApply || authCtx.user.status.applied); // TODO: handle past confirmation/waitlist deadline

  useEffect(() => {
    navigationManager.takeoverNavigation("application", showApplication ? "ApplicationStatus" : "None", showApplication ? [{
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
      }] : [{
      id: "home",
      text: "Home",
      data: 0
    }], (entry) => {
      if(showApplication) {
        setNeedToUpdateNav(entry.data);
      }
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

  if(!showApplication) {
    if (!authCtx.isAuthenticated) {
      return null;
    }

    if (authCtx.user.status.accepted) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <Typography textType='heading3' textColor='neutral-400' as='p'>
              Welcome Back, {authCtx.user.firstName}!
            </Typography>
            <Typography textType='heading2' textColor='neutral-50' as='p'>
              Congratulations, you've been <span className={styles.textsuccess}>accepted</span> 🎉
            </Typography>
            <div style={{height: 35}}/>
            <Typography textType='heading6' textColor='neutral-50' as='p'>
              Welcome to Hack the 6ix 2023! We are excited to offer you the opportunity to hack with us. 
            </Typography>
            <div style={{height: 25}}/>
            <Typography textType='heading6' textColor='neutral-50' as='p'>
              To confirm your attendance, please RSVP below.
            </Typography>
            <div style={{height: 20}}/>
            <div className={styles.buttoncontainer}>
              <div className={styles.button}>
              <Button
                  buttonVariant={"secondary"}
                  onClick={()=>{}}
                  // TODO: IMPLEMENT
                  >
                  I can no longer attend
              </Button>
              </div>
              <div className={styles.button}>
               <div style={{width:20}}/>
              </div>
              <div className={styles.button}>
              <Button
                  buttonVariant={"primary"}
                  onClick={()=>{}}
                  // TODO: IMPLEMENT
                  >
                  Accept invitation
              </Button>
              </div>
            </div>
          </div>
        </div>
    );
    }

    if (authCtx.user.status.confirmed) {
      return <Navigate to='/home' replace />;
    }

    if (authCtx.user.status.declined) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <Typography textType='heading3' textColor='neutral-400' as='p'>
               Bye, {authCtx.user.firstName}!
            </Typography>
            <Typography textType='heading2' textColor='neutral-50' as='p'>
              We're sad to see you go :(
            </Typography>
            <div style={{height: 30}}/>
            <Typography textType='heading6' textColor='neutral-50' as='p'>
            Thank you for letting us know you will no longer be attending Hack The 6ix 2023. 
            </Typography>
            <div style={{height: 10}}/>
            <Typography textType='heading6' textColor='neutral-50' as='p'>
              We hope to see you next year!
            </Typography>
            <div style={{height: 40}}/>
            <div className={styles.socials}>
              <hr />
              <div style={{height: 15}}/>
              <Typography textType='paragraph' textColor='neutral-50' as='p'>
              In the mean time, let's stay connected:
              </Typography>
              <div className={styles.buttoncontainer}>
                <div className={styles.icon}>
                  <a href="https://www.facebook.com/Hackthe6ix/">
                  <FaFacebook size={20} className={styles.whiteicon}/>
                  </a>
                </div>
                <div className={styles.icon}>
                  <a href="https://www.instagram.com/hackthe6ix/">
                  <FaInstagram size={20} className={styles.whiteicon} />
                  </a>
                </div>
                <div className={styles.icon}>
                  <a href="https://www.linkedin.com/company/hackthe6ixofficial/">
                  <FaLinkedin size={20} className={styles.whiteicon}/>
                  </a>
                </div>
                <div className={styles.icon}>
                  <a href="https://twitter.com/HackThe6ix">
                  <FaTwitter size={20} className={styles.whiteicon}/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (authCtx.user.status.waitlisted) {
      return (
        <div className={styles.container}>
        <div className={styles.content}>
          <Typography textType='heading3' textColor='neutral-400' as='p'>
            Welcome Back, {authCtx.user.firstName}!
          </Typography>
          <Typography textType='heading2' textColor='neutral-50' as='p'>
            You have been placed on the <span className={styles.textwarning}>waitlist</span>
          </Typography>
          <div style={{height: 35}}/>
          <Typography textType='heading6' textColor='neutral-50' as='p'>
          We received an overwhelming amount of applications this year and have placed you on the waitlist. We’ll let you know if a spot opens up, so make sure to check your inbox! 
          </Typography>
          <div style={{height: 30}}/>
          <Typography textType='heading6' textColor='neutral-50' as='p'>
          Have a question? Feel free to reach out to us!
          </Typography>
          <div style={{height: 20}}/>
          <div className={styles.buttoncontainer}>
            <div className={styles.button}>
            <Button
                buttonVariant={"primary"}
                onClick={()=>{}}
                >
                E-mail HT6
                {/* TODO: IMPLEMENT */}
            </Button>
            </div>
          </div>
          <div style={{height: 20}} />
          <a href ="/">
            <Typography>
            <span className={styles.greylink}>{'Review my application ->'}</span> 
            {/* TODO: IMPLEMENT */}
            </Typography>
          </a>
        </div>
      </div>
      );
    }

    if (authCtx.user.status.rejected) {
      return (
        <div className={styles.container}>
        <div className={styles.content}>
          <Typography textType='heading3' textColor='neutral-400' as='p'>
            Welcome Back, {authCtx.user.firstName}!
          </Typography>
          <Typography textType='heading2' textColor='neutral-50' as='p'>
            Unfortunately, your hacker <br/> application has <span className={styles.texterror}>not been selected</span> :(
          </Typography>
          <div style={{height: 35}}/>
          <Typography textType='heading6' textColor='neutral-50' as='p'>
          Thank you for your enthusiasm and dedication in applying to Hack the 6ix 2023. We received an overwhelming number of applications and after careful consideration, we regret to inform you that your application was not chosen for this year's hackathon. We strongly encourage you to try again next year.
          </Typography>
          <div style={{height: 30}}/>
          <Typography textType='heading6' textColor='neutral-50' as='p'>
          Have a question? Feel free to reach out to us!
          </Typography>
          <div style={{height: 20}}/>
          <div className={styles.buttoncontainer}>
            <div className={styles.button}>
            <Button
                buttonVariant={"primary"}
                onClick={()=>{}}
                >
                E-mail HT6
                {/* TODO: IMPLEMENT */}
            </Button>
            </div>
          </div>
          <div style={{height: 20}} />
          <a href ="/">
            <Typography>
            <span className={styles.greylink}>{'Review my application ->'}</span> 
            {/* TODO: IMPLEMENT */}
            </Typography>
          </a>
        </div>
      </div>
      );
    }

    if (!authCtx.user.status.canApply && !authCtx.user.status.applied) {
      const tooEarly = authCtx.user.computedApplicationOpen > new Date().getTime();
      const formattedOpenDate = new Intl.DateTimeFormat('en', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(authCtx.user.computedApplicationOpen);

      return (
          <InfoPage
              heading={tooEarly ? 'Applications are not yet open!' : 'Applications are closed!'}
              content={
                <>
                  {tooEarly ?
                      <Typography textType='paragraph1' textColor='copy-light' as='p'>
                        Thank you for your interest in Hack the 6ix! Applications aren't
                        open yet, though. Come back on <strong>{formattedOpenDate}</strong> to start
                        your application!
                      </Typography> :
                      <Typography textType='paragraph1' textColor='copy-light' as='p'>
                        Thank you for your interest in Hack the 6ix! Unfortunately,
                        applications are now closed. We hope to see you next year!
                      </Typography>
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
  }

  if (showCompleted) {
    return (
        <InfoPage
            heading='Application Submitted!'
            content={
              <>
                <Typography textType='paragraph1' textColor='copy-light' as='p'>
                  Thank you for completing the application! You will receive an
                  email confirmation soon.
                </Typography>
                <Typography textType='paragraph1' textColor='copy-light' as='p'>
                  We will send your application results to your email within a few
                  weeks.
                </Typography>
              </>
            }
            action={{
              rightAction: {
                children: 'Back to Home',
                onClick: () => {
                  authCtx.user.status.applied = true;
                  setUserIsApplied(true);
                  setShowCompleted(false);
                  updateUrl(0);
                }
              },
            }}
        />
    );
  }

  return (
    <main>
      <form onSubmit={formik?.handleSubmit} className={styles.root} noValidate>
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
                          disabled: userIsApplied,
                          onClick() {
                            updateUrl(key - 1);
                          },
                          children: 'Back',
                        },
                    rightAction: {
                      disabled: userIsApplied,
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
