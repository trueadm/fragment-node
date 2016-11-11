# fragment-node

## Why

`fragment-node` is an experiment to see if there's a hack way of creating a fragment DOM node, similar to `DocumentFragment` 
that exists in the DOM tree rather than as an abstraction. By having such a node, it allows us to mutate the DOM tree
easily using the existing DOM API whilst ensuring `childNodes` on the fragment remain. `DocumentFragment`s lose their
`childNodes` once the `DocumentFragment` is appended to another node.

The core reasoning behind this experiment is to see if [React](https://github.com/facebook/react) or [Inferno](https://github.com/trueadm/inferno) 
can use `fragment-node` to describe common problems that affect virtual DOM node trees. Such problems include:

```jsx
const Rows = () => [
    <tr />,
    <tr />,
    <tr />
];

const Table = () => (
    <table>
        <Rows />
    </table>
);
```

The above example shows a component returning an array of `<tr />` nodes from the `<Rows />` component. If we were
to wrap the output in a `<div />` this would break the page as the contents of `<table>` elements are strict.

Instead libraries like React and Inferno push this problem into userland and educate the user to instead structure
their components to have a wrapping root node. In the above example, this would mean they'd have to completely
rethink how the `<Table /> and `<Rows />` components work.

## How

`fragment-node` attempts to deal with this problem by providing an alternative to `DocumentFragment` that works
like a typical DOM node, in that it actually gets inserted into the DOM tree and its `childNodes` remain with it.

It does this by using a placeholder base node (in this implementation it uses an empty `CommentNode`). It then uses
`defineProperty` and `MutationObserver`s to proxy in features and API methods that you'd typically use on a `DocumentFragment`.