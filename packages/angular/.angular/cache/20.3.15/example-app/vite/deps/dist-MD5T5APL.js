import {
  Graph,
  Stack_default,
  WeakMap_default,
  alg_exports,
  apply_default,
  arrayEach_default,
  arrayIncludes_default,
  arrayMap_default,
  assignValue_default,
  baseAssignValue_default,
  baseClone_default,
  baseCreate_default,
  baseFindIndex_default,
  baseFlatten_default,
  baseForOwn_default,
  baseFor_default,
  baseGetTag_default,
  baseGet_default,
  baseIteratee_default,
  baseMap_default,
  baseRest_default,
  baseUnary_default,
  castPath_default,
  cloneBuffer_default,
  cloneTypedArray_default,
  constant_default,
  copyArray_default,
  copyObject_default,
  eq_default,
  filter_default,
  forEach_default,
  getPrototype_default,
  getTag_default,
  hasIn_default,
  has_default,
  identity_default,
  initCloneObject_default,
  isArguments_default,
  isArrayLikeObject_default,
  isArrayLike_default,
  isArray_default,
  isBuffer_default,
  isFunction_default,
  isIndex_default,
  isObjectLike_default,
  isObject_default,
  isSymbol_default,
  isTypedArray_default,
  isUndefined_default,
  keysIn_default,
  keys_default,
  mapToArray_default,
  map_default,
  noop_default,
  overRest_default,
  reduce_default,
  root_default,
  setToString_default,
  shortOut_default,
  toKey_default,
  toString_default,
  values_default
} from "./chunk-FNAEINJJ.js";
import "./chunk-7WUTQBRG.js";

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/mapValues.js
function mapValues(object, iteratee) {
  var result = {};
  iteratee = baseIteratee_default(iteratee, 3);
  baseForOwn_default(object, function(value, key, object2) {
    baseAssignValue_default(result, key, iteratee(value, key, object2));
  });
  return result;
}
var mapValues_default = mapValues;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/last.js
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_default = last;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isIterateeCall.js
function isIterateeCall(value, index2, object) {
  if (!isObject_default(object)) {
    return false;
  }
  var type = typeof index2;
  if (type == "number" ? isArrayLike_default(object) && isIndex_default(index2, object.length) : type == "string" && index2 in object) {
    return eq_default(object[index2], value);
  }
  return false;
}
var isIterateeCall_default = isIterateeCall;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/defaults.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var defaults = baseRest_default(function(object, sources) {
  object = Object(object);
  var index2 = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : void 0;
  if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
    length = 1;
  }
  while (++index2 < length) {
    var source = sources[index2];
    var props = keysIn_default(source);
    var propsIndex = -1;
    var propsLength = props.length;
    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];
      if (value === void 0 || eq_default(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
        object[key] = source[key];
      }
    }
  }
  return object;
});
var defaults_default = defaults;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSet.js
function baseSet(object, path, value, customizer) {
  if (!isObject_default(object)) {
    return object;
  }
  path = castPath_default(path, object);
  var index2 = -1, length = path.length, lastIndex = length - 1, nested = object;
  while (nested != null && ++index2 < length) {
    var key = toKey_default(path[index2]), newValue = value;
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return object;
    }
    if (index2 != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = isObject_default(objValue) ? objValue : isIndex_default(path[index2 + 1]) ? [] : {};
      }
    }
    assignValue_default(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
var baseSet_default = baseSet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePickBy.js
function basePickBy(object, paths, predicate) {
  var index2 = -1, length = paths.length, result = {};
  while (++index2 < length) {
    var path = paths[index2], value = baseGet_default(object, path);
    if (predicate(value, path)) {
      baseSet_default(result, castPath_default(path, object), value);
    }
  }
  return result;
}
var basePickBy_default = basePickBy;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_basePick.js
function basePick(object, paths) {
  return basePickBy_default(object, paths, function(value, path) {
    return hasIn_default(object, path);
  });
}
var basePick_default = basePick;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/flatten.js
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten_default(array, 1) : [];
}
var flatten_default = flatten;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_flatRest.js
function flatRest(func) {
  return setToString_default(overRest_default(func, void 0, flatten_default), func + "");
}
var flatRest_default = flatRest;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/pick.js
var pick = flatRest_default(function(object, paths) {
  return object == null ? {} : basePick_default(object, paths);
});
var pick_default = pick;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_assignMergeValue.js
function assignMergeValue(object, key, value) {
  if (value !== void 0 && !eq_default(object[key], value) || value === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value);
  }
}
var assignMergeValue_default = assignMergeValue;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isPlainObject.js
var objectTag = "[object Object]";
var funcProto = Function.prototype;
var objectProto2 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty2 = objectProto2.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject(value) {
  if (!isObjectLike_default(value) || baseGetTag_default(value) != objectTag) {
    return false;
  }
  var proto = getPrototype_default(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty2.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
var isPlainObject_default = isPlainObject;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_safeGet.js
function safeGet(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
var safeGet_default = safeGet;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toPlainObject.js
function toPlainObject(value) {
  return copyObject_default(value, keysIn_default(value));
}
var toPlainObject_default = toPlainObject;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMergeDeep.js
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet_default(object, key), srcValue = safeGet_default(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue_default(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray_default(srcValue), isBuff = !isArr && isBuffer_default(srcValue), isTyped = !isArr && !isBuff && isTypedArray_default(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_default(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject_default(objValue)) {
        newValue = copyArray_default(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer_default(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray_default(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject_default(srcValue) || isArguments_default(srcValue)) {
      newValue = objValue;
      if (isArguments_default(objValue)) {
        newValue = toPlainObject_default(objValue);
      } else if (!isObject_default(objValue) || isFunction_default(objValue)) {
        newValue = initCloneObject_default(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue_default(object, key, newValue);
}
var baseMergeDeep_default = baseMergeDeep;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseMerge.js
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor_default(source, function(srcValue, key) {
    stack || (stack = new Stack_default());
    if (isObject_default(srcValue)) {
      baseMergeDeep_default(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet_default(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue_default(object, key, newValue);
    }
  }, keysIn_default);
}
var baseMerge_default = baseMerge;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createAssigner.js
function createAssigner(assigner) {
  return baseRest_default(function(object, sources) {
    var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
    if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
      customizer = length < 3 ? void 0 : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index2 < length) {
      var source = sources[index2];
      if (source) {
        assigner(object, source, index2, customizer);
      }
    }
    return object;
  });
}
var createAssigner_default = createAssigner;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/merge.js
var merge = createAssigner_default(function(object, source, srcIndex) {
  baseMerge_default(object, source, srcIndex);
});
var merge_default = merge;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/uniqueId.js
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString_default(prefix) + id;
}
var uniqueId_default = uniqueId;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseRange.js
var nativeCeil = Math.ceil;
var nativeMax = Math.max;
function baseRange(start, end, step, fromRight) {
  var index2 = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
  while (length--) {
    result[fromRight ? length : ++index2] = start;
    start += step;
  }
  return result;
}
var baseRange_default = baseRange;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_trimmedEndIndex.js
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index2 = string.length;
  while (index2-- && reWhitespace.test(string.charAt(index2))) {
  }
  return index2;
}
var trimmedEndIndex_default = trimmedEndIndex;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseTrim.js
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
}
var baseTrim_default = baseTrim;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toNumber.js
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol_default(value)) {
    return NAN;
  }
  if (isObject_default(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject_default(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim_default(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var toNumber_default = toNumber;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toFinite.js
var INFINITY = 1 / 0;
var MAX_INTEGER = 17976931348623157e292;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_default(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
var toFinite_default = toFinite;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createRange.js
function createRange(fromRight) {
  return function(start, end, step) {
    if (step && typeof step != "number" && isIterateeCall_default(start, end, step)) {
      end = step = void 0;
    }
    start = toFinite_default(start);
    if (end === void 0) {
      end = start;
      start = 0;
    } else {
      end = toFinite_default(end);
    }
    step = step === void 0 ? start < end ? 1 : -1 : toFinite_default(step);
    return baseRange_default(start, end, step, fromRight);
  };
}
var createRange_default = createRange;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/range.js
var range = createRange_default();
var range_default = range;

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/data/list.js
function List() {
  const sentinel = {};
  sentinel._next = sentinel._prev = sentinel;
  this._sentinel = sentinel;
}
List.prototype.dequeue = function() {
  const sentinel = this._sentinel;
  const entry = sentinel._prev;
  if (entry !== sentinel) {
    unlink(entry);
    return entry;
  }
};
List.prototype.enqueue = function(entry) {
  const sentinel = this._sentinel;
  if (entry._prev && entry._next) {
    unlink(entry);
  }
  entry._next = sentinel._next;
  sentinel._next._prev = entry;
  sentinel._next = entry;
  entry._prev = sentinel;
};
List.prototype.toString = function() {
  const strs = [];
  const sentinel = this._sentinel;
  let curr = sentinel._prev;
  while (curr !== sentinel) {
    strs.push(JSON.stringify(curr, filterOutLinks));
    curr = curr._prev;
  }
  return "[" + strs.join(", ") + "]";
};
function unlink(entry) {
  entry._prev._next = entry._next;
  entry._next._prev = entry._prev;
  delete entry._next;
  delete entry._prev;
}
function filterOutLinks(k, v) {
  if (k !== "_next" && k !== "_prev") {
    return v;
  }
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/greedy-fas.js
var DEFAULT_WEIGHT_FN = constant_default(1);
function greedyFAS(g, weightFn) {
  if (g.nodeCount() <= 1) {
    return [];
  }
  const state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
  const results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);
  return flatten_default(map_default(results, function(e) {
    return g.outEdges(e.v, e.w);
  }), true);
}
function doGreedyFAS(g, buckets, zeroIdx) {
  let results = [];
  const sources = buckets[buckets.length - 1];
  const sinks = buckets[0];
  let entry;
  while (g.nodeCount()) {
    while (entry = sinks.dequeue()) {
      removeNode(g, buckets, zeroIdx, entry);
    }
    while (entry = sources.dequeue()) {
      removeNode(g, buckets, zeroIdx, entry);
    }
    if (g.nodeCount()) {
      for (let i = buckets.length - 2; i > 0; --i) {
        entry = buckets[i].dequeue();
        if (entry) {
          results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
          break;
        }
      }
    }
  }
  return results;
}
function removeNode(g, buckets, zeroIdx, entry, collectPredecessors) {
  const results = collectPredecessors ? [] : void 0;
  forEach_default(g.inEdges(entry.v), function(edge) {
    const weight = g.edge(edge);
    const uEntry = g.node(edge.v);
    if (collectPredecessors) {
      results.push({
        v: edge.v,
        w: edge.w
      });
    }
    uEntry.out -= weight;
    assignBucket(buckets, zeroIdx, uEntry);
  });
  forEach_default(g.outEdges(entry.v), function(edge) {
    const weight = g.edge(edge);
    const w = edge.w;
    const wEntry = g.node(w);
    wEntry["in"] -= weight;
    assignBucket(buckets, zeroIdx, wEntry);
  });
  g.removeNode(entry.v);
  return results;
}
function buildState(g, weightFn) {
  const fasGraph = new Graph();
  let maxIn = 0;
  let maxOut = 0;
  forEach_default(g.nodes(), function(v) {
    fasGraph.setNode(v, {
      v,
      "in": 0,
      out: 0
    });
  });
  forEach_default(g.edges(), function(e) {
    const prevWeight = fasGraph.edge(e.v, e.w) || 0;
    const weight = weightFn(e);
    const edgeWeight = prevWeight + weight;
    fasGraph.setEdge(e.v, e.w, edgeWeight);
    maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
    maxIn = Math.max(maxIn, fasGraph.node(e.w)["in"] += weight);
  });
  const buckets = range_default(maxOut + maxIn + 3).map(function() {
    return new List();
  });
  const zeroIdx = maxIn + 1;
  forEach_default(fasGraph.nodes(), function(v) {
    assignBucket(buckets, zeroIdx, fasGraph.node(v));
  });
  return {
    graph: fasGraph,
    buckets,
    zeroIdx
  };
}
function assignBucket(buckets, zeroIdx, entry) {
  if (!entry.out) {
    buckets[0].enqueue(entry);
  } else if (!entry["in"]) {
    buckets[buckets.length - 1].enqueue(entry);
  } else {
    buckets[entry.out - entry["in"] + zeroIdx].enqueue(entry);
  }
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/acyclic.js
function run(g) {
  const fas = g.graph().acyclicer === "greedy" ? greedyFAS(g, weightFn(g)) : dfsFAS(g);
  forEach_default(fas, function(e) {
    const label = g.edge(e);
    g.removeEdge(e);
    label.forwardName = e.name;
    label.reversed = true;
    g.setEdge(e.w, e.v, label, uniqueId_default("rev"));
  });
  function weightFn(g2) {
    return function(e) {
      return g2.edge(e).weight;
    };
  }
}
function dfsFAS(g) {
  const fas = [];
  const stack = {};
  const visited = {};
  function dfs2(v) {
    if (has_default(visited, v)) {
      return;
    }
    visited[v] = true;
    stack[v] = true;
    forEach_default(g.outEdges(v), function(e) {
      if (has_default(stack, e.w)) {
        fas.push(e);
      } else {
        dfs2(e.w);
      }
    });
    delete stack[v];
  }
  forEach_default(g.nodes(), dfs2);
  return fas;
}
function undo(g) {
  forEach_default(g.edges(), function(e) {
    const label = g.edge(e);
    if (label.reversed) {
      g.removeEdge(e);
      const forwardName = label.forwardName;
      delete label.reversed;
      delete label.forwardName;
      g.setEdge(e.w, e.v, label, forwardName);
    }
  });
}
var acyclic = {
  run,
  undo
};

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/now.js
var now = function() {
  return root_default.Date.now();
};
var now_default = now;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseExtremum.js
function baseExtremum(array, iteratee, comparator) {
  var index2 = -1, length = array.length;
  while (++index2 < length) {
    var value = array[index2], current = iteratee(value);
    if (current != null && (computed === void 0 ? current === current && !isSymbol_default(current) : comparator(current, computed))) {
      var computed = current, result = value;
    }
  }
  return result;
}
var baseExtremum_default = baseExtremum;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseGt.js
function baseGt(value, other) {
  return value > other;
}
var baseGt_default = baseGt;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/max.js
function max(array) {
  return array && array.length ? baseExtremum_default(array, identity_default, baseGt_default) : void 0;
}
var max_default = max;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseLt.js
function baseLt(value, other) {
  return value < other;
}
var baseLt_default = baseLt;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/min.js
function min(array) {
  return array && array.length ? baseExtremum_default(array, identity_default, baseLt_default) : void 0;
}
var min_default = min;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseZipObject.js
function baseZipObject(props, values, assignFunc) {
  var index2 = -1, length = props.length, valsLength = values.length, result = {};
  while (++index2 < length) {
    var value = index2 < valsLength ? values[index2] : void 0;
    assignFunc(result, props[index2], value);
  }
  return result;
}
var baseZipObject_default = baseZipObject;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/zipObject.js
function zipObject(props, values) {
  return baseZipObject_default(props || [], values || [], assignValue_default);
}
var zipObject_default = zipObject;

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/util.js
function addDummyNode(g, type, attrs, name) {
  let v;
  do {
    v = uniqueId_default(name);
  } while (g.hasNode(v));
  attrs.dummy = type;
  g.setNode(v, attrs);
  return v;
}
function simplify(g) {
  const simplified = new Graph().setGraph(g.graph());
  forEach_default(g.nodes(), function(v) {
    simplified.setNode(v, g.node(v));
  });
  forEach_default(g.edges(), function(e) {
    const simpleLabel = simplified.edge(e.v, e.w) || {
      weight: 0,
      minlen: 1
    };
    const label = g.edge(e);
    simplified.setEdge(e.v, e.w, {
      weight: simpleLabel.weight + label.weight,
      minlen: Math.max(simpleLabel.minlen, label.minlen)
    });
  });
  return simplified;
}
function asNonCompoundGraph(g) {
  const simplified = new Graph({
    multigraph: g.isMultigraph()
  }).setGraph(g.graph());
  forEach_default(g.nodes(), function(v) {
    if (!g.children(v).length) {
      simplified.setNode(v, g.node(v));
    }
  });
  forEach_default(g.edges(), function(e) {
    simplified.setEdge(e, g.edge(e));
  });
  return simplified;
}
function successorWeights(g) {
  const weightMap = map_default(g.nodes(), function(v) {
    const sucs = {};
    forEach_default(g.outEdges(v), function(e) {
      sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
    });
    return sucs;
  });
  return zipObject_default(g.nodes(), weightMap);
}
function predecessorWeights(g) {
  const weightMap = map_default(g.nodes(), function(v) {
    const preds = {};
    forEach_default(g.inEdges(v), function(e) {
      preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
    });
    return preds;
  });
  return zipObject_default(g.nodes(), weightMap);
}
function intersectRect(rect, point) {
  const x = rect.x;
  const y = rect.y;
  const dx = point.x - x;
  const dy = point.y - y;
  let w = rect.width / 2;
  let h = rect.height / 2;
  if (!dx && !dy) {
    throw new Error("Not possible to find intersection inside of the rectangle");
  }
  let sx;
  let sy;
  if (Math.abs(dy) * w > Math.abs(dx) * h) {
    if (dy < 0) {
      h = -h;
    }
    sx = h * dx / dy;
    sy = h;
  } else {
    if (dx < 0) {
      w = -w;
    }
    sx = w;
    sy = w * dy / dx;
  }
  return {
    x: x + sx,
    y: y + sy
  };
}
function buildLayerMatrix(g) {
  const layering = map_default(range_default(maxRank(g) + 1), function() {
    return [];
  });
  forEach_default(g.nodes(), function(v) {
    const node = g.node(v);
    const rank2 = node.rank;
    if (!isUndefined_default(rank2)) {
      layering[rank2][node.order] = v;
    }
  });
  return layering;
}
function normalizeRanks(g) {
  const min2 = min_default(map_default(g.nodes(), function(v) {
    return g.node(v).rank;
  }));
  forEach_default(g.nodes(), function(v) {
    const node = g.node(v);
    if (has_default(node, "rank")) {
      node.rank -= min2;
    }
  });
}
function removeEmptyRanks(g) {
  const offset = min_default(map_default(g.nodes(), function(v) {
    return g.node(v).rank;
  }));
  const layers = [];
  forEach_default(g.nodes(), function(v) {
    const rank2 = g.node(v).rank - offset;
    if (!layers[rank2]) {
      layers[rank2] = [];
    }
    layers[rank2].push(v);
  });
  let delta = 0;
  const nodeRankFactor = g.graph().nodeRankFactor;
  forEach_default(layers, function(vs, i) {
    if (isUndefined_default(vs) && i % nodeRankFactor !== 0) {
      --delta;
    } else if (delta) {
      forEach_default(vs, function(v) {
        g.node(v).rank += delta;
      });
    }
  });
}
function addBorderNode(g, prefix, rank2, order2) {
  const node = {
    width: 0,
    height: 0
  };
  if (arguments.length >= 4) {
    node.rank = rank2;
    node.order = order2;
  }
  return addDummyNode(g, "border", node, prefix);
}
function maxRank(g) {
  return max_default(map_default(g.nodes(), function(v) {
    const rank2 = g.node(v).rank;
    if (!isUndefined_default(rank2)) {
      return rank2;
    }
  }));
}
function partition(collection, fn) {
  const result = {
    lhs: [],
    rhs: []
  };
  forEach_default(collection, function(value) {
    if (fn(value)) {
      result.lhs.push(value);
    } else {
      result.rhs.push(value);
    }
  });
  return result;
}
function time(name, fn) {
  const start = now_default();
  try {
    return fn();
  } finally {
    console.log(name + " time: " + (now_default() - start) + "ms");
  }
}
function notime(name, fn) {
  return fn();
}
var util = {
  addDummyNode,
  simplify,
  asNonCompoundGraph,
  successorWeights,
  predecessorWeights,
  intersectRect,
  buildLayerMatrix,
  normalizeRanks,
  removeEmptyRanks,
  addBorderNode,
  maxRank,
  partition,
  time,
  notime
};

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/normalize.js
function run2(g) {
  g.graph().dummyChains = [];
  forEach_default(g.edges(), function(edge) {
    normalizeEdge(g, edge);
  });
}
function normalizeEdge(g, e) {
  let v = e.v;
  let vRank = g.node(v).rank;
  const w = e.w;
  const wRank = g.node(w).rank;
  const name = e.name;
  const edgeLabel = g.edge(e);
  const labelRank = edgeLabel.labelRank;
  if (wRank === vRank + 1) return;
  g.removeEdge(e);
  let dummy;
  let attrs;
  let i;
  for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
    edgeLabel.points = [];
    attrs = {
      width: 0,
      height: 0,
      edgeLabel,
      edgeObj: e,
      rank: vRank
    };
    dummy = util.addDummyNode(g, "edge", attrs, "_d");
    if (vRank === labelRank) {
      attrs.width = edgeLabel.width;
      attrs.height = edgeLabel.height;
      attrs.dummy = "edge-label";
      attrs.labelpos = edgeLabel.labelpos;
    }
    g.setEdge(v, dummy, {
      weight: edgeLabel.weight
    }, name);
    if (i === 0) {
      g.graph().dummyChains.push(dummy);
    }
    v = dummy;
  }
  g.setEdge(v, w, {
    weight: edgeLabel.weight
  }, name);
}
function undo2(g) {
  forEach_default(g.graph().dummyChains, function(v) {
    let node = g.node(v);
    const origLabel = node.edgeLabel;
    let w = null;
    g.setEdge(node.edgeObj, origLabel);
    while (node.dummy) {
      w = g.successors(v)[0];
      g.removeNode(v);
      origLabel.points.push({
        x: node.x,
        y: node.y
      });
      if (node.dummy === "edge-label") {
        origLabel.x = node.x;
        origLabel.y = node.y;
        origLabel.width = node.width;
        origLabel.height = node.height;
      }
      v = w;
      node = g.node(v);
    }
  });
}
var normalize = {
  run: run2,
  undo: undo2
};

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/rank/util.js
function longestPath(g) {
  const visited = {};
  function dfs2(v) {
    const label = g.node(v);
    if (has_default(visited, v)) {
      return label.rank;
    }
    visited[v] = true;
    const rank2 = min_default(map_default(g.outEdges(v), function(e) {
      return dfs2(e.w) - g.edge(e).minlen;
    })) || 0;
    return label.rank = rank2;
  }
  forEach_default(g.sources(), dfs2);
}
function slack(g, e) {
  return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
}

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/minBy.js
function minBy(array, iteratee) {
  return array && array.length ? baseExtremum_default(array, baseIteratee_default(iteratee, 2), baseLt_default) : void 0;
}
var minBy_default = minBy;

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/rank/feasible-tree.js
function feasibleTree(g) {
  const t = new Graph({
    directed: false
  });
  const start = g.nodes()[0];
  const size = g.nodeCount();
  t.setNode(start, {});
  let edge;
  let delta;
  while (tightTree(t, g) < size) {
    edge = findMinSlackEdge(t, g);
    delta = t.hasNode(edge.v) ? slack(g, edge) : -slack(g, edge);
    shiftRanks(t, g, delta);
  }
  return t;
}
function tightTree(t, g) {
  function dfs2(v) {
    forEach_default(g.nodeEdges(v), function(e) {
      const edgeV = e.v;
      const w = v === edgeV ? e.w : edgeV;
      if (!t.hasNode(w) && !slack(g, e)) {
        t.setNode(w, {});
        t.setEdge(v, w, {});
        dfs2(w);
      }
    });
  }
  forEach_default(t.nodes(), dfs2);
  return t.nodeCount();
}
function findMinSlackEdge(t, g) {
  return minBy_default(g.edges(), function(e) {
    if (t.hasNode(e.v) !== t.hasNode(e.w)) {
      return slack(g, e);
    }
  });
}
function shiftRanks(t, g, delta) {
  forEach_default(t.nodes(), function(v) {
    g.node(v).rank += delta;
  });
}

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createFind.js
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike_default(collection)) {
      var iteratee = baseIteratee_default(predicate, 3);
      collection = keys_default(collection);
      predicate = function(key) {
        return iteratee(iterable[key], key, iterable);
      };
    }
    var index2 = findIndexFunc(collection, predicate, fromIndex);
    return index2 > -1 ? iterable[iteratee ? collection[index2] : index2] : void 0;
  };
}
var createFind_default = createFind;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toInteger.js
function toInteger(value) {
  var result = toFinite_default(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
var toInteger_default = toInteger;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/findIndex.js
var nativeMax2 = Math.max;
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index2 = fromIndex == null ? 0 : toInteger_default(fromIndex);
  if (index2 < 0) {
    index2 = nativeMax2(length + index2, 0);
  }
  return baseFindIndex_default(array, baseIteratee_default(predicate, 3), index2);
}
var findIndex_default = findIndex;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/find.js
var find = createFind_default(findIndex_default);
var find_default = find;

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/rank/network-simplex.js
var {
  preorder,
  postorder
} = alg_exports;
networkSimplex.initLowLimValues = initLowLimValues;
networkSimplex.initCutValues = initCutValues;
networkSimplex.calcCutValue = calcCutValue;
networkSimplex.leaveEdge = leaveEdge;
networkSimplex.enterEdge = enterEdge;
networkSimplex.exchangeEdges = exchangeEdges;
function networkSimplex(g) {
  g = simplify(g);
  longestPath(g);
  const t = feasibleTree(g);
  initLowLimValues(t);
  initCutValues(t, g);
  let e;
  let f;
  while (e = leaveEdge(t)) {
    f = enterEdge(t, g, e);
    exchangeEdges(t, g, e, f);
  }
}
function initCutValues(t, g) {
  let vs = postorder(t, t.nodes());
  vs = vs.slice(0, vs.length - 1);
  forEach_default(vs, function(v) {
    assignCutValue(t, g, v);
  });
}
function assignCutValue(t, g, child) {
  const childLab = t.node(child);
  const parent = childLab.parent;
  t.edge(child, parent).cutvalue = calcCutValue(t, g, child);
}
function calcCutValue(t, g, child) {
  const childLab = t.node(child);
  const parent = childLab.parent;
  let childIsTail = true;
  let graphEdge = g.edge(child, parent);
  let cutValue = 0;
  if (!graphEdge) {
    childIsTail = false;
    graphEdge = g.edge(parent, child);
  }
  cutValue = graphEdge.weight;
  forEach_default(g.nodeEdges(child), function(e) {
    const isOutEdge = e.v === child;
    const other = isOutEdge ? e.w : e.v;
    if (other !== parent) {
      const pointsToHead = isOutEdge === childIsTail;
      const otherWeight = g.edge(e).weight;
      cutValue += pointsToHead ? otherWeight : -otherWeight;
      if (isTreeEdge(t, child, other)) {
        const otherCutValue = t.edge(child, other).cutvalue;
        cutValue += pointsToHead ? -otherCutValue : otherCutValue;
      }
    }
  });
  return cutValue;
}
function initLowLimValues(tree, root) {
  if (arguments.length < 2) {
    root = tree.nodes()[0];
  }
  dfsAssignLowLim(tree, {}, 1, root);
}
function dfsAssignLowLim(tree, visited, nextLim, v, parent) {
  const low = nextLim;
  const label = tree.node(v);
  visited[v] = true;
  forEach_default(tree.neighbors(v), function(w) {
    if (!has_default(visited, w)) {
      nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v);
    }
  });
  label.low = low;
  label.lim = nextLim++;
  if (parent) {
    label.parent = parent;
  } else {
    delete label.parent;
  }
  return nextLim;
}
function leaveEdge(tree) {
  return find_default(tree.edges(), function(e) {
    return tree.edge(e).cutvalue < 0;
  });
}
function enterEdge(t, g, edge) {
  let v = edge.v;
  let w = edge.w;
  if (!g.hasEdge(v, w)) {
    v = edge.w;
    w = edge.v;
  }
  const vLabel = t.node(v);
  const wLabel = t.node(w);
  let tailLabel = vLabel;
  let flip = false;
  if (vLabel.lim > wLabel.lim) {
    tailLabel = wLabel;
    flip = true;
  }
  const candidates = filter_default(g.edges(), function(edge2) {
    return flip === isDescendant(t, t.node(edge2.v), tailLabel) && flip !== isDescendant(t, t.node(edge2.w), tailLabel);
  });
  return minBy_default(candidates, function(edge2) {
    return slack(g, edge2);
  });
}
function exchangeEdges(t, g, e, f) {
  const v = e.v;
  const w = e.w;
  t.removeEdge(v, w);
  t.setEdge(f.v, f.w, {});
  initLowLimValues(t);
  initCutValues(t, g);
  updateRanks(t, g);
}
function updateRanks(t, g) {
  const root = find_default(t.nodes(), function(v) {
    return !g.node(v).parent;
  });
  let vs = preorder(t, root);
  vs = vs.slice(1);
  forEach_default(vs, function(v) {
    const parent = t.node(v).parent;
    let edge = g.edge(v, parent);
    let flipped = false;
    if (!edge) {
      edge = g.edge(parent, v);
      flipped = true;
    }
    g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen);
  });
}
function isTreeEdge(tree, u, v) {
  return tree.hasEdge(u, v);
}
function isDescendant(tree, vLabel, rootLabel) {
  return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/rank/index.js
function rank(g) {
  switch (g.graph().ranker) {
    case "network-simplex":
      networkSimplexRanker(g);
      break;
    case "tight-tree":
      tightTreeRanker(g);
      break;
    case "longest-path":
      longestPathRanker(g);
      break;
    default:
      networkSimplexRanker(g);
  }
}
var longestPathRanker = longestPath;
function tightTreeRanker(g) {
  longestPath(g);
  feasibleTree(g);
}
function networkSimplexRanker(g) {
  networkSimplex(g);
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/parent-dummy-chains.js
function parentDummyChains(g) {
  const postorderNums = postorder2(g);
  forEach_default(g.graph().dummyChains, function(v) {
    let node = g.node(v);
    const edgeObj = node.edgeObj;
    const pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
    const path = pathData.path;
    const lca = pathData.lca;
    let pathIdx = 0;
    let pathV = path[pathIdx];
    let ascending = true;
    while (v !== edgeObj.w) {
      node = g.node(v);
      if (ascending) {
        while ((pathV = path[pathIdx]) !== lca && g.node(pathV).maxRank < node.rank) {
          pathIdx++;
        }
        if (pathV === lca) {
          ascending = false;
        }
      }
      if (!ascending) {
        while (pathIdx < path.length - 1 && g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
          pathIdx++;
        }
        pathV = path[pathIdx];
      }
      g.setParent(v, pathV);
      v = g.successors(v)[0];
    }
  });
}
function findPath(g, postorderNums, v, w) {
  const vPath = [];
  const wPath = [];
  const low = Math.min(postorderNums[v].low, postorderNums[w].low);
  const lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
  let parent;
  let lca;
  parent = v;
  do {
    parent = g.parent(parent);
    vPath.push(parent);
  } while (parent && (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
  lca = parent;
  parent = w;
  while ((parent = g.parent(parent)) !== lca) {
    wPath.push(parent);
  }
  return {
    path: vPath.concat(wPath.reverse()),
    lca
  };
}
function postorder2(g) {
  const result = {};
  let lim = 0;
  function dfs2(v) {
    const low = lim;
    forEach_default(g.children(v), dfs2);
    result[v] = {
      low,
      lim: lim++
    };
  }
  forEach_default(g.children(), dfs2);
  return result;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/nesting-graph.js
function run3(g) {
  const root = util.addDummyNode(g, "root", {}, "_root");
  const depths = treeDepths(g);
  const height = max_default(values_default(depths)) - 1;
  const nodeSep = 2 * height + 1;
  g.graph().nestingRoot = root;
  forEach_default(g.edges(), function(e) {
    g.edge(e).minlen *= nodeSep;
  });
  const weight = sumWeights(g) + 1;
  forEach_default(g.children(), function(child) {
    dfs(g, root, nodeSep, weight, height, depths, child);
  });
  g.graph().nodeRankFactor = nodeSep;
}
function dfs(g, root, nodeSep, weight, height, depths, v) {
  const children = g.children(v);
  if (!children.length) {
    if (v !== root) {
      g.setEdge(root, v, {
        weight: 0,
        minlen: nodeSep
      });
    }
    return;
  }
  const top = util.addBorderNode(g, "_bt");
  const bottom = util.addBorderNode(g, "_bb");
  const label = g.node(v);
  g.setParent(top, v);
  label.borderTop = top;
  g.setParent(bottom, v);
  label.borderBottom = bottom;
  forEach_default(children, function(child) {
    dfs(g, root, nodeSep, weight, height, depths, child);
    const childNode = g.node(child);
    const childTop = childNode.borderTop ? childNode.borderTop : child;
    const childBottom = childNode.borderBottom ? childNode.borderBottom : child;
    const thisWeight = childNode.borderTop ? weight : 2 * weight;
    const minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;
    g.setEdge(top, childTop, {
      weight: thisWeight,
      minlen,
      nestingEdge: true
    });
    g.setEdge(childBottom, bottom, {
      weight: thisWeight,
      minlen,
      nestingEdge: true
    });
  });
  if (!g.parent(v)) {
    g.setEdge(root, top, {
      weight: 0,
      minlen: height + depths[v]
    });
  }
}
function treeDepths(g) {
  const depths = {};
  function dfs2(v, depth) {
    const children = g.children(v);
    if (children && children.length) {
      forEach_default(children, function(child) {
        dfs2(child, depth + 1);
      });
    }
    depths[v] = depth;
  }
  forEach_default(g.children(), function(v) {
    dfs2(v, 1);
  });
  return depths;
}
function sumWeights(g) {
  return reduce_default(g.edges(), function(acc, e) {
    return acc + g.edge(e).weight;
  }, 0);
}
function cleanup(g) {
  const graphLabel = g.graph();
  g.removeNode(graphLabel.nestingRoot);
  delete graphLabel.nestingRoot;
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    if (edge.nestingEdge) {
      g.removeEdge(e);
    }
  });
}
var nestingGraph = {
  run: run3,
  cleanup
};

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/add-border-segments.js
function addBorderSegments(g) {
  function dfs2(v) {
    const children = g.children(v);
    const node = g.node(v);
    if (children.length) {
      forEach_default(children, dfs2);
    }
    if (has_default(node, "minRank")) {
      node.borderLeft = [];
      node.borderRight = [];
      for (let rank2 = node.minRank, maxRank2 = node.maxRank + 1; rank2 < maxRank2; ++rank2) {
        addBorderNode2(g, "borderLeft", "_bl", v, node, rank2);
        addBorderNode2(g, "borderRight", "_br", v, node, rank2);
      }
    }
  }
  forEach_default(g.children(), dfs2);
}
function addBorderNode2(g, prop, prefix, sg, sgNode, rank2) {
  const label = {
    width: 0,
    height: 0,
    rank: rank2,
    borderType: prop
  };
  const prev = sgNode[prop][rank2 - 1];
  const curr = util.addDummyNode(g, "border", label, prefix);
  sgNode[prop][rank2] = curr;
  g.setParent(curr, sg);
  if (prev) {
    g.setEdge(prev, curr, {
      weight: 1
    });
  }
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/coordinate-system.js
function adjust(g) {
  const rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === "lr" || rankDir === "rl") {
    swapWidthHeight(g);
  }
}
function undo3(g) {
  const rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === "bt" || rankDir === "rl") {
    reverseY(g);
  }
  if (rankDir === "lr" || rankDir === "rl") {
    swapXY(g);
    swapWidthHeight(g);
  }
}
function swapWidthHeight(g) {
  forEach_default(g.nodes(), function(v) {
    swapWidthHeightOne(g.node(v));
  });
  forEach_default(g.edges(), function(e) {
    swapWidthHeightOne(g.edge(e));
  });
}
function swapWidthHeightOne(attrs) {
  const w = attrs.width;
  attrs.width = attrs.height;
  attrs.height = w;
}
function reverseY(g) {
  forEach_default(g.nodes(), function(v) {
    reverseYOne(g.node(v));
  });
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    forEach_default(edge.points, reverseYOne);
    if (has_default(edge, "y")) {
      reverseYOne(edge);
    }
  });
}
function reverseYOne(attrs) {
  attrs.y = -attrs.y;
}
function swapXY(g) {
  forEach_default(g.nodes(), function(v) {
    swapXYOne(g.node(v));
  });
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    forEach_default(edge.points, swapXYOne);
    if (has_default(edge, "x")) {
      swapXYOne(edge);
    }
  });
}
function swapXYOne(attrs) {
  const x = attrs.x;
  attrs.x = attrs.y;
  attrs.y = x;
}
var coordinateSystem = {
  adjust,
  undo: undo3
};

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/cloneDeep.js
var CLONE_DEEP_FLAG = 1;
var CLONE_SYMBOLS_FLAG = 4;
function cloneDeep(value) {
  return baseClone_default(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
var cloneDeep_default = cloneDeep;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSortBy.js
function baseSortBy(array, comparer) {
  var length = array.length;
  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}
var baseSortBy_default = baseSortBy;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_compareAscending.js
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol_default(value);
    var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol_default(other);
    if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
      return 1;
    }
    if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}
var compareAscending_default = compareAscending;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_compareMultiple.js
function compareMultiple(object, other, orders) {
  var index2 = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
  while (++index2 < length) {
    var result = compareAscending_default(objCriteria[index2], othCriteria[index2]);
    if (result) {
      if (index2 >= ordersLength) {
        return result;
      }
      var order2 = orders[index2];
      return result * (order2 == "desc" ? -1 : 1);
    }
  }
  return object.index - other.index;
}
var compareMultiple_default = compareMultiple;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseOrderBy.js
function baseOrderBy(collection, iteratees, orders) {
  if (iteratees.length) {
    iteratees = arrayMap_default(iteratees, function(iteratee) {
      if (isArray_default(iteratee)) {
        return function(value) {
          return baseGet_default(value, iteratee.length === 1 ? iteratee[0] : iteratee);
        };
      }
      return iteratee;
    });
  } else {
    iteratees = [identity_default];
  }
  var index2 = -1;
  iteratees = arrayMap_default(iteratees, baseUnary_default(baseIteratee_default));
  var result = baseMap_default(collection, function(value, key, collection2) {
    var criteria = arrayMap_default(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { "criteria": criteria, "index": ++index2, "value": value };
  });
  return baseSortBy_default(result, function(object, other) {
    return compareMultiple_default(object, other, orders);
  });
}
var baseOrderBy_default = baseOrderBy;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/sortBy.js
var sortBy = baseRest_default(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall_default(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall_default(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy_default(collection, baseFlatten_default(iteratees, 1), []);
});
var sortBy_default = sortBy;

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/init-order.js
function initOrder(g) {
  const visited = {};
  const simpleNodes = filter_default(g.nodes(), function(v) {
    return !g.children(v).length;
  });
  const maxRank2 = max_default(map_default(simpleNodes, function(v) {
    return g.node(v).rank;
  }));
  const layers = map_default(range_default(maxRank2 + 1), function() {
    return [];
  });
  function dfs2(v) {
    if (has_default(visited, v)) return;
    visited[v] = true;
    const node = g.node(v);
    layers[node.rank].push(v);
    forEach_default(g.successors(v), dfs2);
  }
  const orderedVs = sortBy_default(simpleNodes, function(v) {
    return g.node(v).rank;
  });
  forEach_default(orderedVs, dfs2);
  return layers;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/cross-count.js
function crossCount(g, layering) {
  let cc = 0;
  for (let i = 1; i < layering.length; ++i) {
    cc += twoLayerCrossCount(g, layering[i - 1], layering[i]);
  }
  return cc;
}
function twoLayerCrossCount(g, northLayer, southLayer) {
  const southPos = zipObject_default(southLayer, map_default(southLayer, function(v, i) {
    return i;
  }));
  const southEntries = flatten_default(map_default(northLayer, function(v) {
    const outEdges = g.outEdges(v);
    const pos = map_default(outEdges, (e) => ({
      pos: southPos[e.w],
      weight: g.edge(e).weight
    }));
    const posSorted = sortBy_default(pos, "pos");
    return posSorted;
  }), true);
  let firstIndex = 1;
  while (firstIndex < southLayer.length) {
    firstIndex <<= 1;
  }
  const treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;
  const tree = map_default(new Array(treeSize), function() {
    return 0;
  });
  let cc = 0;
  forEach_default(southEntries.forEach(function(entry) {
    let index2 = entry.pos + firstIndex;
    tree[index2] += entry.weight;
    let weightSum = 0;
    while (index2 > 0) {
      if (index2 % 2) {
        weightSum += tree[index2 + 1];
      }
      index2 = index2 - 1 >> 1;
      tree[index2] += entry.weight;
    }
    cc += entry.weight * weightSum;
  }));
  return cc;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/barycenter.js
function barycenter(g, movable) {
  return map_default(movable, function(v) {
    const inV = g.inEdges(v);
    if (!inV.length) {
      return {
        v
      };
    } else {
      const result = reduce_default(inV, function(acc, e) {
        const edge = g.edge(e);
        const nodeU = g.node(e.v);
        return {
          sum: acc.sum + edge.weight * nodeU.order,
          weight: acc.weight + edge.weight
        };
      }, {
        sum: 0,
        weight: 0
      });
      return {
        v,
        barycenter: result.sum / result.weight,
        weight: result.weight
      };
    }
  });
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/resolve-conflicts.js
function resolveConflicts(entries, cg) {
  const mappedEntries = {};
  forEach_default(entries, function(entry, i) {
    const tmp = mappedEntries[entry.v] = {
      indegree: 0,
      "in": [],
      out: [],
      vs: [entry.v],
      i
    };
    if (!isUndefined_default(entry.barycenter)) {
      tmp.barycenter = entry.barycenter;
      tmp.weight = entry.weight;
    }
  });
  forEach_default(cg.edges(), function(e) {
    const entryV = mappedEntries[e.v];
    const entryW = mappedEntries[e.w];
    if (!isUndefined_default(entryV) && !isUndefined_default(entryW)) {
      entryW.indegree++;
      entryV.out.push(mappedEntries[e.w]);
    }
  });
  const sourceSet = filter_default(mappedEntries, function(entry) {
    return !entry.indegree;
  });
  return doResolveConflicts(sourceSet);
}
function doResolveConflicts(sourceSet) {
  const entries = [];
  function handleIn(vEntry) {
    return function(uEntry) {
      if (uEntry.merged) {
        return;
      }
      if (isUndefined_default(uEntry.barycenter) || isUndefined_default(vEntry.barycenter) || uEntry.barycenter >= vEntry.barycenter) {
        mergeEntries(vEntry, uEntry);
      }
    };
  }
  function handleOut(vEntry) {
    return function(wEntry) {
      wEntry["in"].push(vEntry);
      if (--wEntry.indegree === 0) {
        sourceSet.push(wEntry);
      }
    };
  }
  while (sourceSet.length) {
    const entry = sourceSet.pop();
    entries.push(entry);
    forEach_default(entry["in"].reverse(), handleIn(entry));
    forEach_default(entry.out, handleOut(entry));
  }
  const entriesFiltered = filter_default(entries, function(entry) {
    return !entry.merged;
  });
  return map_default(entriesFiltered, function(entry) {
    return pick_default(entry, ["vs", "i", "barycenter", "weight"]);
  });
}
function mergeEntries(target, source) {
  let sum = 0;
  let weight = 0;
  if (target.weight) {
    sum += target.barycenter * target.weight;
    weight += target.weight;
  }
  if (source.weight) {
    sum += source.barycenter * source.weight;
    weight += source.weight;
  }
  target.vs = source.vs.concat(target.vs);
  target.barycenter = sum / weight;
  target.weight = weight;
  target.i = Math.min(source.i, target.i);
  source.merged = true;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/sort.js
function sort(entries, biasRight) {
  const parts = util.partition(entries, function(entry) {
    return has_default(entry, "barycenter");
  });
  const sortable = parts.lhs;
  const unsortable = sortBy_default(parts.rhs, function(entry) {
    return -entry.i;
  });
  const vs = [];
  let sum = 0;
  let weight = 0;
  let vsIndex = 0;
  sortable.sort(compareWithBias(!!biasRight));
  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  forEach_default(sortable, function(entry) {
    vsIndex += entry.vs.length;
    vs.push(entry.vs);
    sum += entry.barycenter * entry.weight;
    weight += entry.weight;
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  });
  const result = {
    vs: flatten_default(vs, true)
  };
  if (weight) {
    result.barycenter = sum / weight;
    result.weight = weight;
  }
  return result;
}
function consumeUnsortable(vs, unsortable, index2) {
  let last2;
  while (unsortable.length && (last2 = last_default(unsortable)).i <= index2) {
    unsortable.pop();
    vs.push(last2.vs);
    index2++;
  }
  return index2;
}
function compareWithBias(bias) {
  return function(entryV, entryW) {
    if (entryV.barycenter < entryW.barycenter) {
      return -1;
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1;
    }
    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
  };
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/sort-subgraph.js
function sortSubgraph(g, v, cg, biasRight) {
  let movable = g.children(v);
  const node = g.node(v);
  const bl = node ? node.borderLeft : void 0;
  const br = node ? node.borderRight : void 0;
  const subgraphs = {};
  if (bl) {
    movable = filter_default(movable, function(w) {
      return w !== bl && w !== br;
    });
  }
  const barycenters = barycenter(g, movable);
  forEach_default(barycenters, function(entry) {
    if (g.children(entry.v).length) {
      const subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
      subgraphs[entry.v] = subgraphResult;
      if (has_default(subgraphResult, "barycenter")) {
        mergeBarycenters(entry, subgraphResult);
      }
    }
  });
  const entries = resolveConflicts(barycenters, cg);
  expandSubgraphs(entries, subgraphs);
  const result = sort(entries, biasRight);
  if (bl) {
    result.vs = flatten_default([bl, result.vs, br], true);
    if (g.predecessors(bl).length) {
      const blPred = g.node(g.predecessors(bl)[0]);
      const brPred = g.node(g.predecessors(br)[0]);
      if (!has_default(result, "barycenter")) {
        result.barycenter = 0;
        result.weight = 0;
      }
      result.barycenter = (result.barycenter * result.weight + blPred.order + brPred.order) / (result.weight + 2);
      result.weight += 2;
    }
  }
  return result;
}
function expandSubgraphs(entries, subgraphs) {
  forEach_default(entries, function(entry) {
    entry.vs = flatten_default(entry.vs.map(function(v) {
      if (subgraphs[v]) {
        return subgraphs[v].vs;
      }
      return v;
    }), true);
  });
}
function mergeBarycenters(target, other) {
  if (!isUndefined_default(target.barycenter)) {
    target.barycenter = (target.barycenter * target.weight + other.barycenter * other.weight) / (target.weight + other.weight);
    target.weight += other.weight;
  } else {
    target.barycenter = other.barycenter;
    target.weight = other.weight;
  }
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/build-layer-graph.js
function buildLayerGraph(g, rank2, relationship) {
  const root = createRootNode(g);
  const result = new Graph({
    compound: true
  }).setGraph({
    root
  }).setDefaultNodeLabel(function(v) {
    return g.node(v);
  });
  forEach_default(g.nodes(), function(v) {
    const node = g.node(v);
    const parent = g.parent(v);
    if (node.rank === rank2 || node.minRank <= rank2 && rank2 <= node.maxRank) {
      result.setNode(v);
      result.setParent(v, parent || root);
      forEach_default(g[relationship](v), function(e) {
        const u = e.v === v ? e.w : e.v;
        const edge = result.edge(u, v);
        const weight = !isUndefined_default(edge) ? edge.weight : 0;
        result.setEdge(u, v, {
          weight: g.edge(e).weight + weight
        });
      });
      if (has_default(node, "minRank")) {
        result.setNode(v, {
          borderLeft: node.borderLeft[rank2],
          borderRight: node.borderRight[rank2]
        });
      }
    }
  });
  return result;
}
function createRootNode(g) {
  let v;
  while (g.hasNode(v = uniqueId_default("_root"))) ;
  return v;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/add-subgraph-constraints.js
function addSubgraphConstraints(g, cg, vs) {
  const prev = {};
  let rootPrev;
  forEach_default(vs, function(v) {
    let child = g.parent(v);
    let parent;
    let prevChild;
    while (child) {
      parent = g.parent(child);
      if (parent) {
        prevChild = prev[parent];
        prev[parent] = child;
      } else {
        prevChild = rootPrev;
        rootPrev = child;
      }
      if (prevChild && prevChild !== child) {
        cg.setEdge(prevChild, child);
        return;
      }
      child = parent;
    }
  });
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/order/index.js
function order(g) {
  const maxRank2 = util.maxRank(g);
  const downLayerGraphs = buildLayerGraphs(g, range_default(1, maxRank2 + 1), "inEdges");
  const upLayerGraphs = buildLayerGraphs(g, range_default(maxRank2 - 1, -1, -1), "outEdges");
  let layering = initOrder(g);
  assignOrder(g, layering);
  let bestCC = Number.POSITIVE_INFINITY;
  let best;
  for (let i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);
    layering = util.buildLayerMatrix(g);
    const cc = crossCount(g, layering);
    if (cc < bestCC) {
      lastBest = 0;
      best = cloneDeep_default(layering);
      bestCC = cc;
    }
  }
  assignOrder(g, best);
}
function buildLayerGraphs(g, ranks, relationship) {
  return map_default(ranks, function(rank2) {
    return buildLayerGraph(g, rank2, relationship);
  });
}
function sweepLayerGraphs(layerGraphs, biasRight) {
  const cg = new Graph();
  forEach_default(layerGraphs, function(lg) {
    const root = lg.graph().root;
    const sorted = sortSubgraph(lg, root, cg, biasRight);
    forEach_default(sorted.vs, function(v, i) {
      lg.node(v).order = i;
    });
    addSubgraphConstraints(lg, cg, sorted.vs);
  });
}
function assignOrder(g, layering) {
  forEach_default(layering, function(layer) {
    forEach_default(layer, function(v, i) {
      g.node(v).order = i;
    });
  });
}

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_metaMap.js
var metaMap = WeakMap_default && new WeakMap_default();
var metaMap_default = metaMap;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseSetData.js
var baseSetData = !metaMap_default ? identity_default : function(func, data) {
  metaMap_default.set(func, data);
  return func;
};
var baseSetData_default = baseSetData;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createCtor.js
function createCtor(Ctor) {
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0:
        return new Ctor();
      case 1:
        return new Ctor(args[0]);
      case 2:
        return new Ctor(args[0], args[1]);
      case 3:
        return new Ctor(args[0], args[1], args[2]);
      case 4:
        return new Ctor(args[0], args[1], args[2], args[3]);
      case 5:
        return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate_default(Ctor.prototype), result = Ctor.apply(thisBinding, args);
    return isObject_default(result) ? result : thisBinding;
  };
}
var createCtor_default = createCtor;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createBind.js
var WRAP_BIND_FLAG = 1;
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor_default(func);
  function wrapper() {
    var fn = this && this !== root_default && this instanceof wrapper ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}
var createBind_default = createBind;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_composeArgs.js
var nativeMax3 = Math.max;
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax3(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}
var composeArgs_default = composeArgs;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_composeArgsRight.js
var nativeMax4 = Math.max;
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax4(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}
var composeArgsRight_default = composeArgsRight;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_countHolders.js
function countHolders(array, placeholder) {
  var length = array.length, result = 0;
  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}
var countHolders_default = countHolders;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseLodash.js
function baseLodash() {
}
var baseLodash_default = baseLodash;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_LazyWrapper.js
var MAX_ARRAY_LENGTH = 4294967295;
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}
LazyWrapper.prototype = baseCreate_default(baseLodash_default.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;
var LazyWrapper_default = LazyWrapper;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getData.js
var getData = !metaMap_default ? noop_default : function(func) {
  return metaMap_default.get(func);
};
var getData_default = getData;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_realNames.js
var realNames = {};
var realNames_default = realNames;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getFuncName.js
var objectProto3 = Object.prototype;
var hasOwnProperty3 = objectProto3.hasOwnProperty;
function getFuncName(func) {
  var result = func.name + "", array = realNames_default[result], length = hasOwnProperty3.call(realNames_default, result) ? array.length : 0;
  while (length--) {
    var data = array[length], otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}
var getFuncName_default = getFuncName;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_LodashWrapper.js
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = void 0;
}
LodashWrapper.prototype = baseCreate_default(baseLodash_default.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;
var LodashWrapper_default = LodashWrapper;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_wrapperClone.js
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper_default) {
    return wrapper.clone();
  }
  var result = new LodashWrapper_default(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray_default(wrapper.__actions__);
  result.__index__ = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}
var wrapperClone_default = wrapperClone;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/wrapperLodash.js
var objectProto4 = Object.prototype;
var hasOwnProperty4 = objectProto4.hasOwnProperty;
function lodash(value) {
  if (isObjectLike_default(value) && !isArray_default(value) && !(value instanceof LazyWrapper_default)) {
    if (value instanceof LodashWrapper_default) {
      return value;
    }
    if (hasOwnProperty4.call(value, "__wrapped__")) {
      return wrapperClone_default(value);
    }
  }
  return new LodashWrapper_default(value);
}
lodash.prototype = baseLodash_default.prototype;
lodash.prototype.constructor = lodash;
var wrapperLodash_default = lodash;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_isLaziable.js
function isLaziable(func) {
  var funcName = getFuncName_default(func), other = wrapperLodash_default[funcName];
  if (typeof other != "function" || !(funcName in LazyWrapper_default.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData_default(other);
  return !!data && func === data[0];
}
var isLaziable_default = isLaziable;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setData.js
var setData = shortOut_default(baseSetData_default);
var setData_default = setData;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getWrapDetails.js
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/;
var reSplitDetails = /,? & /;
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}
var getWrapDetails_default = getWrapDetails;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_insertWrapDetails.js
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
  details = details.join(length > 2 ? ", " : " ");
  return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
}
var insertWrapDetails_default = insertWrapDetails;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_updateWrapDetails.js
var WRAP_BIND_FLAG2 = 1;
var WRAP_BIND_KEY_FLAG = 2;
var WRAP_CURRY_FLAG = 8;
var WRAP_CURRY_RIGHT_FLAG = 16;
var WRAP_PARTIAL_FLAG = 32;
var WRAP_PARTIAL_RIGHT_FLAG = 64;
var WRAP_ARY_FLAG = 128;
var WRAP_REARG_FLAG = 256;
var WRAP_FLIP_FLAG = 512;
var wrapFlags = [
  ["ary", WRAP_ARY_FLAG],
  ["bind", WRAP_BIND_FLAG2],
  ["bindKey", WRAP_BIND_KEY_FLAG],
  ["curry", WRAP_CURRY_FLAG],
  ["curryRight", WRAP_CURRY_RIGHT_FLAG],
  ["flip", WRAP_FLIP_FLAG],
  ["partial", WRAP_PARTIAL_FLAG],
  ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
  ["rearg", WRAP_REARG_FLAG]
];
function updateWrapDetails(details, bitmask) {
  arrayEach_default(wrapFlags, function(pair) {
    var value = "_." + pair[0];
    if (bitmask & pair[1] && !arrayIncludes_default(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}
var updateWrapDetails_default = updateWrapDetails;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setWrapToString.js
function setWrapToString(wrapper, reference, bitmask) {
  var source = reference + "";
  return setToString_default(wrapper, insertWrapDetails_default(source, updateWrapDetails_default(getWrapDetails_default(source), bitmask)));
}
var setWrapToString_default = setWrapToString;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createRecurry.js
var WRAP_BIND_FLAG3 = 1;
var WRAP_BIND_KEY_FLAG2 = 2;
var WRAP_CURRY_BOUND_FLAG = 4;
var WRAP_CURRY_FLAG2 = 8;
var WRAP_PARTIAL_FLAG2 = 32;
var WRAP_PARTIAL_RIGHT_FLAG2 = 64;
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & WRAP_CURRY_FLAG2, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
  bitmask |= isCurry ? WRAP_PARTIAL_FLAG2 : WRAP_PARTIAL_RIGHT_FLAG2;
  bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG2 : WRAP_PARTIAL_FLAG2);
  if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
    bitmask &= ~(WRAP_BIND_FLAG3 | WRAP_BIND_KEY_FLAG2);
  }
  var newData = [
    func,
    bitmask,
    thisArg,
    newPartials,
    newHolders,
    newPartialsRight,
    newHoldersRight,
    argPos,
    ary,
    arity
  ];
  var result = wrapFunc.apply(void 0, newData);
  if (isLaziable_default(func)) {
    setData_default(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString_default(result, func, bitmask);
}
var createRecurry_default = createRecurry;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_getHolder.js
function getHolder(func) {
  var object = func;
  return object.placeholder;
}
var getHolder_default = getHolder;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_reorder.js
var nativeMin = Math.min;
function reorder(array, indexes) {
  var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray_default(array);
  while (length--) {
    var index2 = indexes[length];
    array[length] = isIndex_default(index2, arrLength) ? oldArray[index2] : void 0;
  }
  return array;
}
var reorder_default = reorder;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_replaceHolders.js
var PLACEHOLDER = "__lodash_placeholder__";
function replaceHolders(array, placeholder) {
  var index2 = -1, length = array.length, resIndex = 0, result = [];
  while (++index2 < length) {
    var value = array[index2];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index2] = PLACEHOLDER;
      result[resIndex++] = index2;
    }
  }
  return result;
}
var replaceHolders_default = replaceHolders;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createHybrid.js
var WRAP_BIND_FLAG4 = 1;
var WRAP_BIND_KEY_FLAG3 = 2;
var WRAP_CURRY_FLAG3 = 8;
var WRAP_CURRY_RIGHT_FLAG2 = 16;
var WRAP_ARY_FLAG2 = 128;
var WRAP_FLIP_FLAG2 = 512;
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & WRAP_ARY_FLAG2, isBind = bitmask & WRAP_BIND_FLAG4, isBindKey = bitmask & WRAP_BIND_KEY_FLAG3, isCurried = bitmask & (WRAP_CURRY_FLAG3 | WRAP_CURRY_RIGHT_FLAG2), isFlip = bitmask & WRAP_FLIP_FLAG2, Ctor = isBindKey ? void 0 : createCtor_default(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index2 = length;
    while (index2--) {
      args[index2] = arguments[index2];
    }
    if (isCurried) {
      var placeholder = getHolder_default(wrapper), holdersCount = countHolders_default(args, placeholder);
    }
    if (partials) {
      args = composeArgs_default(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight_default(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders_default(args, placeholder);
      return createRecurry_default(
        func,
        bitmask,
        createHybrid,
        wrapper.placeholder,
        thisArg,
        args,
        newHolders,
        argPos,
        ary,
        arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
    length = args.length;
    if (argPos) {
      args = reorder_default(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root_default && this instanceof wrapper) {
      fn = Ctor || createCtor_default(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}
var createHybrid_default = createHybrid;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createCurry.js
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor_default(func);
  function wrapper() {
    var length = arguments.length, args = Array(length), index2 = length, placeholder = getHolder_default(wrapper);
    while (index2--) {
      args[index2] = arguments[index2];
    }
    var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders_default(args, placeholder);
    length -= holders.length;
    if (length < arity) {
      return createRecurry_default(
        func,
        bitmask,
        createHybrid_default,
        wrapper.placeholder,
        void 0,
        args,
        holders,
        void 0,
        void 0,
        arity - length
      );
    }
    var fn = this && this !== root_default && this instanceof wrapper ? Ctor : func;
    return apply_default(fn, this, args);
  }
  return wrapper;
}
var createCurry_default = createCurry;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createPartial.js
var WRAP_BIND_FLAG5 = 1;
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & WRAP_BIND_FLAG5, Ctor = createCtor_default(func);
  function wrapper() {
    var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root_default && this instanceof wrapper ? Ctor : func;
    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply_default(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}
var createPartial_default = createPartial;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_mergeData.js
var PLACEHOLDER2 = "__lodash_placeholder__";
var WRAP_BIND_FLAG6 = 1;
var WRAP_BIND_KEY_FLAG4 = 2;
var WRAP_CURRY_BOUND_FLAG2 = 4;
var WRAP_CURRY_FLAG4 = 8;
var WRAP_ARY_FLAG3 = 128;
var WRAP_REARG_FLAG2 = 256;
var nativeMin2 = Math.min;
function mergeData(data, source) {
  var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG6 | WRAP_BIND_KEY_FLAG4 | WRAP_ARY_FLAG3);
  var isCombo = srcBitmask == WRAP_ARY_FLAG3 && bitmask == WRAP_CURRY_FLAG4 || srcBitmask == WRAP_ARY_FLAG3 && bitmask == WRAP_REARG_FLAG2 && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG3 | WRAP_REARG_FLAG2) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG4;
  if (!(isCommon || isCombo)) {
    return data;
  }
  if (srcBitmask & WRAP_BIND_FLAG6) {
    data[2] = source[2];
    newBitmask |= bitmask & WRAP_BIND_FLAG6 ? 0 : WRAP_CURRY_BOUND_FLAG2;
  }
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs_default(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders_default(data[3], PLACEHOLDER2) : source[4];
  }
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight_default(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders_default(data[5], PLACEHOLDER2) : source[6];
  }
  value = source[7];
  if (value) {
    data[7] = value;
  }
  if (srcBitmask & WRAP_ARY_FLAG3) {
    data[8] = data[8] == null ? source[8] : nativeMin2(data[8], source[8]);
  }
  if (data[9] == null) {
    data[9] = source[9];
  }
  data[0] = source[0];
  data[1] = newBitmask;
  return data;
}
var mergeData_default = mergeData;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createWrap.js
var FUNC_ERROR_TEXT = "Expected a function";
var WRAP_BIND_FLAG7 = 1;
var WRAP_BIND_KEY_FLAG5 = 2;
var WRAP_CURRY_FLAG5 = 8;
var WRAP_CURRY_RIGHT_FLAG3 = 16;
var WRAP_PARTIAL_FLAG3 = 32;
var WRAP_PARTIAL_RIGHT_FLAG3 = 64;
var nativeMax5 = Math.max;
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & WRAP_BIND_KEY_FLAG5;
  if (!isBindKey && typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(WRAP_PARTIAL_FLAG3 | WRAP_PARTIAL_RIGHT_FLAG3);
    partials = holders = void 0;
  }
  ary = ary === void 0 ? ary : nativeMax5(toInteger_default(ary), 0);
  arity = arity === void 0 ? arity : toInteger_default(arity);
  length -= holders ? holders.length : 0;
  if (bitmask & WRAP_PARTIAL_RIGHT_FLAG3) {
    var partialsRight = partials, holdersRight = holders;
    partials = holders = void 0;
  }
  var data = isBindKey ? void 0 : getData_default(func);
  var newData = [
    func,
    bitmask,
    thisArg,
    partials,
    holders,
    partialsRight,
    holdersRight,
    argPos,
    ary,
    arity
  ];
  if (data) {
    mergeData_default(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func.length : nativeMax5(newData[9] - length, 0);
  if (!arity && bitmask & (WRAP_CURRY_FLAG5 | WRAP_CURRY_RIGHT_FLAG3)) {
    bitmask &= ~(WRAP_CURRY_FLAG5 | WRAP_CURRY_RIGHT_FLAG3);
  }
  if (!bitmask || bitmask == WRAP_BIND_FLAG7) {
    var result = createBind_default(func, bitmask, thisArg);
  } else if (bitmask == WRAP_CURRY_FLAG5 || bitmask == WRAP_CURRY_RIGHT_FLAG3) {
    result = createCurry_default(func, bitmask, arity);
  } else if ((bitmask == WRAP_PARTIAL_FLAG3 || bitmask == (WRAP_BIND_FLAG7 | WRAP_PARTIAL_FLAG3)) && !holders.length) {
    result = createPartial_default(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid_default.apply(void 0, newData);
  }
  var setter = data ? baseSetData_default : setData_default;
  return setWrapToString_default(setter(result, newData), func, bitmask);
}
var createWrap_default = createWrap;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/bind.js
var WRAP_BIND_FLAG8 = 1;
var WRAP_PARTIAL_FLAG4 = 32;
var bind = baseRest_default(function(func, thisArg, partials) {
  var bitmask = WRAP_BIND_FLAG8;
  if (partials.length) {
    var holders = replaceHolders_default(partials, getHolder_default(bind));
    bitmask |= WRAP_PARTIAL_FLAG4;
  }
  return createWrap_default(func, bitmask, thisArg, partials, holders);
});
bind.placeholder = {};
var bind_default = bind;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/maxBy.js
function maxBy(array, iteratee) {
  return array && array.length ? baseExtremum_default(array, baseIteratee_default(iteratee, 2), baseGt_default) : void 0;
}
var maxBy_default = maxBy;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_baseToPairs.js
function baseToPairs(object, props) {
  return arrayMap_default(props, function(key) {
    return [key, object[key]];
  });
}
var baseToPairs_default = baseToPairs;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_setToPairs.js
function setToPairs(set) {
  var index2 = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index2] = [value, value];
  });
  return result;
}
var setToPairs_default = setToPairs;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/_createToPairs.js
var mapTag = "[object Map]";
var setTag = "[object Set]";
function createToPairs(keysFunc) {
  return function(object) {
    var tag = getTag_default(object);
    if (tag == mapTag) {
      return mapToArray_default(object);
    }
    if (tag == setTag) {
      return setToPairs_default(object);
    }
    return baseToPairs_default(object, keysFunc(object));
  };
}
var createToPairs_default = createToPairs;

// ../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/toPairs.js
var toPairs = createToPairs_default(keys_default);
var toPairs_default = toPairs;

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/position/bk.js
function findType1Conflicts(g, layering) {
  const conflicts = {};
  function visitLayer(prevLayer, layer) {
    let k0 = 0;
    let scanPos = 0;
    const prevLayerLength = prevLayer.length;
    const lastNode = last_default(layer);
    forEach_default(layer, function(v, i) {
      const w = findOtherInnerSegmentNode(g, v);
      const k1 = w ? g.node(w).order : prevLayerLength;
      if (w || v === lastNode) {
        forEach_default(layer.slice(scanPos, i + 1), function(scanNode) {
          forEach_default(g.predecessors(scanNode), function(u) {
            const uLabel = g.node(u);
            const uPos = uLabel.order;
            if ((uPos < k0 || k1 < uPos) && !(uLabel.dummy && g.node(scanNode).dummy)) {
              addConflict(conflicts, u, scanNode);
            }
          });
        });
        scanPos = i + 1;
        k0 = k1;
      }
    });
    return layer;
  }
  reduce_default(layering, visitLayer);
  return conflicts;
}
function findType2Conflicts(g, layering) {
  const conflicts = {};
  function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
    let v;
    forEach_default(range_default(southPos, southEnd), function(i) {
      v = south[i];
      if (g.node(v).dummy) {
        forEach_default(g.predecessors(v), function(u) {
          const uNode = g.node(u);
          if (uNode.dummy && (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
            addConflict(conflicts, u, v);
          }
        });
      }
    });
  }
  function visitLayer(north, south) {
    let prevNorthPos = -1;
    let nextNorthPos;
    let southPos = 0;
    forEach_default(south, function(v, southLookahead) {
      if (g.node(v).dummy === "border") {
        const predecessors = g.predecessors(v);
        if (predecessors.length) {
          nextNorthPos = g.node(predecessors[0]).order;
          scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
          southPos = southLookahead;
          prevNorthPos = nextNorthPos;
        }
      }
      scan(south, southPos, south.length, nextNorthPos, north.length);
    });
    return south;
  }
  reduce_default(layering, visitLayer);
  return conflicts;
}
function findOtherInnerSegmentNode(g, v) {
  if (g.node(v).dummy) {
    return find_default(g.predecessors(v), function(u) {
      return g.node(u).dummy;
    });
  }
}
function addConflict(conflicts, v, w) {
  if (v > w) {
    const tmp = v;
    v = w;
    w = tmp;
  }
  let conflictsV = conflicts[v];
  if (!conflictsV) {
    conflicts[v] = conflictsV = {};
  }
  conflictsV[w] = true;
}
function hasConflict(conflicts, v, w) {
  if (v > w) {
    const tmp = v;
    v = w;
    w = tmp;
  }
  return has_default(conflicts[v], w);
}
function verticalAlignment(g, layering, conflicts, neighborFn) {
  const root = {};
  const align = {};
  const pos = {};
  forEach_default(layering, function(layer) {
    forEach_default(layer, function(v, order2) {
      root[v] = v;
      align[v] = v;
      pos[v] = order2;
    });
  });
  forEach_default(layering, function(layer) {
    let prevIdx = -1;
    forEach_default(layer, function(v) {
      let ws = neighborFn(v);
      if (ws.length) {
        ws = sortBy_default(ws, function(w) {
          return pos[w];
        });
        const mp = (ws.length - 1) / 2;
        for (let i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
          const w = ws[i];
          if (align[v] === v && prevIdx < pos[w] && !hasConflict(conflicts, v, w)) {
            align[w] = v;
            align[v] = root[v] = root[w];
            prevIdx = pos[w];
          }
        }
      }
    });
  });
  return {
    root,
    align
  };
}
function horizontalCompaction(g, layering, root, align, reverseSep) {
  const xs = {};
  const blockG = buildBlockGraph(g, layering, root, reverseSep);
  const visited = {};
  function pass1(v) {
    if (!has_default(visited, v)) {
      visited[v] = true;
      xs[v] = reduce_default(blockG.inEdges(v), function(max2, e) {
        pass1(e.v);
        return Math.max(max2, xs[e.v] + blockG.edge(e));
      }, 0);
    }
  }
  forEach_default(blockG.nodes(), pass1);
  const borderType = reverseSep ? "borderLeft" : "borderRight";
  function pass2(v) {
    if (visited[v] !== 2) {
      visited[v]++;
      const node = g.node(v);
      const min2 = reduce_default(blockG.outEdges(v), function(min3, e) {
        pass2(e.w);
        return Math.min(min3, xs[e.w] - blockG.edge(e));
      }, Number.POSITIVE_INFINITY);
      if (min2 !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
        xs[v] = Math.max(xs[v], min2);
      }
    }
  }
  forEach_default(blockG.nodes(), pass2);
  forEach_default(align, function(v) {
    xs[v] = xs[root[v]];
  });
  return xs;
}
function buildBlockGraph(g, layering, root, reverseSep) {
  const blockGraph = new Graph();
  const graphLabel = g.graph();
  const sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);
  forEach_default(layering, function(layer) {
    let u;
    forEach_default(layer, function(v) {
      const vRoot = root[v];
      blockGraph.setNode(vRoot);
      if (u) {
        const uRoot = root[u];
        const prevMax = blockGraph.edge(uRoot, vRoot);
        blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0));
      }
      u = v;
    });
  });
  return blockGraph;
}
function findSmallestWidthAlignment(g, xss) {
  return minBy_default(values_default(xss), function(xs) {
    const min2 = (minBy_default(toPairs_default(xs), (pair) => pair[1] - width(g, pair[0]) / 2) || ["k", 0])[1];
    const max2 = (maxBy_default(toPairs_default(xs), (pair) => pair[1] + width(g, pair[0]) / 2) || ["k", 0])[1];
    return max2 - min2;
  });
}
function alignCoordinates(xss, alignTo) {
  const alignToVals = values_default(alignTo);
  const alignToMin = min_default(alignToVals);
  const alignToMax = max_default(alignToVals);
  forEach_default(["u", "d"], function(vert) {
    forEach_default(["l", "r"], function(horiz) {
      const alignment = vert + horiz;
      const xs = xss[alignment];
      if (xs === alignTo) {
        return;
      }
      const xsVals = values_default(xs);
      const delta = horiz === "l" ? alignToMin - min_default(xsVals) : alignToMax - max_default(xsVals);
      if (delta) {
        xss[alignment] = mapValues_default(xs, function(x) {
          return x + delta;
        });
      }
    });
  });
}
function balance(xss, align) {
  return mapValues_default(xss.ul, function(ignore, v) {
    if (align) {
      return xss[align.toLowerCase()][v];
    } else {
      const xs = sortBy_default(map_default(xss, v));
      return (xs[1] + xs[2]) / 2;
    }
  });
}
function positionX(g) {
  const layering = util.buildLayerMatrix(g);
  const conflicts = merge_default(findType1Conflicts(g, layering), findType2Conflicts(g, layering));
  const xss = {};
  let adjustedLayering;
  forEach_default(["u", "d"], function(vert) {
    adjustedLayering = vert === "u" ? layering : values_default(layering).reverse();
    forEach_default(["l", "r"], function(horiz) {
      if (horiz === "r") {
        adjustedLayering = map_default(adjustedLayering, function(inner) {
          return values_default(inner).reverse();
        });
      }
      const neighborFn = bind_default(vert === "u" ? g.predecessors : g.successors, g);
      const align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
      let xs = horizontalCompaction(g, adjustedLayering, align.root, align.align, horiz === "r");
      if (horiz === "r") {
        xs = mapValues_default(xs, function(x) {
          return -x;
        });
      }
      xss[vert + horiz] = xs;
    });
  });
  const smallestWidth = findSmallestWidthAlignment(g, xss);
  alignCoordinates(xss, smallestWidth);
  return balance(xss, g.graph().align);
}
function sep(nodeSep, edgeSep, reverseSep) {
  return function(g, v, w) {
    const vLabel = g.node(v);
    const wLabel = g.node(w);
    let sum = 0;
    let delta;
    sum += vLabel.width / 2;
    if (has_default(vLabel, "labelpos")) {
      switch (vLabel.labelpos.toLowerCase()) {
        case "l":
          delta = -vLabel.width / 2;
          break;
        case "r":
          delta = vLabel.width / 2;
          break;
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;
    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;
    sum += wLabel.width / 2;
    if (has_default(wLabel, "labelpos")) {
      switch (wLabel.labelpos.toLowerCase()) {
        case "l":
          delta = wLabel.width / 2;
          break;
        case "r":
          delta = -wLabel.width / 2;
          break;
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;
    return sum;
  };
}
function width(g, v) {
  return g.node(v).width;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/position/index.js
function position(g) {
  g = util.asNonCompoundGraph(g);
  positionY(g);
  forEach_default(positionX(g), function(x, v) {
    g.node(v).x = x;
  });
}
function positionY(g) {
  const layering = util.buildLayerMatrix(g);
  const rankSep = g.graph().ranksep;
  let prevY = 0;
  forEach_default(layering, function(layer) {
    const maxHeight = max_default(map_default(layer, function(v) {
      return g.node(v).height;
    }));
    forEach_default(layer, function(v) {
      g.node(v).y = prevY + maxHeight / 2;
    });
    prevY += maxHeight + rankSep;
  });
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/layout.js
function layout(g, opts) {
  const time2 = opts && opts.debugTiming ? util.time : util.notime;
  time2("layout", function() {
    const layoutGraph = time2("  buildLayoutGraph", function() {
      return buildLayoutGraph(g);
    });
    time2("  runLayout", function() {
      runLayout(layoutGraph, time2);
    });
    time2("  updateInputGraph", function() {
      updateInputGraph(g, layoutGraph);
    });
  });
}
function runLayout(g, time2) {
  time2("    makeSpaceForEdgeLabels", function() {
    makeSpaceForEdgeLabels(g);
  });
  time2("    removeSelfEdges", function() {
    removeSelfEdges(g);
  });
  time2("    acyclic", function() {
    acyclic.run(g);
  });
  time2("    nestingGraph.run", function() {
    nestingGraph.run(g);
  });
  time2("    rank", function() {
    rank(util.asNonCompoundGraph(g));
  });
  time2("    injectEdgeLabelProxies", function() {
    injectEdgeLabelProxies(g);
  });
  time2("    removeEmptyRanks", function() {
    removeEmptyRanks(g);
  });
  time2("    nestingGraph.cleanup", function() {
    nestingGraph.cleanup(g);
  });
  time2("    normalizeRanks", function() {
    normalizeRanks(g);
  });
  time2("    assignRankMinMax", function() {
    assignRankMinMax(g);
  });
  time2("    removeEdgeLabelProxies", function() {
    removeEdgeLabelProxies(g);
  });
  time2("    normalize.run", function() {
    normalize.run(g);
  });
  time2("    parentDummyChains", function() {
    parentDummyChains(g);
  });
  time2("    addBorderSegments", function() {
    addBorderSegments(g);
  });
  time2("    order", function() {
    order(g);
  });
  time2("    insertSelfEdges", function() {
    insertSelfEdges(g);
  });
  time2("    adjustCoordinateSystem", function() {
    coordinateSystem.adjust(g);
  });
  time2("    position", function() {
    position(g);
  });
  time2("    positionSelfEdges", function() {
    positionSelfEdges(g);
  });
  time2("    removeBorderNodes", function() {
    removeBorderNodes(g);
  });
  time2("    normalize.undo", function() {
    normalize.undo(g);
  });
  time2("    fixupEdgeLabelCoords", function() {
    fixupEdgeLabelCoords(g);
  });
  time2("    undoCoordinateSystem", function() {
    coordinateSystem.undo(g);
  });
  time2("    translateGraph", function() {
    translateGraph(g);
  });
  time2("    assignNodeIntersects", function() {
    assignNodeIntersects(g);
  });
  time2("    reversePoints", function() {
    reversePointsForReversedEdges(g);
  });
  time2("    acyclic.undo", function() {
    acyclic.undo(g);
  });
}
function updateInputGraph(inputGraph, layoutGraph) {
  forEach_default(inputGraph.nodes(), function(v) {
    const inputLabel = inputGraph.node(v);
    const layoutLabel = layoutGraph.node(v);
    if (inputLabel) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;
      if (layoutGraph.children(v).length) {
        inputLabel.width = layoutLabel.width;
        inputLabel.height = layoutLabel.height;
      }
    }
  });
  forEach_default(inputGraph.edges(), function(e) {
    const inputLabel = inputGraph.edge(e);
    const layoutLabel = layoutGraph.edge(e);
    inputLabel.points = layoutLabel.points;
    if (has_default(layoutLabel, "x")) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;
    }
  });
  inputGraph.graph().width = layoutGraph.graph().width;
  inputGraph.graph().height = layoutGraph.graph().height;
}
var graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
var graphDefaults = {
  ranksep: 50,
  edgesep: 20,
  nodesep: 50,
  rankdir: "tb"
};
var graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
var nodeNumAttrs = ["width", "height"];
var nodeDefaults = {
  width: 0,
  height: 0
};
var edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"];
var edgeDefaults = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: "r"
};
var edgeAttrs = ["labelpos"];
function buildLayoutGraph(inputGraph) {
  const g = new Graph({
    multigraph: true,
    compound: true
  });
  const graph = canonicalize(inputGraph.graph());
  g.setGraph(merge_default({}, graphDefaults, selectNumberAttrs(graph, graphNumAttrs), pick_default(graph, graphAttrs)));
  forEach_default(inputGraph.nodes(), function(v) {
    const node = canonicalize(inputGraph.node(v));
    g.setNode(v, defaults_default(selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
    g.setParent(v, inputGraph.parent(v));
  });
  forEach_default(inputGraph.edges(), function(e) {
    const edge = canonicalize(inputGraph.edge(e));
    g.setEdge(e, merge_default({}, edgeDefaults, selectNumberAttrs(edge, edgeNumAttrs), pick_default(edge, edgeAttrs)));
  });
  return g;
}
function makeSpaceForEdgeLabels(g) {
  const graph = g.graph();
  graph.ranksep /= 2;
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    edge.minlen *= 2;
    if (edge.labelpos.toLowerCase() !== "c") {
      if (graph.rankdir === "TB" || graph.rankdir === "BT") {
        edge.width += edge.labeloffset;
      } else {
        edge.height += edge.labeloffset;
      }
    }
  });
}
function injectEdgeLabelProxies(g) {
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    if (edge.width && edge.height) {
      const v = g.node(e.v);
      const w = g.node(e.w);
      const label = {
        rank: (w.rank - v.rank) / 2 + v.rank,
        e
      };
      util.addDummyNode(g, "edge-proxy", label, "_ep");
    }
  });
}
function assignRankMinMax(g) {
  let maxRank2 = 0;
  forEach_default(g.nodes(), function(v) {
    const node = g.node(v);
    if (node.borderTop) {
      node.minRank = g.node(node.borderTop).rank;
      node.maxRank = g.node(node.borderBottom).rank;
      maxRank2 = Math.max(maxRank2, node.maxRank);
    }
  });
  g.graph().maxRank = maxRank2;
}
function removeEdgeLabelProxies(g) {
  forEach_default(g.nodes(), function(v) {
    const node = g.node(v);
    if (node.dummy === "edge-proxy") {
      g.edge(node.e).labelRank = node.rank;
      g.removeNode(v);
    }
  });
}
function translateGraph(g) {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = 0;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = 0;
  const graphLabel = g.graph();
  const marginX = graphLabel.marginx || 0;
  const marginY = graphLabel.marginy || 0;
  function getExtremes(attrs) {
    const x = attrs.x;
    const y = attrs.y;
    const w = attrs.width;
    const h = attrs.height;
    minX = Math.min(minX, x - w / 2);
    maxX = Math.max(maxX, x + w / 2);
    minY = Math.min(minY, y - h / 2);
    maxY = Math.max(maxY, y + h / 2);
  }
  forEach_default(g.nodes(), function(v) {
    getExtremes(g.node(v));
  });
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    if (has_default(edge, "x")) {
      getExtremes(edge);
    }
  });
  minX -= marginX;
  minY -= marginY;
  forEach_default(g.nodes(), function(v) {
    const node = g.node(v);
    node.x -= minX;
    node.y -= minY;
  });
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    forEach_default(edge.points, function(p) {
      p.x -= minX;
      p.y -= minY;
    });
    if (has_default(edge, "x")) {
      edge.x -= minX;
    }
    if (has_default(edge, "y")) {
      edge.y -= minY;
    }
  });
  graphLabel.width = maxX - minX + marginX;
  graphLabel.height = maxY - minY + marginY;
}
function assignNodeIntersects(g) {
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    const nodeV = g.node(e.v);
    const nodeW = g.node(e.w);
    let p1 = null;
    let p2 = null;
    if (!edge.points) {
      edge.points = [];
      p1 = nodeW;
      p2 = nodeV;
    } else {
      p1 = edge.points[0];
      p2 = edge.points[edge.points.length - 1];
    }
    edge.points.unshift(util.intersectRect(nodeV, p1));
    edge.points.push(util.intersectRect(nodeW, p2));
  });
}
function fixupEdgeLabelCoords(g) {
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    if (has_default(edge, "x")) {
      if (edge.labelpos === "l" || edge.labelpos === "r") {
        edge.width -= edge.labeloffset;
      }
      switch (edge.labelpos) {
        case "l":
          edge.x -= edge.width / 2 + edge.labeloffset;
          break;
        case "r":
          edge.x += edge.width / 2 + edge.labeloffset;
          break;
      }
    }
  });
}
function reversePointsForReversedEdges(g) {
  forEach_default(g.edges(), function(e) {
    const edge = g.edge(e);
    if (edge.reversed) {
      edge.points.reverse();
    }
  });
}
function removeBorderNodes(g) {
  forEach_default(g.nodes(), function(v) {
    if (g.children(v).length) {
      const node = g.node(v);
      const t = g.node(node.borderTop);
      const b = g.node(node.borderBottom);
      const l = g.node(last_default(node.borderLeft));
      const r = g.node(last_default(node.borderRight));
      node.width = Math.abs(r.x - l.x);
      node.height = Math.abs(b.y - t.y);
      node.x = l.x + node.width / 2;
      node.y = t.y + node.height / 2;
    }
  });
  forEach_default(g.nodes(), function(v) {
    if (g.node(v).dummy === "border") {
      g.removeNode(v);
    }
  });
}
function removeSelfEdges(g) {
  forEach_default(g.edges(), function(e) {
    if (e.v === e.w) {
      const node = g.node(e.v);
      if (!node.selfEdges) {
        node.selfEdges = [];
      }
      node.selfEdges.push({
        e,
        label: g.edge(e)
      });
      g.removeEdge(e);
    }
  });
}
function insertSelfEdges(g) {
  const layers = util.buildLayerMatrix(g);
  forEach_default(layers, function(layer) {
    let orderShift = 0;
    forEach_default(layer, function(v, i) {
      const node = g.node(v);
      node.order = i + orderShift;
      forEach_default(node.selfEdges, function(selfEdge) {
        util.addDummyNode(g, "selfedge", {
          width: selfEdge.label.width,
          height: selfEdge.label.height,
          rank: node.rank,
          order: i + ++orderShift,
          e: selfEdge.e,
          label: selfEdge.label
        }, "_se");
      });
      delete node.selfEdges;
    });
  });
}
function positionSelfEdges(g) {
  forEach_default(g.nodes(), function(v) {
    const node = g.node(v);
    if (node.dummy === "selfedge") {
      const selfNode = g.node(node.e.v);
      const x = selfNode.x + selfNode.width / 2;
      const y = selfNode.y;
      const dx = node.x - x;
      const dy = selfNode.height / 2;
      g.setEdge(node.e, node.label);
      g.removeNode(v);
      node.label.points = [{
        x: x + 2 * dx / 3,
        y: y - dy
      }, {
        x: x + 5 * dx / 6,
        y: y - dy
      }, {
        x: x + dx,
        y
      }, {
        x: x + 5 * dx / 6,
        y: y + dy
      }, {
        x: x + 2 * dx / 3,
        y: y + dy
      }];
      node.label.x = node.x;
      node.label.y = node.y;
    }
  });
}
function selectNumberAttrs(obj, attrs) {
  return mapValues_default(pick_default(obj, attrs), Number);
}
function canonicalize(attrs) {
  const newAttrs = {};
  forEach_default(attrs, function(v, k) {
    newAttrs[k.toLowerCase()] = v;
  });
  return newAttrs;
}

// ../../node_modules/.pnpm/@unovis+dagre-layout@0.8.8-2/node_modules/@unovis/dagre-layout/dist/index.js
var layout2 = layout;
var index = {
  layout
};
export {
  index as default,
  layout2 as layout
};
//# sourceMappingURL=dist-MD5T5APL.js.map
