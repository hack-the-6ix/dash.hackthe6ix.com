import { Typography } from "@ht6/react-ui";
import styles from "./ScheduleLegend.module.scss";

function ScheduleLegend() {
    return (
        <div className={styles.legendContainer}>
            <Typography textColor='neutral-50' textType='heading5' as='h5' className={styles.legendHeading}>
                {/* TODO: Check if the inline font-size doesn't conflict with other styles. */}
                Legend
            </Typography>
            <ul className={styles.legendDetails}>
                <li>
                    <div className={`${styles.legendBox} ${styles.occurringNowLegendBox}`}></div>
                    <Typography textColor='neutral-50' textType='paragraph' as='p'>
                        Occuring Now
                    </Typography>
                </li>
                <li>
                    <div className={`${styles.legendBox} ${styles.mainEventsLegendBox}`}></div>
                    <Typography textColor='neutral-50' textType='paragraph' as='p'>
                        Main Events
                    </Typography>
                </li>
                <li>
                    <div className={`${styles.legendBox} ${styles.sponsorBayLegendBox}`}></div>
                    <Typography textColor='neutral-50' textType='paragraph' as='p'>
                        Sponsor bay
                    </Typography>
                </li>
                <li>
                    <div className={`${styles.legendBox} ${styles.socialsLegendBox}`}></div>
                    <Typography textColor='neutral-50' textType='paragraph' as='p'>
                        Socials
                    </Typography>
                </li>
                <li>
                    <div className={`${styles.legendBox} ${styles.workshopsLegendBox}`}></div>
                    <Typography textColor='neutral-50' textType='paragraph' as='p'>
                        Workshops
                    </Typography>
                </li>
            </ul>
        </div>
    );
}

export default ScheduleLegend;