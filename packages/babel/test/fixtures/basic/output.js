"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports["default"] = TodoList;

var _runtime = require("@relyzer/runtime");

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _useReactRouter = _interopRequireDefault(require("use-react-router"));

var _useInput3 = _interopRequireDefault(require("../hooks/useInput"));

var _useOnEnter = _interopRequireDefault(require("../hooks/useOnEnter"));

var _useTodos3 = _interopRequireDefault(require("../reducers/useTodos"));

var _TodoItem = _interopRequireDefault(require("./TodoItem"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/**
 * @component
 */
function TodoList(_ref) {
  var _p = (0, _runtime.useRelyzer)({
    id: "RANDOM",
    code:
      'function TodoList({x, y}) {\n  const router = useRouter();\n\n  const [todos, { addTodo, deleteTodo, setDone }] = useTodos();\n\n  const left = useMemo(() => todos.reduce((p, c) => p + (c.done ? 0 : 1), 0), [\n    todos,\n  ]);\n\n  const visibleTodos = useMemo(\n    () =>\n      router.match.params.filter\n        ? todos.filter(i =>\n            router.match.params.filter === "active" ? !i.done : i.done\n          )\n        : todos,\n    [todos, router.match.params.filter, aaa()]\n  );\n\n  const anyDone = useMemo(() => todos.some(i => i.done), [todos]);\n  const allSelected = useMemo(() => visibleTodos.every(i => i.done), [\n    visibleTodos\n  ]);\n\n  const onToggleAll = useCallback(\n    () => {\n      visibleTodos.forEach(i => setDone(i.id, !allSelected));\n    },\n    [visibleTodos, allSelected]\n  );\n\n  const onClearCompleted = useCallback(\n    () => {\n      todos.forEach(i => {\n        if (i.done) {\n          deleteTodo(i.id);\n        }\n      });\n    },\n    [todos]\n  );\n\n  const [newValue, onNewValueChange, setNewValue] = useInput();\n  const onAddTodo = useOnEnter(\n    () => {\n      if (newValue) {\n        addTodo(newValue);\n        setNewValue("");\n      }\n    },\n    [newValue]\n  );\n\n  return (\n    <React.Fragment>\n      <header className="header">\n        <h1>todos</h1>\n        <input\n          className="new-todo"\n          placeholder="What needs to be done?"\n          onKeyPress={onAddTodo}\n          value={newValue}\n          onChange={onNewValueChange}\n        />\n      </header>\n\n      <section className="main">\n        <input\n          id="toggle-all"\n          type="checkbox"\n          className="toggle-all"\n          checked={allSelected}\n          onChange={onToggleAll}\n        />\n        <label htmlFor="toggle-all" />\n        <ul className="todo-list">\n          {visibleTodos.map(todo => (\n            <TodoItem key={todo.id} todo={todo} />\n          ))}\n        </ul>\n      </section>\n\n      <footer className="footer">\n        <span className="todo-count">\n          <strong>{left}</strong> items left\n        </span>\n        <ul className="filters">\n          <li>\n            <NavLink exact={true} to="/" activeClassName="selected">\n              All\n            </NavLink>\n          </li>\n          <li>\n            <NavLink to="/active" activeClassName="selected">\n              Active\n            </NavLink>\n          </li>\n          <li>\n            <NavLink to="/completed" activeClassName="selected" onClick={someHandler}>\n              Completed\n            </NavLink>\n          </li>\n        </ul>\n        {anyDone && (\n          <button className="clear-completed" onClick={onClearCompleted}>\n            Clear completed\n          </button>\n        )}\n      </footer>\n    </React.Fragment>\n  );\n}',
    loc: "13,15,124,1",
    observedList: [
      {
        type: "var",
        loc: "0,34,0,35",
        name: "x",
      },
      {
        type: "var",
        loc: "0,37,0,38",
        name: "y",
      },
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
  });

  _p(_ref, -1);

  var x = _ref.x,
    y = _ref.y;

  _p(x, 0);

  _p(y, 1);

  var router = (0, _useReactRouter["default"])();

  _p(router, 2);

  var _useTodos = (0, _useTodos3["default"])(),
    _useTodos2 = _slicedToArray(_useTodos, 2),
    todos = _useTodos2[0],
    _useTodos2$ = _useTodos2[1],
    addTodo = _useTodos2$.addTodo,
    deleteTodo = _useTodos2$.deleteTodo,
    setDone = _useTodos2$.setDone;

  _p(todos, 3);

  _p(addTodo, 4);

  _p(deleteTodo, 5);

  _p(setDone, 6);

  var left = (0, _react.useMemo)(
    function () {
      return todos.reduce(function (p, c) {
        return p + (c.done ? 0 : 1);
      }, 0);
    },
    [_p(todos, 8)]
  );

  _p(left, 7);

  var visibleTodos = (0, _react.useMemo)(
    function () {
      return router.match.params.filter
        ? todos.filter(function (i) {
            return router.match.params.filter === "active" ? !i.done : i.done;
          })
        : todos;
    },
    [_p(todos, 10), _p(router.match.params.filter, 11), _p(aaa(), 12)]
  );

  _p(visibleTodos, 9);

  var anyDone = (0, _react.useMemo)(
    function () {
      return todos.some(function (i) {
        return i.done;
      });
    },
    [_p(todos, 14)]
  );

  _p(anyDone, 13);

  var allSelected = (0, _react.useMemo)(
    function () {
      return visibleTodos.every(function (i) {
        return i.done;
      });
    },
    [_p(visibleTodos, 16)]
  );

  _p(allSelected, 15);

  var onToggleAll = (0, _react.useCallback)(
    function () {
      visibleTodos.forEach(function (i) {
        return setDone(i.id, !allSelected);
      });
    },
    [_p(visibleTodos, 18), _p(allSelected, 19)]
  );

  _p(onToggleAll, 17);

  var onClearCompleted = (0, _react.useCallback)(
    function () {
      todos.forEach(function (i) {
        if (i.done) {
          deleteTodo(i.id);
        }
      });
    },
    [_p(todos, 21)]
  );

  _p(onClearCompleted, 20);

  var _useInput = (0, _useInput3["default"])(),
    _useInput2 = _slicedToArray(_useInput, 3),
    newValue = _useInput2[0],
    onNewValueChange = _useInput2[1],
    setNewValue = _useInput2[2];

  _p(newValue, 22);

  _p(onNewValueChange, 23);

  _p(setNewValue, 24);

  var onAddTodo = (0, _useOnEnter["default"])(
    function () {
      if (newValue) {
        addTodo(newValue);
        setNewValue("");
      }
    },
    [newValue]
  );

  _p(onAddTodo, 25);

  return (
    <_react.default.Fragment>
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
          {visibleTodos.map(function (todo) {
            return <_TodoItem.default key={todo.id} todo={todo} />;
          })}
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{left}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <_reactRouterDom.NavLink
              exact={true}
              to="/"
              activeClassName="selected"
            >
              All
            </_reactRouterDom.NavLink>
          </li>
          <li>
            <_reactRouterDom.NavLink to="/active" activeClassName="selected">
              Active
            </_reactRouterDom.NavLink>
          </li>
          <li>
            <_reactRouterDom.NavLink
              to="/completed"
              activeClassName="selected"
              onClick={_p(someHandler, 26)}
            >
              Completed
            </_reactRouterDom.NavLink>
          </li>
        </ul>
        {anyDone && (
          <button className="clear-completed" onClick={onClearCompleted}>
            Clear completed
          </button>
        )}
      </footer>
    </_react.default.Fragment>
  );
}
