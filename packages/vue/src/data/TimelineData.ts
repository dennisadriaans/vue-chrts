export type DataRecord = {
  name: string;
  color: string;
  startDate: number;
  endDate: number;
  department: 'Frontend' | 'Backend' | 'UX'; // Changed from 'type'
  description?: string;
};

// Define constants for the new departments and their associated colors
const SPRINT_START_MS = 1728172800000; // Monday, October 6, 2025 00:00:00 GMT
const SPRINT_END_MS = 1729296000000;   // Friday, October 17, 2025 00:00:00 GMT

export enum ProductType {
  Frontend = "Frontend",
  Backend = "Backend",
  Ux = "Ux",
}

const COLORS = {
  Frontend: '#FF5733', // Vibrant Orange for App/Frontend
  Backend: '#33FF57',  // Bright Green for Service/Backend
  UX: '#3357FF',       // Deep Blue for Hardware/UX
};

export const data: DataRecord[] = [
  // --- Frontend Tasks (Derived from 'App' type) ---
  {
    name: 'Implement Mobile AdSense Dashboard',
    color: COLORS.Frontend,
    startDate: SPRINT_START_MS + (2 * 86400000), // Start on Oct 8
    endDate: SPRINT_START_MS + (6 * 86400000),   // End on Oct 12
    department: 'Frontend',
    description: 'Develop a responsive dashboard for AdSense performance on mobile devices using modern frameworks.',
  },
  {
    name: 'Update YouTube PS Vita UI',
    color: COLORS.Frontend,
    startDate: SPRINT_START_MS + (7 * 86400000), // Start on Oct 13
    endDate: SPRINT_END_MS - (1 * 86400000),     // End on Oct 16
    department: 'Frontend',
    description: 'Refactor the old YouTube player interface to comply with new brand guidelines and improve load times.',
  },
  {
    name: 'Integrate AR Playground Assets',
    color: COLORS.Frontend,
    startDate: SPRINT_START_MS + (1 * 86400000), // Start on Oct 7
    endDate: SPRINT_START_MS + (5 * 86400000),   // End on Oct 11
    department: 'Frontend',
    description: 'Develop and integrate 3D model assets and animations for the new augmented reality feature.',
  },
  
  // --- Backend Tasks (Derived from 'Service' type) ---
  {
    name: 'Optimize Google Search Posts API',
    color: COLORS.Backend,
    startDate: SPRINT_START_MS, // Start on Oct 6
    endDate: SPRINT_START_MS + (4 * 86400000), // End on Oct 10
    department: 'Backend',
    description: 'Review and optimize the database query performance for celebrity post data retrieval in the search knowledge panel.',
  },
  {
    name: 'Develop Cloud ML Prediction Endpoint',
    color: COLORS.Backend,
    startDate: SPRINT_START_MS + (5 * 86400000), // Start on Oct 11
    endDate: SPRINT_START_MS + (10 * 86400000),  // End on Oct 16
    department: 'Backend',
    description: 'Implement a new secure and scalable REST endpoint for the machine learning prediction model service.',
  },
  {
    name: 'Refactor Google Currents User Service',
    color: COLORS.Backend,
    startDate: SPRINT_START_MS + (3 * 86400000), // Start on Oct 9
    endDate: SPRINT_END_MS,                      // End on Oct 17
    department: 'Backend',
    description: 'Migrate user profile and authentication services for Google Currents to the new microservice architecture.',
  },
  {
    name: 'Implement User-Blocking Logic',
    color: COLORS.Backend,
    startDate: SPRINT_START_MS, // Start on Oct 6
    endDate: SPRINT_START_MS + (2 * 86400000), // End on Oct 8
    department: 'Backend',
    description: 'Write the server-side logic and database schema for the Personal Blocklist feature in Search.',
  },

  // --- UX Tasks (New Tasks using the 'Hardware' color equivalent) ---
  {
    name: 'Design System for Assistant Snapshot',
    color: COLORS.UX,
    startDate: SPRINT_START_MS + (1 * 86400000), // Start on Oct 7
    endDate: SPRINT_START_MS + (5 * 86400000),   // End on Oct 11
    department: 'UX',
    description: 'Create a comprehensive design system and component library for the new Google Assistant Snapshot predictive cards.',
  },
  {
    name: 'User Flow for Google Sites Creation',
    color: COLORS.UX,
    startDate: SPRINT_START_MS + (6 * 86400000), // Start on Oct 12
    endDate: SPRINT_END_MS,                      // End on Oct 17
    department: 'UX',
    description: 'Map out and prototype the optimal user flow for creating and publishing a new website in Google Sites.',
  },
  {
    name: 'A/B Test Community Contrib. Buttons',
    color: COLORS.UX,
    startDate: SPRINT_START_MS + (3 * 86400000), // Start on Oct 9
    endDate: SPRINT_START_MS + (8 * 86400000),   // End on Oct 14
    department: 'UX',
    description: 'Conduct A/B testing on button placement and microcopy for the YouTube Community Contributions feature.',
  },
].sort((p1, p2) => p1.startDate - p2.startDate);