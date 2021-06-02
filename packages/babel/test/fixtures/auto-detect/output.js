import { useRelyzer as _useRelyzer3 } from "@relyzer/runtime";
import { useRelyzer as _useRelyzer2 } from "@relyzer/runtime";
import { useRelyzer as _useRelyzer } from "@relyzer/runtime";
import React from "react";

function A(_props) {
  const _p = _useRelyzer({
    id: "RANDOM",
    code: "function A() {\n  return (\n    <div />\n  );\n}",
    loc: "3,0,7,1",
    observedList: [],
    shouldDetectCallStack: true,
  });

  _p(_props, -1);

  return <div />;
}

function a() {
  return <div />;
}

export function B(_props2) {
  const _p2 = _useRelyzer2({
    id: "RANDOM",
    code: "function B() {\n  return (\n    <div />\n  );\n}",
    loc: "15,7,19,1",
    observedList: [],
    shouldDetectCallStack: true,
  });

  _p2(_props2, -1);

  return <div />;
}
export function b() {
  return <div />;
}
export const C = React.memo((_props3) => {
  const _p3 = _useRelyzer3({
    id: "RANDOM",
    code: "() => {\n  return (\n    <div />\n  );\n}",
    loc: "27,28,31,1",
    observedList: [],
    shouldDetectCallStack: true,
  });

  _p3(_props3, -1);

  return <div />;
});
export const c = React.memo(() => {
  return <div />;
});
