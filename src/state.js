import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
// import { devtools } from 'valtio/utils';

export const fetchComments = async (id) => {
  const data = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  return data.json();
};

export const store = proxy({
  index: { value: 1 },
  text: 'hi',
  increment: () => (store.index.value += 1),
  decrement: () => (store.index.value -= 1),
  tripleCount: () => (store.index.value *= 3),
  setText: (text) => (store.text = text),
  setCapitalizedText: () => (store.text = store.text.toUpperCase()),
});

export const commentStore = proxy({
  comments: null,
  setComments: async () =>
    (commentStore.comments = await fetchComments(store.index.value)),
});

export const users = derive({
  derUsers: async (get) => {
    const list = await fetchComments(get(store.index).value);
    return list?.map((c) => c.email);
  },
});

// const unsub = devtools(inputStore, { name: 'input', enabled: true });
// const unbus = devtools(commentsUsers, { name: 'commusers', enabled: true });
