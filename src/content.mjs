// Shared copy. Rule: nothing here may claim clients, results, revenue, ROAS, leads generated,
// testimonials, awards, partnerships, headcount, years in business or customer logos.

export const heroNodes = [
  { vis: 'traffic', title: 'Traffic', text: 'Search, paid, organic and referral demand.' },
  { vis: 'page', title: 'Conversion', text: 'Pages, offers, forms and booking flows.' },
  { vis: 'flow', title: 'Automation', text: 'Qualification, follow-up and workflows.' },
  { vis: 'network', title: 'Intelligence', text: 'Tracking, attribution and AI analysis.' },
  { vis: 'steps', title: 'Revenue', text: 'Pipeline measured back to its source.' },
];

export const dentalNodes = [
  { vis: 'traffic', title: 'Demand', text: 'Google Ads and Meta Ads for implant and cosmetic demand.' },
  { vis: 'page', title: 'Experience', text: 'Treatment-specific landing pages and offers.' },
  { vis: 'flow', title: 'Follow-up', text: 'AI-assisted qualification and automated follow-up.' },
  { vis: 'network', title: 'Tracking', text: 'Calls, forms and bookings tied to their source.' },
  { vis: 'steps', title: 'Revenue', text: 'Appointments and treatment value attributed to campaigns.' },
];

export const stripSteps = ['Acquire', 'Convert', 'Automate', 'Measure', 'Scale'];

export const fragments = [
  'Advertising',
  'Websites',
  'Landing pages',
  'Lead capture',
  'CRM',
  'Follow-up',
  'Sales processes',
  'Analytics',
  'Automation',
  'Customer data',
];

export const stages = [
  {
    n: '01',
    title: 'Attract',
    text: 'Paid acquisition, organic discovery, content and targeted campaigns.',
    examine: 'Channel mix, targeting and offer-market fit.',
    build: 'Paid, organic and content programs aimed at qualified demand.',
    measure: 'The cost and quality of opportunities, not just traffic.',
  },
  {
    n: '02',
    title: 'Convert',
    text: 'Landing pages, websites, offers, forms and conversion optimization.',
    examine: 'Where visitors stall between the click and the inquiry.',
    build: 'Landing pages, websites, offers and forms designed around one clear action.',
    measure: 'Conversion rate by source, page and offer.',
  },
  {
    n: '03',
    title: 'Engage',
    text: 'CRM, automated follow-up, lead qualification and customer communication.',
    examine: 'The speed, consistency and quality of follow-up.',
    build: 'CRM pipelines, lead qualification and automated follow-up.',
    measure: 'Response time, contact rate and progression through the pipeline.',
  },
  {
    n: '04',
    title: 'Intelligence',
    text: 'Analytics, attribution, customer data and AI-assisted decision making.',
    examine: 'What is tracked today and what is missing.',
    build: 'Tracking, attribution and dashboards connected to revenue.',
    measure: 'Which channels, pages and messages actually produce revenue.',
  },
  {
    n: '05',
    title: 'Scale',
    text: 'Identify what works, automate repetitive processes and increase investment into winning channels.',
    examine: 'Which parts of the system work and which do not.',
    build: 'Automation for repetitive work and a plan to scale winning channels.',
    measure: 'Return on each additional unit of investment, channel by channel.',
  },
];

export const capabilities = [
  {
    id: 'acquisition',
    icon: 'acquire',
    title: 'Customer Acquisition',
    stage: 'Attract',
    text: 'Paid advertising, campaign strategy, targeting and demand generation.',
    covers: [
      'Paid search and paid social campaigns',
      'Audience, offer and message strategy',
      'Demand generation across channels',
      'Budget allocation guided by what happens after the click',
    ],
  },
  {
    id: 'conversion',
    icon: 'convert',
    title: 'Conversion Optimization',
    stage: 'Convert',
    text: 'Landing pages, websites, offers, funnels and conversion optimization.',
    covers: [
      'Landing pages and websites built to convert',
      'Offer and messaging development',
      'Forms, calls and booking flows',
      'Testing and iteration based on measured behavior',
    ],
  },
  {
    id: 'automation',
    icon: 'automate',
    title: 'AI & Automation',
    stage: 'Engage',
    text: 'AI workflows, lead qualification, automated follow-up and operational automation.',
    covers: [
      'AI-assisted lead qualification',
      'Automated follow-up by email and SMS',
      'Workflow automation across your tools',
      'Faster research, drafting and analysis',
    ],
  },
  {
    id: 'crm',
    icon: 'crm',
    title: 'CRM & Revenue Systems',
    stage: 'Engage',
    text: 'Lead management, pipelines, customer journeys and sales-process automation.',
    covers: [
      'CRM setup and pipeline design',
      'Lead routing and ownership',
      'Customer journey mapping',
      'Sales-process automation and handoffs',
    ],
  },
  {
    id: 'analytics',
    icon: 'data',
    title: 'Data & Analytics',
    stage: 'Intelligence',
    text: 'Tracking, attribution, dashboards and performance intelligence.',
    covers: [
      'Event and conversion tracking',
      'Attribution from first touch to revenue',
      'Dashboards organized around revenue outcomes',
      'AI-assisted analysis to find bottlenecks',
    ],
  },
  {
    id: 'content',
    icon: 'search',
    title: 'Growth Content & SEO',
    stage: 'Attract',
    text: 'Search visibility, content systems and long-term organic acquisition.',
    covers: [
      'Search visibility and technical foundations',
      'Content systems built to be repeatable',
      'Organic acquisition that compounds over time',
    ],
  },
];

export const compare = {
  traditional: [
    'Separate marketing channels',
    'Manual processes',
    'Generic campaigns',
    'Slow reporting',
    'Human-heavy execution',
    'Activity-focused reporting',
  ],
  revanta: [
    'Connected growth systems',
    'AI-assisted execution',
    'Automation-first processes',
    'Conversion-focused thinking',
    'Data-driven decisions',
    'Revenue-oriented measurement',
  ],
};

export const aiAreas = [
  'Research',
  'Content production',
  'Lead qualification',
  'Automation',
  'Analysis',
  'Workflow optimization',
];

export const dentalFlow = [
  'Demand Generation',
  'High-Converting Experience',
  'Lead Capture',
  'AI-Assisted Qualification & Follow-Up',
  'Appointment Opportunity',
  'Revenue',
];

export const industries = [
  {
    name: 'Dental',
    status: 'Initial focus',
    text: 'High-value dental practices and elective procedures.',
    href: '/industries/dental',
  },
  {
    name: 'Healthcare',
    status: 'Future expansion',
    text: 'Growth systems for high-value healthcare businesses.',
  },
  {
    name: 'Professional Services',
    status: 'Future expansion',
    text: 'Growth systems for firms where each customer represents significant lifetime value.',
  },
  {
    name: 'Home & Commercial Services',
    status: 'Future expansion',
    text: 'Acquisition and conversion systems for high-value service businesses.',
  },
  {
    name: 'Technology & B2B',
    status: 'Future expansion',
    text: 'Growth infrastructure for technology and B2B companies.',
  },
];

export const process = [
  {
    n: '01',
    title: 'Diagnose',
    text: 'Understand the business, economics, customer journey and current growth bottlenecks.',
  },
  { n: '02', title: 'Design', text: 'Build the acquisition, conversion and automation architecture.' },
  { n: '03', title: 'Deploy', text: 'Launch campaigns, websites, workflows, tracking and systems.' },
  {
    n: '04',
    title: 'Optimize',
    text: 'Measure results, identify bottlenecks and continuously improve the system.',
  },
];

export const principles = [
  {
    title: 'We understand the economics.',
    text: 'Before channels or tactics, we work out what a customer is worth and what growth is worth to the business.',
  },
  {
    title: 'We build the system.',
    text: 'Acquisition, conversion, automation and data are designed together, not bought as separate services.',
  },
  {
    title: 'We measure what happens.',
    text: 'Reporting is organized around opportunities and revenue, not activity.',
  },
  {
    title: 'We improve it.',
    text: 'Every deployment is a starting point. The system is refined as the data comes in.',
  },
];

// Sample growth system (home and /solutions).
export const archNodes = [
  {
    icon: 'acquire',
    title: 'Traffic',
    items: ['Google', 'Meta', 'Organic', 'Referral'],
    text: 'Demand from the channels that fit the business.',
  },
  {
    icon: 'convert',
    title: 'Experience',
    items: ['Website', 'Landing page', 'Offer'],
    text: 'The page and offer a visitor lands on.',
  },
  {
    icon: 'plus',
    title: 'Conversion',
    items: ['Form', 'Call', 'Booking'],
    text: 'The action that turns interest into an opportunity.',
  },
  {
    icon: 'data',
    title: 'Intelligence',
    items: ['CRM', 'Tracking', 'AI'],
    text: 'Every opportunity recorded, attributed and qualified.',
  },
  {
    icon: 'automate',
    title: 'Follow-Up',
    items: ['Email', 'SMS', 'Automation'],
    text: 'Fast, consistent follow-up without manual effort.',
  },
  {
    icon: 'crm',
    title: 'Sales',
    items: [],
    text: 'Qualified opportunities handed to the team to close.',
  },
  {
    icon: 'check',
    title: 'Revenue',
    items: [],
    text: 'Outcomes measured back to where they started.',
  },
];

export const faqs = [
  {
    q: 'What does Revanta do?',
    a: 'Revanta builds AI-powered growth systems combining acquisition, conversion, automation, technology and data.',
  },
  {
    q: 'Is Revanta a marketing agency?',
    a: 'Revanta operates at the intersection of growth, marketing and technology. Rather than selling isolated marketing services, we build connected systems designed around measurable business outcomes.',
  },
  {
    q: 'Why are you starting with dental?',
    a: 'Dental is our initial market because high-value treatments create clear economics around customer acquisition and measurable growth. It is our starting point, not our long-term limitation.',
  },
  {
    q: 'Do you only work with dentists?',
    a: 'No. Dental is currently our initial focus. Revanta is being built to serve multiple high-value industries over time.',
  },
  {
    q: 'Do you guarantee leads or revenue?',
    a: 'No. Growth depends on many variables. Revanta focuses on building, measuring and continuously optimizing the systems that influence acquisition and conversion.',
  },
  {
    q: 'Do you use AI?',
    a: 'Yes. AI is integrated where it provides meaningful leverage, including research, workflows, automation, analysis, content and operational processes.',
  },
];

export const dentalFaqs = [
  {
    q: 'Which treatments does the Dental Growth System focus on?',
    a: 'Dental implants, cosmetic dentistry and other high-value treatments, where each new patient can carry significant value to the practice.',
  },
  {
    q: 'Which channels do you use?',
    a: 'Google Ads and Meta Ads for demand generation, supported by treatment-specific landing pages, lead capture, follow-up and tracking. The right channel mix depends on the practice and its economics.',
  },
  {
    q: 'How does AI fit into dental lead generation?',
    a: 'AI helps qualify incoming inquiries and trigger timely, consistent follow-up so fewer opportunities go cold. It supports the practice team; it does not replace it.',
  },
  {
    q: 'Do you guarantee new patients or revenue?',
    a: 'No. Growth depends on many variables. Revanta focuses on building, measuring and continuously optimizing the systems that influence acquisition and conversion.',
  },
  {
    q: 'Is Revanta only for dental practices?',
    a: 'No. Dental is our initial focus. Revanta is being built to serve multiple high-value industries over time.',
  },
];

// What every future case study will contain (rendered on /case-studies and used by the case study template).
export const caseStudyFields = [
  'Business challenge',
  'Starting situation',
  'Strategy',
  'Growth system implemented',
  'Acquisition channels',
  'Conversion improvements',
  'Automation',
  'Results',
  'Lessons learned',
];
