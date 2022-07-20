//import { specialCharMap } from '@testing-library/user-event/dist/keyboard';
import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import './index.css';
//import { store, commentStore, commentsUsers, textStore } from './state';
import { store, commentStore, users, fetchComments } from './state';

const Counter = ({ store }) => {
  const {
    index: { value },
    text,
  } = useSnapshot(store);

  return (
    <>
      <p>
        You can mutate the state. Rule: no snap in callback, but state. This
        will render
      </p>
      <p>
        <button onClick={store.increment} disabled={store.index.value > 8}>
          Increment
        </button>{' '}
        {value}
        <button
          onClick={() => --store.index.value}
          disabled={store.index.value < 2}
        >
          decrement
        </button>
      </p>
      <p>
        <input value={text} onChange={(e) => (store.text = e.target.value)} />{' '}
        {text}
      </p>
    </>
  );
};

const Component0 = ({ store }) => (
  <>
    <hr />
    <p>C0: no snap, no rendering, just initial state</p>
    <pre>{JSON.stringify(store)}</pre>
  </>
);

// eslint-disable-next-line react/prop-types
const Component1 = ({ store }) => {
  const snap = useSnapshot(store);
  return (
    <>
      <hr />
      <p>C1: snapped: rendered on every state update</p>
      <pre> C1-snap: {JSON.stringify(snap)}</pre>
    </>
  );
};

const capitalize = (t) => t.toUpperCase();

const useTriple = (store) => {
  const {
    index: { value },
  } = useSnapshot(store);
  console.log(value * 3);
  return value * 3;
};

const Component2 = ({ store }) => {
  const { index, text } = useSnapshot(store);

  const double = (id) => id * 2;
  const triple = useTriple(store);

  const newSnap = { index: double(index.value), text: capitalize(text) };
  return (
    <>
      <hr />
      <p>C2: Computed Action on the snap in the render (state unchanged)</p>
      <pre>
        Render actions with snap.action IN render ONLY
        {JSON.stringify(newSnap)}
      </pre>
      <pre>{JSON.stringify({ triple })}</pre>
    </>
  );
};

const Component3 = ({ store }) => {
  const snap = useSnapshot(store);

  const action = () => {
    store.setCapitalizedText();
    store.tripleCount();
  };

  return (
    <>
      <hr />
      <p>
        C3: Mutations on state, not on snap!{' '}
        <button onClick={action}>Update state</button>
      </p>

      <pre>Render snap:{JSON.stringify(snap)}</pre>
    </>
  );
};

const Fetch = ({ commentStore, store }) => {
  const { comments } = useSnapshot(commentStore);

  const handleClick = () => commentStore.setComments();
  const handleReset = () => (store.index.value = 1);

  const {
    index: { value },
  } = useSnapshot(store);

  const [users, setUsers] = React.useState([]);
  useEffect(() => {
    const getUsers = async (id) => {
      const list = await fetchComments(id);
      return setUsers(list?.map((c) => c.email));
    };
    getUsers(value);
  }, [value]);

  return (
    <>
      <hr />
      <button onClick={handleReset}>Reset index</button>
      <p>
        Click on increment index to get the comments(:id)
        <button onClick={handleClick}>get comments(:id)</button>{' '}
      </p>
      <p>
        Async update on internal component action get comments without useState
        or useEffect
      </p>
      <p>Comments change on click: </p>
      <pre>{JSON.stringify(comments?.map((c) => c.email))}</pre>
      <p>Comments via UseEffect</p>
      <pre>{JSON.stringify(users)}</pre>
    </>
  );
};

const Component4 = ({ users }) => {
  const { derUsers } = useSnapshot(users);
  return (
    <>
      <p>
        Async update on action increment outside of a component without
        useEffect using derive:
      </p>
      <pre>{JSON.stringify(derUsers)}</pre>
    </>
  );
};

const App = () => (
  <>
    <Counter store={store} />
    <Component0 store={store} />
    <Component1 store={store} />
    <Component2 store={store} />

    <Component3 store={store} />
    <hr />
    <Counter store={store} />
    <Fetch commentStore={commentStore} store={store} />
    <React.Suspense fallback={null}>
      <Component4 users={users} />
    </React.Suspense>
    <hr />
  </>
);

export default App;
