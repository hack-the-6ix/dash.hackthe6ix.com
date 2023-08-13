import cx from "classnames";
import { Typography } from "@ht6/react-ui";

import styles from './Schedule.module.scss';
import {CSSProperties, useCallback, useState} from "react";

import {FaClock, FaLocationDot, FaNoteSticky} from 'react-icons/fa6';
import {BsPersonCircle} from 'react-icons/bs';
import {RiCloseLine} from 'react-icons/ri';

export interface EventData {
    title: string,
    presenter?: string,
    description?: string,
    startTime: Date,
    endTime: Date | null,
    location: string,
    type: string,
    width: number,
    offset?: number,
    height?: number,
    heightOffset?: number
}

export interface ScheduleHourData {
    hour: number,
    events: EventData[]
}

export interface ScheduleData {
    startHour: number,
    schedule: ScheduleHourData[]
}

const scheduleData = {
    startHour: 14,
    schedule: [{
        hour: 15,
        events: [
            {
                title: 'Hacker Check-In Begins',
                startTime: new Date("August 18, 2023 19:00:00"),
                endTime: null,
                location: 'Entrance Area',
                description: "Hacker Check-In has now started! Please come to the entrance area to check-in and get your swag!",
                type: 'mainEvent',
                width: 6,
                offset: 0,
                height: 1,
                heightOffset: 0
            },
        ]
    },
    {
        hour: 17,
        events: [
            {
                title: 'Opening Ceremony',
                startTime: new Date("August 18, 2023 17:00:00"),
                endTime: new Date("August 18, 2023 18:00:00"),
                location: 'ENG LG011',
                description: "Welcome to Hack the 6ix 2023! We're so excited to have you here! We'll be starting off with some opening remarks from our sponsors and then we'll be getting into the details of the event!",
                type: 'mainEvent',
                width: 6,
                offset: 0,
                height: 1,
                heightOffset: 0
            },
        ]
    },
    {
        hour: 18,
        events: [
            {
                title: 'Dinner',
                startTime: new Date("August 18, 2023 19:00:00"),
                endTime: new Date("August 18, 2023 21:00:00"),
                location: 'Basement Hall',
                type: 'meal',
                width: 2,
                offset: 0,
                height: 2,
                heightOffset: 1
            },
            {
                title: 'Team Formation',
                startTime: new Date("August 18, 2023 18:00:00"),
                endTime: new Date("August 18, 2023 22:00:00"),
                location: 'Discord',
                type: 'activities',
                width: 2,
                offset: 2,
                height: 4,
                heightOffset: 0
            },
            {
                title: 'Sponsor Networking',
                startTime: new Date("August 18, 2023 18:00:00"),
                endTime: new Date("August 18, 2023 22:00:00"),
                location: 'Sponsor Bay',
                type: 'sponsorBay',
                width: 2,
                offset: 4,
                height: 4,
                heightOffset: 0,
            },
            {
                title: 'Introduction to AI-Enhanced Apps',
                presenter: "Test testerson",
                description: "asfghj jhkasfjgh kasfhg asjghkas fghjskfag jasfhjkg sfakhg jkasfhgjk sfakhgjas fgkjahsf saghsfjgh agaskfjhg safhg sfghaksfjgh jsafkhgk ashjkg ",
                startTime: new Date("August 18, 2023 21:00:00"),
                endTime: new Date("August 18, 2023 22:00:00"),
                location: 'idk',
                type: 'workshops',
                width: 2,
                offset: 0,
                height: 1,
                heightOffset: 3
            },
        ]
    },
    {
        hour: 22,
        events: [
            {
                title: 'Hacking Starts!',
                startTime: new Date("August 18, 2023 22:00:00"),
                endTime: null,
                location: null,
                type: 'mainEvent',
                width: 6,
                offset: 0,
                height: 1,
                heightOffset: 0
            },
        ]
    }
    ]
} as ScheduleData;

function Schedule() {
    const [selectedEventData, setSelectedEventData] = useState<EventData>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const formatEventTime = useCallback((eventData: EventData) => {
        let ret = `${eventData.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        if(eventData.endTime) {
            ret += ` - ${eventData.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }

        return ret;
    }, []);

    const formatEventDateTime = useCallback((eventData: EventData) => {
        return `${eventData.startTime.toLocaleDateString([], {weekday: "short", month: "short", day: "2-digit"})} @ ${formatEventTime(eventData)}`;
    }, [formatEventTime])

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
                        ><Typography textType='paragraph2' textWeight={800}>{hour}:00</Typography></div>
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
                                            styles['event--' + eventData.type]
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