import { CSSProperties, Fragment, HTMLProps, ReactNode, useEffect, useMemo, useState } from "react";
import { Typography } from "@ht6/react-ui";
import cx from 'classnames';
import color from 'color';
import { repeat, applyPosition, formatDate, serializeDate, getCol, getNow } from './utils';
import styles from './Calendar.module.scss';
// import { startDate, endDate } from "../../config";

type Category<Categories extends string = string> = {
  color: `#${string}`;
  ref: Categories;
  label: string;
}

export interface ScheduleData<Categories extends string = string> {
  category: Categories;
  start: Date;
  end: Date;
}

export interface CalendarProps<
  Categories extends string = string,
  Item extends ScheduleData<Categories> = ScheduleData<Categories>,
> extends HTMLProps<HTMLDivElement> {
  renderEvent: (event: Item, category: Category<Categories>) => ReactNode;
  schedule: Item[];
  categories: Category<Categories>[];
  timezone?: string;
  locale?: string;
  focus?: string;
}
function Calendar<Categories extends string, Item extends ScheduleData<Categories>>({
  locale = 'en',
  renderEvent,
  categories,
  timezone,
  schedule,
  focus,
  ...props
}: CalendarProps<Categories, Item>) {
  const scheduleByDay = useMemo(() => {
    return schedule.reduce<{ [date: string]: Item[] }>(
      (acc, item) => {
        const day = serializeDate(item.start);
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
      },
      {},
    );
  }, [ schedule ]);
  const days = Object.keys(scheduleByDay);
  const _startDate = days[0];
  // ORIGINAL:
  // const cols = days.length * 24;
  // const rows = categories.length;
  const cols = days.length;
  const rows = days.length * 4;
  const startDate = useMemo(() => new Date(_startDate + ' 1:00'), [_startDate]);
  const [ nowPos, setNowPos ] = useState<number>(Math.max(getNow(startDate), 0));

  useEffect(() => {
    const timer = window.setInterval(
      () => {
        setNowPos(Math.max(getNow(startDate), 0));
      },
      5000,
    );
    return () => {
      window.clearInterval(timer);
    }
  }, [ startDate ]);

  const changeTabSchedule = () => {
    console.log("Click. Tab changed");
  }

  return (
    <div>
      <div className={styles.dayContainer}>
        {days.map((day, idx) => {
          const offset = (idx * 48) + 3;
          return (
            <Typography
              key={day}
              style={applyPosition(offset, 1, 6, 1)}
              className={styles.day}
              textColor='primary-700'
              textType='heading4'
              onClick={changeTabSchedule}
            >
              {formatDate(locale, null, new Date(`${day} 1:00`))}
            </Typography>
          );
        })}
      </div>
      <div
        {...props}
        style={{ ...props.style, '--cols': cols, '--rows': rows } as CSSProperties}
        className={cx(props.className, styles.root)}
      >
        {Object.values(scheduleByDay).map((item, idx) => (
          item.map((info, jdx) => {
            const i = categories.findIndex(c => c.ref === info.category);
            if (i === -1) return null;
            const start = getCol(startDate, info.start);
            const end = getCol(startDate, info.end);
            const len = end - start + (end < start ? 48 : 0);

            return (
              <div
                style={{
                  ...applyPosition(start + 3, (i * 2) + 3, len),
                  '--b': color(categories[i].color).lightness(95).rgb().array(),
                  '--a': color(categories[i].color).rgb().array(),
                } as CSSProperties}
                className={styles.event}
                key={`${idx}-${jdx}`}
              >
                <div className={styles.box}>
                  {renderEvent(info, categories[i])}
                </div>
              </div>
            )
          })
        )).flat()}
        {days.map((day, idx) => {
          const offset = (idx * 48) + 3;
          return (
            <Fragment key={day}>
              {repeat(24, jdx => (
                <Typography
                  style={applyPosition(offset + (jdx * 2), 2, 2)}
                  className={styles.hour}
                  textColor='primary-700'
                  textType='paragraph1'
                  key={jdx}
                >
                  {jdx % 12 || 12}<span className={styles.hourMinutes}>:00</span> <span className={styles.timeZone}>{jdx > 12 ? 'PM' : 'AM'}</span>
                </Typography>
              ))}
            </Fragment>
          );
        })}
        {repeat(rows + 1, (idx) => (
          <div
            // ORIGINAL:
            // style={applyPosition(1, (idx * 2) + 3, cols * 2 + 1, 1)}
            style={applyPosition(1, (idx * 2) + 3, cols, 1)}
            className={cx(styles.line, styles.hline)}
            key={idx}
          />
        ))}
        <div
          style={{
            ...applyPosition(2, 3, 1, rows * 2),
            '--p': nowPos,
          } as CSSProperties}
          className={styles.now}
        />
      </div>
    </div>
  );
}

export default Calendar;