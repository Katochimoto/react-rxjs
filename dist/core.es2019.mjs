// src/index.tsx
import {
  liftSuspense as liftSuspense3,
  sinkSuspense,
  SUSPENSE as SUSPENSE3,
  withDefault
} from "@rx-state/core";

// src/internal/empty-value.ts
var EMPTY_VALUE = {};

// src/bind/connectFactoryObservable.ts
import { state } from "@rx-state/core";
function connectFactoryObservable(getObservable, defaultValue) {
  const args = defaultValue === EMPTY_VALUE ? [getObservable] : [getObservable, defaultValue];
  const obs = state(...args);
  return [
    (...input) => useStateObservable(obs(...input)),
    obs
  ];
}

// src/bind/connectObservable.ts
import { state as state2 } from "@rx-state/core";
function connectObservable(observable, defaultValue) {
  const sharedObservable$ = defaultValue === EMPTY_VALUE ? state2(observable) : state2(observable, defaultValue);
  const useStaticObservable = () => useStateObservable(sharedObservable$);
  return [useStaticObservable, sharedObservable$];
}

// src/bind/index.ts
function bind(observable, defaultValue) {
  return (typeof observable === "function" ? connectFactoryObservable : connectObservable)(observable, arguments.length > 1 ? defaultValue : EMPTY_VALUE);
}

// src/shareLatest.ts
import { ReplaySubject, share } from "rxjs";
var shareLatest = () => share({
  connector: () => new ReplaySubject(1),
  resetOnError: true,
  resetOnComplete: true,
  resetOnRefCountZero: true
});

// src/stateJsx.tsx
import { state as coreState } from "@rx-state/core";
import { createElement } from "react";

// src/useStateObservable.ts
import {
  liftSuspense as liftSuspense2,
  NoSubscribersError,
  StatePromise
} from "@rx-state/core";
import { useRef as useRef2, useState as useState2, useSyncExternalStore } from "react";

// src/Subscribe.tsx
import React, {
  useState,
  Suspense,
  useEffect,
  useRef,
  createContext,
  useContext
} from "react";
import { Subscription } from "rxjs";
import { liftSuspense } from "@rx-state/core";
var SubscriptionContext = createContext(null);
var { Provider } = SubscriptionContext;
var useSubscription = () => useContext(SubscriptionContext);
var p = Promise.resolve();
var Throw = () => {
  throw p;
};
var Subscribe = ({ source$, children, fallback }) => {
  const subscriptionRef = useRef(void 0);
  if (!subscriptionRef.current) {
    const s = new Subscription();
    subscriptionRef.current = {
      s,
      u: (src) => {
        let error = EMPTY_VALUE;
        let synchronous = true;
        s.add(
          liftSuspense()(src).subscribe({
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
  const [subscribedSource, setSubscribedSource] = useState(null);
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
  useEffect(() => {
    setSubscribedSource(source$);
    if (!source$) return;
    const subscription = liftSuspense()(source$).subscribe({
      error: (e) => setSubscribedSource(() => {
        throw e;
      })
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [source$]);
  useEffect(() => {
    return () => {
      var _a;
      (_a = subscriptionRef.current) == null ? void 0 : _a.s.unsubscribe();
      subscriptionRef.current = void 0;
    };
  }, []);
  const actualChildren = subscribedSource === source$ ? /* @__PURE__ */ React.createElement(Provider, { value: subscriptionRef.current.u }, children) : fallback === void 0 ? null : /* @__PURE__ */ React.createElement(Throw, null);
  return fallback === void 0 ? actualChildren : subscribedSource === null ? fallback : /* @__PURE__ */ React.createElement(Suspense, { fallback }, actualChildren);
};
var RemoveSubscribe = ({ children }) => /* @__PURE__ */ React.createElement(Provider, { value: null }, children);

// src/useStateObservable.ts
var useStateObservable = (source$) => {
  const subscription = useSubscription();
  const [, setError] = useState2();
  const callbackRef = useRef2(void 0);
  if (!callbackRef.current) {
    const getValue = (src) => {
      const result = src.getValue();
      if (result instanceof StatePromise)
        throw result.catch((e) => {
          if (e instanceof NoSubscribersError) return e;
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
      const subscription2 = liftSuspense2()(source$).subscribe({
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
  return useSyncExternalStore(...ref.args);
};

// src/stateJsx.tsx
var state3 = (...args) => {
  const result = coreState(...args);
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
      createElement(() => useStateObservable(state$), {})
    );
  const originalPipeState = state$.pipeState.bind(state$);
  return Object.assign(state$, cache.get(state$), {
    pipeState: (...operators) => enhanceState(originalPipeState(...operators))
  });
}
export {
  RemoveSubscribe,
  SUSPENSE3 as SUSPENSE,
  Subscribe,
  bind,
  liftSuspense3 as liftSuspense,
  shareLatest,
  sinkSuspense,
  state3 as state,
  useStateObservable,
  withDefault
};
//# sourceMappingURL=core.es2019.mjs.map
