import { CSSProperties, Fragment, HTMLProps, ReactNode, useEffect, useMemo, useState } from "react";
import { Typography } from "@ht6/react-ui";
import cx from 'classnames';
import color from 'color';
import { repeat, applyPosition, formatDate, serializeDate, getCol, getNow } from './utils';
import styles from './Calendar.module.scss';

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
  const cols = days.length * 24;
  const rows = categories.length;
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

  return (
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
      {categories.map((category, idx) => (
        <div
          style={{ ...applyPosition(1, (idx * 2) + 3, 1, 2), '--a': color(category.color).rgb().array() } as CSSProperties}
          className={styles.label}
          key={category.ref}
        >
          <div className={styles.accent}/>
          <Typography textType='paragraph2' textWeight={650} textColor='primary-3'>
            {category.label}
          </Typography>
        </div>
      ))}
      {days.map((day, idx) => {
        const offset = (idx * 48) + 3;
        return (
          <Fragment key={day}>
            <Typography
              style={applyPosition(offset, 1, 6, 1)}
              className={styles.day}
              textColor='primary-3'
              textType='heading4'
            >
              <div className={cx(styles.line, styles.vline, styles.dline)}/>
              {formatDate(locale, null, new Date(`${day} 1:00`))}
            </Typography>
            {repeat(24, jdx => (
              <Typography
                style={applyPosition(offset + (jdx * 2), 2, 2)}
                className={styles.hour}
                textColor='primary-3'
                textType='paragraph1'
                key={jdx}
              >
                {!!jdx && <div className={cx(styles.line, styles.vline)}/>}
                {jdx % 12 || 12}:00{jdx > 12 ? 'pm' : 'am'}
              </Typography>
            ))}
          </Fragment>
        );
      })}
      <div style={applyPosition(1, 1, 1, 2)} className={styles.cover}/>
      {repeat(rows + 1, (idx) => (
        <div
          style={applyPosition(1, (idx * 2) + 3, cols * 2 + 1, 1)}
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
  );
}

export default Calendar;