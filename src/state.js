import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
// import { devtools } from 'valtio/utils';

export const idxStore = proxy({
  index: 1,
  increment: () => (idxStore.index += 1),
  decrement: () => (idxStore.index -= 1),
  tripleCount: () => (idxStore.index *= 3),
});

export const textStore = proxy({
  text: 'hi',
  setText: (text) => (textStore.text = text),
  setCapitalizedText: () => (textStore.text = textStore.text.toUpperCase()),
});

export const commentStore = proxy({
  comments: null,
  setComments: async () =>
    (commentStore.comments = await fetchComments(idxStore.index)),
});

export const fetchComments = async (id) => {
  const data = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  return data.json();
  //(res) => res.json()
};

export const commentsUsers = derive({
  live: async (get) => {
    const list = await fetchComments(get(idxStore).index);
    return list?.map((c) => c.email);
  },
});

// const unsub = devtools(inputStore, { name: 'input', enabled: true });
// const unbus = devtools(commentsUsers, { name: 'commusers', enabled: true });
