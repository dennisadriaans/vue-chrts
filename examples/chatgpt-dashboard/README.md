# Nuxt Charts — ChatGPT dashboard demo

Standalone Nuxt 4 demo powered by the **nuxt-charts-next** workspace package (published as `nuxt-charts@next`). No production APIs or customer data.

## Run

From the repository root:

```sh
pnpm install
pnpm --filter nuxt-charts build
pnpm --dir examples/chatgpt-dashboard dev
```

Open the local URL printed by Nuxt. The 7/30/90-day controls update all metrics and charts from deterministic in-memory mock data.

## ChatGPT integration

This Nuxt frontend is a standalone browser application. It is **not yet a registered ChatGPT plugin**. For an embedded ChatGPT UI, build a client-only HTML bundle (not an iframe pointing to a remote Nuxt server), register it as an `text/html;profile=mcp-app` MCP resource, and connect a tool that declares `_meta.ui.resourceUri`. Serve through an authenticated remote MCP endpoint and test sandbox behavior in ChatGPT before publishing.

Keep the main Nuxt app standalone and adapt its dashboard component for the MCP Apps UI surface.
