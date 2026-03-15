<script lang="ts" setup>
import { ref } from 'vue'
import { VisXYContainer, VisAxis, VisLine, VisArea, VisXYLabels } from '@unovis/vue'
import { XYLabels } from '@unovis/ts'

type DataItem = {
  x: number;
  y: number;
  label: string;
  color: string;
}

/**
 * Sample data for the background chart
 */
const sampleData: DataItem[] = [
  { x: 1, y: 3, label: 'Q1', color: '#6366F1' },
  { x: 2, y: 7, label: 'Q2', color: '#8B5CF6' },
  { x: 3, y: 5, label: 'Q3', color: '#06B6D4' },
  { x: 4, y: 10, label: 'Q4', color: '#10B981' },
  { x: 5, y: 4, label: 'Q5', color: '#F59E0B' },
  { x: 6, y: 2, label: 'Q6', color: '#EF4444' },
  { x: 7, y: 8, label: 'Q7', color: '#EC4899' },
  { x: 8, y: 6, label: 'Q8', color: '#84CC16' },
]

/**
 * Dense data to demonstrate clustering
 */
const overlappingData: DataItem[] = [
  // Cluster 1: Multiple items near each other
  { x: 2, y: 5, label: 'A1', color: '#6366F1' },
  { x: 2.05, y: 5.05, label: 'A2', color: '#4F46E5' },
  { x: 1.95, y: 4.95, label: 'A3', color: '#5B21B6' },
  
  // Cluster 2: Dense grouping
  { x: 6, y: 8, label: 'B1', color: '#8B5CF6' },
  { x: 6.1, y: 8.1, label: 'B2', color: '#7C3AED' },
  { x: 5.9, y: 7.9, label: 'B3', color: '#6D28D9' },
  { x: 6.05, y: 8.05, label: 'B4', color: '#5B21B6' },
  
  // Isolated entries
  { x: 7, y: 6, label: 'C1', color: '#F59E0B' },
  { x: 8, y: 2, label: 'D1', color: '#EF4444' }
]

const clusteringEnabled = ref(true)

/**
 * Event handlers using Unovis selectors
 */
const events = {
  [XYLabels.selectors.label]: {
    click: (d: DataItem) => {
      console.log('Label clicked:', d)
      alert(`Individual label clicked: ${d.label}`)
    }
  },
  [XYLabels.selectors.cluster]: {
    click: (cluster: DataItem[]) => {
      console.log('Cluster clicked:', cluster)
      alert(`Cluster clicked! Contains ${cluster.length} items.`)
    }
  }
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-gray-900">XYLabels: Clustering & Interactivity</h1>
      <p class="text-gray-600 mt-2">
        This example demonstrates how to use <code>VisXYLabels</code> from Unovis to add interactive data labels with automatic clustering.
      </p>
    </header>
    
    <section class="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div class="flex items-center gap-3">
        <input 
          type="checkbox" 
          id="clustering-toggle" 
          v-model="clusteringEnabled"
          class="w-5 h-5 text-blue-600 rounded border-gray-300 transition-all cursor-pointer"
        >
        <label for="clustering-toggle" class="font-semibold text-gray-800 cursor-pointer select-none">
          Enable Clustering
        </label>
      </div>
      <p class="text-sm text-gray-500 mt-2">
        Try toggling the checkbox to see how <code>XYLabels</code> automatically groups overlapping points to prevent visual bloat.
      </p>
    </section>

    <main class="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
      <VisXYContainer :data="overlappingData" :height="450" :xDomain="[0, 9]" :yDomain="[0, 11]">
        <VisAxis type="x" :gridLine="true" />
        <VisAxis type="y" :gridLine="true" />
        
        <!-- Background context -->
        <VisArea :data="sampleData" :x="(d: DataItem) => d.x" :y="(d: DataItem) => d.y" color="#6366F1" :opacity="0.05" />
        <VisLine :data="sampleData" :x="(d: DataItem) => d.x" :y="(d: DataItem) => d.y" color="#6366F1" :strokeWidth="1" :opacity="0.2" />
        
        <VisXYLabels 
          :x="(d: DataItem) => d.x" 
          :y="(d: DataItem) => d.y"
          :label="(d: DataItem) => d.label"
          :color="(d: DataItem) => d.color"
          :clustering="clusteringEnabled"
          :clusterLabel="(records: DataItem[]) => `${records.length} items`"
          :clusterBackgroundColor="clusteringEnabled ? 'rgba(255, 255, 255, 0.98)' : undefined"
          :clusterLabelColor="clusteringEnabled ? '#1e293b' : undefined"
          backgroundColor="rgba(255, 255, 255, 0.9)"
          cursor="pointer"
          :events="events"
        />
      </VisXYContainer>
    </main>

    <footer class="grid md:grid-cols-2 gap-6 text-sm">
      <div class="space-y-2">
        <h4 class="font-bold text-gray-900 border-b pb-1">Positioning</h4>
        <p class="text-gray-600">Labels are positioned in <strong>Data Space</strong> by default, moving fluidly with the axes as the viewport changes.</p>
      </div>
      <div class="space-y-2">
        <h4 class="font-bold text-gray-900 border-b pb-1">Interaction</h4>
        <p class="text-gray-600">Click individual labels or clusters to trigger events. We use Unovis <code>selectors</code> for precise event targeting.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  color: #1d4ed8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9em;
}
</style>

