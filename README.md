# Demo Valtio

## Rules

Wrap the state with `proxy` and pass it to `useSnapshot` within a component.

Rule 1: read only from snap to be reactive, and write only to the state
Rule 2: in particular, in callbacks, use state, not snaps.

## Tips

If you want to display a modified reactive state but not persist this state, you can simply pass the snap in a function. It can also be a custom hook, inside or outside of the component. See examples below.

Don't modify the state within a component but the state. For example, in callback, use state.

If you want a sync state mutation, then define an action on the proxy of the state (no `this`), not on the snap. Then the rules.

If you call an async action, then you would traditionally the combo `useState`+ `useEffect`. It is equivalent to a derived proxy.  Use the rule with the derived proxy and **`suspend`** the component that consumed it. Note that suspending is not mandatory with `useEffect`.

## Examples

1.Wrap the state with `proxy` and make an immutable object from it with `useSnapshot`

```js
const store = proxy({index: 1})
```

2.Read/return from `snap`, mutate/write from `proxy`.

```js

const useTriple = (store) => {
  const {index} = useSnapshot(store)
  return index * 3
}

const Component = () => {
  const snap = useSnapshot(store)
  const triple = useTriple(store)

  const double = n => n * 2
  return(
    <>
      <button onClick={e => store.index = e.target.value}>Increment</button>
      {JSON.stringify(snap)} 
      {/* => {index: 1} */}
      {JSON.stringify({double: double(snap.index)})}
      {/* => {double: 2} */}
      {JSON.stringify({triple})}
       {/* => {triple: 3} */}
    </>
  )
}
```

3. `derive` can replace `useState` & `useEffect`

We retrieve data from an API:

```js
export const fetchComments = async (id) => {
  const data = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  return data.json();
};
```

Let our state be:

 ```js
 const store = proxy({index: 1, text: "hi"})
 const commentStore = proxy({comments: []})
 ```

We can populate a component with using `useState` and `useEffect`:

```js
const ComponentUseEffect = () => {
  const { comments } = useSnapshot(commentStore);
  const {index} = useSnapshot(store);

  const [users, setUsers] = React.useState([]);

  useEffect(() => {
    const getUsers = async (id) => {
      const list = await fetchComments(id);
      return setUsers(list?.map((c) => c.email));
    };
    getUsers(index);
  }, [index]);

  return <><pre>{JSON.stringify(users)}</pre></>
};
```

We can do the same with a derived proxy:

```js
export const users = derive({
  derUsers: async (get) => {
    const list = await fetchComments(get(store).index);
    return list?.map((c) => c.email);
  },
});
```

and use it in the component:

```js
const ComponentDerive = ({store}) => {
  const { derUsers } = useSnapshot(users);
  return <><pre>{JSON.stringify(derUsers)}</pre></>
};
```

and:

```js
root.render(
  <>
<ComponentUseEffect store={store} commentStore={commentStore}>

<Suspense fallback={"Loading..."}>
  <ComponentDerive store={users}/>
</Suspense>
</>
)
```

4. Gotcha: atomize the state

With we use the state above, `{index: 1, text: "hi"}`, and build a derivation from it, then any change on `index` or `text` will make the component render.

If we atomize further, and use  `{index: {value: 1}, text: "hi"}` instead, then we can segregate the effects. A change in `text` will not make the derivation render because we could fine-grain with `get`.

```js
export const users = derive({
  derUsers: async (get) => {
    const list = await fetchComments(get(store.index).value);
    return list?.map((c) => c.email);
  },
});
