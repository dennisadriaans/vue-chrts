<script lang="ts" setup>
import { ref } from "vue";
import { DagreGraph, LegendPosition, type GraphNodeDatum, type GraphLinkDatum } from "../lib";
import Card from "./elements/Card.vue";
import {
  organizationData,
  workflowData,
  taskDependencyData,
  systemArchitectureData,
  decisionTreeData,
} from "./data/DagreGraphData";

// Event logging
const lastEvent = ref<string>("");

const handleNodeClick = (node: GraphNodeDatum, event?: MouseEvent) => {
  lastEvent.value = `Node clicked: ${node.label || node.id}`;
  console.log('Node clicked:', node, event);
};

const handleNodeMouseover = (node: GraphNodeDatum, event?: MouseEvent) => {
  console.log('Node mouseover:', node, event);
};

const handleNodeMouseout = (node: GraphNodeDatum, event?: MouseEvent) => {
  console.log('Node mouseout:', node, event);
};

const handleLinkClick = (link: GraphLinkDatum, event?: MouseEvent) => {
  lastEvent.value = `Link clicked: ${link.source} → ${link.target}`;
  console.log('Link clicked:', link, event);
};

const handleLinkMouseover = (link: GraphLinkDatum, event?: MouseEvent) => {
  console.log('Link mouseover:', link, event);
};

const handleLinkMouseout = (link: GraphLinkDatum, event?: MouseEvent) => {
  console.log('Link mouseout:', link, event);
};

// Color schemes
const organizationColors = {
  0: "#8b5cf6", // CEO - Purple
  1: "#3b82f6", // C-level - Blue
  2: "#10b981", // Leads - Green
  3: "#f59e0b", // Teams - Orange
};

const statusColors = {
  completed: "#10b981", // Green
  "in-progress": "#3b82f6", // Blue
  pending: "#9ca3af", // Gray
};

const typeColors = {
  frontend: "#3b82f6", // Blue
  backend: "#10b981", // Green
  database: "#8b5cf6", // Purple
  infrastructure: "#f59e0b", // Orange
};

// Custom node fill functions
const getOrganizationNodeColor = (node: any) => {
  return organizationColors[node.level as keyof typeof organizationColors] || "#6b7280";
};

const getTaskNodeColor = (node: any) => {
  return statusColors[node.status as keyof typeof statusColors] || "#6b7280";
};

const getSystemNodeColor = (node: any) => {
  return typeColors[node.type as keyof typeof typeColors] || "#6b7280";
};

// Custom node shapes
const getTaskNodeShape = (node: any) => {
  if (node.status === "completed") return "square";
  if (node.status === "in-progress") return "circle";
  return "triangle";
};

const getSystemNodeShape = (node: any) => {
  if (node.type === "database") return "diamond";
  if (node.type === "frontend") return "square";
  return "circle";
};

// Legend items for task status
const taskLegendItems = [
  { name: "Completed", color: statusColors.completed },
  { name: "In Progress", color: statusColors["in-progress"] },
  { name: "Pending", color: statusColors.pending },
];

// Legend items for system types
const systemLegendItems = [
  { name: "Frontend", color: typeColors.frontend },
  { name: "Backend", color: typeColors.backend },
  { name: "Database", color: typeColors.database },
  { name: "Infrastructure", color: typeColors.infrastructure },
];
</script>

<template>
  <div class="space-y-4 pb-24 pt-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Introduction -->
      <div class="px-4">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dagre Layout Graph
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Hierarchical graph visualization using the Dagre layout algorithm. Perfect for
          organizational charts, workflows, dependency trees, and system architectures.
        </p>
      </div>

      <!-- Organization Chart -->
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Organization Chart (Interactive)</h2>
          <p class="text-neutral-400 text-sm">
            Hierarchical organizational structure with automatic top-to-bottom layout. Click on nodes or links to see events in action.
          </p>
          <div v-if="lastEvent" class="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded text-sm">
            <strong>Last Event:</strong> {{ lastEvent }}
          </div>
        </div>
        <div class="mt-4">
          <DagreGraph
            :data="organizationData"
            :height="500"
            :dagre-layout-settings="{
              rankdir: 'TB',
              nodesep: 80,
              ranksep: 120,
            }"
            :node-fill="getOrganizationNodeColor"
            :node-size="50"
            :node-stroke="'#ffffff'"
            :node-stroke-width="3"
            :link-arrow="'end'"
            @node-click="handleNodeClick"
            @node-mouseover="handleNodeMouseover"
            @node-mouseout="handleNodeMouseout"
            @link-click="handleLinkClick"
            @link-mouseover="handleLinkMouseover"
            @link-mouseout="handleLinkMouseout"
          />
        </div>
      </Card>

      <!-- Workflow Diagram -->
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Workflow Diagram</h2>
          <p class="text-neutral-400 text-sm">
            Process flow with labeled edges showing transitions between stages.
          </p>
        </div>
        <div class="mt-4">
          <DagreGraph
            :data="workflowData"
            :height="600"
            :dagre-layout-settings="{
              rankdir: 'TB',
              nodesep: 60,
              ranksep: 100,
              ranker: 'tight-tree',
            }"
            :node-fill="'#3b82f6'"
            :node-size="45"
            :node-shape="'square'"
            :link-arrow="'end'"
            :link-stroke="'#60a5fa'"
            :link-width="2"
          />
        </div>
      </Card>

      <!-- Task Dependencies (Horizontal) -->
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Task Dependencies</h2>
          <p class="text-neutral-400 text-sm">
            Project tasks with dependencies, colored by status. Horizontal left-to-right layout.
          </p>
        </div>
        <div class="mt-4">
          <DagreGraph
            :data="taskDependencyData"
            :height="400"
            :dagre-layout-settings="{
              rankdir: 'LR',
              nodesep: 50,
              ranksep: 150,
            }"
            :node-fill="getTaskNodeColor"
            :node-shape="getTaskNodeShape"
            :node-size="40"
            :link-arrow="'end'"
            :hide-legend="false"
            :legend-items="taskLegendItems"
            :legend-position="LegendPosition.TopRight"
          />
        </div>
      </Card>

      <!-- System Architecture -->
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">System Architecture</h2>
          <p class="text-neutral-400 text-sm">
            Microservices architecture diagram with different node shapes for different component types.
          </p>
        </div>
        <div class="mt-4">
          <DagreGraph
            :data="systemArchitectureData"
            :height="550"
            :dagre-layout-settings="{
              rankdir: 'TB',
              nodesep: 70,
              ranksep: 100,
              ranker: 'network-simplex',
            }"
            :node-fill="getSystemNodeColor"
            :node-shape="getSystemNodeShape"
            :node-size="45"
            :node-stroke-width="2"
            :link-arrow="'end'"
            :link-width="1.5"
            :hide-legend="false"
            :legend-items="systemLegendItems"
            :legend-position="LegendPosition.BottomCenter"
          />
        </div>
      </Card>

      <!-- Decision Tree (Compact) -->
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Decision Tree</h2>
          <p class="text-neutral-400 text-sm">
            Business logic flow with decision points and labeled branches.
          </p>
        </div>
        <div class="mt-4">
          <DagreGraph
            :data="decisionTreeData"
            :height="450"
            :dagre-layout-settings="{
              rankdir: 'TB',
              nodesep: 40,
              ranksep: 80,
              ranker: 'longest-path',
            }"
            :node-fill="'#10b981'"
            :node-size="35"
            :node-shape="'diamond'"
            :link-arrow="'end'"
            :link-stroke="'#34d399'"
            :link-width="2"
          />
        </div>
      </Card>

      <!-- Customization Examples -->
      <Card>
        <div>
          <h2 class="heading-2 mb-0 text-xl">Customization Options</h2>
          <p class="text-neutral-400 text-sm mb-4">
            The DagreGraph component supports extensive customization:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 class="font-semibold mb-2">Layout Settings</h3>
              <ul class="space-y-1 text-neutral-400">
                <li>• Direction: TB, BT, LR, RL</li>
                <li>• Node spacing (nodesep)</li>
                <li>• Rank spacing (ranksep)</li>
                <li>• Ranking algorithms</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Node Customization</h3>
              <ul class="space-y-1 text-neutral-400">
                <li>• Shapes: circle, square, triangle, diamond</li>
                <li>• Dynamic colors and sizes</li>
                <li>• Custom labels</li>
                <li>• Stroke width and color</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Link Customization</h3>
              <ul class="space-y-1 text-neutral-400">
                <li>• Arrow positions: start, end, both, none</li>
                <li>• Link labels</li>
                <li>• Custom colors and widths</li>
                <li>• Curvature control</li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Interactivity</h3>
              <ul class="space-y-1 text-neutral-400">
                <li>• Zoom and pan controls</li>
                <li>• Node dragging</li>
                <li>• Hover tooltips</li>
                <li>• Click events</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.heading-2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: inherit;
}
</style>
