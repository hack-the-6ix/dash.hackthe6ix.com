import {CSSProperties, HTMLProps, ReactNode, useCallback, useEffect, useState} from "react";

import {FaClock, FaLocationDot, FaNoteSticky} from 'react-icons/fa6';
import {BsPersonCircle} from 'react-icons/bs';
import {RiCloseLine} from 'react-icons/ri';

import cx from "classnames";
import { Typography } from "@ht6/react-ui";

import styles from './Schedule.module.scss';

import {EventData, ScheduleData} from "../../schedule";

export interface ScheduleProps {
    scheduleData: ScheduleData
}

function Schedule({
    scheduleData,
    ...props
}: ScheduleProps) {
    const [selectedEventData, setSelectedEventData] = useState<EventData>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const currentDate = new Date();

    const formatEventTime = useCallback((eventData: EventData) => {
        let ret = `${eventData.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        if (eventData.endTime || eventData.endTime === eventData.startTime) {
            ret += ` - ${eventData.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }

        return ret;
    }, []);

    const formatEventDateTime = useCallback((eventData: EventData) => {
        return `${eventData.startTime.toLocaleDateString([], {weekday: "short", month: "short", day: "2-digit"})} @ ${formatEventTime(eventData)}`;
    }, [formatEventTime]);

    return (
        <>
            <div
                className={cx(styles.scheduleRoot)}
                style={{
                    '--schedule-start-hour': scheduleData.startHour
                } as CSSProperties}
            >
                {
                    Array.from(Array(24).keys()).filter((hour) => hour >= scheduleData.startHour).map((hour) => (
                        <div
                            className={cx(styles.scheduleTime)}
                            style={{
                                '--start-hour': hour,
                            } as CSSProperties}
                            id={'hour ' + hour.toString()}
                        ><Typography textType='paragraph2' textWeight={800} className={cx(styles.hourText)}>{hour}:00</Typography></div>
                    ))
                }
                {
                    scheduleData.schedule.map((hourData) =>
                        <>
                            {hourData.events.map((eventData) =>
                                <>
                                    <div
                                        className={cx(
                                            styles.scheduleItem,
                                            styles['event--' + eventData.type],
                                            (
                                                eventData.startTime.getHours() <= currentDate.getHours() && eventData.endTime.getHours() >= currentDate.getHours() 
                                                && currentDate.toDateString() === eventData.startTime.toDateString()
                                            ) && styles.currentEvent
                                        )}
                                        style={{
                                            '--start-hour': hourData.hour,
                                            '--event-width': eventData.width,
                                            '--event-offset': eventData.offset ?? 0,
                                            '--event-height': eventData.height ?? 1,
                                            '--event-height-offset': eventData.heightOffset ?? 0
                                        } as CSSProperties}
                                        onClick={() => {setSelectedEventData(eventData); setShowModal(true)}}
                                    >
                                        <Typography
                                            textType={"heading4"}
                                            as="h4"
                                        >{eventData.title}</Typography>
                                        <Typography
                                            textType={"paragraph2"}
                                            as="p"
                                        >
                                            {formatEventTime(eventData)} {eventData.location && ` @ ${eventData.location}`}
                                        </Typography>
                                    </div>
                                </>
                            )}
                        </>
                    )
                }
            </div>
            <div
                className={cx(styles.modalContainer, showModal && styles.show)}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowModal(false);
                    }
                }}
            >
                <div
                    className={cx(styles.modal)}
                >
                    <Typography textType={"heading3"} as={"h3"} className={cx(styles.modalHeader)}>
                        {selectedEventData?.title}
                        <div
                            className={cx(styles.modalDismiss)}
                            onClick={() => setShowModal(false)}
                        >
                            <RiCloseLine />
                        </div>
                    </Typography>
                    <div className={cx(styles.modalEventDetails)}>
                        <div>
                            <Typography textType={"paragraph2"}><FaClock /></Typography>
                            <Typography textType={"paragraph2"}>{selectedEventData && formatEventDateTime(selectedEventData)}</Typography>
                        </div>
                        {selectedEventData?.presenter && <div>
                            <Typography textType={"paragraph2"}>{selectedEventData?.presenter && <BsPersonCircle />}</Typography>
                            <Typography textType={"paragraph2"}>{selectedEventData?.presenter}</Typography>
                        </div>}
                        {selectedEventData?.location && <div>
                            <Typography textType={"paragraph2"}>{selectedEventData?.location && <FaLocationDot />}</Typography>
                            <Typography textType={"paragraph2"}>{selectedEventData?.location}</Typography>
                        </div>}
                        {selectedEventData?.description && <div>
                            <Typography textType={"paragraph2"}>{selectedEventData?.description && <FaNoteSticky />}</Typography>
                            <Typography textType={"paragraph2"}>{selectedEventData?.description}</Typography>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Schedule;