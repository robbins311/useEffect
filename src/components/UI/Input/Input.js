import React, { useEffect, useRef, useImperativeHandle } from "react";

import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  // props를 제외하고, 드문경우에 component에 ref를 설정했다면, 2번째 매개변수에 ref를 받아올수있음
  const inputRef = useRef();
  const activate = () => {
    inputRef.current.focus();
  };
  useImperativeHandle(ref, () => {
    return {
      focus: activate,
    };
  });
  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.html}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;
