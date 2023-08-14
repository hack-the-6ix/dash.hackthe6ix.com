import {BsSquareFill} from 'react-icons/bs';
import {Button, Typography} from "@ht6/react-ui";
import {useEffect, useRef, useState} from "react";
import ScheduleDisplay from "../../../components/Schedule";
import styles from './Schedule.module.scss';

import cx from "classnames";
import {scheduleDataFri, scheduleDataSat, scheduleDataSun} from "../../../schedule";


function Schedule() {
  const isReady = true;
  const [activeTab, setActiveTab] = useState<number>(0);

  const scheduleContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      text: 'Fri. August 18',
      scheduleData: scheduleDataFri
    },
    {
      text: 'Sat. August 19',
      scheduleData: scheduleDataSat
    },
    {
      text: 'Sun. August 20',
      scheduleData: scheduleDataSun
    }
  ];

  const eventTypes = [
    {
      id: "occuringNow",
      label: "Occuring Now"
    },
    {
      id: "mainEvent",
      label: "Main Events"
    },
    {
      id: "meal",
      label: "Meals"
    },
    {
      id: "sponsorBay",
      label: "Sponsor Bay"
    },
    {
      id: 'activities',
      label: "Activities"
    },
    {
      id: "workshops",
      label: "Workshops"
    }
  ];

  useEffect(() => {
    if(scheduleContainerRef.current) {
      scheduleContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const currentTime = new Date();
  const scrollToCurrentEvent = () => {
    if (18 <= currentTime.getDate() && currentTime.getDate() <= 20 && currentTime.getMonth() === 7 && currentTime.getFullYear() === 2023) {
      setActiveTab(currentTime.getDate() - 18);
      document.getElementById('hour ' + currentTime.getHours().toString())?.scrollIntoView({behavior: "smooth", block: "center"});
    }
    else {
      setActiveTab(0);
    }
  }

  return isReady ? (
    <div className={styles.root}>
      <div className={styles.scheduleHeading}>
          <Typography
            textType={"heading2"}
            textColor={"copy-light"}
            as="h2">Event Schedule</Typography>
          <Typography
            textType={"paragraph2"}
            textColor={"copy-light"}>Click on each block for more details about each workshop and event.</Typography>
      </div>
      <div className={styles.scheduleRoot}>
        <div className={styles.legendContainer}>
          <Typography
            textType='heading3'
            textColor='copy-light'
          >Legend</Typography>
          {
            eventTypes.map((eventType) => (
              <div>
                <Typography textType='paragraph2' textColor='copy-light'>
                  <span className={cx(styles['event--' + eventType.id])}><BsSquareFill/></span> {eventType.label}
                </Typography>
              </div>
            ))
          }
          <Button
              className={cx(styles.legendScrollButton)}
              onClick={() => scrollToCurrentEvent()} buttonVariant={"secondary"}>Scroll to Now</Button>
        </div>
        <div className={cx(styles.scheduleContainer)}>
          <div className={cx(styles.tabs)}>
            {
              tabs.map((tab, idx) => (
                <div
                className={cx(activeTab === idx && styles.active)}
                onClick={() => setActiveTab(idx)}
                >
                  <Typography textType='paragraph2'>{tab.text}</Typography>
                </div>
              ))
            }
          </div>
          <div ref={scheduleContainerRef} className={cx(styles.schedule)}>
            <ScheduleDisplay scheduleData={tabs[activeTab].scheduleData}></ScheduleDisplay>
          </div>
        </div>
      </div>
      {/*<Calendar*/}
      {/*  renderEvent={item => (*/}
      {/*    <div className={styles.event}>*/}
      {/*      <Typography className={styles.text} textType='paragraph2' textColor='primary-700'>*/}
      {/*        {item.name}*/}
      {/*      </Typography>*/}
      {/*      <Typography className={styles.text} textType='paragraph3' textColor='grey'>*/}
      {/*        {formatTimeRange(item.start, item.end)} | {item.location}*/}
      {/*      </Typography>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*  categories={types}*/}
      {/*  schedule={events}*/}
      {/*/>*/}
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
