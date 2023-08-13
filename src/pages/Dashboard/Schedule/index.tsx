import {BsSquareFill} from 'react-icons/bs';
import { Typography, Button } from "@ht6/react-ui";
import { CSSProperties, useEffect, useState } from "react";
import ScheduleDisplay from "../../../components/Schedule";
import styles from './Schedule.module.scss';

import cx from "classnames";


function Schedule() {
  const isReady = true;
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabs = [
    {
      text: 'Fri. August 18'
    },
    {
      text: 'Sat. August 19'
    },
    {
      text: 'Sun. August 20'
    }
  ];

  const eventTypes = [
    {
      id: "mainEvent",
      label: "Main Events"
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
      id: "meal",
      label: "Meals"
    },
    {
      id: "workshops",
      label: "Workshops"
    }
  ];

  const currentTime = new Date();
  const scrollToCurrentEvent = () => {
    if (18 <= currentTime.getDate() && currentTime.getDate() <= 20 && currentTime.getMonth() === 7 && currentTime.getFullYear() === 2023) {
      setActiveTab(currentTime.getDate() - 18);
      document.getElementById('hour ' + currentTime.getHours().toString())?.scrollIntoView({behavior: "smooth", block: "center"});
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
          {/* <Button onClick={() => scrollToCurrentEvent()}>Scroll to current time</Button> */}
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
          <div className={cx(styles.schedule)}>
            <ScheduleDisplay></ScheduleDisplay>
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
