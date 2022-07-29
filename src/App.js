import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

import './index.css';
import { store, commentStore, users, fetchComments } from './state';
// SSE

const Counter = ({ store }) => {
  const {
    index: { value },
    text,
  } = useSnapshot(store);

  return (
    <>
      <p> We modify below the two components of the state:</p>
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
        <input
          aria-label='text'
          value={text}
          onChange={(e) => (store.text = e.target.value)}
        />{' '}
        {text}
      </p>
    </>
  );
};

const Component0 = ({ store }) => (
  <>
    <hr />
    <p>
      C0: We are <strong>reading from state</strong>, a mutable object, so this
      is <strong>not</strong> reactive
    </p>
    <pre>{JSON.stringify(store)}</pre>
  </>
);

// eslint-disable-next-line react/prop-types
const Component1 = ({ store }) => {
  const snap = useSnapshot(store);
  return (
    <>
      <hr />
      <p>
        C1: we are <strong>reading from snap</strong>, an immutable object. This
        will render any change in both props
      </p>
      <pre> C1-snap: {JSON.stringify(snap)}</pre>
    </>
  );
};

const Component11 = ({ store }) => {
  const {
    index: { value },
  } = useSnapshot(store);
  return (
    <>
      <p>
        The component below only snaps one prop from state, the value. It will
        not render changes on text (use React dev tools)
      </p>
      <button
        onClick={() => ++store.index.value}
        disabled={store.index.value > 8}
      >
        Increment
      </button>
      {value}
    </>
  );
};

const Component12 = ({ store }) => {
  const { text } = useSnapshot(store);
  return (
    <>
      <p>
        This component only snaps one prop from state, the text. It will not
        render changes on <strong>value</strong> (use react dev tools).
      </p>
      <input
        aria-label='text'
        value={text}
        onChange={(e) => (store.text = e.target.value)}
      />{' '}
      {text}
    </>
  );
};

const capitalize = (t) => t.toUpperCase();

const useDouble = (store) => {
  const {
    index: { value },
  } = useSnapshot(store);
  return value * 2;
};

const Component2 = ({ store }) => {
  const { index, text } = useSnapshot(store);

  const double = (id) => id * 2;
  const doubled = useDouble(store);

  const newSnap = {
    doubleSimpleFunction: double(index.value),
    capitalized: capitalize(text),
  };
  return (
    <>
      <hr />
      <p>C2: we want to render computed values</p>
      <p>
        We use a function to compute new values from the snap and render them:
      </p>
      <pre>{JSON.stringify(newSnap)}</pre>
      <p>We can use a custom hook too:</p>
      <pre>{JSON.stringify({ doubledCustom: doubled })}</pre>
    </>
  );
};

const Component22 = ({ store }) => {
  return (
    <>
      <p>
        If we use a computation using the state, it will not render changes
        since the state is mutable
      </p>
      <pre>{JSON.stringify({ triple: store.tripled() })}</pre>
    </>
  );
};

const Component3 = ({ store }) => {
  const {
    index: { value },
    text,
  } = useSnapshot(store);

  const action = () => {
    store.setCapitalizedText();
    store.tripleCount();
  };

  return (
    <>
      <hr />
      <p>
        C3: Mutations on state, not on snap! Click to render:{' '}
        <button onClick={action}>Update state</button>
      </p>

      <pre>{JSON.stringify({ value, text })}</pre>
    </>
  );
};

const Reset = ({ store }) => {
  const handleReset = () => (store.index.value = 1);
  return (
    <>
      <button onClick={handleReset}>Reset index</button>
    </>
  );
};
const Fetch = ({ commentStore }) => {
  const { comments } = useSnapshot(commentStore);

  const handleClick = () => commentStore.getComments();

  return (
    <>
      <hr />
      <p>
        Async update change on click action:{' '}
        <button onClick={handleClick}>get comments(:id)</button>{' '}
      </p>
      <pre>{JSON.stringify(comments?.map((c) => c.email))}</pre>
    </>
  );
};

const Fetch2 = ({ store }) => {
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
      <p>
        Comment async auto-updating to :id via classic{' '}
        <strong>useState/useEffect</strong>
      </p>
      <pre>{JSON.stringify(users)}</pre>
    </>
  );
};

const Component4 = ({ users }) => {
  const { derUsers } = useSnapshot(users);
  return (
    <>
      <p>
        Users async auto-updateing to :id via <strong>derivation</strong>
      </p>
      <pre>{JSON.stringify(derUsers)}</pre>
    </>
  );
};

/*
const Component51 = () => {
  const [msg, setMsg] = React.useState(null);
  const [res, setRes] = React.useState(null);
  const { derUsers } = useSnapshot(users);

  React.useEffect(() => {
    const source = new EventSource(process.env.REACT_APP_SSE_URL);
    source.addEventListener('message', handleMsg);

    return () => {
      source.removeEventListener('message', handleMsg);
      source.close();
    };
  }, []);

  const handleMsg = (e) => {
    console.log('effect', e.data);
    setMsg(e.data);
    const data = e.data;``
    setRes(
      Object.values(derUsers).find((user) => user[0] === data?.toUpperCase())
    );
  };`

  return (
    <pre>
      New message arrived via useEffect: {msg} then {res}
    </pre>
  );
};
*/

const Component52 = ({ store, users }) => {
  const {
    sse: { message },
  } = useSnapshot(store);
  const { derUsers } = useSnapshot(users);

  let res = Object.values(derUsers).find(
    (user) => user[0] === JSON.parse(message).msg.toUpperCase()
  );

  console.log(Object.values(derUsers).find((user) => user[0] === 'E'));
  // console.log('valtio', message?.msg[0]?.toUpperCase(), res);
  return (
    <pre>
      New message arrived via internal store: {message}. Any user with this
      letter? {res}
    </pre>
  );
};
const Component53 = ({ store }) => {
  const {
    post: { message_post },
  } = useSnapshot(store);

  console.log('valtio', message_post);
  return <pre>{message_post}</pre>;
};

const App = () => (
  <>
    <p>
      Rule 1: read from snap, write on state. In particular, no snap in
      callbacks
    </p>
    <p>
      Tip: atomize the components to limit rendering as well as the state.
      Instead of {JSON.stringify({ index: 1, text: 'hi' })}, we will use{' '}
      {JSON.stringify({ index: { value: 1 }, text: 'hi' })} so that we can
      segregate the rendering.
    </p>

    <Counter store={store} />
    <Component0 store={store} />
    <Component1 store={store} />
    <Component11 store={store} />
    <Component12 store={store} />
    <Component2 store={store} />
    <Component22 store={store} />

    <Component3 store={store} />
    <hr />
    <Counter store={store} />
    <Reset store={store} />
    <Fetch commentStore={commentStore} store={store} />
    <Fetch2 store={store} />
    <React.Suspense fallback={'Loading...'}>
      <Component4 users={users} />
    </React.Suspense>
    <hr />
    <p>Receiving Server Sent Events from a server</p>
    {/* <React.Suspense fallback={'Loading..'}>
      <Component51 />
    </React.Suspense> */}
    {/* <Component51 /> */}
    <React.Suspense fallback={'Loading..'}>
      <Component52 store={store} users={users} />
    </React.Suspense>
    <Component53 store={store} />
  </>
);
export default App;
