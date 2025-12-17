import type { GraphData, GraphNodeDatum, GraphLinkDatum } from "../../lib/components/DagreGraph/types";

// Simple hierarchical organization chart
export const organizationData: GraphData = {
  nodes: [
    { id: "ceo", label: "CEO", level: 0 },
    { id: "cto", label: "CTO", level: 1 },
    { id: "cfo", label: "CFO", level: 1 },
    { id: "coo", label: "COO", level: 1 },
    { id: "eng-lead", label: "Engineering Lead", level: 2 },
    { id: "product-lead", label: "Product Lead", level: 2 },
    { id: "finance-lead", label: "Finance Lead", level: 2 },
    { id: "ops-lead", label: "Operations Lead", level: 2 },
    { id: "dev-1", label: "Dev Team 1", level: 3 },
    { id: "dev-2", label: "Dev Team 2", level: 3 },
    { id: "qa", label: "QA Team", level: 3 },
    { id: "design", label: "Design Team", level: 3 },
  ],
  links: [
    { source: "ceo", target: "cto" },
    { source: "ceo", target: "cfo" },
    { source: "ceo", target: "coo" },
    { source: "cto", target: "eng-lead" },
    { source: "cto", target: "product-lead" },
    { source: "cfo", target: "finance-lead" },
    { source: "coo", target: "ops-lead" },
    { source: "eng-lead", target: "dev-1" },
    { source: "eng-lead", target: "dev-2" },
    { source: "eng-lead", target: "qa" },
    { source: "product-lead", target: "design" },
  ],
};

// Workflow/Process diagram with labeled edges
export const workflowData: GraphData = {
  nodes: [
    { id: "start", label: "Start", level: 0 },
    { id: "planning", label: "Planning", level: 1 },
    { id: "design", label: "Design", level: 2 },
    { id: "development", label: "Development", level: 3 },
    { id: "testing", label: "Testing", level: 4 },
    { id: "review", label: "Code Review", level: 4 },
    { id: "staging", label: "Staging", level: 5 },
    { id: "production", label: "Production", level: 6 },
    { id: "monitoring", label: "Monitoring", level: 7 },
  ],
  links: [
    { source: "start", target: "planning", label: "Initialize" },
    { source: "planning", target: "design", label: "Approved" },
    { source: "design", target: "development", label: "Specs Ready" },
    { source: "development", target: "testing", label: "Complete" },
    { source: "development", target: "review", label: "Submit PR" },
    { source: "testing", target: "staging", label: "Pass" },
    { source: "review", target: "staging", label: "Approved" },
    { source: "staging", target: "production", label: "Deploy" },
    { source: "production", target: "monitoring", label: "Live" },
    { source: "monitoring", target: "planning", label: "Issues Found" },
  ],
};

// Task dependency graph
export const taskDependencyData: GraphData = {
  nodes: [
    { id: "task1", label: "Setup Environment", level: 0, status: "completed" },
    { id: "task2", label: "Database Design", level: 1, status: "completed" },
    { id: "task3", label: "API Development", level: 2, status: "in-progress" },
    { id: "task4", label: "Frontend Setup", level: 1, status: "completed" },
    { id: "task5", label: "UI Components", level: 2, status: "in-progress" },
    { id: "task6", label: "Integration", level: 3, status: "pending" },
    { id: "task7", label: "Testing", level: 4, status: "pending" },
    { id: "task8", label: "Documentation", level: 3, status: "pending" },
    { id: "task9", label: "Deployment", level: 5, status: "pending" },
  ],
  links: [
    { source: "task1", target: "task2" },
    { source: "task1", target: "task4" },
    { source: "task2", target: "task3" },
    { source: "task4", target: "task5" },
    { source: "task3", target: "task6" },
    { source: "task5", target: "task6" },
    { source: "task6", target: "task7" },
    { source: "task6", target: "task8" },
    { source: "task7", target: "task9" },
    { source: "task8", target: "task9" },
  ],
};

// System architecture diagram
export const systemArchitectureData: GraphData = {
  nodes: [
    { id: "client", label: "Client App", level: 0, type: "frontend" },
    { id: "cdn", label: "CDN", level: 1, type: "infrastructure" },
    { id: "lb", label: "Load Balancer", level: 2, type: "infrastructure" },
    { id: "api-1", label: "API Server 1", level: 3, type: "backend" },
    { id: "api-2", label: "API Server 2", level: 3, type: "backend" },
    { id: "cache", label: "Redis Cache", level: 4, type: "database" },
    { id: "db-master", label: "DB Master", level: 4, type: "database" },
    { id: "db-replica", label: "DB Replica", level: 5, type: "database" },
    { id: "queue", label: "Message Queue", level: 4, type: "infrastructure" },
    { id: "worker", label: "Worker", level: 5, type: "backend" },
    { id: "storage", label: "Object Storage", level: 5, type: "infrastructure" },
  ],
  links: [
    { source: "client", target: "cdn" },
    { source: "client", target: "lb" },
    { source: "cdn", target: "lb" },
    { source: "lb", target: "api-1" },
    { source: "lb", target: "api-2" },
    { source: "api-1", target: "cache" },
    { source: "api-2", target: "cache" },
    { source: "api-1", target: "db-master" },
    { source: "api-2", target: "db-master" },
    { source: "db-master", target: "db-replica" },
    { source: "api-1", target: "queue" },
    { source: "api-2", target: "queue" },
    { source: "queue", target: "worker" },
    { source: "worker", target: "storage" },
  ],
};

// Decision tree
export const decisionTreeData: GraphData = {
  nodes: [
    { id: "root", label: "Customer Visit", level: 0 },
    { id: "member", label: "Is Member?", level: 1 },
    { id: "member-yes", label: "Apply Discount", level: 2 },
    { id: "member-no", label: "Offer Signup", level: 2 },
    { id: "cart-value", label: "Cart > $100?", level: 3 },
    { id: "free-shipping", label: "Free Shipping", level: 4 },
    { id: "standard-shipping", label: "Standard Shipping", level: 4 },
    { id: "checkout", label: "Checkout", level: 5 },
  ],
  links: [
    { source: "root", target: "member" },
    { source: "member", target: "member-yes", label: "Yes" },
    { source: "member", target: "member-no", label: "No" },
    { source: "member-yes", target: "cart-value" },
    { source: "member-no", target: "cart-value" },
    { source: "cart-value", target: "free-shipping", label: "Yes" },
    { source: "cart-value", target: "standard-shipping", label: "No" },
    { source: "free-shipping", target: "checkout" },
    { source: "standard-shipping", target: "checkout" },
  ],
};
