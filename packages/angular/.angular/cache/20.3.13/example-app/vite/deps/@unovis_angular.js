import {
  Component,
  ContentChild,
  ContentChildren,
  Input,
  NgModule,
  ViewChild,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryRefresh,
  ɵɵviewQuery
} from "./chunk-BNMFKIU3.js";
import {
  Annotations,
  Area,
  Axis,
  Brush,
  BulletLegend,
  ChordDiagram,
  Crosshair,
  Direction,
  Donut,
  FreeBrush,
  Graph,
  GroupedBar,
  LeafletFlowMap,
  LeafletMap,
  Line,
  NestedDonut,
  Plotband,
  Plotline,
  RollingPinLegend,
  Sankey,
  Scatter,
  SingleContainer,
  StackedBar,
  Timeline,
  Tooltip,
  TopoJSONMap,
  XYContainer,
  XYLabels
} from "./chunk-HLI4DFV6.js";
import "./chunk-SFUQ3DKB.js";
import "./chunk-IZMHJU6E.js";
import "./chunk-BKKYJXF4.js";
import "./chunk-7WUTQBRG.js";

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/core/generic-component.js
var VisGenericComponent = class {
};

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/core/core-component.js
var VisCoreComponent = class extends VisGenericComponent {
};

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/core/xy-component.js
var VisXYComponent = class extends VisCoreComponent {
};

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/tooltip/tooltip.component.js
var VisTooltipComponent = class {
  ngAfterViewInit() {
    this.component = new Tooltip(this.getConfig());
  }
  ngOnChanges(changes) {
    var _a, _b;
    (_a = this.component) === null || _a === void 0 ? void 0 : _a.setConfig(this.getConfig());
    (_b = this.componentContainer) === null || _b === void 0 ? void 0 : _b.render();
  }
  getConfig() {
    const {
      components,
      container,
      followCursor,
      allowHover,
      horizontalPlacement,
      horizontalShift,
      verticalPlacement,
      verticalShift,
      triggers,
      attributes,
      className,
      hideDelay,
      showDelay
    } = this;
    const config = {
      components,
      container,
      followCursor,
      allowHover,
      horizontalPlacement,
      horizontalShift,
      verticalPlacement,
      verticalShift,
      triggers,
      attributes,
      className,
      hideDelay,
      showDelay
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisTooltipComponent.ɵfac = function VisTooltipComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisTooltipComponent)();
};
VisTooltipComponent.ɵcmp = ɵɵdefineComponent({
  type: VisTooltipComponent,
  selectors: [["vis-tooltip"]],
  inputs: {
    components: "components",
    container: "container",
    followCursor: "followCursor",
    allowHover: "allowHover",
    horizontalPlacement: "horizontalPlacement",
    horizontalShift: "horizontalShift",
    verticalPlacement: "verticalPlacement",
    verticalShift: "verticalShift",
    triggers: "triggers",
    attributes: "attributes",
    className: "className",
    hideDelay: "hideDelay",
    showDelay: "showDelay"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisGenericComponent,
    useExisting: VisTooltipComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisTooltipComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisTooltipComponent, [{
    type: Component,
    args: [{
      selector: "vis-tooltip",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisGenericComponent,
        useExisting: VisTooltipComponent
      }]
    }]
  }], null, {
    components: [{
      type: Input
    }],
    container: [{
      type: Input
    }],
    followCursor: [{
      type: Input
    }],
    allowHover: [{
      type: Input
    }],
    horizontalPlacement: [{
      type: Input
    }],
    horizontalShift: [{
      type: Input
    }],
    verticalPlacement: [{
      type: Input
    }],
    verticalShift: [{
      type: Input
    }],
    triggers: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    className: [{
      type: Input
    }],
    hideDelay: [{
      type: Input
    }],
    showDelay: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/annotations/annotations.component.js
var VisAnnotationsComponent = class {
  ngAfterViewInit() {
    this.component = new Annotations(this.getConfig());
  }
  ngOnChanges(changes) {
    var _a, _b;
    (_a = this.component) === null || _a === void 0 ? void 0 : _a.setConfig(this.getConfig());
    (_b = this.componentContainer) === null || _b === void 0 ? void 0 : _b.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      items
    } = this;
    const config = {
      duration,
      events,
      attributes,
      items
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisAnnotationsComponent.ɵfac = function VisAnnotationsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisAnnotationsComponent)();
};
VisAnnotationsComponent.ɵcmp = ɵɵdefineComponent({
  type: VisAnnotationsComponent,
  selectors: [["vis-annotations"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    items: "items"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisGenericComponent,
    useExisting: VisAnnotationsComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisAnnotationsComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisAnnotationsComponent, [{
    type: Component,
    args: [{
      selector: "vis-annotations",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisGenericComponent,
        useExisting: VisAnnotationsComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    items: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/containers/xy-container/xy-container.component.js
var _c0 = ["container"];
var _c1 = ["*"];
var VisXYContainerComponent = class {
  constructor() {
    this.yDomainMinConstraint = void 0;
    this.yDirection = Direction.North;
    this.preventEmptyDomain = null;
    this.duration = void 0;
    this.margin = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
    this.padding = {};
    this.autoMargin = true;
    this.data = void 0;
  }
  ngAfterViewInit() {
    this.chart = new XYContainer(this.containerRef.nativeElement, this.getConfig(), this.data);
    this.passContainerReferenceToChildren();
  }
  ngAfterContentInit() {
    this.visComponents.changes.subscribe(() => {
      var _a;
      this.passContainerReferenceToChildren();
      (_a = this.chart) === null || _a === void 0 ? void 0 : _a.updateContainer(this.getConfig());
    });
  }
  ngOnChanges(changes) {
    var _a, _b;
    const preventRender = true;
    if (changes.data) {
      (_a = this.chart) === null || _a === void 0 ? void 0 : _a.setData(this.data, preventRender);
      delete changes.data;
    }
    (_b = this.chart) === null || _b === void 0 ? void 0 : _b.updateContainer(this.getConfig());
  }
  getConfig() {
    var _a, _b;
    const {
      duration,
      margin,
      padding,
      scaleByDomain,
      autoMargin,
      width,
      height,
      xScale,
      xDomain,
      xDomainMinConstraint,
      xDomainMaxConstraint,
      xRange,
      yScale,
      yDomain,
      yDomainMinConstraint,
      yDomainMaxConstraint,
      yRange,
      yDirection,
      ariaLabel
    } = this;
    const visComponents = this.visComponents.toArray().map((d) => d.component);
    const crosshair = visComponents.find((c) => c instanceof Crosshair);
    const tooltip = (_a = this.tooltipComponent) === null || _a === void 0 ? void 0 : _a.component;
    const xAxis = visComponents.find((c) => {
      var _a2;
      return c instanceof Axis && ((_a2 = c === null || c === void 0 ? void 0 : c.config) === null || _a2 === void 0 ? void 0 : _a2.type) === "x";
    });
    const yAxis = visComponents.find((c) => {
      var _a2;
      return c instanceof Axis && ((_a2 = c === null || c === void 0 ? void 0 : c.config) === null || _a2 === void 0 ? void 0 : _a2.type) === "y";
    });
    const annotations = (_b = this.annotationsComponent) === null || _b === void 0 ? void 0 : _b.component;
    const components = visComponents.filter((c) => !(c instanceof Crosshair) && !(c instanceof Tooltip) && !(c instanceof Axis));
    return {
      components,
      width,
      height,
      duration,
      margin,
      padding,
      xAxis,
      yAxis,
      tooltip,
      crosshair,
      annotations,
      scaleByDomain,
      autoMargin,
      xScale,
      xDomain,
      xDomainMinConstraint,
      xDomainMaxConstraint,
      xRange,
      yScale,
      yDomain,
      yDomainMinConstraint,
      yDomainMaxConstraint,
      yRange,
      yDirection,
      ariaLabel
    };
  }
  passContainerReferenceToChildren() {
    if (this.chart) this.visComponents.toArray().forEach((c) => {
      c.componentContainer = this.chart;
    });
  }
  ngOnDestroy() {
    var _a;
    (_a = this.chart) === null || _a === void 0 ? void 0 : _a.destroy();
  }
};
VisXYContainerComponent.ɵfac = function VisXYContainerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisXYContainerComponent)();
};
VisXYContainerComponent.ɵcmp = ɵɵdefineComponent({
  type: VisXYContainerComponent,
  selectors: [["vis-xy-container"]],
  contentQueries: function VisXYContainerComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, VisTooltipComponent, 5);
      ɵɵcontentQuery(dirIndex, VisAnnotationsComponent, 5);
      ɵɵcontentQuery(dirIndex, VisXYComponent, 4);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.tooltipComponent = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.annotationsComponent = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.visComponents = _t);
    }
  },
  viewQuery: function VisXYContainerComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    }
  },
  inputs: {
    width: "width",
    height: "height",
    xScale: "xScale",
    xDomain: "xDomain",
    xDomainMinConstraint: "xDomainMinConstraint",
    xDomainMaxConstraint: "xDomainMaxConstraint",
    xRange: "xRange",
    yScale: "yScale",
    yDomain: "yDomain",
    yDomainMinConstraint: "yDomainMinConstraint",
    yDomainMaxConstraint: "yDomainMaxConstraint",
    yRange: "yRange",
    yDirection: "yDirection",
    preventEmptyDomain: "preventEmptyDomain",
    duration: "duration",
    margin: "margin",
    padding: "padding",
    scaleByDomain: "scaleByDomain",
    autoMargin: "autoMargin",
    ariaLabel: "ariaLabel",
    data: "data"
  },
  standalone: false,
  features: [ɵɵNgOnChangesFeature],
  ngContentSelectors: _c1,
  decls: 3,
  vars: 0,
  consts: [["container", ""], [1, "unovis-xy-container"]],
  template: function VisXYContainerComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "div", 1, 0);
      ɵɵprojection(2);
      ɵɵelementEnd();
    }
  },
  styles: [".unovis-xy-container[_ngcontent-%COMP%] { width: 100%; height: 100%; position: relative; }"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisXYContainerComponent, [{
    type: Component,
    args: [{
      selector: "vis-xy-container",
      template: `<div #container class="unovis-xy-container">
    <ng-content></ng-content>
  </div>`,
      styles: [".unovis-xy-container { width: 100%; height: 100%; position: relative; }"]
    }]
  }], null, {
    containerRef: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    visComponents: [{
      type: ContentChildren,
      args: [VisXYComponent]
    }],
    tooltipComponent: [{
      type: ContentChild,
      args: [VisTooltipComponent]
    }],
    annotationsComponent: [{
      type: ContentChild,
      args: [VisAnnotationsComponent]
    }],
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    xDomain: [{
      type: Input
    }],
    xDomainMinConstraint: [{
      type: Input
    }],
    xDomainMaxConstraint: [{
      type: Input
    }],
    xRange: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    yDomain: [{
      type: Input
    }],
    yDomainMinConstraint: [{
      type: Input
    }],
    yDomainMaxConstraint: [{
      type: Input
    }],
    yRange: [{
      type: Input
    }],
    yDirection: [{
      type: Input
    }],
    preventEmptyDomain: [{
      type: Input
    }],
    duration: [{
      type: Input
    }],
    margin: [{
      type: Input
    }],
    padding: [{
      type: Input
    }],
    scaleByDomain: [{
      type: Input
    }],
    autoMargin: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/containers/xy-container/xy-container.module.js
var VisXYContainerModule = class {
};
VisXYContainerModule.ɵfac = function VisXYContainerModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisXYContainerModule)();
};
VisXYContainerModule.ɵmod = ɵɵdefineNgModule({
  type: VisXYContainerModule,
  declarations: [VisXYContainerComponent],
  exports: [VisXYContainerComponent]
});
VisXYContainerModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisXYContainerModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisXYContainerComponent],
      exports: [VisXYContainerComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/containers/single-container/single-container.component.js
var _c02 = ["container"];
var _c12 = ["*"];
var VisSingleContainerComponent = class {
  constructor() {
    this.margin = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
  }
  ngAfterViewInit() {
    this.chart = new SingleContainer(this.containerRef.nativeElement, this.getConfig(), this.data);
    this.visComponent.componentContainer = this.chart;
  }
  ngOnChanges(changes) {
    var _a, _b;
    if (changes.data) {
      (_a = this.chart) === null || _a === void 0 ? void 0 : _a.setData(this.data, true);
      delete changes.data;
    }
    (_b = this.chart) === null || _b === void 0 ? void 0 : _b.updateContainer(this.getConfig());
  }
  getConfig() {
    var _a, _b, _c;
    const {
      width,
      height,
      duration,
      margin,
      ariaLabel,
      svgDefs,
      sizing
    } = this;
    const component = (_a = this.visComponent) === null || _a === void 0 ? void 0 : _a.component;
    const tooltip = (_b = this.tooltipComponent) === null || _b === void 0 ? void 0 : _b.component;
    const annotations = (_c = this.annotationsComponent) === null || _c === void 0 ? void 0 : _c.component;
    return {
      width,
      height,
      duration,
      margin,
      component,
      tooltip,
      ariaLabel,
      annotations,
      svgDefs,
      sizing
    };
  }
  ngOnDestroy() {
    this.chart.destroy();
  }
};
VisSingleContainerComponent.ɵfac = function VisSingleContainerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisSingleContainerComponent)();
};
VisSingleContainerComponent.ɵcmp = ɵɵdefineComponent({
  type: VisSingleContainerComponent,
  selectors: [["vis-single-container"]],
  contentQueries: function VisSingleContainerComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, VisCoreComponent, 5);
      ɵɵcontentQuery(dirIndex, VisTooltipComponent, 5);
      ɵɵcontentQuery(dirIndex, VisAnnotationsComponent, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.visComponent = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.tooltipComponent = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.annotationsComponent = _t.first);
    }
  },
  viewQuery: function VisSingleContainerComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c02, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    }
  },
  inputs: {
    width: "width",
    height: "height",
    margin: "margin",
    duration: "duration",
    ariaLabel: "ariaLabel",
    svgDefs: "svgDefs",
    sizing: "sizing",
    data: "data"
  },
  standalone: false,
  features: [ɵɵNgOnChangesFeature],
  ngContentSelectors: _c12,
  decls: 3,
  vars: 0,
  consts: [["container", ""], [1, "unovis-single-container"]],
  template: function VisSingleContainerComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "div", 1, 0);
      ɵɵprojection(2);
      ɵɵelementEnd();
    }
  },
  styles: [".unovis-single-container[_ngcontent-%COMP%] { width: 100%; height: 100%; position: relative; }"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisSingleContainerComponent, [{
    type: Component,
    args: [{
      selector: "vis-single-container",
      template: `<div #container class="unovis-single-container">
    <ng-content></ng-content>
  </div>`,
      styles: [".unovis-single-container { width: 100%; height: 100%; position: relative; }"]
    }]
  }], null, {
    containerRef: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    visComponent: [{
      type: ContentChild,
      args: [VisCoreComponent]
    }],
    tooltipComponent: [{
      type: ContentChild,
      args: [VisTooltipComponent]
    }],
    annotationsComponent: [{
      type: ContentChild,
      args: [VisAnnotationsComponent]
    }],
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }],
    margin: [{
      type: Input
    }],
    duration: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    svgDefs: [{
      type: Input
    }],
    sizing: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/containers/single-container/single-container.module.js
var VisSingleContainerModule = class {
};
VisSingleContainerModule.ɵfac = function VisSingleContainerModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisSingleContainerModule)();
};
VisSingleContainerModule.ɵmod = ɵɵdefineNgModule({
  type: VisSingleContainerModule,
  declarations: [VisSingleContainerComponent],
  exports: [VisSingleContainerComponent]
});
VisSingleContainerModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisSingleContainerModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisSingleContainerComponent],
      exports: [VisSingleContainerComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/area/area.component.js
var VisAreaComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Area(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      curveType,
      baseline,
      opacity,
      cursor,
      minHeight1Px,
      minHeight
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      curveType,
      baseline,
      opacity,
      cursor,
      minHeight1Px,
      minHeight
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisAreaComponent.ɵfac = function VisAreaComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisAreaComponent)();
};
VisAreaComponent.ɵcmp = ɵɵdefineComponent({
  type: VisAreaComponent,
  selectors: [["vis-area"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    y: "y",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    curveType: "curveType",
    baseline: "baseline",
    opacity: "opacity",
    cursor: "cursor",
    minHeight1Px: "minHeight1Px",
    minHeight: "minHeight",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisAreaComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisAreaComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisAreaComponent, [{
    type: Component,
    args: [{
      selector: "vis-area",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisAreaComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    y: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    curveType: [{
      type: Input
    }],
    baseline: [{
      type: Input
    }],
    opacity: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    minHeight1Px: [{
      type: Input
    }],
    minHeight: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/area/area.module.js
var VisAreaModule = class {
};
VisAreaModule.ɵfac = function VisAreaModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisAreaModule)();
};
VisAreaModule.ɵmod = ɵɵdefineNgModule({
  type: VisAreaModule,
  declarations: [VisAreaComponent],
  exports: [VisAreaComponent]
});
VisAreaModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisAreaModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisAreaComponent],
      exports: [VisAreaComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/annotations/annotations.module.js
var VisAnnotationsModule = class {
};
VisAnnotationsModule.ɵfac = function VisAnnotationsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisAnnotationsModule)();
};
VisAnnotationsModule.ɵmod = ɵɵdefineNgModule({
  type: VisAnnotationsModule,
  declarations: [VisAnnotationsComponent],
  exports: [VisAnnotationsComponent]
});
VisAnnotationsModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisAnnotationsModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisAnnotationsComponent],
      exports: [VisAnnotationsComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/axis/axis.component.js
var VisAxisComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Axis(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      position,
      type,
      fullSize,
      label,
      labelFontSize,
      labelMargin,
      labelTextFitMode,
      labelTextTrimType,
      labelColor,
      gridLine,
      tickLine,
      domainLine,
      minMaxTicksOnly,
      minMaxTicksOnlyShowGridLines,
      minMaxTicksOnlyWhenWidthIsLess,
      tickFormat,
      tickValues,
      numTicks,
      tickTextFitMode,
      tickTextWidth,
      tickTextSeparator,
      tickTextForceWordBreak,
      tickTextTrimType,
      tickTextFontSize,
      tickTextAlign,
      tickTextColor,
      tickTextAngle,
      tickTextHideOverlapping,
      tickPadding
    } = this;
    const config = {
      duration,
      events,
      attributes,
      position,
      type,
      fullSize,
      label,
      labelFontSize,
      labelMargin,
      labelTextFitMode,
      labelTextTrimType,
      labelColor,
      gridLine,
      tickLine,
      domainLine,
      minMaxTicksOnly,
      minMaxTicksOnlyShowGridLines,
      minMaxTicksOnlyWhenWidthIsLess,
      tickFormat,
      tickValues,
      numTicks,
      tickTextFitMode,
      tickTextWidth,
      tickTextSeparator,
      tickTextForceWordBreak,
      tickTextTrimType,
      tickTextFontSize,
      tickTextAlign,
      tickTextColor,
      tickTextAngle,
      tickTextHideOverlapping,
      tickPadding
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisAxisComponent.ɵfac = function VisAxisComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisAxisComponent)();
};
VisAxisComponent.ɵcmp = ɵɵdefineComponent({
  type: VisAxisComponent,
  selectors: [["vis-axis"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    position: "position",
    type: "type",
    fullSize: "fullSize",
    label: "label",
    labelFontSize: "labelFontSize",
    labelMargin: "labelMargin",
    labelTextFitMode: "labelTextFitMode",
    labelTextTrimType: "labelTextTrimType",
    labelColor: "labelColor",
    gridLine: "gridLine",
    tickLine: "tickLine",
    domainLine: "domainLine",
    minMaxTicksOnly: "minMaxTicksOnly",
    minMaxTicksOnlyShowGridLines: "minMaxTicksOnlyShowGridLines",
    minMaxTicksOnlyWhenWidthIsLess: "minMaxTicksOnlyWhenWidthIsLess",
    tickFormat: "tickFormat",
    tickValues: "tickValues",
    numTicks: "numTicks",
    tickTextFitMode: "tickTextFitMode",
    tickTextWidth: "tickTextWidth",
    tickTextSeparator: "tickTextSeparator",
    tickTextForceWordBreak: "tickTextForceWordBreak",
    tickTextTrimType: "tickTextTrimType",
    tickTextFontSize: "tickTextFontSize",
    tickTextAlign: "tickTextAlign",
    tickTextColor: "tickTextColor",
    tickTextAngle: "tickTextAngle",
    tickTextHideOverlapping: "tickTextHideOverlapping",
    tickPadding: "tickPadding",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisAxisComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisAxisComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisAxisComponent, [{
    type: Component,
    args: [{
      selector: "vis-axis",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisAxisComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    type: [{
      type: Input
    }],
    fullSize: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    labelFontSize: [{
      type: Input
    }],
    labelMargin: [{
      type: Input
    }],
    labelTextFitMode: [{
      type: Input
    }],
    labelTextTrimType: [{
      type: Input
    }],
    labelColor: [{
      type: Input
    }],
    gridLine: [{
      type: Input
    }],
    tickLine: [{
      type: Input
    }],
    domainLine: [{
      type: Input
    }],
    minMaxTicksOnly: [{
      type: Input
    }],
    minMaxTicksOnlyShowGridLines: [{
      type: Input
    }],
    minMaxTicksOnlyWhenWidthIsLess: [{
      type: Input
    }],
    tickFormat: [{
      type: Input
    }],
    tickValues: [{
      type: Input
    }],
    numTicks: [{
      type: Input
    }],
    tickTextFitMode: [{
      type: Input
    }],
    tickTextWidth: [{
      type: Input
    }],
    tickTextSeparator: [{
      type: Input
    }],
    tickTextForceWordBreak: [{
      type: Input
    }],
    tickTextTrimType: [{
      type: Input
    }],
    tickTextFontSize: [{
      type: Input
    }],
    tickTextAlign: [{
      type: Input
    }],
    tickTextColor: [{
      type: Input
    }],
    tickTextAngle: [{
      type: Input
    }],
    tickTextHideOverlapping: [{
      type: Input
    }],
    tickPadding: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/axis/axis.module.js
var VisAxisModule = class {
};
VisAxisModule.ɵfac = function VisAxisModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisAxisModule)();
};
VisAxisModule.ɵmod = ɵɵdefineNgModule({
  type: VisAxisModule,
  declarations: [VisAxisComponent],
  exports: [VisAxisComponent]
});
VisAxisModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisAxisModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisAxisComponent],
      exports: [VisAxisComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/brush/brush.component.js
var VisBrushComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Brush(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      onBrush,
      onBrushStart,
      onBrushMove,
      onBrushEnd,
      handleWidth,
      selection,
      draggable,
      handlePosition,
      selectionMinLength
    } = this;
    const config = {
      duration,
      events,
      attributes,
      onBrush,
      onBrushStart,
      onBrushMove,
      onBrushEnd,
      handleWidth,
      selection,
      draggable,
      handlePosition,
      selectionMinLength
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisBrushComponent.ɵfac = function VisBrushComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisBrushComponent)();
};
VisBrushComponent.ɵcmp = ɵɵdefineComponent({
  type: VisBrushComponent,
  selectors: [["vis-brush"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    onBrush: "onBrush",
    onBrushStart: "onBrushStart",
    onBrushMove: "onBrushMove",
    onBrushEnd: "onBrushEnd",
    handleWidth: "handleWidth",
    selection: "selection",
    draggable: "draggable",
    handlePosition: "handlePosition",
    selectionMinLength: "selectionMinLength",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisBrushComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisBrushComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisBrushComponent, [{
    type: Component,
    args: [{
      selector: "vis-brush",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisBrushComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    onBrush: [{
      type: Input
    }],
    onBrushStart: [{
      type: Input
    }],
    onBrushMove: [{
      type: Input
    }],
    onBrushEnd: [{
      type: Input
    }],
    handleWidth: [{
      type: Input
    }],
    selection: [{
      type: Input
    }],
    draggable: [{
      type: Input
    }],
    handlePosition: [{
      type: Input
    }],
    selectionMinLength: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/brush/brush.module.js
var VisBrushModule = class {
};
VisBrushModule.ɵfac = function VisBrushModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisBrushModule)();
};
VisBrushModule.ɵmod = ɵɵdefineNgModule({
  type: VisBrushModule,
  declarations: [VisBrushComponent],
  exports: [VisBrushComponent]
});
VisBrushModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisBrushModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisBrushComponent],
      exports: [VisBrushComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/chord-diagram/chord-diagram.component.js
var VisChordDiagramComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new ChordDiagram(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      angleRange,
      cornerRadius,
      highlightedNodeId,
      highlightedLinkIds,
      linkColor,
      linkValue,
      nodeLevels,
      nodeWidth,
      nodeColor,
      nodeLabel,
      nodeLabelColor,
      nodeLabelAlignment,
      padAngle,
      radiusScaleExponent
    } = this;
    const config = {
      duration,
      events,
      attributes,
      angleRange,
      cornerRadius,
      highlightedNodeId,
      highlightedLinkIds,
      linkColor,
      linkValue,
      nodeLevels,
      nodeWidth,
      nodeColor,
      nodeLabel,
      nodeLabelColor,
      nodeLabelAlignment,
      padAngle,
      radiusScaleExponent
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisChordDiagramComponent.ɵfac = function VisChordDiagramComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisChordDiagramComponent)();
};
VisChordDiagramComponent.ɵcmp = ɵɵdefineComponent({
  type: VisChordDiagramComponent,
  selectors: [["vis-chord-diagram"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    angleRange: "angleRange",
    cornerRadius: "cornerRadius",
    highlightedNodeId: "highlightedNodeId",
    highlightedLinkIds: "highlightedLinkIds",
    linkColor: "linkColor",
    linkValue: "linkValue",
    nodeLevels: "nodeLevels",
    nodeWidth: "nodeWidth",
    nodeColor: "nodeColor",
    nodeLabel: "nodeLabel",
    nodeLabelColor: "nodeLabelColor",
    nodeLabelAlignment: "nodeLabelAlignment",
    padAngle: "padAngle",
    radiusScaleExponent: "radiusScaleExponent",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisChordDiagramComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisChordDiagramComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisChordDiagramComponent, [{
    type: Component,
    args: [{
      selector: "vis-chord-diagram",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisChordDiagramComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    angleRange: [{
      type: Input
    }],
    cornerRadius: [{
      type: Input
    }],
    highlightedNodeId: [{
      type: Input
    }],
    highlightedLinkIds: [{
      type: Input
    }],
    linkColor: [{
      type: Input
    }],
    linkValue: [{
      type: Input
    }],
    nodeLevels: [{
      type: Input
    }],
    nodeWidth: [{
      type: Input
    }],
    nodeColor: [{
      type: Input
    }],
    nodeLabel: [{
      type: Input
    }],
    nodeLabelColor: [{
      type: Input
    }],
    nodeLabelAlignment: [{
      type: Input
    }],
    padAngle: [{
      type: Input
    }],
    radiusScaleExponent: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/chord-diagram/chord-diagram.module.js
var VisChordDiagramModule = class {
};
VisChordDiagramModule.ɵfac = function VisChordDiagramModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisChordDiagramModule)();
};
VisChordDiagramModule.ɵmod = ɵɵdefineNgModule({
  type: VisChordDiagramModule,
  declarations: [VisChordDiagramComponent],
  exports: [VisChordDiagramComponent]
});
VisChordDiagramModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisChordDiagramModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisChordDiagramComponent],
      exports: [VisChordDiagramComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/crosshair/crosshair.component.js
var VisCrosshairComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Crosshair(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      strokeColor,
      strokeWidth,
      yStacked,
      baseline,
      tooltip,
      template,
      hideWhenFarFromPointer,
      hideWhenFarFromPointerDistance,
      snapToData,
      getCircles,
      onCrosshairMove,
      forceShowAt,
      skipRangeCheck
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      strokeColor,
      strokeWidth,
      yStacked,
      baseline,
      tooltip,
      template,
      hideWhenFarFromPointer,
      hideWhenFarFromPointerDistance,
      snapToData,
      getCircles,
      onCrosshairMove,
      forceShowAt,
      skipRangeCheck
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisCrosshairComponent.ɵfac = function VisCrosshairComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisCrosshairComponent)();
};
VisCrosshairComponent.ɵcmp = ɵɵdefineComponent({
  type: VisCrosshairComponent,
  selectors: [["vis-crosshair"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    y: "y",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    strokeColor: "strokeColor",
    strokeWidth: "strokeWidth",
    yStacked: "yStacked",
    baseline: "baseline",
    tooltip: "tooltip",
    template: "template",
    hideWhenFarFromPointer: "hideWhenFarFromPointer",
    hideWhenFarFromPointerDistance: "hideWhenFarFromPointerDistance",
    snapToData: "snapToData",
    getCircles: "getCircles",
    onCrosshairMove: "onCrosshairMove",
    forceShowAt: "forceShowAt",
    skipRangeCheck: "skipRangeCheck",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisCrosshairComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisCrosshairComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisCrosshairComponent, [{
    type: Component,
    args: [{
      selector: "vis-crosshair",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisCrosshairComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    y: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    strokeColor: [{
      type: Input
    }],
    strokeWidth: [{
      type: Input
    }],
    yStacked: [{
      type: Input
    }],
    baseline: [{
      type: Input
    }],
    tooltip: [{
      type: Input
    }],
    template: [{
      type: Input
    }],
    hideWhenFarFromPointer: [{
      type: Input
    }],
    hideWhenFarFromPointerDistance: [{
      type: Input
    }],
    snapToData: [{
      type: Input
    }],
    getCircles: [{
      type: Input
    }],
    onCrosshairMove: [{
      type: Input
    }],
    forceShowAt: [{
      type: Input
    }],
    skipRangeCheck: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/crosshair/crosshair.module.js
var VisCrosshairModule = class {
};
VisCrosshairModule.ɵfac = function VisCrosshairModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisCrosshairModule)();
};
VisCrosshairModule.ɵmod = ɵɵdefineNgModule({
  type: VisCrosshairModule,
  declarations: [VisCrosshairComponent],
  exports: [VisCrosshairComponent]
});
VisCrosshairModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisCrosshairModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisCrosshairComponent],
      exports: [VisCrosshairComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/donut/donut.component.js
var VisDonutComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Donut(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      id,
      value,
      angleRange,
      padAngle,
      sortFunction,
      cornerRadius,
      color,
      radius,
      arcWidth,
      centralLabel,
      centralSubLabel,
      centralSubLabelWrap,
      showEmptySegments,
      emptySegmentAngle,
      showBackground,
      backgroundAngleRange,
      centralLabelOffsetX,
      centralLabelOffsetY
    } = this;
    const config = {
      duration,
      events,
      attributes,
      id,
      value,
      angleRange,
      padAngle,
      sortFunction,
      cornerRadius,
      color,
      radius,
      arcWidth,
      centralLabel,
      centralSubLabel,
      centralSubLabelWrap,
      showEmptySegments,
      emptySegmentAngle,
      showBackground,
      backgroundAngleRange,
      centralLabelOffsetX,
      centralLabelOffsetY
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisDonutComponent.ɵfac = function VisDonutComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisDonutComponent)();
};
VisDonutComponent.ɵcmp = ɵɵdefineComponent({
  type: VisDonutComponent,
  selectors: [["vis-donut"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    id: "id",
    value: "value",
    angleRange: "angleRange",
    padAngle: "padAngle",
    sortFunction: "sortFunction",
    cornerRadius: "cornerRadius",
    color: "color",
    radius: "radius",
    arcWidth: "arcWidth",
    centralLabel: "centralLabel",
    centralSubLabel: "centralSubLabel",
    centralSubLabelWrap: "centralSubLabelWrap",
    showEmptySegments: "showEmptySegments",
    emptySegmentAngle: "emptySegmentAngle",
    showBackground: "showBackground",
    backgroundAngleRange: "backgroundAngleRange",
    centralLabelOffsetX: "centralLabelOffsetX",
    centralLabelOffsetY: "centralLabelOffsetY",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisDonutComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisDonutComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisDonutComponent, [{
    type: Component,
    args: [{
      selector: "vis-donut",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisDonutComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    angleRange: [{
      type: Input
    }],
    padAngle: [{
      type: Input
    }],
    sortFunction: [{
      type: Input
    }],
    cornerRadius: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    radius: [{
      type: Input
    }],
    arcWidth: [{
      type: Input
    }],
    centralLabel: [{
      type: Input
    }],
    centralSubLabel: [{
      type: Input
    }],
    centralSubLabelWrap: [{
      type: Input
    }],
    showEmptySegments: [{
      type: Input
    }],
    emptySegmentAngle: [{
      type: Input
    }],
    showBackground: [{
      type: Input
    }],
    backgroundAngleRange: [{
      type: Input
    }],
    centralLabelOffsetX: [{
      type: Input
    }],
    centralLabelOffsetY: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/donut/donut.module.js
var VisDonutModule = class {
};
VisDonutModule.ɵfac = function VisDonutModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisDonutModule)();
};
VisDonutModule.ɵmod = ɵɵdefineNgModule({
  type: VisDonutModule,
  declarations: [VisDonutComponent],
  exports: [VisDonutComponent]
});
VisDonutModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisDonutModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisDonutComponent],
      exports: [VisDonutComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/free-brush/free-brush.component.js
var VisFreeBrushComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new FreeBrush(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      mode,
      onBrush,
      onBrushStart,
      onBrushMove,
      onBrushEnd,
      handleWidth,
      selection,
      selectionMinLength,
      autoHide
    } = this;
    const config = {
      duration,
      events,
      attributes,
      mode,
      onBrush,
      onBrushStart,
      onBrushMove,
      onBrushEnd,
      handleWidth,
      selection,
      selectionMinLength,
      autoHide
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisFreeBrushComponent.ɵfac = function VisFreeBrushComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisFreeBrushComponent)();
};
VisFreeBrushComponent.ɵcmp = ɵɵdefineComponent({
  type: VisFreeBrushComponent,
  selectors: [["vis-free-brush"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    mode: "mode",
    onBrush: "onBrush",
    onBrushStart: "onBrushStart",
    onBrushMove: "onBrushMove",
    onBrushEnd: "onBrushEnd",
    handleWidth: "handleWidth",
    selection: "selection",
    selectionMinLength: "selectionMinLength",
    autoHide: "autoHide",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisFreeBrushComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisFreeBrushComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisFreeBrushComponent, [{
    type: Component,
    args: [{
      selector: "vis-free-brush",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisFreeBrushComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    mode: [{
      type: Input
    }],
    onBrush: [{
      type: Input
    }],
    onBrushStart: [{
      type: Input
    }],
    onBrushMove: [{
      type: Input
    }],
    onBrushEnd: [{
      type: Input
    }],
    handleWidth: [{
      type: Input
    }],
    selection: [{
      type: Input
    }],
    selectionMinLength: [{
      type: Input
    }],
    autoHide: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/free-brush/free-brush.module.js
var VisFreeBrushModule = class {
};
VisFreeBrushModule.ɵfac = function VisFreeBrushModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisFreeBrushModule)();
};
VisFreeBrushModule.ɵmod = ɵɵdefineNgModule({
  type: VisFreeBrushModule,
  declarations: [VisFreeBrushComponent],
  exports: [VisFreeBrushComponent]
});
VisFreeBrushModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisFreeBrushModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisFreeBrushComponent],
      exports: [VisFreeBrushComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/graph/graph.component.js
var VisGraphComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Graph(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      zoomScaleExtent,
      disableZoom,
      zoomEventFilter,
      disableDrag,
      disableBrush,
      zoomThrottledUpdateNodeThreshold,
      fitViewPadding,
      fitViewAlign,
      layoutType,
      layoutAutofit,
      layoutAutofitTolerance,
      layoutNonConnectedAside,
      layoutNodeGroup,
      layoutGroupOrder,
      layoutParallelNodesPerColumn,
      layoutParallelNodeSubGroup,
      layoutParallelSubGroupsPerRow,
      layoutParallelNodeSpacing,
      layoutParallelSubGroupSpacing,
      layoutParallelGroupSpacing,
      layoutParallelSortConnectionsByGroup,
      forceLayoutSettings,
      dagreLayoutSettings,
      layoutElkSettings,
      layoutElkNodeGroups,
      layoutElkGetNodeShape,
      linkWidth,
      linkStyle,
      linkBandWidth,
      linkArrow,
      linkStroke,
      linkDisabled,
      linkFlow,
      linkFlowAnimDuration,
      linkFlowParticleSize,
      linkFlowParticleSpeed,
      linkLabel,
      linkLabelShiftFromCenter,
      linkNeighborSpacing,
      linkCurvature,
      linkHighlightOnHover,
      linkSourcePointOffset,
      linkTargetPointOffset,
      selectedLinkId,
      nodeSize,
      nodeStrokeWidth,
      nodeShape,
      nodeGaugeValue,
      nodeGaugeFill,
      nodeGaugeAnimDuration,
      nodeIcon,
      nodeIconSize,
      nodeLabel,
      nodeLabelTrim,
      nodeLabelTrimMode,
      nodeLabelTrimLength,
      nodeSubLabel,
      nodeSubLabelTrim,
      nodeSubLabelTrimMode,
      nodeSubLabelTrimLength,
      nodeSideLabels,
      nodeBottomIcon,
      nodeDisabled,
      nodeFill,
      nodeStroke,
      nodeSort,
      nodeEnterPosition,
      nodeEnterScale,
      nodeExitPosition,
      nodeExitScale,
      nodeEnterCustomRenderFunction,
      nodeUpdateCustomRenderFunction,
      nodePartialUpdateCustomRenderFunction,
      nodeExitCustomRenderFunction,
      nodeOnZoomCustomRenderFunction,
      nodeSelectionHighlightMode,
      selectedNodeId,
      selectedNodeIds,
      panels,
      onNodeDragStart,
      onNodeDrag,
      onNodeDragEnd,
      onZoom,
      onZoomStart,
      onZoomEnd,
      onLayoutCalculated,
      onNodeSelectionBrush,
      onNodeSelectionDrag,
      onRenderComplete,
      shouldDataUpdate
    } = this;
    const config = {
      duration,
      events,
      attributes,
      zoomScaleExtent,
      disableZoom,
      zoomEventFilter,
      disableDrag,
      disableBrush,
      zoomThrottledUpdateNodeThreshold,
      fitViewPadding,
      fitViewAlign,
      layoutType,
      layoutAutofit,
      layoutAutofitTolerance,
      layoutNonConnectedAside,
      layoutNodeGroup,
      layoutGroupOrder,
      layoutParallelNodesPerColumn,
      layoutParallelNodeSubGroup,
      layoutParallelSubGroupsPerRow,
      layoutParallelNodeSpacing,
      layoutParallelSubGroupSpacing,
      layoutParallelGroupSpacing,
      layoutParallelSortConnectionsByGroup,
      forceLayoutSettings,
      dagreLayoutSettings,
      layoutElkSettings,
      layoutElkNodeGroups,
      layoutElkGetNodeShape,
      linkWidth,
      linkStyle,
      linkBandWidth,
      linkArrow,
      linkStroke,
      linkDisabled,
      linkFlow,
      linkFlowAnimDuration,
      linkFlowParticleSize,
      linkFlowParticleSpeed,
      linkLabel,
      linkLabelShiftFromCenter,
      linkNeighborSpacing,
      linkCurvature,
      linkHighlightOnHover,
      linkSourcePointOffset,
      linkTargetPointOffset,
      selectedLinkId,
      nodeSize,
      nodeStrokeWidth,
      nodeShape,
      nodeGaugeValue,
      nodeGaugeFill,
      nodeGaugeAnimDuration,
      nodeIcon,
      nodeIconSize,
      nodeLabel,
      nodeLabelTrim,
      nodeLabelTrimMode,
      nodeLabelTrimLength,
      nodeSubLabel,
      nodeSubLabelTrim,
      nodeSubLabelTrimMode,
      nodeSubLabelTrimLength,
      nodeSideLabels,
      nodeBottomIcon,
      nodeDisabled,
      nodeFill,
      nodeStroke,
      nodeSort,
      nodeEnterPosition,
      nodeEnterScale,
      nodeExitPosition,
      nodeExitScale,
      nodeEnterCustomRenderFunction,
      nodeUpdateCustomRenderFunction,
      nodePartialUpdateCustomRenderFunction,
      nodeExitCustomRenderFunction,
      nodeOnZoomCustomRenderFunction,
      nodeSelectionHighlightMode,
      selectedNodeId,
      selectedNodeIds,
      panels,
      onNodeDragStart,
      onNodeDrag,
      onNodeDragEnd,
      onZoom,
      onZoomStart,
      onZoomEnd,
      onLayoutCalculated,
      onNodeSelectionBrush,
      onNodeSelectionDrag,
      onRenderComplete,
      shouldDataUpdate
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisGraphComponent.ɵfac = function VisGraphComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisGraphComponent)();
};
VisGraphComponent.ɵcmp = ɵɵdefineComponent({
  type: VisGraphComponent,
  selectors: [["vis-graph"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    zoomScaleExtent: "zoomScaleExtent",
    disableZoom: "disableZoom",
    zoomEventFilter: "zoomEventFilter",
    disableDrag: "disableDrag",
    disableBrush: "disableBrush",
    zoomThrottledUpdateNodeThreshold: "zoomThrottledUpdateNodeThreshold",
    fitViewPadding: "fitViewPadding",
    fitViewAlign: "fitViewAlign",
    layoutType: "layoutType",
    layoutAutofit: "layoutAutofit",
    layoutAutofitTolerance: "layoutAutofitTolerance",
    layoutNonConnectedAside: "layoutNonConnectedAside",
    layoutNodeGroup: "layoutNodeGroup",
    layoutGroupOrder: "layoutGroupOrder",
    layoutParallelNodesPerColumn: "layoutParallelNodesPerColumn",
    layoutParallelNodeSubGroup: "layoutParallelNodeSubGroup",
    layoutParallelSubGroupsPerRow: "layoutParallelSubGroupsPerRow",
    layoutParallelNodeSpacing: "layoutParallelNodeSpacing",
    layoutParallelSubGroupSpacing: "layoutParallelSubGroupSpacing",
    layoutParallelGroupSpacing: "layoutParallelGroupSpacing",
    layoutParallelSortConnectionsByGroup: "layoutParallelSortConnectionsByGroup",
    forceLayoutSettings: "forceLayoutSettings",
    dagreLayoutSettings: "dagreLayoutSettings",
    layoutElkSettings: "layoutElkSettings",
    layoutElkNodeGroups: "layoutElkNodeGroups",
    layoutElkGetNodeShape: "layoutElkGetNodeShape",
    linkWidth: "linkWidth",
    linkStyle: "linkStyle",
    linkBandWidth: "linkBandWidth",
    linkArrow: "linkArrow",
    linkStroke: "linkStroke",
    linkDisabled: "linkDisabled",
    linkFlow: "linkFlow",
    linkFlowAnimDuration: "linkFlowAnimDuration",
    linkFlowParticleSize: "linkFlowParticleSize",
    linkFlowParticleSpeed: "linkFlowParticleSpeed",
    linkLabel: "linkLabel",
    linkLabelShiftFromCenter: "linkLabelShiftFromCenter",
    linkNeighborSpacing: "linkNeighborSpacing",
    linkCurvature: "linkCurvature",
    linkHighlightOnHover: "linkHighlightOnHover",
    linkSourcePointOffset: "linkSourcePointOffset",
    linkTargetPointOffset: "linkTargetPointOffset",
    selectedLinkId: "selectedLinkId",
    nodeSize: "nodeSize",
    nodeStrokeWidth: "nodeStrokeWidth",
    nodeShape: "nodeShape",
    nodeGaugeValue: "nodeGaugeValue",
    nodeGaugeFill: "nodeGaugeFill",
    nodeGaugeAnimDuration: "nodeGaugeAnimDuration",
    nodeIcon: "nodeIcon",
    nodeIconSize: "nodeIconSize",
    nodeLabel: "nodeLabel",
    nodeLabelTrim: "nodeLabelTrim",
    nodeLabelTrimMode: "nodeLabelTrimMode",
    nodeLabelTrimLength: "nodeLabelTrimLength",
    nodeSubLabel: "nodeSubLabel",
    nodeSubLabelTrim: "nodeSubLabelTrim",
    nodeSubLabelTrimMode: "nodeSubLabelTrimMode",
    nodeSubLabelTrimLength: "nodeSubLabelTrimLength",
    nodeSideLabels: "nodeSideLabels",
    nodeBottomIcon: "nodeBottomIcon",
    nodeDisabled: "nodeDisabled",
    nodeFill: "nodeFill",
    nodeStroke: "nodeStroke",
    nodeSort: "nodeSort",
    nodeEnterPosition: "nodeEnterPosition",
    nodeEnterScale: "nodeEnterScale",
    nodeExitPosition: "nodeExitPosition",
    nodeExitScale: "nodeExitScale",
    nodeEnterCustomRenderFunction: "nodeEnterCustomRenderFunction",
    nodeUpdateCustomRenderFunction: "nodeUpdateCustomRenderFunction",
    nodePartialUpdateCustomRenderFunction: "nodePartialUpdateCustomRenderFunction",
    nodeExitCustomRenderFunction: "nodeExitCustomRenderFunction",
    nodeOnZoomCustomRenderFunction: "nodeOnZoomCustomRenderFunction",
    nodeSelectionHighlightMode: "nodeSelectionHighlightMode",
    selectedNodeId: "selectedNodeId",
    selectedNodeIds: "selectedNodeIds",
    panels: "panels",
    onNodeDragStart: "onNodeDragStart",
    onNodeDrag: "onNodeDrag",
    onNodeDragEnd: "onNodeDragEnd",
    onZoom: "onZoom",
    onZoomStart: "onZoomStart",
    onZoomEnd: "onZoomEnd",
    onLayoutCalculated: "onLayoutCalculated",
    onNodeSelectionBrush: "onNodeSelectionBrush",
    onNodeSelectionDrag: "onNodeSelectionDrag",
    onRenderComplete: "onRenderComplete",
    shouldDataUpdate: "shouldDataUpdate",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisGraphComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisGraphComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisGraphComponent, [{
    type: Component,
    args: [{
      selector: "vis-graph",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisGraphComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    zoomScaleExtent: [{
      type: Input
    }],
    disableZoom: [{
      type: Input
    }],
    zoomEventFilter: [{
      type: Input
    }],
    disableDrag: [{
      type: Input
    }],
    disableBrush: [{
      type: Input
    }],
    zoomThrottledUpdateNodeThreshold: [{
      type: Input
    }],
    fitViewPadding: [{
      type: Input
    }],
    fitViewAlign: [{
      type: Input
    }],
    layoutType: [{
      type: Input
    }],
    layoutAutofit: [{
      type: Input
    }],
    layoutAutofitTolerance: [{
      type: Input
    }],
    layoutNonConnectedAside: [{
      type: Input
    }],
    layoutNodeGroup: [{
      type: Input
    }],
    layoutGroupOrder: [{
      type: Input
    }],
    layoutParallelNodesPerColumn: [{
      type: Input
    }],
    layoutParallelNodeSubGroup: [{
      type: Input
    }],
    layoutParallelSubGroupsPerRow: [{
      type: Input
    }],
    layoutParallelNodeSpacing: [{
      type: Input
    }],
    layoutParallelSubGroupSpacing: [{
      type: Input
    }],
    layoutParallelGroupSpacing: [{
      type: Input
    }],
    layoutParallelSortConnectionsByGroup: [{
      type: Input
    }],
    forceLayoutSettings: [{
      type: Input
    }],
    dagreLayoutSettings: [{
      type: Input
    }],
    layoutElkSettings: [{
      type: Input
    }],
    layoutElkNodeGroups: [{
      type: Input
    }],
    layoutElkGetNodeShape: [{
      type: Input
    }],
    linkWidth: [{
      type: Input
    }],
    linkStyle: [{
      type: Input
    }],
    linkBandWidth: [{
      type: Input
    }],
    linkArrow: [{
      type: Input
    }],
    linkStroke: [{
      type: Input
    }],
    linkDisabled: [{
      type: Input
    }],
    linkFlow: [{
      type: Input
    }],
    linkFlowAnimDuration: [{
      type: Input
    }],
    linkFlowParticleSize: [{
      type: Input
    }],
    linkFlowParticleSpeed: [{
      type: Input
    }],
    linkLabel: [{
      type: Input
    }],
    linkLabelShiftFromCenter: [{
      type: Input
    }],
    linkNeighborSpacing: [{
      type: Input
    }],
    linkCurvature: [{
      type: Input
    }],
    linkHighlightOnHover: [{
      type: Input
    }],
    linkSourcePointOffset: [{
      type: Input
    }],
    linkTargetPointOffset: [{
      type: Input
    }],
    selectedLinkId: [{
      type: Input
    }],
    nodeSize: [{
      type: Input
    }],
    nodeStrokeWidth: [{
      type: Input
    }],
    nodeShape: [{
      type: Input
    }],
    nodeGaugeValue: [{
      type: Input
    }],
    nodeGaugeFill: [{
      type: Input
    }],
    nodeGaugeAnimDuration: [{
      type: Input
    }],
    nodeIcon: [{
      type: Input
    }],
    nodeIconSize: [{
      type: Input
    }],
    nodeLabel: [{
      type: Input
    }],
    nodeLabelTrim: [{
      type: Input
    }],
    nodeLabelTrimMode: [{
      type: Input
    }],
    nodeLabelTrimLength: [{
      type: Input
    }],
    nodeSubLabel: [{
      type: Input
    }],
    nodeSubLabelTrim: [{
      type: Input
    }],
    nodeSubLabelTrimMode: [{
      type: Input
    }],
    nodeSubLabelTrimLength: [{
      type: Input
    }],
    nodeSideLabels: [{
      type: Input
    }],
    nodeBottomIcon: [{
      type: Input
    }],
    nodeDisabled: [{
      type: Input
    }],
    nodeFill: [{
      type: Input
    }],
    nodeStroke: [{
      type: Input
    }],
    nodeSort: [{
      type: Input
    }],
    nodeEnterPosition: [{
      type: Input
    }],
    nodeEnterScale: [{
      type: Input
    }],
    nodeExitPosition: [{
      type: Input
    }],
    nodeExitScale: [{
      type: Input
    }],
    nodeEnterCustomRenderFunction: [{
      type: Input
    }],
    nodeUpdateCustomRenderFunction: [{
      type: Input
    }],
    nodePartialUpdateCustomRenderFunction: [{
      type: Input
    }],
    nodeExitCustomRenderFunction: [{
      type: Input
    }],
    nodeOnZoomCustomRenderFunction: [{
      type: Input
    }],
    nodeSelectionHighlightMode: [{
      type: Input
    }],
    selectedNodeId: [{
      type: Input
    }],
    selectedNodeIds: [{
      type: Input
    }],
    panels: [{
      type: Input
    }],
    onNodeDragStart: [{
      type: Input
    }],
    onNodeDrag: [{
      type: Input
    }],
    onNodeDragEnd: [{
      type: Input
    }],
    onZoom: [{
      type: Input
    }],
    onZoomStart: [{
      type: Input
    }],
    onZoomEnd: [{
      type: Input
    }],
    onLayoutCalculated: [{
      type: Input
    }],
    onNodeSelectionBrush: [{
      type: Input
    }],
    onNodeSelectionDrag: [{
      type: Input
    }],
    onRenderComplete: [{
      type: Input
    }],
    shouldDataUpdate: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/graph/graph.module.js
var VisGraphModule = class {
};
VisGraphModule.ɵfac = function VisGraphModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisGraphModule)();
};
VisGraphModule.ɵmod = ɵɵdefineNgModule({
  type: VisGraphModule,
  declarations: [VisGraphComponent],
  exports: [VisGraphComponent]
});
VisGraphModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisGraphModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisGraphComponent],
      exports: [VisGraphComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/grouped-bar/grouped-bar.component.js
var VisGroupedBarComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new GroupedBar(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      groupWidth,
      groupMaxWidth,
      dataStep,
      groupPadding,
      barPadding,
      roundedCorners,
      barMinHeight,
      cursor,
      orientation
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      groupWidth,
      groupMaxWidth,
      dataStep,
      groupPadding,
      barPadding,
      roundedCorners,
      barMinHeight,
      cursor,
      orientation
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisGroupedBarComponent.ɵfac = function VisGroupedBarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisGroupedBarComponent)();
};
VisGroupedBarComponent.ɵcmp = ɵɵdefineComponent({
  type: VisGroupedBarComponent,
  selectors: [["vis-grouped-bar"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    y: "y",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    groupWidth: "groupWidth",
    groupMaxWidth: "groupMaxWidth",
    dataStep: "dataStep",
    groupPadding: "groupPadding",
    barPadding: "barPadding",
    roundedCorners: "roundedCorners",
    barMinHeight: "barMinHeight",
    cursor: "cursor",
    orientation: "orientation",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisGroupedBarComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisGroupedBarComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisGroupedBarComponent, [{
    type: Component,
    args: [{
      selector: "vis-grouped-bar",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisGroupedBarComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    y: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    groupWidth: [{
      type: Input
    }],
    groupMaxWidth: [{
      type: Input
    }],
    dataStep: [{
      type: Input
    }],
    groupPadding: [{
      type: Input
    }],
    barPadding: [{
      type: Input
    }],
    roundedCorners: [{
      type: Input
    }],
    barMinHeight: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    orientation: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/grouped-bar/grouped-bar.module.js
var VisGroupedBarModule = class {
};
VisGroupedBarModule.ɵfac = function VisGroupedBarModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisGroupedBarModule)();
};
VisGroupedBarModule.ɵmod = ɵɵdefineNgModule({
  type: VisGroupedBarModule,
  declarations: [VisGroupedBarComponent],
  exports: [VisGroupedBarComponent]
});
VisGroupedBarModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisGroupedBarModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisGroupedBarComponent],
      exports: [VisGroupedBarComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/line/line.component.js
var VisLineComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Line(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      curveType,
      lineWidth,
      lineDashArray,
      fallbackValue,
      highlightOnHover,
      cursor,
      interpolateMissingData
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      curveType,
      lineWidth,
      lineDashArray,
      fallbackValue,
      highlightOnHover,
      cursor,
      interpolateMissingData
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisLineComponent.ɵfac = function VisLineComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisLineComponent)();
};
VisLineComponent.ɵcmp = ɵɵdefineComponent({
  type: VisLineComponent,
  selectors: [["vis-line"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    y: "y",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    curveType: "curveType",
    lineWidth: "lineWidth",
    lineDashArray: "lineDashArray",
    fallbackValue: "fallbackValue",
    highlightOnHover: "highlightOnHover",
    cursor: "cursor",
    interpolateMissingData: "interpolateMissingData",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisLineComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisLineComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisLineComponent, [{
    type: Component,
    args: [{
      selector: "vis-line",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisLineComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    y: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    curveType: [{
      type: Input
    }],
    lineWidth: [{
      type: Input
    }],
    lineDashArray: [{
      type: Input
    }],
    fallbackValue: [{
      type: Input
    }],
    highlightOnHover: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    interpolateMissingData: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/line/line.module.js
var VisLineModule = class {
};
VisLineModule.ɵfac = function VisLineModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisLineModule)();
};
VisLineModule.ɵmod = ɵɵdefineNgModule({
  type: VisLineModule,
  declarations: [VisLineComponent],
  exports: [VisLineComponent]
});
VisLineModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisLineModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisLineComponent],
      exports: [VisLineComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/nested-donut/nested-donut.component.js
var VisNestedDonutComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new NestedDonut(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      angleRange,
      direction,
      value,
      centralLabel,
      centralSubLabel,
      centralSubLabelWrap,
      showBackground,
      sort,
      layers,
      layerSettings,
      layerPadding,
      cornerRadius,
      emptySegmentAngle,
      hideOverflowingSegmentLabels,
      segmentColor,
      segmentLabel,
      segmentLabelColor,
      showEmptySegments,
      showSegmentLabels
    } = this;
    const config = {
      duration,
      events,
      attributes,
      angleRange,
      direction,
      value,
      centralLabel,
      centralSubLabel,
      centralSubLabelWrap,
      showBackground,
      sort,
      layers,
      layerSettings,
      layerPadding,
      cornerRadius,
      emptySegmentAngle,
      hideOverflowingSegmentLabels,
      segmentColor,
      segmentLabel,
      segmentLabelColor,
      showEmptySegments,
      showSegmentLabels
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisNestedDonutComponent.ɵfac = function VisNestedDonutComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisNestedDonutComponent)();
};
VisNestedDonutComponent.ɵcmp = ɵɵdefineComponent({
  type: VisNestedDonutComponent,
  selectors: [["vis-nested-donut"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    angleRange: "angleRange",
    direction: "direction",
    value: "value",
    centralLabel: "centralLabel",
    centralSubLabel: "centralSubLabel",
    centralSubLabelWrap: "centralSubLabelWrap",
    showBackground: "showBackground",
    sort: "sort",
    layers: "layers",
    layerSettings: "layerSettings",
    layerPadding: "layerPadding",
    cornerRadius: "cornerRadius",
    emptySegmentAngle: "emptySegmentAngle",
    hideOverflowingSegmentLabels: "hideOverflowingSegmentLabels",
    segmentColor: "segmentColor",
    segmentLabel: "segmentLabel",
    segmentLabelColor: "segmentLabelColor",
    showEmptySegments: "showEmptySegments",
    showSegmentLabels: "showSegmentLabels",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisNestedDonutComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisNestedDonutComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisNestedDonutComponent, [{
    type: Component,
    args: [{
      selector: "vis-nested-donut",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisNestedDonutComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    angleRange: [{
      type: Input
    }],
    direction: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    centralLabel: [{
      type: Input
    }],
    centralSubLabel: [{
      type: Input
    }],
    centralSubLabelWrap: [{
      type: Input
    }],
    showBackground: [{
      type: Input
    }],
    sort: [{
      type: Input
    }],
    layers: [{
      type: Input
    }],
    layerSettings: [{
      type: Input
    }],
    layerPadding: [{
      type: Input
    }],
    cornerRadius: [{
      type: Input
    }],
    emptySegmentAngle: [{
      type: Input
    }],
    hideOverflowingSegmentLabels: [{
      type: Input
    }],
    segmentColor: [{
      type: Input
    }],
    segmentLabel: [{
      type: Input
    }],
    segmentLabelColor: [{
      type: Input
    }],
    showEmptySegments: [{
      type: Input
    }],
    showSegmentLabels: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/nested-donut/nested-donut.module.js
var VisNestedDonutModule = class {
};
VisNestedDonutModule.ɵfac = function VisNestedDonutModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisNestedDonutModule)();
};
VisNestedDonutModule.ɵmod = ɵɵdefineNgModule({
  type: VisNestedDonutModule,
  declarations: [VisNestedDonutComponent],
  exports: [VisNestedDonutComponent]
});
VisNestedDonutModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisNestedDonutModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisNestedDonutComponent],
      exports: [VisNestedDonutComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/plotline/plotline.component.js
var VisPlotlineComponent = class {
  ngAfterViewInit() {
    this.component = new Plotline(this.getConfig());
  }
  ngOnChanges(changes) {
    var _a, _b;
    (_a = this.component) === null || _a === void 0 ? void 0 : _a.setConfig(this.getConfig());
    (_b = this.componentContainer) === null || _b === void 0 ? void 0 : _b.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      lineWidth,
      axis,
      value,
      lineStyle,
      labelText,
      labelPosition,
      labelOffsetX,
      labelOffsetY,
      labelOrientation,
      labelColor,
      labelSize
    } = this;
    const config = {
      duration,
      events,
      attributes,
      lineWidth,
      axis,
      value,
      lineStyle,
      labelText,
      labelPosition,
      labelOffsetX,
      labelOffsetY,
      labelOrientation,
      labelColor,
      labelSize
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisPlotlineComponent.ɵfac = function VisPlotlineComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisPlotlineComponent)();
};
VisPlotlineComponent.ɵcmp = ɵɵdefineComponent({
  type: VisPlotlineComponent,
  selectors: [["vis-plotline"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    lineWidth: "lineWidth",
    axis: "axis",
    value: "value",
    lineStyle: "lineStyle",
    labelText: "labelText",
    labelPosition: "labelPosition",
    labelOffsetX: "labelOffsetX",
    labelOffsetY: "labelOffsetY",
    labelOrientation: "labelOrientation",
    labelColor: "labelColor",
    labelSize: "labelSize"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisPlotlineComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisPlotlineComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisPlotlineComponent, [{
    type: Component,
    args: [{
      selector: "vis-plotline",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisPlotlineComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    lineWidth: [{
      type: Input
    }],
    axis: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    lineStyle: [{
      type: Input
    }],
    labelText: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    labelOffsetX: [{
      type: Input
    }],
    labelOffsetY: [{
      type: Input
    }],
    labelOrientation: [{
      type: Input
    }],
    labelColor: [{
      type: Input
    }],
    labelSize: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/plotline/plotline.module.js
var VisPlotlineModule = class {
};
VisPlotlineModule.ɵfac = function VisPlotlineModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisPlotlineModule)();
};
VisPlotlineModule.ɵmod = ɵɵdefineNgModule({
  type: VisPlotlineModule,
  declarations: [VisPlotlineComponent],
  exports: [VisPlotlineComponent]
});
VisPlotlineModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisPlotlineModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisPlotlineComponent],
      exports: [VisPlotlineComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/sankey/sankey.component.js
var VisSankeyComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Sankey(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      id,
      heightNormalizationCoeff,
      exitTransitionType,
      enterTransitionType,
      highlightSubtreeOnHover,
      highlightDuration,
      highlightDelay,
      iterations,
      nodeSort,
      linkSort,
      nodeWidth,
      nodeAlign,
      nodeHorizontalSpacing,
      nodeMinHeight,
      nodeMaxHeight,
      nodePadding,
      showSingleNode,
      nodeCursor,
      nodeIcon,
      nodeColor,
      nodeFixedValue,
      nodeIconColor,
      linkColor,
      linkValue,
      linkCursor,
      label,
      subLabel,
      labelPosition,
      labelVerticalAlign,
      labelBackground,
      labelFit,
      labelMaxWidth,
      labelExpandTrimmedOnHover,
      labelTrimMode,
      labelFontSize,
      labelTextSeparator,
      labelForceWordBreak,
      labelColor,
      labelCursor,
      labelVisibility,
      subLabelFontSize,
      subLabelColor,
      subLabelPlacement,
      subLabelToLabelInlineWidthRatio
    } = this;
    const config = {
      duration,
      events,
      attributes,
      id,
      heightNormalizationCoeff,
      exitTransitionType,
      enterTransitionType,
      highlightSubtreeOnHover,
      highlightDuration,
      highlightDelay,
      iterations,
      nodeSort,
      linkSort,
      nodeWidth,
      nodeAlign,
      nodeHorizontalSpacing,
      nodeMinHeight,
      nodeMaxHeight,
      nodePadding,
      showSingleNode,
      nodeCursor,
      nodeIcon,
      nodeColor,
      nodeFixedValue,
      nodeIconColor,
      linkColor,
      linkValue,
      linkCursor,
      label,
      subLabel,
      labelPosition,
      labelVerticalAlign,
      labelBackground,
      labelFit,
      labelMaxWidth,
      labelExpandTrimmedOnHover,
      labelTrimMode,
      labelFontSize,
      labelTextSeparator,
      labelForceWordBreak,
      labelColor,
      labelCursor,
      labelVisibility,
      subLabelFontSize,
      subLabelColor,
      subLabelPlacement,
      subLabelToLabelInlineWidthRatio
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisSankeyComponent.ɵfac = function VisSankeyComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisSankeyComponent)();
};
VisSankeyComponent.ɵcmp = ɵɵdefineComponent({
  type: VisSankeyComponent,
  selectors: [["vis-sankey"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    id: "id",
    heightNormalizationCoeff: "heightNormalizationCoeff",
    exitTransitionType: "exitTransitionType",
    enterTransitionType: "enterTransitionType",
    highlightSubtreeOnHover: "highlightSubtreeOnHover",
    highlightDuration: "highlightDuration",
    highlightDelay: "highlightDelay",
    iterations: "iterations",
    nodeSort: "nodeSort",
    linkSort: "linkSort",
    nodeWidth: "nodeWidth",
    nodeAlign: "nodeAlign",
    nodeHorizontalSpacing: "nodeHorizontalSpacing",
    nodeMinHeight: "nodeMinHeight",
    nodeMaxHeight: "nodeMaxHeight",
    nodePadding: "nodePadding",
    showSingleNode: "showSingleNode",
    nodeCursor: "nodeCursor",
    nodeIcon: "nodeIcon",
    nodeColor: "nodeColor",
    nodeFixedValue: "nodeFixedValue",
    nodeIconColor: "nodeIconColor",
    linkColor: "linkColor",
    linkValue: "linkValue",
    linkCursor: "linkCursor",
    label: "label",
    subLabel: "subLabel",
    labelPosition: "labelPosition",
    labelVerticalAlign: "labelVerticalAlign",
    labelBackground: "labelBackground",
    labelFit: "labelFit",
    labelMaxWidth: "labelMaxWidth",
    labelExpandTrimmedOnHover: "labelExpandTrimmedOnHover",
    labelTrimMode: "labelTrimMode",
    labelFontSize: "labelFontSize",
    labelTextSeparator: "labelTextSeparator",
    labelForceWordBreak: "labelForceWordBreak",
    labelColor: "labelColor",
    labelCursor: "labelCursor",
    labelVisibility: "labelVisibility",
    subLabelFontSize: "subLabelFontSize",
    subLabelColor: "subLabelColor",
    subLabelPlacement: "subLabelPlacement",
    subLabelToLabelInlineWidthRatio: "subLabelToLabelInlineWidthRatio",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisSankeyComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisSankeyComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisSankeyComponent, [{
    type: Component,
    args: [{
      selector: "vis-sankey",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisSankeyComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    heightNormalizationCoeff: [{
      type: Input
    }],
    exitTransitionType: [{
      type: Input
    }],
    enterTransitionType: [{
      type: Input
    }],
    highlightSubtreeOnHover: [{
      type: Input
    }],
    highlightDuration: [{
      type: Input
    }],
    highlightDelay: [{
      type: Input
    }],
    iterations: [{
      type: Input
    }],
    nodeSort: [{
      type: Input
    }],
    linkSort: [{
      type: Input
    }],
    nodeWidth: [{
      type: Input
    }],
    nodeAlign: [{
      type: Input
    }],
    nodeHorizontalSpacing: [{
      type: Input
    }],
    nodeMinHeight: [{
      type: Input
    }],
    nodeMaxHeight: [{
      type: Input
    }],
    nodePadding: [{
      type: Input
    }],
    showSingleNode: [{
      type: Input
    }],
    nodeCursor: [{
      type: Input
    }],
    nodeIcon: [{
      type: Input
    }],
    nodeColor: [{
      type: Input
    }],
    nodeFixedValue: [{
      type: Input
    }],
    nodeIconColor: [{
      type: Input
    }],
    linkColor: [{
      type: Input
    }],
    linkValue: [{
      type: Input
    }],
    linkCursor: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    subLabel: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    labelVerticalAlign: [{
      type: Input
    }],
    labelBackground: [{
      type: Input
    }],
    labelFit: [{
      type: Input
    }],
    labelMaxWidth: [{
      type: Input
    }],
    labelExpandTrimmedOnHover: [{
      type: Input
    }],
    labelTrimMode: [{
      type: Input
    }],
    labelFontSize: [{
      type: Input
    }],
    labelTextSeparator: [{
      type: Input
    }],
    labelForceWordBreak: [{
      type: Input
    }],
    labelColor: [{
      type: Input
    }],
    labelCursor: [{
      type: Input
    }],
    labelVisibility: [{
      type: Input
    }],
    subLabelFontSize: [{
      type: Input
    }],
    subLabelColor: [{
      type: Input
    }],
    subLabelPlacement: [{
      type: Input
    }],
    subLabelToLabelInlineWidthRatio: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/sankey/sankey.module.js
var VisSankeyModule = class {
};
VisSankeyModule.ɵfac = function VisSankeyModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisSankeyModule)();
};
VisSankeyModule.ɵmod = ɵɵdefineNgModule({
  type: VisSankeyModule,
  declarations: [VisSankeyComponent],
  exports: [VisSankeyComponent]
});
VisSankeyModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisSankeyModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisSankeyComponent],
      exports: [VisSankeyComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/scatter/scatter.component.js
var VisScatterComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Scatter(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      size,
      sizeScale,
      sizeRange,
      shape,
      label,
      labelColor,
      labelHideOverlapping,
      cursor,
      labelTextBrightnessRatio,
      labelPosition,
      strokeColor,
      strokeWidth
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      size,
      sizeScale,
      sizeRange,
      shape,
      label,
      labelColor,
      labelHideOverlapping,
      cursor,
      labelTextBrightnessRatio,
      labelPosition,
      strokeColor,
      strokeWidth
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisScatterComponent.ɵfac = function VisScatterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisScatterComponent)();
};
VisScatterComponent.ɵcmp = ɵɵdefineComponent({
  type: VisScatterComponent,
  selectors: [["vis-scatter"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    y: "y",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    size: "size",
    sizeScale: "sizeScale",
    sizeRange: "sizeRange",
    shape: "shape",
    label: "label",
    labelColor: "labelColor",
    labelHideOverlapping: "labelHideOverlapping",
    cursor: "cursor",
    labelTextBrightnessRatio: "labelTextBrightnessRatio",
    labelPosition: "labelPosition",
    strokeColor: "strokeColor",
    strokeWidth: "strokeWidth",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisScatterComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisScatterComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisScatterComponent, [{
    type: Component,
    args: [{
      selector: "vis-scatter",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisScatterComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    y: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    sizeScale: [{
      type: Input
    }],
    sizeRange: [{
      type: Input
    }],
    shape: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    labelColor: [{
      type: Input
    }],
    labelHideOverlapping: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    labelTextBrightnessRatio: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    strokeColor: [{
      type: Input
    }],
    strokeWidth: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/scatter/scatter.module.js
var VisScatterModule = class {
};
VisScatterModule.ɵfac = function VisScatterModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisScatterModule)();
};
VisScatterModule.ɵmod = ɵɵdefineNgModule({
  type: VisScatterModule,
  declarations: [VisScatterComponent],
  exports: [VisScatterComponent]
});
VisScatterModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisScatterModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisScatterComponent],
      exports: [VisScatterComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/stacked-bar/stacked-bar.component.js
var VisStackedBarComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new StackedBar(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      barWidth,
      barMaxWidth,
      dataStep,
      barPadding,
      roundedCorners,
      cursor,
      barMinHeight1Px,
      barMinHeightZeroValue,
      orientation
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      barWidth,
      barMaxWidth,
      dataStep,
      barPadding,
      roundedCorners,
      cursor,
      barMinHeight1Px,
      barMinHeightZeroValue,
      orientation
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisStackedBarComponent.ɵfac = function VisStackedBarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisStackedBarComponent)();
};
VisStackedBarComponent.ɵcmp = ɵɵdefineComponent({
  type: VisStackedBarComponent,
  selectors: [["vis-stacked-bar"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    y: "y",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    barWidth: "barWidth",
    barMaxWidth: "barMaxWidth",
    dataStep: "dataStep",
    barPadding: "barPadding",
    roundedCorners: "roundedCorners",
    cursor: "cursor",
    barMinHeight1Px: "barMinHeight1Px",
    barMinHeightZeroValue: "barMinHeightZeroValue",
    orientation: "orientation",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisStackedBarComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisStackedBarComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisStackedBarComponent, [{
    type: Component,
    args: [{
      selector: "vis-stacked-bar",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisStackedBarComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    y: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    barWidth: [{
      type: Input
    }],
    barMaxWidth: [{
      type: Input
    }],
    dataStep: [{
      type: Input
    }],
    barPadding: [{
      type: Input
    }],
    roundedCorners: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    barMinHeight1Px: [{
      type: Input
    }],
    barMinHeightZeroValue: [{
      type: Input
    }],
    orientation: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/stacked-bar/stacked-bar.module.js
var VisStackedBarModule = class {
};
VisStackedBarModule.ɵfac = function VisStackedBarModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisStackedBarModule)();
};
VisStackedBarModule.ɵmod = ɵɵdefineNgModule({
  type: VisStackedBarModule,
  declarations: [VisStackedBarComponent],
  exports: [VisStackedBarComponent]
});
VisStackedBarModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisStackedBarModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisStackedBarComponent],
      exports: [VisStackedBarComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/timeline/timeline.component.js
var VisTimelineComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new Timeline(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      type,
      length,
      cursor,
      lineRow,
      lineDuration,
      lineWidth,
      lineCap,
      lineStartIcon,
      lineStartIconColor,
      lineStartIconSize,
      lineStartIconArrangement,
      lineEndIcon,
      lineEndIconColor,
      lineEndIconSize,
      lineEndIconArrangement,
      lineCursor,
      showEmptySegments,
      showEmptySegmentsCorrectPosition,
      rowHeight,
      alternatingRowColors,
      showLabels,
      labelWidth,
      maxLabelWidth,
      showRowLabels,
      rowLabelStyle,
      rowLabelFormatter,
      rowIcon,
      rowLabelWidth,
      rowMaxLabelWidth,
      rowLabelTextAlign,
      arrows,
      animationLineEnterPosition,
      animationLineExitPosition,
      onScroll
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      type,
      length,
      cursor,
      lineRow,
      lineDuration,
      lineWidth,
      lineCap,
      lineStartIcon,
      lineStartIconColor,
      lineStartIconSize,
      lineStartIconArrangement,
      lineEndIcon,
      lineEndIconColor,
      lineEndIconSize,
      lineEndIconArrangement,
      lineCursor,
      showEmptySegments,
      showEmptySegmentsCorrectPosition,
      rowHeight,
      alternatingRowColors,
      showLabels,
      labelWidth,
      maxLabelWidth,
      showRowLabels,
      rowLabelStyle,
      rowLabelFormatter,
      rowIcon,
      rowLabelWidth,
      rowMaxLabelWidth,
      rowLabelTextAlign,
      arrows,
      animationLineEnterPosition,
      animationLineExitPosition,
      onScroll
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisTimelineComponent.ɵfac = function VisTimelineComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisTimelineComponent)();
};
VisTimelineComponent.ɵcmp = ɵɵdefineComponent({
  type: VisTimelineComponent,
  selectors: [["vis-timeline"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    type: "type",
    length: "length",
    cursor: "cursor",
    lineRow: "lineRow",
    lineDuration: "lineDuration",
    lineWidth: "lineWidth",
    lineCap: "lineCap",
    lineStartIcon: "lineStartIcon",
    lineStartIconColor: "lineStartIconColor",
    lineStartIconSize: "lineStartIconSize",
    lineStartIconArrangement: "lineStartIconArrangement",
    lineEndIcon: "lineEndIcon",
    lineEndIconColor: "lineEndIconColor",
    lineEndIconSize: "lineEndIconSize",
    lineEndIconArrangement: "lineEndIconArrangement",
    lineCursor: "lineCursor",
    showEmptySegments: "showEmptySegments",
    showEmptySegmentsCorrectPosition: "showEmptySegmentsCorrectPosition",
    rowHeight: "rowHeight",
    alternatingRowColors: "alternatingRowColors",
    showLabels: "showLabels",
    labelWidth: "labelWidth",
    maxLabelWidth: "maxLabelWidth",
    showRowLabels: "showRowLabels",
    rowLabelStyle: "rowLabelStyle",
    rowLabelFormatter: "rowLabelFormatter",
    rowIcon: "rowIcon",
    rowLabelWidth: "rowLabelWidth",
    rowMaxLabelWidth: "rowMaxLabelWidth",
    rowLabelTextAlign: "rowLabelTextAlign",
    arrows: "arrows",
    animationLineEnterPosition: "animationLineEnterPosition",
    animationLineExitPosition: "animationLineExitPosition",
    onScroll: "onScroll",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisTimelineComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisTimelineComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisTimelineComponent, [{
    type: Component,
    args: [{
      selector: "vis-timeline",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisTimelineComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    type: [{
      type: Input
    }],
    length: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    lineRow: [{
      type: Input
    }],
    lineDuration: [{
      type: Input
    }],
    lineWidth: [{
      type: Input
    }],
    lineCap: [{
      type: Input
    }],
    lineStartIcon: [{
      type: Input
    }],
    lineStartIconColor: [{
      type: Input
    }],
    lineStartIconSize: [{
      type: Input
    }],
    lineStartIconArrangement: [{
      type: Input
    }],
    lineEndIcon: [{
      type: Input
    }],
    lineEndIconColor: [{
      type: Input
    }],
    lineEndIconSize: [{
      type: Input
    }],
    lineEndIconArrangement: [{
      type: Input
    }],
    lineCursor: [{
      type: Input
    }],
    showEmptySegments: [{
      type: Input
    }],
    showEmptySegmentsCorrectPosition: [{
      type: Input
    }],
    rowHeight: [{
      type: Input
    }],
    alternatingRowColors: [{
      type: Input
    }],
    showLabels: [{
      type: Input
    }],
    labelWidth: [{
      type: Input
    }],
    maxLabelWidth: [{
      type: Input
    }],
    showRowLabels: [{
      type: Input
    }],
    rowLabelStyle: [{
      type: Input
    }],
    rowLabelFormatter: [{
      type: Input
    }],
    rowIcon: [{
      type: Input
    }],
    rowLabelWidth: [{
      type: Input
    }],
    rowMaxLabelWidth: [{
      type: Input
    }],
    rowLabelTextAlign: [{
      type: Input
    }],
    arrows: [{
      type: Input
    }],
    animationLineEnterPosition: [{
      type: Input
    }],
    animationLineExitPosition: [{
      type: Input
    }],
    onScroll: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/timeline/timeline.module.js
var VisTimelineModule = class {
};
VisTimelineModule.ɵfac = function VisTimelineModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisTimelineModule)();
};
VisTimelineModule.ɵmod = ɵɵdefineNgModule({
  type: VisTimelineModule,
  declarations: [VisTimelineComponent],
  exports: [VisTimelineComponent]
});
VisTimelineModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisTimelineModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisTimelineComponent],
      exports: [VisTimelineComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/xy-labels/xy-labels.component.js
var VisXYLabelsComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new XYLabels(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      xPositioning,
      yPositioning,
      labelFontSize,
      label,
      backgroundColor,
      cursor,
      labelTextBrightnessRatio,
      clustering,
      clusterLabel,
      clusterFontSize,
      clusterBackgroundColor,
      clusterCursor,
      clusterLabelColor
    } = this;
    const config = {
      duration,
      events,
      attributes,
      x,
      y,
      id,
      color,
      xScale,
      yScale,
      excludeFromDomainCalculation,
      xPositioning,
      yPositioning,
      labelFontSize,
      label,
      backgroundColor,
      cursor,
      labelTextBrightnessRatio,
      clustering,
      clusterLabel,
      clusterFontSize,
      clusterBackgroundColor,
      clusterCursor,
      clusterLabelColor
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisXYLabelsComponent.ɵfac = function VisXYLabelsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisXYLabelsComponent)();
};
VisXYLabelsComponent.ɵcmp = ɵɵdefineComponent({
  type: VisXYLabelsComponent,
  selectors: [["vis-xy-labels"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    x: "x",
    y: "y",
    id: "id",
    color: "color",
    xScale: "xScale",
    yScale: "yScale",
    excludeFromDomainCalculation: "excludeFromDomainCalculation",
    xPositioning: "xPositioning",
    yPositioning: "yPositioning",
    labelFontSize: "labelFontSize",
    label: "label",
    backgroundColor: "backgroundColor",
    cursor: "cursor",
    labelTextBrightnessRatio: "labelTextBrightnessRatio",
    clustering: "clustering",
    clusterLabel: "clusterLabel",
    clusterFontSize: "clusterFontSize",
    clusterBackgroundColor: "clusterBackgroundColor",
    clusterCursor: "clusterCursor",
    clusterLabelColor: "clusterLabelColor",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisXYLabelsComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisXYLabelsComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisXYLabelsComponent, [{
    type: Component,
    args: [{
      selector: "vis-xy-labels",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisXYLabelsComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    x: [{
      type: Input
    }],
    y: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    xScale: [{
      type: Input
    }],
    yScale: [{
      type: Input
    }],
    excludeFromDomainCalculation: [{
      type: Input
    }],
    xPositioning: [{
      type: Input
    }],
    yPositioning: [{
      type: Input
    }],
    labelFontSize: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    backgroundColor: [{
      type: Input
    }],
    cursor: [{
      type: Input
    }],
    labelTextBrightnessRatio: [{
      type: Input
    }],
    clustering: [{
      type: Input
    }],
    clusterLabel: [{
      type: Input
    }],
    clusterFontSize: [{
      type: Input
    }],
    clusterBackgroundColor: [{
      type: Input
    }],
    clusterCursor: [{
      type: Input
    }],
    clusterLabelColor: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/xy-labels/xy-labels.module.js
var VisXYLabelsModule = class {
};
VisXYLabelsModule.ɵfac = function VisXYLabelsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisXYLabelsModule)();
};
VisXYLabelsModule.ɵmod = ɵɵdefineNgModule({
  type: VisXYLabelsModule,
  declarations: [VisXYLabelsComponent],
  exports: [VisXYLabelsComponent]
});
VisXYLabelsModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisXYLabelsModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisXYLabelsComponent],
      exports: [VisXYLabelsComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/topojson-map/topojson-map.component.js
var VisTopoJSONMapComponent = class {
  ngAfterViewInit() {
    var _a;
    this.component = new TopoJSONMap(this.getConfig());
    if (this.data) {
      this.component.setData(this.data);
      (_a = this.componentContainer) === null || _a === void 0 ? void 0 : _a.render();
    }
  }
  ngOnChanges(changes) {
    var _a, _b, _c;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
    (_c = this.componentContainer) === null || _c === void 0 ? void 0 : _c.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      projection,
      topojson,
      mapFeatureName,
      mapFitToPoints,
      zoomFactor,
      disableZoom,
      zoomExtent,
      zoomDuration,
      linkWidth,
      linkColor,
      linkCursor,
      linkId,
      linkSource,
      linkTarget,
      areaId,
      areaColor,
      areaCursor,
      pointColor,
      pointRadius,
      pointStrokeWidth,
      pointCursor,
      longitude,
      latitude,
      pointLabel,
      pointLabelPosition,
      pointLabelTextBrightnessRatio,
      pointId,
      heatmapMode,
      heatmapModeBlurStdDeviation,
      heatmapModeZoomLevelThreshold
    } = this;
    const config = {
      duration,
      events,
      attributes,
      projection,
      topojson,
      mapFeatureName,
      mapFitToPoints,
      zoomFactor,
      disableZoom,
      zoomExtent,
      zoomDuration,
      linkWidth,
      linkColor,
      linkCursor,
      linkId,
      linkSource,
      linkTarget,
      areaId,
      areaColor,
      areaCursor,
      pointColor,
      pointRadius,
      pointStrokeWidth,
      pointCursor,
      longitude,
      latitude,
      pointLabel,
      pointLabelPosition,
      pointLabelTextBrightnessRatio,
      pointId,
      heatmapMode,
      heatmapModeBlurStdDeviation,
      heatmapModeZoomLevelThreshold
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisTopoJSONMapComponent.ɵfac = function VisTopoJSONMapComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisTopoJSONMapComponent)();
};
VisTopoJSONMapComponent.ɵcmp = ɵɵdefineComponent({
  type: VisTopoJSONMapComponent,
  selectors: [["vis-topojson-map"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    projection: "projection",
    topojson: "topojson",
    mapFeatureName: "mapFeatureName",
    mapFitToPoints: "mapFitToPoints",
    zoomFactor: "zoomFactor",
    disableZoom: "disableZoom",
    zoomExtent: "zoomExtent",
    zoomDuration: "zoomDuration",
    linkWidth: "linkWidth",
    linkColor: "linkColor",
    linkCursor: "linkCursor",
    linkId: "linkId",
    linkSource: "linkSource",
    linkTarget: "linkTarget",
    areaId: "areaId",
    areaColor: "areaColor",
    areaCursor: "areaCursor",
    pointColor: "pointColor",
    pointRadius: "pointRadius",
    pointStrokeWidth: "pointStrokeWidth",
    pointCursor: "pointCursor",
    longitude: "longitude",
    latitude: "latitude",
    pointLabel: "pointLabel",
    pointLabelPosition: "pointLabelPosition",
    pointLabelTextBrightnessRatio: "pointLabelTextBrightnessRatio",
    pointId: "pointId",
    heatmapMode: "heatmapMode",
    heatmapModeBlurStdDeviation: "heatmapModeBlurStdDeviation",
    heatmapModeZoomLevelThreshold: "heatmapModeZoomLevelThreshold",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisTopoJSONMapComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisTopoJSONMapComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisTopoJSONMapComponent, [{
    type: Component,
    args: [{
      selector: "vis-topojson-map",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisTopoJSONMapComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    projection: [{
      type: Input
    }],
    topojson: [{
      type: Input
    }],
    mapFeatureName: [{
      type: Input
    }],
    mapFitToPoints: [{
      type: Input
    }],
    zoomFactor: [{
      type: Input
    }],
    disableZoom: [{
      type: Input
    }],
    zoomExtent: [{
      type: Input
    }],
    zoomDuration: [{
      type: Input
    }],
    linkWidth: [{
      type: Input
    }],
    linkColor: [{
      type: Input
    }],
    linkCursor: [{
      type: Input
    }],
    linkId: [{
      type: Input
    }],
    linkSource: [{
      type: Input
    }],
    linkTarget: [{
      type: Input
    }],
    areaId: [{
      type: Input
    }],
    areaColor: [{
      type: Input
    }],
    areaCursor: [{
      type: Input
    }],
    pointColor: [{
      type: Input
    }],
    pointRadius: [{
      type: Input
    }],
    pointStrokeWidth: [{
      type: Input
    }],
    pointCursor: [{
      type: Input
    }],
    longitude: [{
      type: Input
    }],
    latitude: [{
      type: Input
    }],
    pointLabel: [{
      type: Input
    }],
    pointLabelPosition: [{
      type: Input
    }],
    pointLabelTextBrightnessRatio: [{
      type: Input
    }],
    pointId: [{
      type: Input
    }],
    heatmapMode: [{
      type: Input
    }],
    heatmapModeBlurStdDeviation: [{
      type: Input
    }],
    heatmapModeZoomLevelThreshold: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/topojson-map/topojson-map.module.js
var VisTopoJSONMapModule = class {
};
VisTopoJSONMapModule.ɵfac = function VisTopoJSONMapModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisTopoJSONMapModule)();
};
VisTopoJSONMapModule.ɵmod = ɵɵdefineNgModule({
  type: VisTopoJSONMapModule,
  declarations: [VisTopoJSONMapComponent],
  exports: [VisTopoJSONMapComponent]
});
VisTopoJSONMapModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisTopoJSONMapModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisTopoJSONMapComponent],
      exports: [VisTopoJSONMapComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/plotband/plotband.component.js
var VisPlotbandComponent = class {
  ngAfterViewInit() {
    this.component = new Plotband(this.getConfig());
  }
  ngOnChanges(changes) {
    var _a, _b;
    (_a = this.component) === null || _a === void 0 ? void 0 : _a.setConfig(this.getConfig());
    (_b = this.componentContainer) === null || _b === void 0 ? void 0 : _b.render();
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      axis,
      from,
      to,
      labelText,
      labelPosition,
      labelOffsetX,
      labelOffsetY,
      labelOrientation,
      labelColor,
      labelSize
    } = this;
    const config = {
      duration,
      events,
      attributes,
      axis,
      from,
      to,
      labelText,
      labelPosition,
      labelOffsetX,
      labelOffsetY,
      labelOrientation,
      labelColor,
      labelSize
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisPlotbandComponent.ɵfac = function VisPlotbandComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisPlotbandComponent)();
};
VisPlotbandComponent.ɵcmp = ɵɵdefineComponent({
  type: VisPlotbandComponent,
  selectors: [["vis-plotband"]],
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    axis: "axis",
    from: "from",
    to: "to",
    labelText: "labelText",
    labelPosition: "labelPosition",
    labelOffsetX: "labelOffsetX",
    labelOffsetY: "labelOffsetY",
    labelOrientation: "labelOrientation",
    labelColor: "labelColor",
    labelSize: "labelSize"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisXYComponent,
    useExisting: VisPlotbandComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 0,
  vars: 0,
  template: function VisPlotbandComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisPlotbandComponent, [{
    type: Component,
    args: [{
      selector: "vis-plotband",
      template: "",
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisXYComponent,
        useExisting: VisPlotbandComponent
      }]
    }]
  }], null, {
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    axis: [{
      type: Input
    }],
    from: [{
      type: Input
    }],
    to: [{
      type: Input
    }],
    labelText: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    labelOffsetX: [{
      type: Input
    }],
    labelOffsetY: [{
      type: Input
    }],
    labelOrientation: [{
      type: Input
    }],
    labelColor: [{
      type: Input
    }],
    labelSize: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/plotband/plotband.module.js
var VisPlotbandModule = class {
};
VisPlotbandModule.ɵfac = function VisPlotbandModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisPlotbandModule)();
};
VisPlotbandModule.ɵmod = ɵɵdefineNgModule({
  type: VisPlotbandModule,
  declarations: [VisPlotbandComponent],
  exports: [VisPlotbandComponent]
});
VisPlotbandModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisPlotbandModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisPlotbandComponent],
      exports: [VisPlotbandComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/leaflet-map/leaflet-map.component.js
var _c03 = ["container"];
var VisLeafletMapComponent = class {
  ngAfterViewInit() {
    this.component = new LeafletMap(this.containerRef.nativeElement, this.getConfig(), this.data);
    if (this.data) {
      this.component.setData(this.data);
    }
  }
  ngOnChanges(changes) {
    var _a, _b;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      width,
      height,
      flyToDuration,
      fitViewPadding,
      zoomDuration,
      initialBounds,
      fitBoundsOnUpdate,
      fitViewOnInit,
      fitViewOnUpdate,
      style,
      styleDarkTheme,
      accessToken,
      attribution,
      renderer,
      onMapInitialized,
      onMapMoveZoom,
      onMapMoveStart,
      onMapMoveEnd,
      onMapZoomStart,
      onMapZoomEnd,
      onMapClick,
      pointLongitude,
      pointLatitude,
      pointId,
      pointShape,
      pointColor,
      pointRadius,
      pointLabel,
      pointLabelColor,
      pointBottomLabel,
      pointCursor,
      pointRingWidth,
      selectedPointId,
      clusterColor,
      clusterRadius,
      clusterLabel,
      clusterLabelColor,
      clusterBottomLabel,
      clusterRingWidth,
      clusterBackground,
      clusterExpandOnClick,
      clusteringDistance,
      colorMap,
      topoJSONLayer,
      tooltip,
      ariaLabel
    } = this;
    const config = {
      duration,
      events,
      attributes,
      width,
      height,
      flyToDuration,
      fitViewPadding,
      zoomDuration,
      initialBounds,
      fitBoundsOnUpdate,
      fitViewOnInit,
      fitViewOnUpdate,
      style,
      styleDarkTheme,
      accessToken,
      attribution,
      renderer,
      onMapInitialized,
      onMapMoveZoom,
      onMapMoveStart,
      onMapMoveEnd,
      onMapZoomStart,
      onMapZoomEnd,
      onMapClick,
      pointLongitude,
      pointLatitude,
      pointId,
      pointShape,
      pointColor,
      pointRadius,
      pointLabel,
      pointLabelColor,
      pointBottomLabel,
      pointCursor,
      pointRingWidth,
      selectedPointId,
      clusterColor,
      clusterRadius,
      clusterLabel,
      clusterLabelColor,
      clusterBottomLabel,
      clusterRingWidth,
      clusterBackground,
      clusterExpandOnClick,
      clusteringDistance,
      colorMap,
      topoJSONLayer,
      tooltip,
      ariaLabel
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisLeafletMapComponent.ɵfac = function VisLeafletMapComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisLeafletMapComponent)();
};
VisLeafletMapComponent.ɵcmp = ɵɵdefineComponent({
  type: VisLeafletMapComponent,
  selectors: [["vis-leaflet-map"]],
  viewQuery: function VisLeafletMapComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c03, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    }
  },
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    width: "width",
    height: "height",
    flyToDuration: "flyToDuration",
    fitViewPadding: "fitViewPadding",
    zoomDuration: "zoomDuration",
    initialBounds: "initialBounds",
    fitBoundsOnUpdate: "fitBoundsOnUpdate",
    fitViewOnInit: "fitViewOnInit",
    fitViewOnUpdate: "fitViewOnUpdate",
    style: "style",
    styleDarkTheme: "styleDarkTheme",
    accessToken: "accessToken",
    attribution: "attribution",
    renderer: "renderer",
    onMapInitialized: "onMapInitialized",
    onMapMoveZoom: "onMapMoveZoom",
    onMapMoveStart: "onMapMoveStart",
    onMapMoveEnd: "onMapMoveEnd",
    onMapZoomStart: "onMapZoomStart",
    onMapZoomEnd: "onMapZoomEnd",
    onMapClick: "onMapClick",
    pointLongitude: "pointLongitude",
    pointLatitude: "pointLatitude",
    pointId: "pointId",
    pointShape: "pointShape",
    pointColor: "pointColor",
    pointRadius: "pointRadius",
    pointLabel: "pointLabel",
    pointLabelColor: "pointLabelColor",
    pointBottomLabel: "pointBottomLabel",
    pointCursor: "pointCursor",
    pointRingWidth: "pointRingWidth",
    selectedPointId: "selectedPointId",
    clusterColor: "clusterColor",
    clusterRadius: "clusterRadius",
    clusterLabel: "clusterLabel",
    clusterLabelColor: "clusterLabelColor",
    clusterBottomLabel: "clusterBottomLabel",
    clusterRingWidth: "clusterRingWidth",
    clusterBackground: "clusterBackground",
    clusterExpandOnClick: "clusterExpandOnClick",
    clusteringDistance: "clusteringDistance",
    colorMap: "colorMap",
    topoJSONLayer: "topoJSONLayer",
    tooltip: "tooltip",
    ariaLabel: "ariaLabel",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisLeafletMapComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 2,
  vars: 0,
  consts: [["container", ""], [1, "leaflet-map-container"]],
  template: function VisLeafletMapComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelement(0, "div", 1, 0);
    }
  },
  styles: [".leaflet-map-container[_ngcontent-%COMP%] { width: 100%; height: 100%; position: relative }"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisLeafletMapComponent, [{
    type: Component,
    args: [{
      selector: "vis-leaflet-map",
      template: '<div #container class="leaflet-map-container"></div>',
      styles: [".leaflet-map-container { width: 100%; height: 100%; position: relative }"],
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisLeafletMapComponent
      }]
    }]
  }], null, {
    containerRef: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }],
    flyToDuration: [{
      type: Input
    }],
    fitViewPadding: [{
      type: Input
    }],
    zoomDuration: [{
      type: Input
    }],
    initialBounds: [{
      type: Input
    }],
    fitBoundsOnUpdate: [{
      type: Input
    }],
    fitViewOnInit: [{
      type: Input
    }],
    fitViewOnUpdate: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    styleDarkTheme: [{
      type: Input
    }],
    accessToken: [{
      type: Input
    }],
    attribution: [{
      type: Input
    }],
    renderer: [{
      type: Input
    }],
    onMapInitialized: [{
      type: Input
    }],
    onMapMoveZoom: [{
      type: Input
    }],
    onMapMoveStart: [{
      type: Input
    }],
    onMapMoveEnd: [{
      type: Input
    }],
    onMapZoomStart: [{
      type: Input
    }],
    onMapZoomEnd: [{
      type: Input
    }],
    onMapClick: [{
      type: Input
    }],
    pointLongitude: [{
      type: Input
    }],
    pointLatitude: [{
      type: Input
    }],
    pointId: [{
      type: Input
    }],
    pointShape: [{
      type: Input
    }],
    pointColor: [{
      type: Input
    }],
    pointRadius: [{
      type: Input
    }],
    pointLabel: [{
      type: Input
    }],
    pointLabelColor: [{
      type: Input
    }],
    pointBottomLabel: [{
      type: Input
    }],
    pointCursor: [{
      type: Input
    }],
    pointRingWidth: [{
      type: Input
    }],
    selectedPointId: [{
      type: Input
    }],
    clusterColor: [{
      type: Input
    }],
    clusterRadius: [{
      type: Input
    }],
    clusterLabel: [{
      type: Input
    }],
    clusterLabelColor: [{
      type: Input
    }],
    clusterBottomLabel: [{
      type: Input
    }],
    clusterRingWidth: [{
      type: Input
    }],
    clusterBackground: [{
      type: Input
    }],
    clusterExpandOnClick: [{
      type: Input
    }],
    clusteringDistance: [{
      type: Input
    }],
    colorMap: [{
      type: Input
    }],
    topoJSONLayer: [{
      type: Input
    }],
    tooltip: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/leaflet-map/leaflet-map.module.js
var VisLeafletMapModule = class {
};
VisLeafletMapModule.ɵfac = function VisLeafletMapModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisLeafletMapModule)();
};
VisLeafletMapModule.ɵmod = ɵɵdefineNgModule({
  type: VisLeafletMapModule,
  declarations: [VisLeafletMapComponent],
  exports: [VisLeafletMapComponent]
});
VisLeafletMapModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisLeafletMapModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisLeafletMapComponent],
      exports: [VisLeafletMapComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/leaflet-flow-map/leaflet-flow-map.component.js
var _c04 = ["container"];
var VisLeafletFlowMapComponent = class {
  ngAfterViewInit() {
    this.component = new LeafletFlowMap(this.containerRef.nativeElement, this.getConfig(), this.data);
    if (this.data) {
      this.component.setData(this.data);
    }
  }
  ngOnChanges(changes) {
    var _a, _b;
    if (changes.data) {
      (_a = this.component) === null || _a === void 0 ? void 0 : _a.setData(this.data);
    }
    (_b = this.component) === null || _b === void 0 ? void 0 : _b.setConfig(this.getConfig());
  }
  getConfig() {
    const {
      duration,
      events,
      attributes,
      width,
      height,
      flyToDuration,
      fitViewPadding,
      zoomDuration,
      initialBounds,
      fitBoundsOnUpdate,
      fitViewOnInit,
      fitViewOnUpdate,
      style,
      styleDarkTheme,
      accessToken,
      attribution,
      renderer,
      onMapInitialized,
      onMapMoveZoom,
      onMapMoveStart,
      onMapMoveEnd,
      onMapZoomStart,
      onMapZoomEnd,
      onMapClick,
      pointLongitude,
      pointLatitude,
      pointId,
      pointShape,
      pointColor,
      pointRadius,
      pointLabel,
      pointLabelColor,
      pointBottomLabel,
      pointCursor,
      pointRingWidth,
      selectedPointId,
      clusterColor,
      clusterRadius,
      clusterLabel,
      clusterLabelColor,
      clusterBottomLabel,
      clusterRingWidth,
      clusterBackground,
      clusterExpandOnClick,
      clusteringDistance,
      colorMap,
      topoJSONLayer,
      tooltip,
      ariaLabel,
      sourceLongitude,
      sourceLatitude,
      targetLongitude,
      targetLatitude,
      sourcePointRadius,
      sourcePointColor,
      flowParticleColor,
      flowParticleRadius,
      flowParticleSpeed,
      flowParticleDensity,
      onSourcePointClick,
      onSourcePointMouseEnter,
      onSourcePointMouseLeave
    } = this;
    const config = {
      duration,
      events,
      attributes,
      width,
      height,
      flyToDuration,
      fitViewPadding,
      zoomDuration,
      initialBounds,
      fitBoundsOnUpdate,
      fitViewOnInit,
      fitViewOnUpdate,
      style,
      styleDarkTheme,
      accessToken,
      attribution,
      renderer,
      onMapInitialized,
      onMapMoveZoom,
      onMapMoveStart,
      onMapMoveEnd,
      onMapZoomStart,
      onMapZoomEnd,
      onMapClick,
      pointLongitude,
      pointLatitude,
      pointId,
      pointShape,
      pointColor,
      pointRadius,
      pointLabel,
      pointLabelColor,
      pointBottomLabel,
      pointCursor,
      pointRingWidth,
      selectedPointId,
      clusterColor,
      clusterRadius,
      clusterLabel,
      clusterLabelColor,
      clusterBottomLabel,
      clusterRingWidth,
      clusterBackground,
      clusterExpandOnClick,
      clusteringDistance,
      colorMap,
      topoJSONLayer,
      tooltip,
      ariaLabel,
      sourceLongitude,
      sourceLatitude,
      targetLongitude,
      targetLatitude,
      sourcePointRadius,
      sourcePointColor,
      flowParticleColor,
      flowParticleRadius,
      flowParticleSpeed,
      flowParticleDensity,
      onSourcePointClick,
      onSourcePointMouseEnter,
      onSourcePointMouseLeave
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisLeafletFlowMapComponent.ɵfac = function VisLeafletFlowMapComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisLeafletFlowMapComponent)();
};
VisLeafletFlowMapComponent.ɵcmp = ɵɵdefineComponent({
  type: VisLeafletFlowMapComponent,
  selectors: [["vis-leaflet-flow-map"]],
  viewQuery: function VisLeafletFlowMapComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c04, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    }
  },
  inputs: {
    duration: "duration",
    events: "events",
    attributes: "attributes",
    width: "width",
    height: "height",
    flyToDuration: "flyToDuration",
    fitViewPadding: "fitViewPadding",
    zoomDuration: "zoomDuration",
    initialBounds: "initialBounds",
    fitBoundsOnUpdate: "fitBoundsOnUpdate",
    fitViewOnInit: "fitViewOnInit",
    fitViewOnUpdate: "fitViewOnUpdate",
    style: "style",
    styleDarkTheme: "styleDarkTheme",
    accessToken: "accessToken",
    attribution: "attribution",
    renderer: "renderer",
    onMapInitialized: "onMapInitialized",
    onMapMoveZoom: "onMapMoveZoom",
    onMapMoveStart: "onMapMoveStart",
    onMapMoveEnd: "onMapMoveEnd",
    onMapZoomStart: "onMapZoomStart",
    onMapZoomEnd: "onMapZoomEnd",
    onMapClick: "onMapClick",
    pointLongitude: "pointLongitude",
    pointLatitude: "pointLatitude",
    pointId: "pointId",
    pointShape: "pointShape",
    pointColor: "pointColor",
    pointRadius: "pointRadius",
    pointLabel: "pointLabel",
    pointLabelColor: "pointLabelColor",
    pointBottomLabel: "pointBottomLabel",
    pointCursor: "pointCursor",
    pointRingWidth: "pointRingWidth",
    selectedPointId: "selectedPointId",
    clusterColor: "clusterColor",
    clusterRadius: "clusterRadius",
    clusterLabel: "clusterLabel",
    clusterLabelColor: "clusterLabelColor",
    clusterBottomLabel: "clusterBottomLabel",
    clusterRingWidth: "clusterRingWidth",
    clusterBackground: "clusterBackground",
    clusterExpandOnClick: "clusterExpandOnClick",
    clusteringDistance: "clusteringDistance",
    colorMap: "colorMap",
    topoJSONLayer: "topoJSONLayer",
    tooltip: "tooltip",
    ariaLabel: "ariaLabel",
    sourceLongitude: "sourceLongitude",
    sourceLatitude: "sourceLatitude",
    targetLongitude: "targetLongitude",
    targetLatitude: "targetLatitude",
    sourcePointRadius: "sourcePointRadius",
    sourcePointColor: "sourcePointColor",
    flowParticleColor: "flowParticleColor",
    flowParticleRadius: "flowParticleRadius",
    flowParticleSpeed: "flowParticleSpeed",
    flowParticleDensity: "flowParticleDensity",
    onSourcePointClick: "onSourcePointClick",
    onSourcePointMouseEnter: "onSourcePointMouseEnter",
    onSourcePointMouseLeave: "onSourcePointMouseLeave",
    data: "data"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisCoreComponent,
    useExisting: VisLeafletFlowMapComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 2,
  vars: 0,
  consts: [["container", ""], [1, "leaflet-flow-map-container"]],
  template: function VisLeafletFlowMapComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelement(0, "div", 1, 0);
    }
  },
  styles: [".leaflet-flow-map-container[_ngcontent-%COMP%] { width: 100%; height: 100%; position: relative }"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisLeafletFlowMapComponent, [{
    type: Component,
    args: [{
      selector: "vis-leaflet-flow-map",
      template: '<div #container class="leaflet-flow-map-container"></div>',
      styles: [".leaflet-flow-map-container { width: 100%; height: 100%; position: relative }"],
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisCoreComponent,
        useExisting: VisLeafletFlowMapComponent
      }]
    }]
  }], null, {
    containerRef: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    duration: [{
      type: Input
    }],
    events: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }],
    flyToDuration: [{
      type: Input
    }],
    fitViewPadding: [{
      type: Input
    }],
    zoomDuration: [{
      type: Input
    }],
    initialBounds: [{
      type: Input
    }],
    fitBoundsOnUpdate: [{
      type: Input
    }],
    fitViewOnInit: [{
      type: Input
    }],
    fitViewOnUpdate: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    styleDarkTheme: [{
      type: Input
    }],
    accessToken: [{
      type: Input
    }],
    attribution: [{
      type: Input
    }],
    renderer: [{
      type: Input
    }],
    onMapInitialized: [{
      type: Input
    }],
    onMapMoveZoom: [{
      type: Input
    }],
    onMapMoveStart: [{
      type: Input
    }],
    onMapMoveEnd: [{
      type: Input
    }],
    onMapZoomStart: [{
      type: Input
    }],
    onMapZoomEnd: [{
      type: Input
    }],
    onMapClick: [{
      type: Input
    }],
    pointLongitude: [{
      type: Input
    }],
    pointLatitude: [{
      type: Input
    }],
    pointId: [{
      type: Input
    }],
    pointShape: [{
      type: Input
    }],
    pointColor: [{
      type: Input
    }],
    pointRadius: [{
      type: Input
    }],
    pointLabel: [{
      type: Input
    }],
    pointLabelColor: [{
      type: Input
    }],
    pointBottomLabel: [{
      type: Input
    }],
    pointCursor: [{
      type: Input
    }],
    pointRingWidth: [{
      type: Input
    }],
    selectedPointId: [{
      type: Input
    }],
    clusterColor: [{
      type: Input
    }],
    clusterRadius: [{
      type: Input
    }],
    clusterLabel: [{
      type: Input
    }],
    clusterLabelColor: [{
      type: Input
    }],
    clusterBottomLabel: [{
      type: Input
    }],
    clusterRingWidth: [{
      type: Input
    }],
    clusterBackground: [{
      type: Input
    }],
    clusterExpandOnClick: [{
      type: Input
    }],
    clusteringDistance: [{
      type: Input
    }],
    colorMap: [{
      type: Input
    }],
    topoJSONLayer: [{
      type: Input
    }],
    tooltip: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    sourceLongitude: [{
      type: Input
    }],
    sourceLatitude: [{
      type: Input
    }],
    targetLongitude: [{
      type: Input
    }],
    targetLatitude: [{
      type: Input
    }],
    sourcePointRadius: [{
      type: Input
    }],
    sourcePointColor: [{
      type: Input
    }],
    flowParticleColor: [{
      type: Input
    }],
    flowParticleRadius: [{
      type: Input
    }],
    flowParticleSpeed: [{
      type: Input
    }],
    flowParticleDensity: [{
      type: Input
    }],
    onSourcePointClick: [{
      type: Input
    }],
    onSourcePointMouseEnter: [{
      type: Input
    }],
    onSourcePointMouseLeave: [{
      type: Input
    }],
    data: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/leaflet-flow-map/leaflet-flow-map.module.js
var VisLeafletFlowMapModule = class {
};
VisLeafletFlowMapModule.ɵfac = function VisLeafletFlowMapModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisLeafletFlowMapModule)();
};
VisLeafletFlowMapModule.ɵmod = ɵɵdefineNgModule({
  type: VisLeafletFlowMapModule,
  declarations: [VisLeafletFlowMapComponent],
  exports: [VisLeafletFlowMapComponent]
});
VisLeafletFlowMapModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisLeafletFlowMapModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisLeafletFlowMapComponent],
      exports: [VisLeafletFlowMapComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/bullet-legend/bullet-legend.component.js
var _c05 = ["container"];
var VisBulletLegendComponent = class {
  ngAfterViewInit() {
    this.component = new BulletLegend(this.containerRef.nativeElement, Object.assign(Object.assign({}, this.getConfig()), {
      renderIntoProvidedDomNode: true
    }));
  }
  ngOnChanges(changes) {
    var _a;
    (_a = this.component) === null || _a === void 0 ? void 0 : _a.update(this.getConfig());
  }
  getConfig() {
    const {
      items,
      labelClassName,
      onLegendItemClick,
      labelFontSize,
      labelMaxWidth,
      bulletSize,
      bulletSpacing,
      bulletShape,
      orientation
    } = this;
    const config = {
      items,
      labelClassName,
      onLegendItemClick,
      labelFontSize,
      labelMaxWidth,
      bulletSize,
      bulletSpacing,
      bulletShape,
      orientation
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisBulletLegendComponent.ɵfac = function VisBulletLegendComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisBulletLegendComponent)();
};
VisBulletLegendComponent.ɵcmp = ɵɵdefineComponent({
  type: VisBulletLegendComponent,
  selectors: [["vis-bullet-legend"]],
  viewQuery: function VisBulletLegendComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c05, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    }
  },
  inputs: {
    items: "items",
    labelClassName: "labelClassName",
    onLegendItemClick: "onLegendItemClick",
    labelFontSize: "labelFontSize",
    labelMaxWidth: "labelMaxWidth",
    bulletSize: "bulletSize",
    bulletSpacing: "bulletSpacing",
    bulletShape: "bulletShape",
    orientation: "orientation"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisGenericComponent,
    useExisting: VisBulletLegendComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 2,
  vars: 0,
  consts: [["container", ""], [1, "bullet-legend-container"]],
  template: function VisBulletLegendComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelement(0, "div", 1, 0);
    }
  },
  styles: [".bullet-legend-container[_ngcontent-%COMP%] {  }"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisBulletLegendComponent, [{
    type: Component,
    args: [{
      selector: "vis-bullet-legend",
      template: '<div #container class="bullet-legend-container"></div>',
      styles: [".bullet-legend-container {  }"],
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisGenericComponent,
        useExisting: VisBulletLegendComponent
      }]
    }]
  }], null, {
    containerRef: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    items: [{
      type: Input
    }],
    labelClassName: [{
      type: Input
    }],
    onLegendItemClick: [{
      type: Input
    }],
    labelFontSize: [{
      type: Input
    }],
    labelMaxWidth: [{
      type: Input
    }],
    bulletSize: [{
      type: Input
    }],
    bulletSpacing: [{
      type: Input
    }],
    bulletShape: [{
      type: Input
    }],
    orientation: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/bullet-legend/bullet-legend.module.js
var VisBulletLegendModule = class {
};
VisBulletLegendModule.ɵfac = function VisBulletLegendModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisBulletLegendModule)();
};
VisBulletLegendModule.ɵmod = ɵɵdefineNgModule({
  type: VisBulletLegendModule,
  declarations: [VisBulletLegendComponent],
  exports: [VisBulletLegendComponent]
});
VisBulletLegendModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisBulletLegendModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisBulletLegendComponent],
      exports: [VisBulletLegendComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/rolling-pin-legend/rolling-pin-legend.component.js
var _c06 = ["container"];
var VisRollingPinLegendComponent = class {
  ngAfterViewInit() {
    this.component = new RollingPinLegend(this.containerRef.nativeElement, this.getConfig());
  }
  ngOnChanges(changes) {
    var _a;
    (_a = this.component) === null || _a === void 0 ? void 0 : _a.setConfig(this.getConfig());
  }
  getConfig() {
    const {
      rects,
      leftLabelText,
      rightLabelText,
      labelClassName,
      labelFontSize
    } = this;
    const config = {
      rects,
      leftLabelText,
      rightLabelText,
      labelClassName,
      labelFontSize
    };
    const keys = Object.keys(config);
    keys.forEach((key) => {
      if (config[key] === void 0) delete config[key];
    });
    return config;
  }
};
VisRollingPinLegendComponent.ɵfac = function VisRollingPinLegendComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisRollingPinLegendComponent)();
};
VisRollingPinLegendComponent.ɵcmp = ɵɵdefineComponent({
  type: VisRollingPinLegendComponent,
  selectors: [["vis-rolling-pin-legend"]],
  viewQuery: function VisRollingPinLegendComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c06, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerRef = _t.first);
    }
  },
  inputs: {
    rects: "rects",
    leftLabelText: "leftLabelText",
    rightLabelText: "rightLabelText",
    labelClassName: "labelClassName",
    labelFontSize: "labelFontSize"
  },
  standalone: false,
  features: [ɵɵProvidersFeature([{
    provide: VisGenericComponent,
    useExisting: VisRollingPinLegendComponent
  }]), ɵɵNgOnChangesFeature],
  decls: 2,
  vars: 0,
  consts: [["container", ""], [1, "rolling-pin-legend-container"]],
  template: function VisRollingPinLegendComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelement(0, "div", 1, 0);
    }
  },
  styles: [".rolling-pin-legend-container[_ngcontent-%COMP%] {  }"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisRollingPinLegendComponent, [{
    type: Component,
    args: [{
      selector: "vis-rolling-pin-legend",
      template: '<div #container class="rolling-pin-legend-container"></div>',
      styles: [".rolling-pin-legend-container {  }"],
      // eslint-disable-next-line no-use-before-define
      providers: [{
        provide: VisGenericComponent,
        useExisting: VisRollingPinLegendComponent
      }]
    }]
  }], null, {
    containerRef: [{
      type: ViewChild,
      args: ["container", {
        static: false
      }]
    }],
    rects: [{
      type: Input
    }],
    leftLabelText: [{
      type: Input
    }],
    rightLabelText: [{
      type: Input
    }],
    labelClassName: [{
      type: Input
    }],
    labelFontSize: [{
      type: Input
    }]
  });
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/html-components/rolling-pin-legend/rolling-pin-legend.module.js
var VisRollingPinLegendModule = class {
};
VisRollingPinLegendModule.ɵfac = function VisRollingPinLegendModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisRollingPinLegendModule)();
};
VisRollingPinLegendModule.ɵmod = ɵɵdefineNgModule({
  type: VisRollingPinLegendModule,
  declarations: [VisRollingPinLegendComponent],
  exports: [VisRollingPinLegendComponent]
});
VisRollingPinLegendModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisRollingPinLegendModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisRollingPinLegendComponent],
      exports: [VisRollingPinLegendComponent]
    }]
  }], null, null);
})();

// ../../node_modules/.pnpm/@unovis+angular@1.6.2_@angular+common@20.3.15_@angular+core@20.3.15_@angular+compiler@20.3.15_sepy7mmya7lpzjbmzw5ichhorm/node_modules/@unovis/angular/dist/lib/esm2015/components/tooltip/tooltip.module.js
var VisTooltipModule = class {
};
VisTooltipModule.ɵfac = function VisTooltipModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || VisTooltipModule)();
};
VisTooltipModule.ɵmod = ɵɵdefineNgModule({
  type: VisTooltipModule,
  declarations: [VisTooltipComponent],
  exports: [VisTooltipComponent]
});
VisTooltipModule.ɵinj = ɵɵdefineInjector({
  imports: [[]]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisTooltipModule, [{
    type: NgModule,
    args: [{
      imports: [],
      declarations: [VisTooltipComponent],
      exports: [VisTooltipComponent]
    }]
  }], null, null);
})();
export {
  VisAnnotationsComponent,
  VisAnnotationsModule,
  VisAreaComponent,
  VisAreaModule,
  VisAxisComponent,
  VisAxisModule,
  VisBrushComponent,
  VisBrushModule,
  VisBulletLegendComponent,
  VisBulletLegendModule,
  VisChordDiagramComponent,
  VisChordDiagramModule,
  VisCoreComponent,
  VisCrosshairComponent,
  VisCrosshairModule,
  VisDonutComponent,
  VisDonutModule,
  VisFreeBrushComponent,
  VisFreeBrushModule,
  VisGenericComponent,
  VisGraphComponent,
  VisGraphModule,
  VisGroupedBarComponent,
  VisGroupedBarModule,
  VisLeafletFlowMapComponent,
  VisLeafletFlowMapModule,
  VisLeafletMapComponent,
  VisLeafletMapModule,
  VisLineComponent,
  VisLineModule,
  VisNestedDonutComponent,
  VisNestedDonutModule,
  VisPlotbandComponent,
  VisPlotbandModule,
  VisPlotlineComponent,
  VisPlotlineModule,
  VisRollingPinLegendComponent,
  VisRollingPinLegendModule,
  VisSankeyComponent,
  VisSankeyModule,
  VisScatterComponent,
  VisScatterModule,
  VisSingleContainerComponent,
  VisSingleContainerModule,
  VisStackedBarComponent,
  VisStackedBarModule,
  VisTimelineComponent,
  VisTimelineModule,
  VisTooltipComponent,
  VisTooltipModule,
  VisTopoJSONMapComponent,
  VisTopoJSONMapModule,
  VisXYComponent,
  VisXYContainerComponent,
  VisXYContainerModule,
  VisXYLabelsComponent,
  VisXYLabelsModule
};
//# sourceMappingURL=@unovis_angular.js.map
