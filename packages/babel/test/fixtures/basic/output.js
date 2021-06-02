import { useRelyzer as _useRelyzer } from "@relyzer/runtime";
import React, { useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import useRouter from "use-react-router";
import useInput from "../hooks/useInput";
import useOnEnter from "../hooks/useOnEnter";
import useTodos from "../reducers/useTodos";
import TodoItem from "./TodoItem";
/**
 * @component
 */

export default function TodoList(_props) {
  const _p = _useRelyzer({
    id: "RANDOM",
    code:
      'function TodoList({x, y}) {\n  const router = useRouter();\n\n  const [todos, { addTodo, deleteTodo, setDone }] = useTodos();\n\n  const left = useMemo(() => todos.reduce((p, c) => p + (c.done ? 0 : 1), 0), [\n    todos,\n  ]);\n\n  const visibleTodos = useMemo(\n    () =>\n      router.match.params.filter\n        ? todos.filter(i =>\n            router.match.params.filter === "active" ? !i.done : i.done\n          )\n        : todos,\n    [todos, router.match.params.filter, aaa()]\n  );\n\n  const anyDone = useMemo(() => todos.some(i => i.done), [todos]);\n  const allSelected = useMemo(() => visibleTodos.every(i => i.done), [\n    visibleTodos\n  ]);\n\n  const onToggleAll = useCallback(\n    () => {\n      visibleTodos.forEach(i => setDone(i.id, !allSelected));\n    },\n    [visibleTodos, allSelected]\n  );\n\n  const onClearCompleted = useCallback(\n    () => {\n      todos.forEach(i => {\n        if (i.done) {\n          deleteTodo(i.id);\n        }\n      });\n    },\n    [todos]\n  );\n\n  const [newValue, onNewValueChange, setNewValue] = useInput();\n  const onAddTodo = useOnEnter(\n    () => {\n      if (newValue) {\n        addTodo(newValue);\n        setNewValue("");\n      }\n    },\n    [newValue]\n  );\n\n  return (\n    <React.Fragment>\n      <header className="header">\n        <h1>todos</h1>\n        <input\n          className="new-todo"\n          placeholder="What needs to be done?"\n          onKeyPress={onAddTodo}\n          value={newValue}\n          onChange={onNewValueChange}\n        />\n      </header>\n\n      <section className="main">\n        <input\n          id="toggle-all"\n          type="checkbox"\n          className="toggle-all"\n          checked={allSelected}\n          onChange={onToggleAll}\n        />\n        <label htmlFor="toggle-all" />\n        <ul className="todo-list">\n          {visibleTodos.map(todo => (\n            <TodoItem key={todo.id} todo={todo} />\n          ))}\n        </ul>\n      </section>\n\n      <footer className="footer">\n        <span className="todo-count">\n          <strong>{left}</strong> items left\n        </span>\n        <ul className="filters">\n          <li>\n            <NavLink exact={true} to="/" activeClassName="selected">\n              All\n            </NavLink>\n          </li>\n          <li>\n            <NavLink to="/active" activeClassName="selected">\n              Active\n            </NavLink>\n          </li>\n          <li>\n            <NavLink to="/completed" activeClassName="selected" onClick={someHandler}>\n              Completed\n            </NavLink>\n          </li>\n        </ul>\n        {anyDone && (\n          <button className="clear-completed" onClick={onClearCompleted}>\n            Clear completed\n          </button>\n        )}\n      </footer>\n    </React.Fragment>\n  );\n}',
    loc: "13,15,124,1",
    observedList: [
      {
        type: "var",
        loc: "1,8,1,14",
        name: "router",
      },
      {
        type: "var",
        loc: "3,9,3,14",
        name: "todos",
      },
      {
        type: "var",
        loc: "3,18,3,25",
        name: "addTodo",
      },
      {
        type: "var",
        loc: "3,27,3,37",
        name: "deleteTodo",
      },
      {
        type: "var",
        loc: "3,39,3,46",
        name: "setDone",
      },
      {
        type: "var",
        loc: "5,8,5,12",
        name: "left",
      },
      {
        type: "dep",
        loc: "6,4,6,9",
        name: "todos",
      },
      {
        type: "var",
        loc: "9,8,9,20",
        name: "visibleTodos",
      },
      {
        type: "dep",
        loc: "16,5,16,10",
        name: "todos",
      },
      {
        type: "dep",
        loc: "16,12,16,38",
        name: "MemberExpression",
      },
      {
        type: "dep",
        loc: "16,40,16,45",
        name: "CallExpression",
      },
      {
        type: "var",
        loc: "19,8,19,15",
        name: "anyDone",
      },
      {
        type: "dep",
        loc: "19,58,19,63",
        name: "todos",
      },
      {
        type: "var",
        loc: "20,8,20,19",
        name: "allSelected",
      },
      {
        type: "dep",
        loc: "21,4,21,16",
        name: "visibleTodos",
      },
      {
        type: "var",
        loc: "24,8,24,19",
        name: "onToggleAll",
      },
      {
        type: "dep",
        loc: "28,5,28,17",
        name: "visibleTodos",
      },
      {
        type: "dep",
        loc: "28,19,28,30",
        name: "allSelected",
      },
      {
        type: "var",
        loc: "31,8,31,24",
        name: "onClearCompleted",
      },
      {
        type: "dep",
        loc: "39,5,39,10",
        name: "todos",
      },
      {
        type: "var",
        loc: "42,9,42,17",
        name: "newValue",
      },
      {
        type: "var",
        loc: "42,19,42,35",
        name: "onNewValueChange",
      },
      {
        type: "var",
        loc: "42,37,42,48",
        name: "setNewValue",
      },
      {
        type: "var",
        loc: "43,8,43,17",
        name: "onAddTodo",
      },
      {
        type: "attr",
        loc: "98,64,98,71",
        name: "onClick",
      },
    ],
    shouldDetectCallStack: false,
  });

  _p(_props, -1);

  let { x, y } = _props;
  const router = useRouter();

  _p(router, 0);

  const [todos, { addTodo, deleteTodo, setDone }] = useTodos();

  _p(todos, 1);

  _p(addTodo, 2);

  _p(deleteTodo, 3);

  _p(setDone, 4);

  const left = useMemo(() => todos.reduce((p, c) => p + (c.done ? 0 : 1), 0), [
    _p(todos, 6),
  ]);

  _p(left, 5);

  const visibleTodos = useMemo(
    () =>
      router.match.params.filter
        ? todos.filter((i) =>
            router.match.params.filter === "active" ? !i.done : i.done
          )
        : todos,
    [_p(todos, 8), _p(router.match.params.filter, 9), _p(aaa(), 10)]
  );

  _p(visibleTodos, 7);

  const anyDone = useMemo(() => todos.some((i) => i.done), [_p(todos, 12)]);

  _p(anyDone, 11);

  const allSelected = useMemo(() => visibleTodos.every((i) => i.done), [
    _p(visibleTodos, 14),
  ]);

  _p(allSelected, 13);

  const onToggleAll = useCallback(() => {
    visibleTodos.forEach((i) => setDone(i.id, !allSelected));
  }, [_p(visibleTodos, 16), _p(allSelected, 17)]);

  _p(onToggleAll, 15);

  const onClearCompleted = useCallback(() => {
    todos.forEach((i) => {
      if (i.done) {
        deleteTodo(i.id);
      }
    });
  }, [_p(todos, 19)]);

  _p(onClearCompleted, 18);

  const [newValue, onNewValueChange, setNewValue] = useInput();

  _p(newValue, 20);

  _p(onNewValueChange, 21);

  _p(setNewValue, 22);

  const onAddTodo = useOnEnter(() => {
    if (newValue) {
      addTodo(newValue);
      setNewValue("");
    }
  }, [newValue]);

  _p(onAddTodo, 23);

  return (
    <React.Fragment>
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyPress={onAddTodo}
          value={newValue}
          onChange={onNewValueChange}
        />
      </header>

      <section className="main">
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
          checked={allSelected}
          onChange={onToggleAll}
        />
        <label htmlFor="toggle-all" />
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{left}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <NavLink exact={true} to="/" activeClassName="selected">
              All
            </NavLink>
          </li>
          <li>
            <NavLink to="/active" activeClassName="selected">
              Active
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/completed"
              activeClassName="selected"
              onClick={_p(someHandler, 24)}
            >
              Completed
            </NavLink>
          </li>
        </ul>
        {anyDone && (
          <button className="clear-completed" onClick={onClearCompleted}>
            Clear completed
          </button>
        )}
      </footer>
    </React.Fragment>
  );
}
