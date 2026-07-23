export type QuestionOption = {
  label: string
  value: string
}

export type Question = {
  title: string
  description: string
  type: 'option' | 'search'
  options?: QuestionOption[]
  value?: QuestionOption
}
