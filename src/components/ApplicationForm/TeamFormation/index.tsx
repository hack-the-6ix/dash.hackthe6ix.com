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

function InitScreen({ onNext }: TeamFormationProps) {
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

  const firstName = authCtx.user.firstName;

  return (
    <>
      <Typography textColor='neutral-400' textType='heading3' as='h3'>
        Hi {firstName}! 
      </Typography>
      <Typography textColor='neutral-50' textType='heading2' as='h2'>
        You are currently a solo hacker.
      </Typography>
      <Typography textColor='neutral-50' textType='heading6' as='p' className={styles.teamFormationDescription}>
        Don't have a team? No worries! You can create your own team and invite your friends, join a team, or decide to go solo. You can change this at any point before applications close.
      </Typography>
      <div className={styles.buttons}>
        <Button
          disabled={isLoading}
          onClick={() => setShowJoin(true)}
          type='button'
          buttonVariant='secondary'
        >
          Join a team
        </Button>
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
          Create a team
        </Button>
        <ApplicationFooter
          className={styles.continueSoloBtn}
          rightAction={{
            ...onNext,
            children: 'Continue solo →',
            disabled: isLoading,
          }}
      />
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
  const [leaveModal, setLeaveModal] = useState(false);

  if (!authCtx.isAuthenticated) {
    return null;
  }

  const isOwner = team?.memberNames[0] === authCtx.user.fullName;

  const toggleLeaveModal = () => {
    setLeaveModal(!leaveModal);
  };

  // TODO: Override Layout Root styles to create background overlay
  // Change classes that apply to the Root to make the background overlay style
  // if(leaveModal) {
  //   document.body.classList.add('active-modal')
  // } else {
  //   document.body.classList.remove('active-modal')
  // }

  return (
    <>
      <div className={styles.teamScreenContainer}>
        <Typography textColor='neutral-50' textType='heading2' as='h2'>
          {isOwner ? 'Your team has been created!' : 'You have joined a team!'}
        </Typography>
        <div className={styles.teamScreenContent}>
          <div>
            <Typography
              className={styles.title}
              textColor='neutral-50'
              textType='heading4'
              as='h4'
            >
              Team Code
            </Typography>
            <Typography
              className={sharedStyles.items}
              textColor='warning-400'
              textType='heading6'
              as='ul'
            >
              <li>{team?.code}</li>
            </Typography>
          </div>
          <div>
            <Typography
              className={styles.title}
              textColor='neutral-50'
              textType='heading4'
              as='h4'
            >
              Members
            </Typography>
            <Typography
              className={sharedStyles.items}
              textColor='neutral-50'
              textType='heading6'
              as='ul'
            >
              {team?.memberNames.map((member, key) => (
                <li key={key}>{member}</li>
              ))}
            </Typography>
          </div>
        </div>
      </div>
      <ApplicationFooter
        className={styles.footer}
        leftAction={{
          children: 'Leave team',
          disabled: isLoading,
          onClick: async () => { // TODO: hook this into a confirmation modal
              const res = await leaveTeam({ method: 'POST' });
              if (res?.status !== 200) return;
              setTeam(null);
          },
        }}
        rightAction={{
          ...onNext,
          children: 'Save & continue',
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
      <div className={styles.joinScreenContainer}>
        <Typography textColor='neutral-50' textType='heading2' as='h2'>
          Join a Team
        </Typography>
        <Typography textColor='neutral-50' textType='heading6' as='p'>
          Already have a team code? Enter it below!
        </Typography>
        <div className={styles.join}>
          <Input
            onChange={(e) => setCode(e.currentTarget.value)}
            placeholder='Enter team code'
            outlineColor='primary-700'
            label='Team Code'
            value={code}
            name='code'
            required
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
            className={styles.joinBtn}
            type='button'
          >
            Join Team
          </Button>
        </div>
      </div>
      <ApplicationFooter
        className={styles.footer}
        leftAction={{
          children: '← Back',
          disabled: isLoading,
          onClick: () => setShowJoin(false),
          buttonVariant:'tertiary'
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
            <InitScreen onNext={onNext} />
          )}
        </div>
      )}
    </TeamContext.Provider>
  );
}

export default TeamFormation;
