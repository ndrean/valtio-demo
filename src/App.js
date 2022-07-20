//import { specialCharMap } from '@testing-library/user-event/dist/keyboard';
import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import './index.css';
//import { idxStore, commentStore, commentsUsers, textStore } from './state';
import {
  idxStore,
  textStore,
  commentStore,
  commentsUsers,
  fetchComments,
} from './state';

/*
import { EditPerson, ViewPerson } from "./personComponent";
import personState from "./personState";
*/

const Counter = ({ store }) => {
  let { index } = useSnapshot(store);
  return (
    <>
      <p>
        You can mutate the state. Rule: no snap in callback, but state. This
        will render
      </p>
      <p>
        <button onClick={store.increment} disabled={store.index > 8}>
          Increment
        </button>{' '}
        {index}{' '}
        <button onClick={() => --store.index} disabled={store.index < 2}>
          decrement
        </button>
      </p>
    </>
  );
};

const Text = ({ store }) => {
  const { text } = useSnapshot(store);
  return (
    <p>
      <input value={text} onChange={(e) => (store.text = e.target.value)} />{' '}
      {text}
    </p>
  );
};

// eslint-disable-next-line react/prop-types
const Component0 = ({ index, text }) => (
  <>
    <hr />
    <p>C0: no snap, no rendering, just initial state</p>
    <pre>
      {JSON.stringify(index)} {JSON.stringify(text)}
    </pre>
  </>
);

// eslint-disable-next-line react/prop-types
const Component1 = ({ index, text }) => {
  const snapIndex = useSnapshot(index);
  const snapText = useSnapshot(text);
  return (
    <>
      <hr />
      <p>C1: snapped: rendered on every state update</p>
      <pre>
        {' '}
        C1-snap: {JSON.stringify(snapIndex)} {JSON.stringify(snapText)}{' '}
      </pre>
    </>
  );
};

const capitalize = (t) => t.toUpperCase();

const Component2 = ({ idx, txt }) => {
  const { index } = useSnapshot(idx);
  const { text } = useSnapshot(txt);
  const double = (id) => id * 2;

  const newSnap = { index: double(index), text: capitalize(text) };
  return (
    <>
      <hr />
      <p>C2: Computed Action on the snap in the render (state unchanged)</p>
      <pre>
        Render actions with snap.action IN render ONLY
        {JSON.stringify(newSnap)}
      </pre>
    </>
  );
};

const Component3 = ({ index, text }) => {
  const snapIndex = useSnapshot(index);
  const snapText = useSnapshot(text);

  const action = () => {
    text.setCapitalizedText();
    index.tripleCount();
  };

  return (
    <>
      <hr />
      <p>
        C3: Mutations on state, not on snap!{' '}
        <button onClick={action}>Update state</button>
      </p>

      <pre>Render snap:{JSON.stringify(snapIndex, snapText)}</pre>
    </>
  );
};

const Fetch = ({ storeComments, idxStore }) => {
  const { comments } = useSnapshot(storeComments);

  const handleClick = () => storeComments.setComments();
  const handleReset = () => (idxStore.index = 1);

  const { index } = useSnapshot(idxStore);
  const [users, setUsers] = React.useState([]);
  useEffect(() => {
    const getUsers = async (id) => {
      const list = await fetchComments(id);
      return setUsers(list?.map((c) => c.email));
    };
    getUsers(index);
  }, [index]);

  //console.log(index);
  return (
    <>
      <hr />
      <button onClick={handleReset}>Reset index</button>
      <p>
        Click on increment index to get new comments
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

const Component4 = ({ store }) => {
  const { live } = useSnapshot(store);
  return (
    <>
      <p>
        Async update on action increment outside of a component without
        useEffect using derive:
      </p>
      <pre>{JSON.stringify(live)}</pre>
    </>
  );
};

const App = () => (
  <>
    <Counter store={idxStore} />
    <Text store={textStore} />
    <Component0 index={idxStore} text={textStore} />
    <Component1 index={idxStore} text={textStore} />
    <Component2 idx={idxStore} txt={textStore} />

    <Component3 index={idxStore} text={textStore} />
    <hr />
    <Counter store={idxStore} />
    <Fetch storeComments={commentStore} idxStore={idxStore} />
    <React.Suspense fallback={null}>
      <Component4 store={commentsUsers} />
    </React.Suspense>
    <hr />

    {/*}
    <EditPerson store={personState} />
    <ViewPerson store={personState} />
    */}
  </>
);

export default App;
