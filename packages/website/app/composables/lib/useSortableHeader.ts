import type { SortBy, SortDir } from '~/components/lib/ServerDataTable/types'

export function useSortableHeader(
  UButton: Component,
  sortBy: Ref<SortBy>,
  sortDir: Ref<SortDir>
) {
  function renderSortableHeader(
    label: string,
    column: {
      getIsSorted: () => string | false
      toggleSorting: (desc: boolean) => void
      id?: string
    }
  ) {
    const isSorted = column.getIsSorted()
    return h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      label,
      trailingIcon: isSorted
        ? isSorted === 'asc'
          ? 'i-lucide-arrow-up'
          : 'i-lucide-arrow-down'
        : 'i-lucide-chevrons-up-down',
      ui: {
        trailingIcon: 'size-3'
      },
      class: '-mx-2.5',
      onClick: () => {
        if (column.id) {
          sortBy.value = column.id
          if (sortDir.value === 'asc') {
            sortDir.value = 'desc'
          } else {
            sortDir.value = 'asc'
          }
        }
      }
    })
  }
  return { renderSortableHeader }
}
