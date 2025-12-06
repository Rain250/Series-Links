// Mock Data Fixtures for Events UI
// All data is hard-coded for UI prototype

// Types (for reference)
// type EventsUserProfile = {
//   firstName: string;
//   lastName: string;
//   schoolEmail: string;
//   schoolEmailVerified: boolean;
//   headline: string;
//   bio: string;
//   interests: string[];
//   linkedInUrl: string;
//   websiteUrl?: string;
// }

// type Event = {
//   id: string;
//   title: string;
//   dateTime: string;
//   location: string;
//   description: string;
//   tags: string[];
//   urgencyLabel?: string;
//   hostName: string;
//   spotsLeft?: number;
//   hoursUntilStart?: number;
// }

// type PersonSuggestion = {
//   id: string;
//   name: string;
//   school: string;
//   headline: string;
//   sharedInterests: string[];
//   avatar?: string;
// }

// Hard-coded Events
export const MOCK_EVENTS = [
  {
    id: 'event-1',
    title: 'AI Founders Mixer',
    dateTime: '2024-12-07T19:00:00',
    location: 'The WeWork, 45th Street',
    description: 'Networking event for AI founders, investors, and builders. Drinks and light bites provided.',
    tags: ['Tech', 'AI', 'Founders'],
    hostName: 'Tech@NYU',
    spotsLeft: 3,
    hoursUntilStart: 3,
    urgencyLabel: 'Starts in 3 hours'
  },
  {
    id: 'event-2',
    title: 'Climate Tech Happy Hour',
    dateTime: '2024-12-08T18:00:00',
    location: 'The Flatiron, 5th Avenue',
    description: 'Connect with climate tech entrepreneurs and investors working on the future of sustainability.',
    tags: ['Climate', 'Tech', 'VC'],
    hostName: 'NYU Engage',
    spotsLeft: 5,
    hoursUntilStart: 27,
    urgencyLabel: 'Only 5 spots left'
  },
  {
    id: 'event-3',
    title: 'VC Office Hours',
    dateTime: '2024-12-09T14:00:00',
    location: 'Zoom',
    description: '1:1 office hours with partners from top VCs. Get feedback on your pitch and ask questions.',
    tags: ['VC', 'Finance', 'Startups'],
    hostName: 'Stern Club',
    spotsLeft: 2,
    hoursUntilStart: 50,
    urgencyLabel: 'Decide in 20 min to be grouped'
  },
  {
    id: 'event-4',
    title: 'Creator Economy Meetup',
    dateTime: '2024-12-10T19:30:00',
    location: 'The Commons, Brooklyn',
    description: 'Content creators, influencers, and brands coming together to share strategies and opportunities.',
    tags: ['Creator', 'Consumer', 'Social Media'],
    hostName: 'NYU Engage',
    spotsLeft: 8,
    hoursUntilStart: 98
  },
  {
    id: 'event-5',
    title: 'Fintech Innovation Panel',
    dateTime: '2024-12-11T17:00:00',
    location: 'Stern School of Business',
    description: 'Panel discussion with fintech leaders on the future of banking and payments.',
    tags: ['Finance', 'Tech', 'AI'],
    hostName: 'Stern Club',
    spotsLeft: 15,
    hoursUntilStart: 122
  },
  {
    id: 'event-6',
    title: 'Early Stage Startup Pitch Night',
    dateTime: '2024-12-12T18:00:00',
    location: 'NYU Tandon, Brooklyn',
    description: 'Watch early-stage startups pitch to investors and network with the ecosystem.',
    tags: ['Startups', 'VC', 'Founders'],
    hostName: 'Tech@NYU',
    spotsLeft: 12,
    hoursUntilStart: 146
  },
  {
    id: 'event-7',
    title: 'Consumer Product Demo Day',
    dateTime: '2024-12-13T16:00:00',
    location: 'The Alley, Union Square',
    description: 'See the latest consumer products from NYU entrepreneurs and investors.',
    tags: ['Consumer', 'Products', 'Demo'],
    hostName: 'NYU Engage',
    spotsLeft: 20,
    hoursUntilStart: 170
  },
  {
    id: 'event-8',
    title: 'Climate + AI Roundtable',
    dateTime: '2024-12-14T19:00:00',
    location: 'Remote',
    description: 'Discussion on how AI is being applied to climate solutions. Virtual event.',
    tags: ['AI', 'Climate', 'Tech'],
    hostName: 'Tech@NYU',
    spotsLeft: 25,
    hoursUntilStart: 194
  },
  {
    id: 'event-9',
    title: 'Finance & Tech Networking',
    dateTime: '2024-12-15T18:30:00',
    location: 'The Standard, Meatpacking',
    description: 'Connect with professionals working at the intersection of finance and technology.',
    tags: ['Finance', 'Tech', 'Networking'],
    hostName: 'Stern Club',
    spotsLeft: 6,
    hoursUntilStart: 218
  },
  {
    id: 'event-10',
    title: 'VC Portfolio Showcase',
    dateTime: '2024-12-16T17:00:00',
    location: 'A16Z Office, Soho',
    description: 'Meet portfolio companies and investors from top venture capital firms.',
    tags: ['VC', 'Finance', 'Startups'],
    hostName: 'IB Network',
    spotsLeft: 4,
    hoursUntilStart: 242
  }
];

// Hard-coded People Suggestions
export const MOCK_PEOPLE = {
  'event-1': [
    {
      id: 'person-1',
      name: 'Sarah Chen',
      school: 'NYU Stern MBA',
      headline: 'AI Product Manager at Google',
      sharedInterests: ['AI', 'Tech'],
      avatar: 'SC'
    },
    {
      id: 'person-2',
      name: 'Alex Rivera',
      school: 'NYU Tandon',
      headline: 'Founder @ AI Startup',
      sharedInterests: ['AI', 'Founders', 'Tech'],
      avatar: 'AR'
    },
    {
      id: 'person-3',
      name: 'Jordan Kim',
      school: 'NYU Stern',
      headline: 'ML Engineer',
      sharedInterests: ['AI', 'Tech'],
      avatar: 'JK'
    },
    {
      id: 'person-4',
      name: 'Taylor Morgan',
      school: 'NYU',
      headline: 'AI Researcher',
      sharedInterests: ['AI', 'Tech'],
      avatar: 'TM'
    }
  ],
  'event-2': [
    {
      id: 'person-5',
      name: 'Emma Wilson',
      school: 'NYU',
      headline: 'Climate Tech Founder',
      sharedInterests: ['Climate', 'Tech'],
      avatar: 'EW'
    },
    {
      id: 'person-6',
      name: 'Marcus Johnson',
      school: 'NYU Stern',
      headline: 'Sustainability Investor',
      sharedInterests: ['Climate', 'VC'],
      avatar: 'MJ'
    },
    {
      id: 'person-7',
      name: 'Sofia Martinez',
      school: 'NYU Tandon',
      headline: 'Climate Engineer',
      sharedInterests: ['Climate', 'Tech'],
      avatar: 'SM'
    },
    {
      id: 'person-8',
      name: 'David Park',
      school: 'NYU',
      headline: 'ESG Analyst',
      sharedInterests: ['Climate'],
      avatar: 'DP'
    }
  ],
  'event-3': [
    {
      id: 'person-9',
      name: 'Chris Lee',
      school: 'NYU Stern MBA',
      headline: 'VC Associate',
      sharedInterests: ['VC', 'Finance'],
      avatar: 'CL'
    },
    {
      id: 'person-10',
      name: 'Rachel Green',
      school: 'NYU',
      headline: 'Startup Founder',
      sharedInterests: ['VC', 'Startups'],
      avatar: 'RG'
    },
    {
      id: 'person-11',
      name: 'Michael Brown',
      school: 'NYU Stern',
      headline: 'Investment Banking',
      sharedInterests: ['Finance', 'VC'],
      avatar: 'MB'
    }
  ],
  'event-4': [
    {
      id: 'person-12',
      name: 'Olivia White',
      school: 'NYU',
      headline: 'Content Creator',
      sharedInterests: ['Creator', 'Consumer'],
      avatar: 'OW'
    },
    {
      id: 'person-13',
      name: 'Noah Harris',
      school: 'NYU',
      headline: 'Influencer Marketing',
      sharedInterests: ['Creator', 'Consumer'],
      avatar: 'NH'
    }
  ],
  'event-5': [
    {
      id: 'person-14',
      name: 'Isabella Davis',
      school: 'NYU Stern',
      headline: 'Fintech Product Manager',
      sharedInterests: ['Finance', 'Tech'],
      avatar: 'ID'
    },
    {
      id: 'person-15',
      name: 'James Wilson',
      school: 'NYU',
      headline: 'Blockchain Developer',
      sharedInterests: ['Finance', 'Tech', 'AI'],
      avatar: 'JW'
    }
  ]
};

// Interest Tags Available
export const INTEREST_TAGS = [
  'Tech', 'AI', 'Climate', 'VC', 'Finance', 'Consumer', 'Creator', 
  'Founders', 'Startups', 'Networking', 'Social Media', 'Products'
];

// Generate recommendations based on user profile
export function getRecommendedEvents(userProfile, allEvents = MOCK_EVENTS) {
  if (!userProfile || !userProfile.interests || userProfile.interests.length === 0) {
    return allEvents.slice(0, 3);
  }

  // Score events based on tag overlap
  const scored = allEvents.map(event => {
    const overlap = event.tags.filter(tag => userProfile.interests.includes(tag)).length;
    return { event, score: overlap };
  });

  // Sort by score and take top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.event);
}

// Get people for an event
export function getPeopleForEvent(eventId) {
  return MOCK_PEOPLE[eventId] || [];
}

// Generate relevance text for event based on user profile
export function getRelevanceText(event, userProfile) {
  if (!userProfile || !userProfile.interests) {
    return 'You might be interested in this event';
  }

  const matchingTags = event.tags.filter(tag => userProfile.interests.includes(tag));
  if (matchingTags.length === 0) {
    return 'This event might be relevant to you';
  }

  if (matchingTags.length === 1) {
    return `Matches your ${matchingTags[0]} interest`;
  }

  return `Matches your ${matchingTags.slice(0, 2).join(' + ')} interests`;
}

