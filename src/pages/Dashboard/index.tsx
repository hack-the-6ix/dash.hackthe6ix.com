import { ReactElement, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import Protected from '../../components/Authentication/Protected';
import useAuth from '../../components/Authentication/context';
import HeadingSection from '../../components/HeadingSection';
import TabSection, { Tab } from '../../components/TabSection';
import HackerInfo from './HackerInfo';
import Resources from './Resources';
import Schedule from './Schedule';

import styles from './Dashboard.module.scss';

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

  const [selected, setSelected] = useState(() => {
    const { hash } = location;
    const idx = tabs.findIndex((tab) => hash === `#${tab.id}`);
    return idx < 0 ? 0 : idx;
  });

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const userConfirmed = authCtx.user.status.confirmed;
  const firstName = authCtx.user.firstName;

  const updateUrl = (idx: number) => {
    const tab = tabs[idx];
    if (!tab) return;

    navigate(`${location.pathname}#${tab.id}`, { replace: true });
    setSelected(idx);
  };

  if (!userConfirmed) {
    return <Navigate replace to='/' />;
  }

  return (
    <main className={styles.root}>
      <HeadingSection
        title={`Welcome back, ${firstName}!`}
        action={{
          onClick: async () => {
            await authCtx.revokeAuth();
            navigate('/');
          },
          children: 'Sign Out',
        }}
        textType='heading2'
        as='h2'
      />
      <TabSection
        onChange={(_, idx) => {
          updateUrl(idx);
        }}
        value={selected}
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
