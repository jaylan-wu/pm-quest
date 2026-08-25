import type { QuizQuestion } from '../types'

const QUESTION_IMAGE_ASSET_PATH = `${import.meta.env.BASE_URL}assets/questions/`

export const questions = [
  {
    id: 'q1',
    title: 'You wake up to start your day… how do you wake up?',
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-01.webp`,
      alt: 'A person hides under pillows beside a bedside alarm clock.',
      position: '50% 45%',
    },
    choices: [
      {
        id: 'q1-snooze',
        text: 'Snoozed and missed one (or multiple) alarms.',
        scores: { moba: 1, fps: 1 },
      },
      {
        id: 'q1-made-bed',
        text: 'Woke up and made my bed with plenty of time to get ready.',
        scores: { sandbox: 1, tabletop: 1 },
      },
      {
        id: 'q1-all-nighter',
        text: "I pulled an all-nighter — I've been awake!",
        scores: { rpg: 1 },
      },
      {
        id: 'q1-workout',
        text: "I've been up before dawn — gotta get a workout in.",
        scores: { sports: 1, mobile: 1 },
      },
    ],
  },
  {
    id: 'q2',
    title: "It's time for breakfast. What are you having?",
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-02.webp`,
      alt: 'A breakfast plate and coffee sit beside a newspaper.',
    },
    choices: [
      {
        id: 'q2-celsius',
        text: 'I chugged a Celsius.',
        scores: { moba: 1, fps: 1 },
      },
      {
        id: 'q2-leftover-pizza',
        text: "I ate last night's leftover pizza.",
        scores: { sports: 1 },
      },
      {
        id: 'q2-blank-street',
        text: 'I mobile ordered a croissant and matcha from Blank Street on my way to campus.',
        scores: { mobile: 1 },
      },
      {
        id: 'q2-no-breakfast',
        text: "I don't eat breakfast.",
        scores: { rpg: 1, sandbox: 1 },
      },
      {
        id: 'q2-omelette-coffee',
        text: 'I woke up early and made myself an omelette and coffee.',
        scores: { tabletop: 1 },
      },
    ],
  },
  {
    id: 'q3',
    title: "It's time to commute to campus. How are you getting there?",
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-03.webp`,
      alt: 'Commuters wait on a subway platform as a train passes.',
    },
    choices: [
      {
        id: 'q3-roll-into-class',
        text: 'I roll out of bed straight into class from my dorm/apartment.',
        scores: { moba: 1, rpg: 1 },
      },
      {
        id: 'q3-modded-longboard',
        text: 'I rode a longboard that I modded myself.',
        scores: { sports: 1, sandbox: 1 },
      },
      {
        id: 'q3-public-transit',
        text: "I take public transportation but don't touch anything.",
        scores: { mobile: 1, tabletop: 1 },
      },
      {
        id: 'q3-sleep-on-campus',
        text: "I sleep on campus so I don't have to commute.",
        scores: { fps: 1 },
      },
    ],
  },
  {
    id: 'q4',
    title: "You've arrived at your first class of the day. What are you doing?",
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-04.webp`,
      alt: 'Rows of seats in an empty college lecture hall.',
    },
    choices: [
      {
        id: 'q4-front-row-notes',
        text: 'I sit in the front row and diligently take notes during class.',
        scores: { rpg: 1, mobile: 1 },
      },
      {
        id: 'q4-minecraft',
        text: 'I sit in the back to play Minecraft on my laptop.',
        scores: { sandbox: 1, tabletop: 1 },
      },
      {
        id: 'q4-bathroom',
        text: 'I sign in for attendance and go to "the bathroom" for 45 minutes.',
        scores: { moba: 1, sports: 1 },
      },
      {
        id: 'q4-fire-alarm',
        text: 'Pulled the fire alarm, as always.',
        scores: { fps: 1 },
      },
    ],
  },
  {
    id: 'q5',
    title: 'Time for your Open Lab shift. What are you doing?',
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-05.webp`,
      alt: 'Hands connect wires inside a small electronics project.',
    },
    choices: [
      {
        id: 'q5-oll',
        text: "I'm always the OLL! I'm on the aux, assigning the other people on shift what to do, and talking to Jaylan.",
        scores: { moba: 1 },
      },
      {
        id: 'q5-slide-tackle',
        text: 'I slide tackle my SLDP team.',
        scores: { sports: 1 },
      },
      {
        id: 'q5-personal-project',
        text: "I'm using the downtime to work on a personal project.",
        scores: { sandbox: 1, mobile: 1 },
      },
      {
        id: 'q5-missing-responsibilities',
        text: "I don't know what my job responsibilities are or where OL is.",
        scores: { fps: 1 },
      },
      {
        id: 'q5-help-students',
        text: "I'm helping every student that I can!",
        scores: { rpg: 1, tabletop: 1 },
      },
    ],
  },
  {
    id: 'q6',
    title: "Class and shifts are over. Now you have to study for an exam. What's your strategy?",
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-06.webp`,
      alt: 'A student studies an open textbook at a desk.',
      position: '50% 55%',
    },
    choices: [
      {
        id: 'q6-lockbox-pomodoro',
        text: 'I have a lockbox for my phone and a Pomodoro timer set.',
        scores: { sports: 1, mobile: 1 },
      },
      {
        id: 'q6-no-study',
        text: "I don't need to study.",
        scores: { moba: 1, fps: 1 },
      },
      {
        id: 'q6-library-group',
        text: 'I booked a group room in the library for me and all my friends.',
        scores: { rpg: 1, tabletop: 1 },
      },
      {
        id: 'q6-all-nighter-later',
        text: "That's a problem for later. I'll pull an all-nighter next week.",
        scores: { sandbox: 1 },
      },
    ],
  },
  {
    id: 'q7',
    title: 'Club sign-ups are next week! What are you planning to do?',
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-07.webp`,
      alt: 'People browse stacks of books in a bookstore.',
    },
    choices: [
      {
        id: 'q7-greek-life',
        text: "I'm going to join Greek Life. I hear they have bomb parties!",
        scores: { moba: 1, fps: 1, sports: 1 },
      },
      {
        id: 'q7-robotics-club',
        text: "I'm going to check out Robotics Club. It'll look great on my CV!",
        scores: { sandbox: 1 },
      },
      {
        id: 'q7-student-body-president',
        text: "I'm going to run for student body president!",
        scores: { rpg: 1, mobile: 1 },
      },
      {
        id: 'q7-arts-and-crafts',
        text: "I'm going to sign up for the Arts and Crafts Club. I can't wait to make friends and create art.",
        scores: { tabletop: 1 },
      },
    ],
  },
  {
    id: 'q8',
    title: "Ingrid Slack messaged you to meet her in her office. What's it for?",
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-08.webp`,
      alt: 'An empty office desk holds a laptop, lamp, and pencils.',
      position: '50% 70%',
    },
    choices: [
      {
        id: 'q8-lan-party',
        text: 'Threw a LAN party in the lab after hours.',
        scores: { moba: 1, fps: 1, sandbox: 1 },
      },
      {
        id: 'q8-award-nomination',
        text: "She's nominating me for an award.",
        scores: { rpg: 1, tabletop: 1 },
      },
      {
        id: 'q8-professor-offices',
        text: 'Wait, professors have offices?',
        scores: { fps: 1, sports: 1 },
      },
      {
        id: 'q8-download-slack',
        text: 'I should really download Slack and turn my notifications on.',
        scores: { mobile: 1 },
      },
    ],
  },
  {
    id: 'q9',
    title: 'You were planning to do laundry tonight, but your friends asked you to hang out. What do you do?',
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-09.webp`,
      alt: 'Two people wait beside washing machines and a cart of laundry.',
      position: '50% 55%',
    },
    choices: [
      {
        id: 'q9-do-laundry',
        text: "Tell them I'm sorry I'm busy, but I've already planned to do laundry.",
        scores: { tabletop: 1 },
      },
      {
        id: 'q9-doom-scrolling',
        text: 'You end up doing neither because you were doom scrolling.',
        scores: { fps: 1, sports: 1, mobile: 1 },
      },
      {
        id: 'q9-raid-night',
        text: "It's raid night! My real friends are my online friends.",
        scores: { rpg: 1, sandbox: 1 },
      },
      {
        id: 'q9-go-out',
        text: "Hell yeah! I'm going out.",
        scores: { moba: 1 },
      },
    ],
  },
  {
    id: 'q10',
    title: "It's finally time for bed. What's your nighttime routine?",
    image: {
      src: `${QUESTION_IMAGE_ASSET_PATH}question-10.webp`,
      alt: 'A person wearing a sleep mask rests in bed.',
    },
    choices: [
      {
        id: 'q10-celsius',
        text: 'I chug a Celsius and keep going!',
        scores: { moba: 1, fps: 1 },
      },
      {
        id: 'q10-skincare',
        text: 'Ten-step skincare, warm shower, set an alarm, in bed by 10.',
        scores: { sports: 1, tabletop: 1 },
      },
      {
        id: 'q10-the-office',
        text: 'I crawl into bed and binge The Office until I fall asleep.',
        scores: { sandbox: 1, mobile: 1 },
      },
      {
        id: 'q10-crash-on-mattress',
        text: 'I just crash straight on the mattress — no bed frame, no sheets, no regrets.',
        scores: { rpg: 1 },
      },
    ],
  },
] as const satisfies readonly QuizQuestion[]
