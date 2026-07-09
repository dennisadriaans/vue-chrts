export interface CodeBlockProps {
  /** The source code to display. */
  code: string
  /** Language for syntax highlighting (e.g. 'vue', 'typescript', 'bash'). */
  language?: string
  /** Filename shown in the header. Falls back to language. */
  filename?: string
  /** Show line numbers. */
  showLineNumbers?: boolean
  /** Highlighting engine to use. Defaults to 'shiki'. */
  highlighter?: 'shiki' | 'lowlight'
  /** Explicit Shiki theme name. Overrides darkTheme / lightTheme. */
  theme?: string
  /** Shiki theme used in dark color mode. */
  darkTheme?: string
  /** Shiki theme used in light color mode. */
  lightTheme?: string
  /** Max height of the code area. Scrollable when content overflows. */
  maxHeight?: string | number
  /** Show a loading spinner instead of code. */
  loading?: boolean
}
