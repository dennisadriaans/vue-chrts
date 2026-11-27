import { defineComponent, inject, type InjectionKey } from "vue";

interface Action {
  type: string;
}

interface ChartLayoutState {
  layout: {
    width: number;
    height: number;
    margin: { top?: number; right?: number; bottom?: number; left?: number };
  };
  legend: { payload: unknown[][] };
}

export interface ChartStoreContext {
  store: {
    dispatch: (action: Action & { payload?: unknown }) => unknown;
    getState: () => ChartLayoutState;
  };
}

export interface SsrLayoutPass {
  /** `record` on the throwaway pass, `replay` on the pass whose HTML is kept. */
  mode: "record" | "replay";
  actions: Action[];
}

export const SSR_LAYOUT_PASS_KEY: InjectionKey<SsrLayoutPass> = Symbol("nuxt-charts:ssr-layout-pass");

const UNREGISTER = /\/remove[A-Z]/;

/** The key `@reduxjs/vue-redux` provides the `vccs` chart store under. */
export const STORE_KEY = Symbol.for("vue-redux-context");

/**
 * Server-only. `vccs` lays a chart out from a store its children fill in as
 * they set up: axes, series and the legend each register themselves. On the
 * client that settles over a few renders. The server renders once, top to
 * bottom, so an axis is drawn before the series that give it a domain exist.
 *
 * `ChartContainer` therefore renders the chart twice on the server. Mounted as
 * the chart's first child, this records every registration during the first
 * pass and replays them into the fresh store of the second, so each child of
 * the second pass reads the settled layout. The children then register again
 * themselves; those repeats are dropped.
 */
export default defineComponent({
  name: "ChartSsrBridge",
  setup() {
    const pass = inject(SSR_LAYOUT_PASS_KEY, null);
    const context = inject<ChartStoreContext | null>(STORE_KEY, null);
    if (pass && context) {
      const { store } = context;
      const dispatch = store.dispatch;
      const repeats = new Map<string, number>();
      if (pass.mode === "replay") {
        for (const action of pass.actions) {
          dispatch(action);
          repeats.set(action.type, (repeats.get(action.type) ?? 0) + 1);
        }
      }
      store.dispatch = (action) => {
        const type = action?.type;
        if (typeof type !== "string") return dispatch(action);
        // A server-side effect runs once and is torn down straight away, which
        // would unregister what it just registered.
        if (UNREGISTER.test(type)) return action;
        if (pass.mode === "record") pass.actions.push(action);
        const left = repeats.get(type);
        if (!left) return dispatch(action);
        repeats.set(type, left - 1);
        return action;
      };
    }
    return () => null;
  },
});
