<script lang="ts" setup>
defineOptions({
  tags: ['dagregraph', 'basic']
})

interface GraphNode {
  id: string
  label: string
  type: string
}

interface GraphLink {
  source: string
  target: string
}

const data = {
  nodes: [
    { id: 'start', label: 'Start', type: 'start' },
    { id: 'auth', label: 'Auth Check', type: 'process' },
    { id: 'valid', label: 'Valid User', type: 'decision' },
    { id: 'dashboard', label: 'Dashboard', type: 'process' },
    { id: 'login', label: 'Login Page', type: 'process' },
    { id: 'end', label: 'End', type: 'end' }
  ] as GraphNode[],
  links: [
    { source: 'start', target: 'auth' },
    { source: 'auth', target: 'valid' },
    { source: 'valid', target: 'dashboard' },
    { source: 'valid', target: 'login' },
    { source: 'dashboard', target: 'end' },
    { source: 'login', target: 'auth' }
  ] as GraphLink[]
}

const nodeLabel = (node: GraphNode) => node.label

const nodeFill = (node: GraphNode) => {
  const colors: Record<string, string> = {
    start: '#22c55e',
    process: '#3b82f6',
    decision: '#f59e0b',
    end: '#ef4444'
  }
  return colors[node.type] ?? '#64748b'
}

const nodeShape = (node: GraphNode) => {
  const shapes: Record<string, 'circle' | 'square' | 'diamond'> = {
    start: 'circle',
    process: 'square',
    decision: 'diamond',
    end: 'circle'
  }
  return shapes[node.type] ?? 'circle'
}
</script>

<template>
  <DagreGraph
    :data="data"
    :height="350"
    :node-label="nodeLabel"
    :node-size="45"
    :node-fill="nodeFill"
    :node-shape="nodeShape"
    :link-arrow="'end'"
    :dagre-layout-settings="{
      rankdir: 'TB',
      nodesep: 60,
      ranksep: 60
    }"
  />
</template>
