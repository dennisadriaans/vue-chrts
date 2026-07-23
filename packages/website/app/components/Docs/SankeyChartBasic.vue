<script lang="ts" setup>
defineOptions({
  tags: ['sankeychart', 'basic']
})

interface SankeyNode {
  id: string
  label: string
}

interface SankeyLink {
  source: string
  target: string
  value: number
}

const data = {
  nodes: [
    { id: 'visitors', label: 'Visitors' },
    { id: 'signups', label: 'Sign Ups' },
    { id: 'trials', label: 'Trials' },
    { id: 'paid', label: 'Paid' },
    { id: 'churned', label: 'Churned' },
    { id: 'enterprise', label: 'Enterprise' },
    { id: 'startup', label: 'Startup' }
  ] as SankeyNode[],
  links: [
    { source: 'visitors', target: 'signups', value: 1000 },
    { source: 'signups', target: 'trials', value: 600 },
    { source: 'signups', target: 'churned', value: 400 },
    { source: 'trials', target: 'paid', value: 400 },
    { source: 'trials', target: 'churned', value: 200 },
    { source: 'paid', target: 'enterprise', value: 150 },
    { source: 'paid', target: 'startup', value: 250 }
  ] as SankeyLink[]
}

const label = (node: SankeyNode) => node.label
const linkValue = (link: SankeyLink) => link.value
const nodeColor = (node: SankeyNode) => {
  const colors: Record<string, string> = {
    visitors: '#3b82f6',
    signups: '#22c55e',
    trials: '#f59e0b',
    paid: '#10b981',
    churned: '#ef4444',
    enterprise: '#8b5cf6',
    startup: '#06b6d4'
  }
  return colors[node.id] ?? '#64748b'
}
</script>

<template>
  <SankeyChart
    :data="data"
    :height="320"
    :label="label"
    :link-value="linkValue"
    :node-color="nodeColor"
    :node-width="15"
    :node-padding="20"
    :highlight-subtree-on-hover="true"
  />
</template>
