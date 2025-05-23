"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  RemoveSubscribe: () => RemoveSubscribe,
  SUSPENSE: () => import_core6.SUSPENSE,
  Subscribe: () => Subscribe,
  bind: () => bind,
  liftSuspense: () => import_core6.liftSuspense,
  shareLatest: () => shareLatest,
  sinkSuspense: () => import_core6.sinkSuspense,
  state: () => state3,
  useStateObservable: () => useStateObservable,
  withDefault: () => import_core6.withDefault
});
module.exports = __toCommonJS(index_exports);
var import_core6 = require("@rx-state/core");

// src/internal/empty-value.ts
var EMPTY_VALUE = {};

// src/bind/connectFactoryObservable.ts
var import_core = require("@rx-state/core");
function connectFactoryObservable(getObservable, defaultValue) {
  const args = defaultValue === EMPTY_VALUE ? [getObservable] : [getObservable, defaultValue];
  const obs = (0, import_core.state)(...args);
  return [
    (...input) => useStateObservable(obs(...input)),
    obs
  ];
}

// src/bind/connectObservable.ts
var import_core2 = require("@rx-state/core");
function connectObservable(observable, defaultValue) {
  const sharedObservable$ = defaultValue === EMPTY_VALUE ? (0, import_core2.state)(observable) : (0, import_core2.state)(observable, defaultValue);
  const useStaticObservable = () => useStateObservable(sharedObservable$);
  return [useStaticObservable, sharedObservable$];
}

// src/bind/index.ts
function bind(observable, defaultValue) {
  return (typeof observable === "function" ? connectFactoryObservable : connectObservable)(observable, arguments.length > 1 ? defaultValue : EMPTY_VALUE);
}

// src/shareLatest.ts
var import_rxjs = require("rxjs");
var shareLatest = () => (0, import_rxjs.share)({
  connector: () => new import_rxjs.ReplaySubject(1),
  resetOnError: true,
  resetOnComplete: true,
  resetOnRefCountZero: true
});

// src/stateJsx.tsx
var import_core5 = require("@rx-state/core");
var import_react3 = require("react");

// src/useStateObservable.ts
var import_core4 = require("@rx-state/core");
var import_react2 = require("react");

// src/Subscribe.tsx
var import_react = __toESM(require("react"));
var import_rxjs2 = require("rxjs");
var import_core3 = require("@rx-state/core");
var SubscriptionContext = (0, import_react.createContext)(null);
var { Provider } = SubscriptionContext;
var useSubscription = () => (0, import_react.useContext)(SubscriptionContext);
var p = Promise.resolve();
var Throw = () => {
  throw p;
};
var Subscribe = ({ source$, children, fallback }) => {
  const subscriptionRef = (0, import_react.useRef)(void 0);
  if (!subscriptionRef.current) {
    const s = new import_rxjs2.Subscription();
    subscriptionRef.current = {
      s,
      u: (src) => {
        let error = EMPTY_VALUE;
        let synchronous = true;
        s.add(
          (0, import_core3.liftSuspense)()(src).subscribe({
            error: (e) => {
              if (synchronous) {
                error = e;
                return;
              }
              setSubscribedSource(() => {
                throw e;
              });
            }
          })
        );
        synchronous = false;
        if (error !== EMPTY_VALUE) {
          throw error;
        }
      }
    };
  }
  const [subscribedSource, setSubscribedSource] = (0, import_react.useState)(null);
  if (subscribedSource !== null && subscribedSource !== source$) {
    if (source$ === void 0) {
      setSubscribedSource(source$);
    } else {
      try {
        ;
        source$.getValue();
        setSubscribedSource(source$);
      } catch (e) {
      }
    }
  }
  (0, import_react.useEffect)(() => {
    setSubscribedSource(source$);
    if (!source$) return;
    const subscription = (0, import_core3.liftSuspense)()(source$).subscribe({
      error: (e) => setSubscribedSource(() => {
        throw e;
      })
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [source$]);
  (0, import_react.useEffect)(() => {
    return () => {
      var _a;
      (_a = subscriptionRef.current) == null ? void 0 : _a.s.unsubscribe();
      subscriptionRef.current = void 0;
    };
  }, []);
  const actualChildren = subscribedSource === source$ ? /* @__PURE__ */ import_react.default.createElement(Provider, { value: subscriptionRef.current.u }, children) : fallback === void 0 ? null : /* @__PURE__ */ import_react.default.createElement(Throw, null);
  return fallback === void 0 ? actualChildren : subscribedSource === null ? fallback : /* @__PURE__ */ import_react.default.createElement(import_react.Suspense, { fallback }, actualChildren);
};
var RemoveSubscribe = ({ children }) => /* @__PURE__ */ import_react.default.createElement(Provider, { value: null }, children);

// src/useStateObservable.ts
var useStateObservable = (source$) => {
  const subscription = useSubscription();
  const [, setError] = (0, import_react2.useState)();
  const callbackRef = (0, import_react2.useRef)(void 0);
  if (!callbackRef.current) {
    const getValue = (src) => {
      const result = src.getValue();
      if (result instanceof import_core4.StatePromise)
        throw result.catch((e) => {
          if (e instanceof import_core4.NoSubscribersError) return e;
          throw e;
        });
      return result;
    };
    const gv = () => {
      const src = callbackRef.current.source$;
      if (!src.getRefCount() && !src.getDefaultValue) {
        if (!subscription) throw new Error("Missing Subscribe!");
        subscription(src);
      }
      return getValue(src);
    };
    callbackRef.current = {
      source$: null,
      args: [, gv, gv]
    };
  }
  const ref = callbackRef.current;
  if (ref.source$ !== source$) {
    ref.source$ = source$;
    ref.args[0] = (next) => {
      const subscription2 = (0, import_core4.liftSuspense)()(source$).subscribe({
        next,
        error: (e) => {
          setError(() => {
            throw e;
          });
        }
      });
      return () => {
        subscription2.unsubscribe();
      };
    };
  }
  return (0, import_react2.useSyncExternalStore)(...ref.args);
};

// src/stateJsx.tsx
var state3 = (...args) => {
  const result = (0, import_core5.state)(...args);
  if (typeof result === "function") {
    return (...args2) => enhanceState(result(...args2));
  }
  return enhanceState(result);
};
var cache = /* @__PURE__ */ new WeakMap();
function enhanceState(state$) {
  if (!cache.has(state$))
    cache.set(
      state$,
      (0, import_react3.createElement)(() => useStateObservable(state$), {})
    );
  const originalPipeState = state$.pipeState.bind(state$);
  return Object.assign(state$, cache.get(state$), {
    pipeState: (...operators) => enhanceState(originalPipeState(...operators))
  });
}
//# sourceMappingURL=core.cjs.development.js.map
