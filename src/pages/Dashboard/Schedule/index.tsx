import { Typography } from "@ht6/react-ui";
import Airtable from "airtable";
import { useEffect, useState } from "react";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Calendar, { CalendarProps, ScheduleData } from "../../../components/Calendar";
import styles from './Schedule.module.scss';

type EventTypeRes = {
  Name: string;
  Color: `#${string}`;
  Events: string[];
  Hidden: boolean;
};

type EventRes = {
  Name: string;
  Platform: string;
  'HT6 Support': string;
  Start: string;
  End: string;
  Description: string;
  Host: string[];
  'Type of Event': string[];
  'Is Mentor added to Hopin session?': string[];
  Day: string;
  PlatformLink: string;
}

interface Event extends ScheduleData {
  location: string;
  name: string;
}

function parseDate(date: string) {
  const d = new Date(date);
  // Apply Toronto offset to fix GMT conversion
  d.setMinutes(d.getMinutes() + 240);
  return d;
}

const base = new Airtable({
  // By all means steal this, its readonly
  apiKey: process.env.REACT_APP_AIRTABLE_KEY,
}).base(process.env.REACT_APP_AIRTABLE_ID!);

function Schedule() {
  const [events, setEvents] = useState<Event[]>();
  const [types, setTypes] = useState<CalendarProps['categories']>();
  useEffect(() => {
    let mounted = true;
    Promise.all([
      base<EventTypeRes>('Type of Events').select({
        filterByFormula: 'NOT({Hidden} = TRUE())',
      }).all(),
      base<EventRes>('Events 2022').select({
        filterByFormula: 'NOT({Type of Event} = BLANK())',
        sort: [{ field: 'Start', direction: 'asc' }],
      }).all(),
    ]).then(([_types, _events]) => {
      if (!mounted) return;
      setTypes(_types.map(type => ({
        label: type.fields.Name,
        color: type.fields.Color,
        ref: type.id,
      })));
      setEvents(_events.map(event => ({
        category: event.fields["Type of Event"][0],
        location: event.fields["Platform"],
        start: parseDate(event.fields.Start),
        end: parseDate(event.fields.End),
        name: event.fields.Name,
      })));
    })
    return () => {
      mounted = false;
    }
  }, []);

  const timeFormat = new Intl.DateTimeFormat('en-CA', {
    minute: '2-digit',
    hour: 'numeric',
    hour12: true,
  });
  const formatTimeRange = (start: Date, end: Date) => {
    let s = timeFormat.format(start).replace(/[ .]/g, '').replace(':00', '');
    const e = timeFormat.format(end).replace(/[ .]/g, '').replace(':00', '');
    if (s.slice(-2) === e.slice(-2)) s = s.slice(0, -2);
    return `${s}-${e}`;
  }

  const isReady = types && events;
  return isReady ? (
    <div className={styles.root}>
      <Calendar
        renderEvent={item => (
          <div className={styles.event}>
            <Typography className={styles.text} textType='paragraph2' textColor='primary-3'>
              {item.name}
            </Typography>
            <Typography className={styles.text} textType='paragraph3' textColor='grey'>
              {formatTimeRange(item.start, item.end)} | {item.location}
            </Typography>
          </div>
        )}
        categories={types}
        schedule={events}
      />
      {/*<div className={styles.buttons}>
        <Button
          className={styles.button}
          buttonVariant='outline'
        >
          <FaAngleLeft className={styles.iconl}/>
          Yesterday
        </Button>
        <Button
          className={styles.button}
          buttonVariant='outline'
        >
          Tomorrow
          <FaAngleRight className={styles.iconr}/>
        </Button>
        </div>*/}
    </div>
  ) : null;
}

export default Schedule;
