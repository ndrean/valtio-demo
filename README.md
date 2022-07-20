# Getting Started with Create React App

I want to stick to the minimum Valio patterns as possible, and no `this`:  so `proxy`, `useSnapshot`, and possibly `derive` for fine-graining should be enough most use cases I believe.
The rule: "read from snapshots in the render function, otherwise use the source proxy"

Do I understand correctly is I say:

- if you don't modify the state within a component, then the rule: "snap the state and return from the snap". You can use simple functions or a custom hook in case you want to modifiy the snap, and return.
- if you want a sync state mutation, then define an action on the proxy of the state (no `this`), not on the snap. Then the rule.
- if you call an async action, then you would traditionally the combo `useState`+ `useEffect`. It is equivalent to a derived proxy.  Use the rule with the derived proxy and `suspend`** the component that consumed it. Suspending is not mandatory with `useEffect`.
