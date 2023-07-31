import cx from "classnames";
import {RiMenuLine, RiCloseLine} from 'react-icons/ri';
import { Typography } from '@ht6/react-ui/dist/esm';
import {HTMLAttributes, useState} from 'react';

import { ReactComponent as Logo } from '../../assets/logo.svg';
import Section from '../Section';

import styles from './Layout.module.scss';
import {useNavigationManager} from "../NavigationManager/context";
import {Button} from "@ht6/react-ui";
import useAuth from "../Authentication/context";

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {}

function Layout({ children }: LayoutProps) {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const authCtx = useAuth();
  const navigationManager = useNavigationManager();

  let formattedEndDate = "";
  let shortFormattedEndDate = "";

  if(authCtx.isAuthenticated) {
      formattedEndDate = new Intl.DateTimeFormat('en', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
      }).format(authCtx.user.computedApplicationDeadline);

      shortFormattedEndDate = new Intl.DateTimeFormat('en', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
      }).format(authCtx.user.computedApplicationDeadline);
  }

  return (
    <div className={styles.root}>
      <Section
        containerClassName={cx(styles.nav, navOpen && styles.mobileNavOpenGrow)}
        className={styles.content}
        type='page'
        as='nav'
      >
        <div className={styles.top}>
          <div className={styles.navLogoWrapper}>
              <Logo width='24' />
              {
                  navigationManager.navBottomMode === "ApplicationStatus" &&
                  <div className={cx(styles.navMobileStatus)}>
                      <div className={cx(styles.navBottomInfoContainer)}>
                          <Typography
                              textType={"heading4"}
                              as={"h4"}
                          >
                              App Status: <Typography
                              textType={"heading4"}
                              as={"span"}
                              textColor={authCtx.isAuthenticated && authCtx.user.status.applied ? "success" : "error-500"}
                          >
                              {authCtx.isAuthenticated && authCtx.user.status.applied ? "Submitted" : "Not Submitted"}
                          </Typography>
                          </Typography>
                      </div>
                      <div className={cx(styles.navBottomInfoContainer)}>
                          <Typography
                              textType={"heading4"} as={"h4"}
                          >
                              Apps Close: <Typography
                              textType={"heading4"}
                              as={"span"}
                              textColor={"warning-400"}
                          >
                              {shortFormattedEndDate}
                          </Typography>
                          </Typography>

                      </div>
                  </div>
              }
          </div>
            <Button
                icon={navOpen ? <RiCloseLine /> : <RiMenuLine />}
                iconOnly={true}
                buttonVariant={"tertiary"}
                className={cx(styles.navMobileControl)}
                onClick={() => setNavOpen((old) => !old)}
            ></Button>
        </div>
        <div className={cx(styles.navBtnContainer, navOpen && styles.mobileNavOpenDisplay)}>
          {
              navigationManager.navigationEntries.map((entry, idx) => {
                  return (
                      <Button
                          buttonVariant={"tertiary"}
                          onClick={() => {
                              navigationManager.onNavigation?.current(entry);
                              setNavOpen(false);
                          }}
                          className={cx(styles.navBtn, (navigationManager.activeEntry === idx) && styles.selectedNavBtn)}
                      >
                          {entry.text}
                      </Button>
                  )
              })
          }
        </div>

          <div className={cx(styles.navBottomContainer, navOpen && styles.mobileNavOpenDisplay)}>
              <div className={cx(styles.navBottomContent)}>
                  {
                      navigationManager.navBottomMode === "ApplicationStatus" &&
                      <>
                          <div className={cx(styles.navBottomInfoContainer)}>
                              <Typography
                                  textType={"heading5"}
                                  as={"h5"}
                              >
                                  Application Status:
                              </Typography>
                              <Typography
                                  textType={"heading5"}
                                  as={"h5"}
                                  textColor={authCtx.isAuthenticated && authCtx.user.status.applied ? "success" : "error-500"}
                              >
                                  {authCtx.isAuthenticated && authCtx.user.status.applied ? "Submitted" : "Not Submitted"}
                              </Typography>
                          </div>
                          <div className={cx(styles.navBottomInfoContainer)}>
                              <Typography
                                  textType={"heading5"} as={"h5"}
                              >
                                  Applications Close:
                              </Typography>
                              <Typography
                                  textType={"heading5"}
                                  as={"h5"}
                                  textColor={"warning-400"}
                              >
                                  {formattedEndDate}
                              </Typography>
                          </div>
                      </>
                  }
              </div>
              <Button
                  buttonVariant={"secondary"}
                  className={cx(styles.logoutBtn)}
                  onClick={() => authCtx.revokeAuth(true)}
                  >
                  Log Out
              </Button>
              <Button
                  buttonVariant={"secondary"}
                  className={cx(styles.logoutBtn)}
                  onClick={() => console.log(authCtx)}
                  >
                  Testing
              </Button>
          </div>


      </Section>
      <div className={cx(styles.appContainer, navOpen && styles.mobileNavOpenHidden)}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
