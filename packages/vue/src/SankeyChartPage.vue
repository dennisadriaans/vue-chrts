<script lang="ts" setup>
import { SankeyChart } from "./../lib";
import Card from "./elements/Card.vue";
import { SankeyInputNode, SankeyInputLink } from "@unovis/ts";

type EnergyNode = SankeyInputNode & {
  id: string;
  label?: string;
};

type EnergyLink = SankeyInputLink & {
  source: string;
  target: string;
  value: number;
};

// Sample Sankey data showing energy flow
const energyFlowData = {
  nodes: [
    { id: "Coal", label: "Coal" },
    { id: "Natural Gas", label: "Natural Gas" },
    { id: "Solar", label: "Solar" },
    { id: "Wind", label: "Wind" },
    { id: "Electricity", label: "Electricity" },
    { id: "Heating", label: "Heating" },
    { id: "Industrial", label: "Industrial" },
    { id: "Residential", label: "Residential" },
    { id: "Commercial", label: "Commercial" },
  ] as EnergyNode[],
  links: [
    { source: "Coal", target: "Electricity", value: 30 },
    { source: "Natural Gas", target: "Electricity", value: 25 },
    { source: "Natural Gas", target: "Heating", value: 15 },
    { source: "Solar", target: "Electricity", value: 10 },
    { source: "Wind", target: "Electricity", value: 15 },
    { source: "Electricity", target: "Industrial", value: 35 },
    { source: "Electricity", target: "Residential", value: 25 },
    { source: "Electricity", target: "Commercial", value: 20 },
    { source: "Heating", target: "Residential", value: 10 },
    { source: "Heating", target: "Commercial", value: 5 },
  ] as EnergyLink[],
};

// Sample data showing simple workflow
const workflowData = {
  nodes: [
    { id: "Start", label: "Start" },
    { id: "Process A", label: "Process A" },
    { id: "Process B", label: "Process B" },
    { id: "Decision", label: "Decision" },
    { id: "Success", label: "Success" },
    { id: "Failed", label: "Failed" },
  ] as EnergyNode[],
  links: [
    { source: "Start", target: "Process A", value: 100 },
    { source: "Process A", target: "Process B", value: 80 },
    { source: "Process A", target: "Failed", value: 20 },
    { source: "Process B", target: "Decision", value: 80 },
    { source: "Decision", target: "Success", value: 60 },
    { source: "Decision", target: "Failed", value: 20 },
  ] as EnergyLink[],
};
</script>

<template>
  <div class="pt-4">
    <div class="py-2">
      <h2 class="font-bold text-2xl">Sankey Charts</h2>
    </div>
    <div class="gap-4 md:grid md:grid-cols-2">
      <Card>
        <template #header>
          <h2>Energy Flow Diagram</h2>
        </template>
        <template #body>
          <SankeyChart
            :data="energyFlowData"
            :height="400"
            :label="(d: EnergyNode) => d.label || d.id"
            :nodeColor="
              (d: EnergyNode) => {
                if (d.id.includes('Coal')) return '#64748b';
                if (d.id.includes('Natural Gas')) return '#f97316';
                if (d.id.includes('Solar')) return '#fbbf24';
                if (d.id.includes('Wind')) return '#06b6d4';
                if (d.id.includes('Electricity')) return '#3b82f6';
                if (d.id.includes('Heating')) return '#ef4444';
                return '#8b5cf6';
              }
            "
            :linkValue="(d: EnergyLink) => d.value"
            :nodeWidth="20"
            :nodePadding="15"
            :highlightSubtreeOnHover="true"
          />
        </template>
      </Card>

      <Card>
        <template #header>
          <h2>Workflow Process</h2>
        </template>
        <template #body>
          <SankeyChart
            :data="workflowData"
            :height="400"
            :label="(d: EnergyNode) => d.label || d.id"
            :nodeColor="
              (d: EnergyNode) => {
                if (d.id === 'Start') return '#10b981';
                if (d.id === 'Success') return '#22c55e';
                if (d.id === 'Failed') return '#ef4444';
                return '#3b82f6';
              }
            "
            :linkValue="(d: EnergyLink) => d.value"
            :nodeWidth="15"
            :nodePadding="20"
            :highlightSubtreeOnHover="true"
          />
        </template>
      </Card>
    </div>
  </div>
</template>
