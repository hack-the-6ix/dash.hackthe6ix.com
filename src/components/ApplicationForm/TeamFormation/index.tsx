import { Button, Input, Typography } from '@ht6/react-ui';
import cx from 'classnames';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ServerResponse, useRequest } from '../../../utils/useRequest';
import ApplicationFooter, {
  ApplicationFooterProps,
} from '../../ApplicationFooter';
import useAuth from '../../Authentication/context';
import { useConfig } from '../../Configuration/context';

import sharedStyles from '../ApplicationForm.module.scss';
import styles from './TeamFormation.module.scss';

type Team = {
  code: string;
  memberNames: string[];
};

type TeamServerResponse = ServerResponse<Team>;

interface TeamFormationProps {
  onNext: Omit<ApplicationFooterProps['rightAction'], 'children'>;
}

const TeamContext = createContext<{
  team: Team | null;
  setTeam: Dispatch<SetStateAction<Team | null>>;
  showJoin: boolean;
  setShowJoin: Dispatch<SetStateAction<boolean>>;
}>({
  team: null,
  setTeam: () => {},
  showJoin: false,
  setShowJoin: () => {},
});

function InitScreen() {
  const { setShowJoin, setTeam } = useContext(TeamContext);
  const { teamFormationEndDate } = useConfig();
  const authCtx = useAuth();
  const { makeRequest: makeTeam, isLoading } = useRequest<TeamServerResponse>(
    '/api/action/createTeam'
  );

  const formattedDate = new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(teamFormationEndDate);
  const formattedTime = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'est',
  }).format(teamFormationEndDate);

  if (!authCtx.isAuthenticated) {
    return null;
  }

  return (
    <>
      <Typography textColor='primary-3' textType='heading2' as='h2'>
        You're currently not on a team.
      </Typography>
      <Typography textColor='copy-dark' textType='heading4' as='p'>
        Don't have a team? No worries! You can go solo or decide after
        submitting your application. Just remember to do so before{' '}
        {formattedDate} at {formattedTime} EST.
      </Typography>
      <div className={styles.buttons}>
        <Button
          disabled={isLoading}
          onClick={async () => {
            const res = await makeTeam({ method: 'POST' });
            if (res?.status !== 200) return;

            setTeam({
              memberNames: res.message.memberNames,
              code: res.message.code,
            });
          }}
          type='button'
        >
          Create Team
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => setShowJoin(true)}
          type='button'
        >
          Join Team
        </Button>
      </div>
    </>
  );
}

function TeamScreen({ onNext }: TeamFormationProps) {
  const { team, setTeam } = useContext(TeamContext);
  const { makeRequest: leaveTeam, isLoading } = useRequest<
    ServerResponse<string>
  >('/api/action/leaveTeam');
  const authCtx = useAuth();

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const isOwner = team?.memberNames[0] === authCtx.user.fullName;

  return (
    <>
      <Typography textColor='primary-3' textType='heading2' as='h2'>
        {isOwner ? 'Your team has been created!' : 'You have joined a team!'}
      </Typography>
      <Typography
        className={styles.title}
        textColor='primary-3'
        textType='heading3'
        as='h3'
      >
        Team Code
      </Typography>
      <Typography
        className={sharedStyles.items}
        textColor='copy-dark'
        textType='heading4'
        as='ul'
      >
        <li>{team?.code}</li>
        <li>Teammates can join by entering the Team Code above.</li>
      </Typography>
      <Typography
        className={styles.title}
        textColor='primary-3'
        textType='heading3'
        as='h3'
      >
        Members
      </Typography>
      <Typography
        className={sharedStyles.items}
        textColor='copy-dark'
        textType='heading4'
        as='ul'
      >
        {team?.memberNames.map((member, key) => (
          <li key={key}>{member}</li>
        ))}
      </Typography>
      <ApplicationFooter
        className={styles.footer}
        leftAction={{
          children: 'Leave Team',
          disabled: isLoading,
          onClick: async () => {
            const res = await leaveTeam({ method: 'POST' });
            if (res?.status !== 200) return;
            setTeam(null);
          },
        }}
        rightAction={{
          ...onNext,
          children: 'Save & Continue',
          disabled: isLoading,
        }}
      />
    </>
  );
}

function JoinScreen() {
  const { setTeam, setShowJoin } = useContext(TeamContext);
  const [code, setCode] = useState('');
  const authCtx = useAuth();
  const { makeRequest: joinTeam, isLoading } = useRequest<TeamServerResponse>(
    '/api/action/joinTeam'
  );

  if (!authCtx.isAuthenticated) {
    return null;
  }

  return (
    <>
      <Typography textColor='primary-3' textType='heading2' as='h2'>
        Join Team
      </Typography>
      <Typography textColor='copy-dark' textType='heading4' as='p'>
        Already have a code? Enter it below to join!
      </Typography>
      <div className={styles.join}>
        <Input
          onChange={(e) => setCode(e.currentTarget.value)}
          placeholder='Enter team code'
          outlineColor='primary-3'
          label='Team Code'
          value={code}
          name='code'
        />
        <Button
          onClick={async () => {
            const res = await joinTeam({
              method: 'POST',
              body: JSON.stringify({
                teamCode: code,
              }),
            });

            if (res?.status !== 200) return;
            setTeam({
              memberNames: res.message.memberNames,
              code: res.message.code,
            });

            setShowJoin(false);
          }}
          disabled={!code || isLoading}
          className={styles.joinBtn}
          buttonVariant='outline'
          type='button'
        >
          Join Team
        </Button>
      </div>
      <ApplicationFooter
        className={styles.footer}
        leftAction={{
          children: 'Back',
          disabled: isLoading,
          onClick: () => setShowJoin(false),
        }}
      />
    </>
  );
}

function TeamFormation({ onNext }: TeamFormationProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [showJoin, setShowJoin] = useState(false);
  const authCtx = useAuth();
  const { makeRequest: getTeam, isLoading } = useRequest<TeamServerResponse>(
    '/api/action/getTeam'
  );

  useEffect(() => {
    if (!authCtx.isAuthenticated) return;
    getTeam().then((res) => {
      if (!res || res.status === 403) return;
      setTeam({
        memberNames: res.message.memberNames,
        code: res.message.code,
      });
    });
  }, [getTeam, authCtx]);

  return (
    <TeamContext.Provider
      value={{
        setShowJoin,
        showJoin,
        setTeam,
        team,
      }}
    >
      {isLoading ? null : (
        <div
          className={cx(
            sharedStyles['field--full-width'],
            showJoin && styles['root--left'],
            styles.root
          )}
        >
          {team?.code ? (
            <TeamScreen onNext={onNext} />
          ) : showJoin ? (
            <JoinScreen />
          ) : (
            <InitScreen />
          )}
        </div>
      )}
    </TeamContext.Provider>
  );
}

export default TeamFormation;
