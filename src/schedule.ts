export interface EventData {
    title: string,
    presenter?: string,
    description?: string,
    startTime: Date,
    endTime: Date,
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

export const scheduleDataFri = {
    startHour: 14,
    schedule: [{
        hour: 15,
        events: [
            {
                title: 'Hacker Check-In Begins',
                startTime: new Date("August 18, 2023 15:00:00"),
                endTime: new Date("August 18, 2023 15:00:00"),
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
                    endTime: new Date("August 18, 2023 22:00:00"),
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

export const scheduleDataSat = {
    startHour: 0,
    schedule: [{
        hour: 2,
        events: [
            {
                title: 'Fireside Chat: Hackathons 101',
                startTime: new Date("August 19, 2023 2:00:00"),
                endTime: new Date("August 19, 2023 3:00:00"),
                location: 'Ground Floor',
                description: "If you're actually curious as to what goes into planning a hackathon (or are thinking of starting your own), this activity is for you. Our executives will be on hand to field your burning questions on everything that goes into running Hack the 6ix.",
                type: 'activities',
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
                    title: 'Breakfast',
                    startTime: new Date("August 19, 2023 8:30:00"),
                    endTime: new Date("August 19, 2023 10:30:00"),
                    location: 'Basement Hall',
                    type: 'meal',
                    width: 3,
                    offset: 0,
                    height: 2,
                    heightOffset: 0.5
                },
            ]
        },
        {
            hour: 10,
            events: [
                {
                    title: 'Data Observability, presented by Metrolinx',
                    startTime: new Date("August 19, 2023 11:00:00"),
                    endTime: new Date("August 19, 2023 12:00:00"),
                    location: 'ENG 105',
                    type: 'workshops',
                    width: 3,
                    offset: 0,
                    height: 1,
                    heightOffset: 1
                },
                {
                    title: 'The Design Thinking Process: Effective Problem Framing and Designing with the User at Heart',
                    startTime: new Date("August 19, 2023 10:00:00"),
                    endTime: new Date("August 19, 2023 11:30:00"),
                    location: 'ENG 106',
                    type: 'workshops',
                    width: 3,
                    offset: 3,
                    height: 1.5,
                    heightOffset: 0
                }
            ]
        },
        {
            hour: 12,
            events: [
                {
                    title: 'Lunch',
                    startTime: new Date("August 19, 2023 12:30:00"),
                    endTime: new Date("August 19, 2023 14:30:00"),
                    location: 'Basement Hall',
                    type: 'meal',
                    width: 3,
                    offset: 0,
                    height: 2,
                    heightOffset: 0.5
                },
                {
                    title: 'Navigating Your Tech Career: A Guide to Optimizing the Job Application Process',
                    startTime: new Date("August 19, 2023 13:00:00"),
                    endTime: new Date("August 19, 2023 14:00:00"),
                    location: 'ENG 105',
                    type: 'workshops',
                    width: 3,
                    offset: 3,
                    height: 1,
                    heightOffset: 1
                },
                {
                    title: 'Introduction to Functional Programming in an Array-Based Language',
                    startTime: new Date("August 19, 2023 14:00:00"),
                    endTime: new Date("August 19, 2023 15:00:00"),
                    location: 'ENG 106',
                    type: 'workshops',
                    width: 3,
                    offset: 3,
                    height: 1,
                    heightOffset: 2
                },
                {
                    title: 'Chubby Bunny Challenge',
                    startTime: new Date("August 19, 2023 14:30:00"),
                    endTime: new Date("August 19, 2023 15:30:00"),
                    location: 'Basement Hall',
                    type: 'activities',
                    width: 3,
                    offset: 0,
                    height: 1,
                    heightOffset: 2.5
                }
            ]
        },
        {
            hour: 17,
            events: [
                {
                    title: 'Among Us in Real Life',
                    startTime: new Date("August 19, 2023 17:00:00"),
                    endTime: new Date("August 19, 2023 18:00:00"),
                    location: 'Ground Floor',
                    type: 'activities',
                    width: 6,
                    offset: 0,
                    height: 1,
                    heightOffset: 0
                }
            ]
        },
        {
            hour: 18,
            events: [
                {
                    title: 'Dinner',
                    startTime: new Date("August 19, 2023 18:30:00"),
                    endTime: new Date("August 19, 2023 20:30:00"),
                    location: 'Basement Hall',
                    type: 'meal',
                    width: 6,
                    offset: 0,
                    height: 2,
                    heightOffset: 0.5
                }
            ]
        },
        {
            hour: 20,
            events: [
                {
                    title: 'Resume Roast',
                    startTime: new Date("August 19, 2023 20:45:00"),
                    endTime: new Date("August 19, 2023 21:45:00"),
                    location: 'ENG 105',
                    type: 'activities',
                    width: 3,
                    offset: 0,
                    height: 1,
                    heightOffset: 0.75
                },
                {
                    title: 'Valorant Tournament',
                    startTime: new Date("August 19, 2023 21:00:00"),
                    endTime: new Date("August 19, 2023 24:00:00"),
                    location: 'Discord',
                    type: 'activities',
                    width: 3,
                    offset: 3,
                    height: 3,
                    heightOffset: 1
                }
            ]
        }
    ]
} as ScheduleData;

export const scheduleDataSun = {
    startHour: 0,
    schedule: [
        {
            hour: 0,
            events: [
                {
                    title: 'Test your skills - Tech Trivia Challenge',
                    startTime: new Date("August 20, 2023 0:30:00"),
                    endTime: new Date("August 20, 2023 1:30:00"),
                    location: 'ENG 105',
                    type: 'activities',
                    width: 6,
                    offset: 0,
                    height: 1,
                    heightOffset: 0.5
                }
            ]
        },
        {
            hour: 8,
            events: [
                {
                    title: 'Breakfast',
                    startTime: new Date("August 20, 2023 8:00:00"),
                    endTime: new Date("August 20, 2023 10:00:00"),
                    location: 'Basement Hall',
                    type: 'meal',
                    width: 3,
                    offset: 0,
                    height: 2,
                    heightOffset: 0
                },
                {
                    title: 'Build a Portfolio With React in Under an Hour',
                    startTime: new Date("August 20, 2023 9:00:00"),
                    endTime: new Date("August 20, 2023 10:00:00"),
                    location: 'ENG 105',
                    type: 'workshops',
                    width: 3,
                    offset: 3,
                    height: 1,
                    heightOffset: 1
                }
            ]
        },
        {
            hour: 10,
            events: [
                {
                    title: 'Hacking Ends!',
                    startTime: new Date("August 20, 2023 10:00:00"),
                    endTime: new Date("August 20, 2023 10:00:00"),
                    type: 'mainEvent',
                    width: 3,
                    offset: 0,
                    height: 1,
                    heightOffset: 0
                },
                {
                    title: 'Scavenger Hunt Deadline',
                    startTime: new Date("August 20, 2023 10:00:00"),
                    endTime: new Date("August 20, 2023 10:00:00"),
                    type: 'activities',
                    width: 3,
                    offset: 3,
                    height: 1,
                    heightOffset: 0
                },
            ]
        }
    ]
} as ScheduleData;