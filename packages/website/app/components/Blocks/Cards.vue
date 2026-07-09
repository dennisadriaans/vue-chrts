<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'cards']
})

export interface ExpenseCategory {
  color: string
  name: string
  value: number
  budget: number
  trend: number
}

const expenseCategories = [
  {
    color: 'var(--ui-success)',
    name: 'Food & Dining',
    value: 1245,
    budget: 1500,
    trend: -8
  },
  {
    color: 'var(--ui-info)',
    name: 'Software & Tools',
    value: 890,
    budget: 1000,
    trend: 12
  },
  {
    color: 'var(--ui-warning)',
    name: 'Travel & Transport',
    value: 675,
    budget: 800,
    trend: 15
  }
]

// Scroll indicator state
const showScrollIndicator = ref(true)

const handleDismissScrollIndicator = () => {
  showScrollIndicator.value = false
}
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Card Blocks
      </h2>
      <p class="text-toned dark:text-muted">
        Visualize your data beautifully with our versatile card components,
        designed for clarity and impact.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Expense Budget Cards">
          <template #chart>
            <div class="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsWithExpenseBudget :categories="expenseCategories" />
            </div>
          </template>
          <PreviewCode
            id="cards-expense-budget"
            category="cards"
            block="with-expense-budget"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Expense Budget Cards Boxed">
          <template #chart>
            <div class="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsWithExpenseBudgetBoxed :categories="expenseCategories" />
            </div>
          </template>
          <PreviewCode
            id="cards-expense-budget-boxed"
            category="cards"
            block="with-expense-budget-boxed"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Cards with Progress Circle">
          <template #chart>
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsWithProgressCircle />
            </div>
          </template>
          <PreviewCode
            id="cards-progress-circle"
            category="cards"
            block="with-progress-circle"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Default Cards">
          <template #chart>
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsDefault
                v-bind="{
                  name: 'Unique visitors',
                  stat: '10,450',
                  change: '-12.5%',
                  changeType: 'negative'
                }"
              />
              <CardsDefault
                v-bind="{
                  name: 'Unique visitors',
                  stat: '10,450',
                  change: '12.5%',
                  changeType: 'positive'
                }"
              />
              <CardsDefault
                v-bind="{
                  name: 'Unique visitors',
                  stat: '10,450',
                  change: '12.5%',
                  changeType: 'negative'
                }"
              />
            </div>
          </template>
          <PreviewCode
            id="cards-default"
            category="cards"
            block="default"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Cards with Mini Charts">
          <template #chart>
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsWithMiniCharts />
            </div>
          </template>
          <PreviewCode
            id="cards-mini-charts"
            category="cards"
            block="with-mini-charts"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Cards with Area Chart">
          <template #chart>
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsWithAreaChart />
            </div>
          </template>
          <PreviewCode
            id="cards-area-chart"
            category="cards"
            block="with-area-chart"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Cards with Progress Bar">
          <template #chart>
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsWithProgress
                class="bg-default!"
                color="var(--color-primary-500)"
                label="Weekly active users"
                value="250"
                :total="512"
                :progress="250"
                :button="{
                  label: 'View more',
                  icon: 'i-lucide-chevron-right'
                }"
              />
              <CardsWithProgress
                class="bg-default!"
                color="var(--color-primary-500)"
                label="Weekly active users"
                value="250"
                :total="512"
                :progress="350"
                :button="{
                  label: 'View more',
                  icon: 'i-lucide-chevron-right'
                }"
              />
              <CardsWithProgress
                class="bg-default!"
                color="var(--color-primary-500)"
                label="Weekly active users"
                value="250"
                :total="512"
                :progress="480"
                :button="{
                  label: 'View more',
                  icon: 'i-lucide-chevron-right'
                }"
              />
            </div>
          </template>
          <PreviewCode
            id="cards-progress-bar"
            category="cards"
            block="with-progress"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Category Cards">
          <template #chart>
            <div class="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
              <CardsCategories :categories="expenseCategories" />
            </div>
          </template>
          <PreviewCode
            id="cards-categories"
            category="cards"
            block="categories"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Integration Cards">
          <template #chart>
            <CardsIntegration />
          </template>
          <PreviewCode
            id="cards-integration"
            category="cards"
            block="integration"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Integration Cards Variant">
          <template #chart>
            <CardsIntegrationVariant />
          </template>
          <PreviewCode
            id="cards-integration-variant"
            category="cards"
            block="integration-variant"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Team Cards">
          <template #chart>
            <CardsTeamCard />
          </template>
          <PreviewCode
            id="cards-team"
            category="cards"
            block="team-card"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>

    <!-- Scroll Indicator -->
    <ScrollIndicator
      target-id="cards-team"
      :show="showScrollIndicator"
      @dismiss="handleDismissScrollIndicator"
    />
  </div>
</template>
