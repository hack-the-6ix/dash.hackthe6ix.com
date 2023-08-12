import cx from "classnames";

import styles from './Schedule.module.scss';
import {CSSProperties} from "react";
const scheduleData = [
    {
        hour: 7,
        events: [
            {
                name: 'Testing event 1',
                type: 'mainEvent',
                width: 6,
                offset: 0,
                height: 1,
                heightOffset: 0
            },
        ]
    },
    {
        hour: 8,
        events: [
            {
                name: 'Testing event 2',
                type: 'mainEvent',
                width: 3,
                offset: 0,
                height: 0.75,
                heightOffset: 0.25
            },
            {
                name: 'Testing event 3',
                type: 'mainEvent',
                width: 3,
                offset: 3,
                height: 2,
                heightOffset: 0
            },
        ]
    },
    {
        hour: 9,
        events: [
            {
                name: 'Testing event 4',
                type: 'mainEvent',
                width: 3,
                offset: 0,
                height: 1,
                heightOffset: 0
            }
        ]
    }
]
function Schedule() {
    return (
        <div className={cx(styles.scheduleRoot)}>
            {
                scheduleData.map((hourData) =>
                    <>
                        <div
                            className={cx(styles.scheduleTime)}
                            style={{
                                '--start-hour': hourData.hour,
                            } as CSSProperties}
                        >{hourData.hour}</div>
                        {hourData.events.map((eventData) =>
                            <>
                                <div
                                    className={cx(
                                        styles.scheduleItem,
                                        styles['event--' + eventData.type]
                                    )}
                                    style={{
                                        '--start-hour': hourData.hour,
                                        '--event-width': eventData.width,
                                        '--event-offset': eventData.offset,
                                        '--event-height': eventData.height,
                                        '--event-height-offset': eventData.heightOffset
                                    } as CSSProperties}
                                >The event is: {eventData.name} at {hourData.hour}</div>
                            </>
                        )}
                    </>
                )
            }
        </div>
    )
}

export default Schedule;