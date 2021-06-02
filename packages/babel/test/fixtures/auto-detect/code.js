import React from "react";

function A() {
  return (
    <div />
  );
}

function a() {
  return (
    <div />
  );
}

export function B() {
  return (
    <div />
  );
}

export function b() {
  return (
    <div />
  );
}

export const C = React.memo(() => {
  return (
    <div />
  );
})

export const c = React.memo(() => {
  return (
    <div />
  );
})
