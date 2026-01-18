<script lang="ts" setup>
import { ref } from "vue";
import { SankeyChart } from "./../lib";
import Card from "./elements/Card.vue";
import { SankeyInputNode, SankeyInputLink, SankeyNodeAlign } from "@unovis/ts";

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

// User Journey data
const userJourneyData = {
  nodes: [
    // Column 0 (Starting Points)
    { id: "col0-home", label: "/" },
    { id: "col0-docs-red", label: "/docs" },
    { id: "col0-self-host-green", label: "/docs/self-host...ng/self-hosting" },
    
    // Column 1
    { id: "col1-pricing", label: "/pricing" },
    { id: "col1-docs", label: "/docs" },
    { id: "col1-onboarding", label: "/onboarding" },
    { id: "col1-home-red", label: "/" },
    { id: "col1-get-started-red", label: "/docs/get-start...stall-openpanel" },
    { id: "col1-get-started-green", label: "/docs/get-start...stall-openpanel" },
    
    // Column 2
    { id: "col2-supporter", label: "/supporter" },
    { id: "col2-get-started", label: "/docs/get-start...stall-openpanel" },
    { id: "col2-self-host", label: "/docs/self-host...ng/self-hosting" },
    { id: "col2-sdks", label: "/docs/sdks" },
    { id: "col2-onboarding-project", label: "/onboarding/project" },
    { id: "col2-login", label: "/login" },
    { id: "col2-pricing", label: "/pricing" },
    { id: "col2-get-started-red", label: "/docs/get-start.../identify-users" },
    
    // Column 3
    { id: "col3-docs", label: "/docs" },
    { id: "col3-get-started", label: "/docs/get-start...stall-openpanel" },
    { id: "col3-self-host", label: "/docs/self-host...ng/self-hosting" },
    { id: "col3-sdks", label: "/docs/sdks" },
    { id: "col3-sdks-script", label: "/docs/sdks/script" },
    { id: "col3-sdks-nextjs", label: "/docs/sdks/nextjs" },
    { id: "col3-onboarding-project", label: "/onboarding/project" },
    
    // Column 4
    { id: "col4-get-started", label: "/docs/get-start...stall-openpanel" },
    { id: "col4-track-events", label: "/docs/get-started/track-events" },
    { id: "col4-docker-compose", label: "/docs/self-host...docker-compose" },
    { id: "col4-docker-images", label: "/docs/self-host...t-docker-images" },
    { id: "col4-deploy-coolify", label: "/docs/self-host.../deploy-coolify" },
    { id: "col4-identify-users", label: "/docs/get-start.../identify-users" },
    { id: "col4-sdks", label: "/docs/sdks" },
  ] as EnergyNode[],
  links: [
    // Main blue flows from root /
    { source: "col0-home", target: "col1-pricing", value: 120 },
    { source: "col0-home", target: "col1-docs", value: 80 },
    { source: "col0-home", target: "col1-onboarding", value: 40 },
    
    { source: "col1-pricing", target: "col2-supporter", value: 30 },
    { source: "col1-pricing", target: "col2-get-started", value: 40 },
    { source: "col1-pricing", target: "col2-self-host", value: 50 },
    
    { source: "col1-docs", target: "col2-get-started", value: 30 },
    { source: "col1-docs", target: "col2-sdks", value: 50 },
    
    { source: "col1-onboarding", target: "col2-onboarding-project", value: 20 },
    { source: "col1-onboarding", target: "col2-login", value: 10 },
    { source: "col1-onboarding", target: "col2-pricing", value: 10 },

    { source: "col2-get-started", target: "col3-get-started", value: 50 },
    { source: "col2-self-host", target: "col3-self-host", value: 40 },
    { source: "col2-sdks", target: "col3-sdks-script", value: 20 },
    { source: "col2-sdks", target: "col3-sdks-nextjs", value: 20 },

    { source: "col3-get-started", target: "col4-get-started", value: 20 },
    { source: "col3-get-started", target: "col4-track-events", value: 20 },
    { source: "col3-self-host", target: "col4-docker-compose", value: 15 },
    { source: "col3-self-host", target: "col4-docker-images", value: 10 },
    { source: "col3-self-host", target: "col4-deploy-coolify", value: 10 },

    // Red flows starting from /docs
    { source: "col0-docs-red", target: "col1-home-red", value: 25, color: "#991b1b" },
    { source: "col1-home-red", target: "col2-get-started-red", value: 20, color: "#991b1b" },
    { source: "col2-get-started-red", target: "col3-docs", value: 15, color: "#991b1b" },
    
    // Green flows starting from /docs/self-host...
    { source: "col0-self-host-green", target: "col1-get-started-green", value: 15, color: "#065f46" },
    { source: "col1-get-started-green", target: "col2-get-started", value: 10, color: "#065f46" },

    // Additional small red flows at bottom
    { source: "col2-onboarding-project", target: "col3-onboarding-project", value: 5, color: "#991b1b" },
    { source: "col3-onboarding-project", target: "col4-sdks", value: 5, color: "#991b1b" },
  ] as (EnergyLink & { color?: string })[],
};

const steps = ref(5);
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
          :nodeWidth="1"
          :nodePadding="100"
          :highlightSubtreeOnHover="true"
        />
      </Card>

      <Card>
        <template #header>
          <h2>Workflow Process</h2>
        </template>
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
      </Card>

      <Card class="md:col-span-2 !bg-default">

        <SankeyChart
          :data="userJourneyData"
          :height="500"
          :nodeWidth="16"
          :nodePadding="16"
          :nodeAlign="SankeyNodeAlign.Justify"
          :label="(d: any) => d.label"
          :labelFontSize="9"
          :labelColor="() => '#64748b'"
          :labelMaxWidth="140"
          :labelPadding="8"
          :nodeColor="(d: any) => {
            if (d.id.includes('red')) return '#991b1b';
            if (d.id.includes('green') || d.id.includes('self-host')) return '#065f46';
            return '#1e3a8a';
          }"
          :linkColor="(d: any) => d.color || '#1e3a8a44'"
          :linkValue="(d: any) => d.value"
          :padding="{ top: 40, bottom: 20, left: 20, right: 160 }"
          :nodeSort="(a: any, b: any) => {
            if (a.id.includes('red') && !b.id.includes('red')) return 1;
            if (!a.id.includes('red') && b.id.includes('red')) return -1;
            if (a.id.includes('green') && !b.id.includes('green')) return 1;
            if (!a.id.includes('green') && b.id.includes('green')) return -1;
            return 0;
          }"
          :linkSort="(a: any, b: any) => {
            if (a.color === '#991b1b' && b.color !== '#991b1b') return 1;
            if (a.color !== '#991b1b' && b.color === '#991b1b') return -1;
            return 0;
          }"
          :highlightSubtreeOnHover="true"
        />
        
        <template #footer>
          <p class="text-[11px] text-slate-600">Shows the most common paths users take through your application</p>
        </template>
      </Card>
    </div>
  </div>
</template>
