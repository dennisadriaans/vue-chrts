<template>
  <svg
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="mx-auto size-full max-w-[320px] text-muted"
    aria-hidden="true"
  >
    <g stroke="currentColor" stroke-width="0.5" opacity="0.12">
      <ellipse cx="120" cy="98" rx="72" ry="28" />
      <ellipse cx="120" cy="98" rx="54" ry="21" />
      <ellipse cx="120" cy="98" rx="36" ry="14" />
      <path d="M48 98 L192 98 M120 70 L120 126" />
      <path d="M66 82 L174 114 M66 114 L174 82" />
    </g>

    <ellipse
      cx="120"
      cy="108"
      rx="70"
      ry="27"
      fill="currentColor"
      opacity="0.06"
    />

    <g transform="translate(0 -6)">
      <path
        d="M120 70 A70 27 0 0 1 178 110 L158 110 A46 18 0 0 0 120 82 Z"
        class="text-primary"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M178 110 A70 27 0 0 1 120 126 L120 108 A46 18 0 0 0 158 110 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M120 126 A70 27 0 0 1 62 86 L82 90 A46 18 0 0 0 120 108 Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M62 86 A70 27 0 0 1 120 70 L120 82 A46 18 0 0 0 82 90 Z"
        fill="currentColor"
        opacity="0.12"
      />

      <ellipse
        cx="120"
        cy="98"
        rx="70"
        ry="27"
        stroke="currentColor"
        stroke-width="0.75"
        opacity="0.3"
      />
      <ellipse
        cx="120"
        cy="98"
        rx="46"
        ry="18"
        stroke="currentColor"
        stroke-width="0.75"
        opacity="0.3"
      />

      <path
        d="M178 110 L178 118 A70 27 0 0 1 120 134 L120 126"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M120 126 L120 134 A70 27 0 0 1 62 94 L62 86"
        fill="currentColor"
        opacity="0.08"
      />

      <g class="text-primary" stroke="currentColor" stroke-width="1">
        <path d="M120 70 L120 62" opacity="0.5" />
        <circle cx="149" cy="78" r="2" fill="currentColor" />
      </g>
    </g>

    <g stroke="currentColor" stroke-width="0.5" opacity="0.35">
      <path d="M188 72 H208 M208 68 V76" />
      <path d="M188 72 L178 78" />
    </g>
    <text
      x="212"
      y="74"
      class="font-mono text-primary"
      font-size="6.5"
      fill="currentColor"
      opacity="0.7"
    >38.0°</text>

    <g class="font-mono" fill="currentColor" opacity="0.4" font-size="5.5">
      <text x="28" y="64">0°</text>
      <text x="28" y="80">90°</text>
      <text x="28" y="96">180°</text>
      <text x="28" y="112">270°</text>
    </g>

    <g fill="currentColor">
      <rect x="28" y="132" width="7" height="7" class="text-primary" />
      <text x="40" y="138" class="font-mono" font-size="5.5" opacity="0.4">A 38.0</text>
      <rect x="88" y="132" width="7" height="7" opacity="0.35" />
      <text x="100" y="138" class="font-mono" font-size="5.5" opacity="0.4">B 26.0</text>
      <rect x="148" y="132" width="7" height="7" opacity="0.2" />
      <text x="160" y="138" class="font-mono" font-size="5.5" opacity="0.4">C 22.0</text>
    </g>
  </svg>
</template>
