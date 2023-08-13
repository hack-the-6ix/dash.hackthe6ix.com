import {ReactElement, useEffect, useState} from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import TabSection, { Tab } from '../../components/TabSection';
import HackerInfo from './HackerInfo';
import Resources from './Resources';
import Schedule from './Schedule';

import styles from './Dashboard.module.scss';
import {useNavigationManager} from "../../components/NavigationManager/context";

const tabs: (Omit<Tab, 'element'> & {
  element: ReactElement;
  id: string;
})[] = [
  {
    label: <span>Hacker Info</span>,
    element: <HackerInfo />,
    id: 'hacker-info',
  },
  {
    label: <span>Resources</span>,
    element: <Resources />,
    id: 'resources',
  },
  {
    label: <span>Schedule</span>,
    element: <Schedule/>,
    id: 'schedule',
  },
];

function DashboardContent() {
  const navigate = useNavigate();
  const authCtx = useAuth();
  const location = useLocation();
  const navigationManager = useNavigationManager();

  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });

  const [needToUpdateNav, setNeedToUpdateNav] = useState<number>(-1);

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

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

  useEffect(() => {
    navigationManager.takeoverNavigation("dashboard", "None", [{
      id: "hacker-info",
      text: "Hacker Info",
      data: 0
    },
      {
        id: "resources",
        text: "Resources",
        data: 1
      },
      {
        id: "schedule",
        text: "Schedule",
        data: 2
      }], (entry) => {
      setNeedToUpdateNav(entry.data);
    })
  }, [navigationManager]);

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const userConfirmed = authCtx.user.status.confirmed;
  const firstName = authCtx.user.firstName;

  if (!userConfirmed) {
    return <Navigate replace to='/' />;
  }

  return (
    <main className={styles.root}>
      <TabSection
        onChange={(_, idx) => {
          updateUrl(idx);
        }}
        value={selected}
        type=""
        tabs={tabs}
      />
    </main>
  );
}

function Dashboard() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}

export default Dashboard;
