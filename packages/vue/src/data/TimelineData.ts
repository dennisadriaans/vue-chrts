export type TimelineItem = {
  name: string;
  color: string;
  startDate: number;
  endDate: number;
  department: "Frontend" | "Backend" | "UX";
  description?: string;
  label?: string;
};

const SPRINT_START_MS = 1728172800000;
const SPRINT_END_MS = 1729296000000;

export enum ProductType {
  Frontend = "Frontend",
  Backend = "Backend",
  UX = "UX",
}

const COLORS = {
  Frontend: "#FF5733",
  Backend: "#33FF57",
  UX: "#3357FF",
};

export const data: TimelineItem[] = [
  {
    name: "Implement Mobile AdSense Dashboard",
    color: COLORS.Frontend,
    startDate: SPRINT_START_MS + 2 * 86400000,
    endDate: SPRINT_START_MS + 6 * 86400000,
    department: "Frontend" as const,
    description:
      "Develop a responsive dashboard for AdSense performance on mobile devices using modern frameworks.",
  },
  {
    name: "Update YouTube PS Vita UI",
    color: COLORS.Frontend,
    startDate: SPRINT_START_MS + 7 * 86400000,
    endDate: SPRINT_END_MS - 1 * 86400000,
    department: "Frontend" as const,
    description:
      "Refactor the old YouTube player interface to comply with new brand guidelines and improve load times.",
  },
  {
    name: "Integrate AR Playground Assets",
    color: COLORS.Frontend,
    startDate: SPRINT_START_MS + 1 * 86400000,
    endDate: SPRINT_START_MS + 5 * 86400000,
    department: "Frontend" as const,
    description:
      "Develop and integrate 3D model assets and animations for the new augmented reality feature.",
  },

  {
    name: "Optimize Google Search Posts API",
    color: COLORS.Backend,
    startDate: SPRINT_START_MS,
    endDate: SPRINT_START_MS + 4 * 86400000,
    department: "Backend" as const,
    description:
      "Review and optimize the database query performance for celebrity post data retrieval in the search knowledge panel.",
  },
  {
    name: "Develop Cloud ML Prediction Endpoint",
    color: COLORS.Backend,
    startDate: SPRINT_START_MS + 5 * 86400000,
    endDate: SPRINT_START_MS + 10 * 86400000,
    department: "Backend" as const,
    description:
      "Implement a new secure and scalable REST endpoint for the machine learning prediction model service.",
  },
  {
    name: "Refactor Google Currents User Service",
    color: COLORS.Backend,
    startDate: SPRINT_START_MS + 3 * 86400000,
    endDate: SPRINT_END_MS,
    department: "Backend" as const,
    description:
      "Migrate user profile and authentication services for Google Currents to the new microservice architecture.",
  },
  {
    name: "Implement User-Blocking Logic",
    color: COLORS.Backend,
    startDate: SPRINT_START_MS,
    endDate: SPRINT_START_MS + 2 * 86400000,
    department: "Backend" as const,
    description:
      "Write the server-side logic and database schema for the Personal Blocklist feature in Search.",
  },

  {
    name: "Design System for Assistant Snapshot",
    color: COLORS.UX,
    startDate: SPRINT_START_MS + 1 * 86400000,
    endDate: SPRINT_START_MS + 5 * 86400000,
    department: "UX" as const,
    description:
      "Create a comprehensive design system and component library for the new Google Assistant Snapshot predictive cards.",
  },
  {
    name: "User Flow for Google Sites Creation",
    color: COLORS.UX,
    startDate: SPRINT_START_MS + 6 * 86400000,
    endDate: SPRINT_END_MS,
    department: "UX" as const,
    description:
      "Map out and prototype the optimal user flow for creating and publishing a new website in Google Sites.",
  },
  {
    name: "A/B Test Community Contrib. Buttons",
    color: COLORS.UX,
    startDate: SPRINT_START_MS + 3 * 86400000,
    endDate: SPRINT_START_MS + 8 * 86400000,
    department: "UX" as const,
    description:
      "Conduct A/B testing on button placement and microcopy for the YouTube Community Contributions feature.",
  },
].sort((p1, p2) => p1.startDate - p2.startDate);
