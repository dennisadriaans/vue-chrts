// components/TanStackTable.vue
<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useVueTable,
  ColumnDef,
  SortingState,
  PaginationState,
  ColumnFiltersState,
  Row
} from '@tanstack/vue-table'
import { computed, ref } from 'vue'

// Define the types for the props
type TableSize = 'sm' | 'md' | 'lg'
type LegendPosition = 'top' | 'bottom' | 'both' | 'none'

// Define the props with defaults
const props = withDefaults(defineProps<{
  // Data and columns
  data: any[]
  columns: ColumnDef<any, any>[]
  
  // Features
  enableSorting?: boolean
  enableMultiSort?: boolean
  enablePagination?: boolean
  enableFiltering?: boolean
  enableRowSelection?: boolean
  
  // Appearance
  tableSize?: TableSize
  striped?: boolean
  hover?: boolean
  bordered?: boolean
  
  // Pagination
  legendPosition?: LegendPosition
  pageSizeOptions?: any
  initialPageSize?: number
  
  // Functions
  onRowClick?: (row: Row<any>) => void
  getRowClass?: (row: Row<any>) => string
}>(), {
  // Default prop values
  enableSorting: true,
  enableMultiSort: false,
  enablePagination: true,
  enableFiltering: false,
  enableRowSelection: false,
  tableSize: 'md',
  striped: true,
  hover: true,
  bordered: false,
  LegendPosition: 'bottom',
  pageSizeOptions: [10, 20, 50, 100],
  initialPageSize: 10,
})

// Define emits for external state management
const emit = defineEmits<{
  'update:sorting': [sorting: SortingState]
  'update:pagination': [pagination: PaginationState]
  'update:filters': [filters: ColumnFiltersState]
  'update:selectedRows': [selectedRowIds: Record<string, boolean>]
  'row-click': [row: Row<any>]
}>()

// Internal state
const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: props.initialPageSize,
})
const columnFilters = ref<ColumnFiltersState>([])
const rowSelection = ref<Record<string, boolean>>({})
const globalFilter = ref('')

// Create table instance with options
const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
    get pagination() { return pagination.value },
    get columnFilters() { return columnFilters.value },
    get rowSelection() { return rowSelection.value },
    get globalFilter() { return globalFilter.value },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    emit('update:sorting', sorting.value)
  },
  onPaginationChange: (updater) => {
    pagination.value = typeof updater === 'function' ? updater(pagination.value) : updater
    emit('update:pagination', pagination.value)
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = typeof updater === 'function' ? updater(columnFilters.value) : updater
    emit('update:filters', columnFilters.value)
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    emit('update:selectedRows', rowSelection.value)
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  enableMultiSort: props.enableMultiSort,
  enableSorting: props.enableSorting,
  enableRowSelection: props.enableRowSelection,
  enableFilters: props.enableFiltering,
  manualPagination: !props.enablePagination,
})

// Handle row click events
const handleRowClick = (row: Row<any>) => {
  if (props.onRowClick) {
    props.onRowClick(row)
  }
  emit('row-click', row)
}

// Computed styles based on size
const tableSizeClasses = computed(() => {
  switch (props.tableSize) {
    case 'sm':
      return {
        table: 'text-xs',
        cell: 'px-2 py-1',
        pagination: 'text-xs'
      }
    case 'lg':
      return {
        table: 'text-base',
        cell: 'px-6 py-4',
        pagination: 'text-base'
      }
    default: // 'md'
      return {
        table: 'text-sm',
        cell: 'px-4 py-2',
        pagination: 'text-sm'
      }
  }
})

// Computed classes for table styling
const tableClasses = computed(() => {
  return [
    'min-w-full divide-y divide-neutral-600 border-collapse',
    tableSizeClasses.value.table,
    props.bordered ? 'border border-gray-200' : '',
  ]
})

// Row classes
const getRowClasses = (row: Row<any>) => {
  const classes = [
    'transition-colors',
    props.hover ? 'dark:hover:bg-neutral-900 hover:bg-neutral-100' : '',
    props.striped && row.index % 2 === 1 ? 'bg-neutral' : '',
    props.enableRowSelection && row.getIsSelected() ? 'bg-blue-50 hover:bg-blue-100' : '',
  ]
  
  if (props.getRowClass) {
    classes.push(props.getRowClass(row))
  }
  
  return classes.join(' ')
}

// Cell classes
const getCellClasses = (isHeader = false) => {
  return [
    tableSizeClasses.value.cell,
    isHeader ? 'font-semibold text-neutral-500 border-b border-border capitalize' : ' text-neutral-600 dark:text-neutral-400',
    props.bordered ? 'border border-border' : '',
  ].join(' ')
}

// Expose the table instance and key states for external use
defineExpose({
  tableInstance: table,
  sorting,
  pagination,
  columnFilters,
  rowSelection,
  globalFilter,
})
</script>

<template>
  <div class="overflow-x-auto w-full">
    <!-- Top Pagination -->
    <div v-if="['top', 'both'].includes(LegendPosition) && enablePagination" class="mb-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span :class="tableSizeClasses.pagination">Rows per page:</span>
          <select
            v-model="pagination.pageSize"
            class="border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="table.previousPage"
            :disabled="!table.getCanPreviousPage()"
            class="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            <span class="sr-only">Previous</span>
            <span class="inline-block">&lt;</span>
          </button>
          <span :class="tableSizeClasses.pagination">
            Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}
          </span>
          <button
            @click="table.nextPage"
            :disabled="!table.getCanNextPage()"
            class="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            <span class="sr-only">Next</span>
            <span class="inline-block">&gt;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Global Filter -->
    <div v-if="enableFiltering" class="mb-2">
      <input
        v-model="globalFilter"
        placeholder="Search all columns..."
        class="border border-gray-300 rounded px-3 py-2 w-full max-w-sm"
      />
    </div>

    <!-- Table -->
    <table :class="tableClasses">
      <thead>
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="[
              getCellClasses(true),
              header.column.getCanSort() ? 'cursor-pointer select-none' : '',
              'text-left'
            ]"
            @click="header.column.getToggleSortingHandler()"
          >
            <div class="flex items-center gap-1">
              <FlexRender
                v-if="header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              
              <!-- Column title with sort icons -->
              <div v-else class="flex-1">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </div>
              
              <!-- Sort indicator -->
              <div class="w-4" v-if="header.column.getCanSort()">
                {{{
                  asc: '▲',
                  desc: '▼',
                }[header.column.getIsSorted() as string] ?? '⬍'}}
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        <template v-if="table.getRowModel().rows.length">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :class="getRowClasses(row)"
            @click="handleRowClick(row)"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="getCellClasses()"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td
              :colspan="table.getAllColumns().length"
              :class="getCellClasses()"
              class="text-center py-4"
            >
              No results found
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Bottom Pagination -->
    <div v-if="['bottom', 'both'].includes(LegendPosition) && enablePagination" class="mt-2">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span :class="tableSizeClasses.pagination">Rows per page:</span>
          <select
            v-model="pagination.pageSize"
            class="border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="table.previousPage"
            :disabled="!table.getCanPreviousPage()"
            class="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            <span class="sr-only">Previous</span>
            <span class="inline-block">&lt;</span>
          </button>
          <span :class="tableSizeClasses.pagination">
            Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}
          </span>
          <button
            @click="table.nextPage"
            :disabled="!table.getCanNextPage()"
            class="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            <span class="sr-only">Next</span>
            <span class="inline-block">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>