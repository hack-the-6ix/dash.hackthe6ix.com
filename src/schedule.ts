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
                    description: 'Dinner will be served in the basement hall. Please come down to grab your pizza, snacks, and soda!',
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
                    description: "Need a team? Come to the #need-a-team channel in our Discord server to find one!",
                    width: 1,
                    offset: 4,
                    height: 4,
                    heightOffset: 0
                },
                {
                    title: 'An Introduction to Blockchain Technology',
                    startTime: new Date("August 18, 2023 18:30:00"),
                    endTime: new Date("August 18, 2023 19:30:00"),
                    location: 'ENG 106',
                    presenter: "Tolga Acan",
                    type: 'workshops',
                    description: "This workshop is an introduction to blockchain technology that educates all groups over 13 years of age on the fundamental principles, concepts, and theories behind the subject with no required prior experience or knowledge.",
                    width: 2,
                    offset: 2,
                    height: 1,
                    heightOffset: 0
                },
                {
                    title: 'How I sold my first startup at 20 y/o',
                    startTime: new Date("August 18, 2023 19:30:00"),
                    endTime: new Date("August 18, 2023 20:30:00"),
                    location: 'ENG 105',
                    presenter: "Matthew Espinoza",
                    type: 'workshops',
                    description: "I'm a 21 y/o whose first startup was acquired by a $50m company. Since then, built a ton of profitable side projects. Today, I'm going full-force on something new.",
                    width: 2,
                    offset: 2,
                    height: 1,
                    heightOffset: 1
                },
                {
                    title: 'Sponsor Networking',
                    startTime: new Date("August 18, 2023 18:00:00"),
                    endTime: new Date("August 18, 2023 22:00:00"),
                    location: 'Sponsor Bay',
                    type: 'sponsorBay',
                    description: "Come to the sponsor bay to network with our sponsors and learn about their companies!",
                    width: 1,
                    offset: 5,
                    height: 4,
                    heightOffset: 0,
                },
                {
                    title: 'Introduction to AI-Enhanced Apps',
                    presenter: "Kevin Jiang",
                    description: "This workshop will be an overview of how LLMs work and current available APIs. Additionally, we'll go over current Open Source stack for AI apps (LangChain, LlamaIndex, maybe a vector DB). On top of that, you'll learn strategies for getting data in/out of LLMs (json, option to write your own ChatGPT plugin). We'll focus on integrating it into a flask backend as end result.",
                    startTime: new Date("August 18, 2023 21:00:00"),
                    endTime: new Date("August 18, 2023 22:00:00"),
                    location: 'ENG 105',
                    type: 'workshops',
                    width: 4,
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
                    description: "The designated hacking time has now began! Go work on your projects! Hacking will end exactly 36 hours later at 10:00 AM EST on Sunday, August 20, 2023.",
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
        hour: 1,
        events: [
            {
                title: 'Fireside Chat: Hackathons 101',
                startTime: new Date("August 19, 2023 1:00:00"),
                endTime: new Date("August 19, 2023 2:00:00"),
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
                    description: "Breakfast will be served in the basement hall. Please come down to grab your croissants, snacks, and juice!",
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
                    presenter: "Cindy Wong",
                    location: 'ENG 105',
                    type: 'workshops',
                    description: "As businesses rely more heavily on data to make key decisions, Data Observability has become an important pillar in the Data world. This workshop provides an overview of Data Observability. It provides insights into commonly used tools and approaches to build Data Observability.",
                    width: 3,
                    offset: 0,
                    height: 1,
                    heightOffset: 1
                },
                {
                    title: 'The Design Thinking Process: Effective Problem Framing and Designing with the User at Heart',
                    presenter: "Izzy Vohsemer & Ren Black",
                    startTime: new Date("August 19, 2023 10:00:00"),
                    endTime: new Date("August 19, 2023 11:30:00"),
                    description: "Join us to learn about the design thinking process in a hands-on environment by taking part in a fun micro design sprint. Together we will explore the basics and importance of problem framing, understanding your user, divergent and convergent ideation, as well as aligning with stakeholders, and tips for pitching your ideas. Whether you're a developer, a designer, or in business, the design thinking process is an essential asset in everyone's toolkit.",
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
                    description: "Hungry? Come down to the basement hall to grab your sandwiches!",
                    type: 'meal',
                    width: 3,
                    offset: 0,
                    height: 2,
                    heightOffset: 0.5
                },
                {
                    title: 'Navigating Your Tech Career: A Guide to Optimizing the Job Application Process',
                    presenter: "Stefan Smolovic",
                    description: "Attendees will learn strategies for optimizing their job applications, including crafting high-quality resumes that appeal to hiring managers and automated parsers, effective networking through social media, and the best practices for preparing for technical interviews. This workshop may include demonstrations of various resume building tools, LinkedIn for networking, and platforms that simulate technical interviews.",
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
                    description: "Introduction to Functional Programming in an Array-Based Language will provide an introduction to the language q, which is a member of the APL family of languages. It's quite a bit different from most languages, and learning (or even being exposed to) this programming paradigm will change the way you think about solving problems with code. We'll start with an overview of this paradigm, the language q, and its quirks. Then we'll give all participants a problem to be solved with q, and help people work through it. At the end participants will be encouraged to share their solutions. The efficiency of each solution will be measured in terms of time used, memory used, and characters used - try to come up with a solution that minimizes all three! If you'd like to get a head start, check out Q for Mortals: https://code.kx.com/q4m3/",
                    presenter: "Will Da Silva & Braedon Leonard",
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
                    description: "Need I say anymore? Take a break from hacking and participate in a round of this classic party game to see how many marshmallows you can fit in your mouth while saying 'Chubby Bunny' between each one!",
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
                    description: "Is there an imposter… AMONG US!? A thematic twist on the classic group game Werewolf, find whose been venting by joining a game of real-life Among Us. No crewmates were harmed in the making of this activity...yet.",
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
                    description: "Dinner will be served in the basement hall. Please come down to grab your chicken and rice shawarma!",
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
                    heightOffset: 0.75,
                    description: "Want some resume recommendations with a side of spice? Look no further than HT6's resume roast. Simply bring your resume and some aloe for the light burns you'll receive from our panel of expert critics, who will provide alongside the burns valuable advice on how to improve your chances of landing an internship/job."
                },
                {
                    title: 'Valorant Tournament',
                    startTime: new Date("August 19, 2023 21:00:00"),
                    endTime: new Date("August 19, 2023 23:59:00"),
                    location: 'Discord',
                    type: 'activities',
                    width: 3,
                    offset: 3,
                    height: 3,
                    description: "Why type race when you can tap strafe? Join an in-house Valorant match and see how you stack up against fellow hackers.",
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
                    description: "Want to take a break from hacking but keep your brain on its toes? Test your knowledge on a variety of topics by participating in a fun round of custom Jeopardy with your team.",
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
                    description: "Breakfast will be served in the basement hall. Please come down to grab your bagels, snacks, and juice!",
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
                    description: "Viewers will follow along and build their own portfolios to showcase their projects in under an hour. The portfolio will include a short intro section, a projects section, and a contact form. They'll use mostly React to build the site, push their code to GitHub, and deploy their site with Vercel.",
                    presenter: "Frederic Pun & Victoria Da Rosa",
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
                    description: "Hacking time has now ended! Please submit your projects on Devpost.",
                    width: 2,
                    offset: 2,
                    height: 1,
                    heightOffset: 0
                },
                {
                    title: 'Scavenger Hunt Deadline',
                    startTime: new Date("August 20, 2023 10:00:00"),
                    endTime: new Date("August 20, 2023 10:00:00"),
                    type: 'activities',
                    description: "The deadline for the scavenger hunt has now passed!",
                    width: 2,
                    offset: 4,
                    height: 1,
                    heightOffset: 0
                },
                {
                    title: 'Judging Period',
                    startTime: new Date("August 20, 2023 10:30:00"),
                    endTime: new Date("August 20, 2023 12:30:00"),
                    type: 'mainEvent',
                    description: "Head over to the judging area to present your project to the judges!",
                    width: 2,
                    offset: 0,
                    height: 2,
                    heightOffset: 0.5
                },
                {
                    title: "Lunch",
                    startTime: new Date("August 20, 2023 11:00:00"),
                    endTime: new Date("August 20, 2023 13:00:00"),
                    type: 'meal',
                    description: "Lunch will be served in the basement hall. Please come down to grab your macaroni!",
                    width: 4,
                    offset: 2,
                    height: 2,
                    heightOffset: 1
                }
            ]
        },
        {
            hour: 13,
            events: [
                {
                    title: "Closing Ceremony",
                    startTime: new Date("August 20, 2023 13:00:00"),
                    endTime: new Date("August 20, 2023 14:00:00"),
                    type: 'mainEvent',
                    description: "Thank you for attending Hack the 6ix 2023! We hope you had a great time and we hope to see you again next year! We'll be announcing the winners of the hackathon and giving out prizes!",
                    width: 6,
                    offset: 0,
                    height: 1,
                    heightOffset: 0
                }
            ]
        }
    ]
} as ScheduleData;