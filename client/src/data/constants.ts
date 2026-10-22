export const ENGINEERING_BRANCHES = [
  'Computer Engineering',
  'Computer Science Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering'
];

export const STUDY_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

export const GRADUATION_YEARS = [
  '2025',
  '2026',
  '2027',
  '2028',
  '2029'
];

export const ACADEMIC_PERFORMANCE_OPTIONS = [
  { value: 'Developing', label: 'Developing (Building foundational concepts)' },
  { value: 'Intermediate', label: 'Intermediate (Consistent academic standing)' },
  { value: 'Strong', label: 'Strong (High coursework consistency)' },
  { value: 'Unspecified', label: 'Prefer not to disclose (Focus on technical skills)' }
];

export const SKILL_CATEGORIES: { name: string; skills: string[] }[] = [
  {
    name: 'Programming Fundamentals',
    skills: ['Python', 'C++', 'Java', 'C', 'JavaScript', 'TypeScript', 'SQL']
  },
  {
    name: 'Web & App Development',
    skills: ['HTML/CSS', 'React', 'Node.js', 'Database Management', 'Express', 'Next.js', 'REST APIs', 'MongoDB']
  },
  {
    name: 'Computer Science Core',
    skills: ['DSA', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'OOP', 'Linux', 'Git']
  },
  {
    name: 'Data Science & Machine Learning',
    skills: ['Data analysis', 'Statistics', 'pandas', 'NumPy', 'scikit-learn', 'Linear algebra', 'Excel', 'Power BI', 'Tableau']
  },
  {
    name: 'Cloud, Systems & Security',
    skills: ['Cloud basics', 'Docker', 'CI/CD', 'Cybersecurity basics', 'Networking', 'Linux']
  },
  {
    name: 'Electronics, IoT & Semiconductors',
    skills: ['Digital electronics', 'Circuit analysis', 'Arduino', 'Microcontrollers', 'Embedded C', 'IoT', 'Verilog', 'Logic design', 'MATLAB']
  },
  {
    name: 'Mechanical & Automation',
    skills: ['CAD', 'SolidWorks', 'AutoCAD', '3D printing', 'CNC basics', 'Control systems', 'Robotics basics']
  },
  {
    name: 'Civil & Infrastructure',
    skills: ['AutoCAD', 'Revit', 'BIM basics', 'STAAD.Pro', 'Structural analysis', 'Project planning', 'GIS basics']
  },
  {
    name: 'Electrical, Energy & Chemical',
    skills: ['Power systems', 'Renewable energy', 'AutoCAD Electrical', 'PLC basics', 'Process simulation', 'Thermodynamics', 'Mass transfer', 'Process safety']
  },
  {
    name: 'Product Design & UI/UX',
    skills: ['Figma', 'Wireframing', 'Visual design', 'User research', 'Prototyping']
  }
];

export const INTEREST_OPTIONS = [
  {
    id: 'building applications',
    label: 'Building websites, software and web apps',
    desc: 'Creating full-stack products, responsive user interfaces, and backend server APIs.',
    icon: 'Code'
  },
  {
    id: 'working with data and patterns',
    label: 'Working with data, dashboards and trends',
    desc: 'Cleaning messy datasets, computing statistics, and uncovering business insights.',
    icon: 'BarChart3'
  },
  {
    id: 'AI, prediction and experimentation',
    label: 'Developing AI, predictive models and algorithms',
    desc: 'Training machine learning models, neural networks, and experimenting with data science.',
    icon: 'Sparkles'
  },
  {
    id: 'security and problem investigation',
    label: 'Cybersecurity and system protection',
    desc: 'Identifying vulnerabilities, analyzing network logs, and defending digital systems.',
    icon: 'ShieldCheck'
  },
  {
    id: 'automation, deployment and infrastructure',
    label: 'Cloud infrastructure, containers and DevOps',
    desc: 'Automating build pipelines, running containers, and configuring scalable cloud servers.',
    icon: 'Cloud'
  },
  {
    id: 'hardware, sensors and connected devices',
    label: 'Hardware, microcontrollers, sensors and IoT',
    desc: 'Tinkering with microcontrollers, breadboards, embedded firmware, and silicon chips.',
    icon: 'Cpu'
  },
  {
    id: 'robots and intelligent machines',
    label: 'Robotics, motor control and autonomous systems',
    desc: 'Designing automated machines, kinematic motion systems, and smart actuators.',
    icon: 'Bot'
  },
  {
    id: 'visual design and user experience',
    label: 'UI/UX, visual design and interactive prototypes',
    desc: 'Designing intuitive wireframes, accessibility systems, and delightful digital user journeys.',
    icon: 'Palette'
  },
  {
    id: 'product design and manufacturing',
    label: 'Mechanical CAD, 3D printing and manufacturing',
    desc: 'Designing parametric 3D assemblies, prototyping components, and modern fabrication.',
    icon: 'Wrench'
  },
  {
    id: 'buildings, structures and digital construction',
    label: 'Civil design, structural safety and BIM',
    desc: 'Planning resilient infrastructure, 3D building models, and structural calculations.',
    icon: 'Building2'
  },
  {
    id: 'power systems and sustainability',
    label: 'Electrical power grids and renewable clean tech',
    desc: 'Working with solar-wind energy, power distribution, transformers, and clean energy storage.',
    icon: 'Zap'
  },
  {
    id: 'chemical processes, materials and safety',
    label: 'Chemical process optimization and plant safety',
    desc: 'Simulating industrial thermodynamic reactions, fluid balances, and safety protocols.',
    icon: 'FlaskConical'
  }
];

export const WORK_STYLE_OPTIONS = [
  {
    id: 'hands-on building',
    label: 'Hands-on Building',
    desc: 'I learn fastest by assembling working prototypes, writing actual code, or building circuits.'
  },
  {
    id: 'analytical problem-solving',
    label: 'Analytical & Methodical',
    desc: 'I enjoy breaking complex algorithmic challenges or datasets down into logical components.'
  },
  {
    id: 'creative exploration',
    label: 'Creative Exploration',
    desc: 'I enjoy brainstorming open-ended design solutions and exploring creative visual ideas.'
  },
  {
    id: 'research and experimentation',
    label: 'Research & Deep Theory',
    desc: 'I appreciate reading papers, understanding mathematical proofs, and methodical trial-and-error.'
  },
  {
    id: 'team-based delivery',
    label: 'Team-Based Delivery',
    desc: 'I thrive when collaborating with diverse teammates, aligning goals, and shipping together.'
  }
];

export const CAREER_ASPIRATION_OPTIONS = [
  {
    id: 'internship first',
    label: 'Securing an Internship Soon',
    desc: 'Priority is landing a high-impact internship within the next 3–6 months.'
  },
  {
    id: 'industry job after graduation',
    label: 'Full-time Industry Placement',
    desc: 'Preparing systematically for campus placements or off-campus entry-level engineering roles.'
  },
  {
    id: 'higher studies and research',
    label: 'Higher Studies & Research (MS / M.Tech)',
    desc: 'Aiming for research publications, deep specialized knowledge, and master’s admissions.'
  },
  {
    id: 'explore before choosing a specialization',
    label: 'Exploratory Career Discovery',
    desc: 'Keeping options open to discover which engineering niche aligns best with my strengths.'
  }
];
