import React, { useEffect, useReducer, useState } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

// reducer 함수는 컴포넌트 함수 밖에서 생성, 컴포넌트 함수에 있는것이 필요없기때문 ㅋ
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  // useEffect에서 호출이 여러번 되지 않게 객체분할을 하여 Valid하지 않을때만 검사
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // useEffect는 컴포넌트가 실행된 '이후'에 실행됨(mount 시점)
  // 의존성에 빈 배열을 추가하면, 컴포넌트가 실행되고 한번만 실행됨
  // 의존성을 추가하면 의존성에 추가한 state가 변경되면 실행
  // cleanup을 하면 component가 unmount될때 실행
  useEffect(() => {
    // 1. useEffect는 side effect(http req 등)를 처리하기위해 존재
    // 2. Debouncing = 예를 들어 이메일 등을 input에 입력할떄 사용자가 이메일을 전부 입력한 후 유효성을 체크(몇초 기다린다던지 등)
    const identifier = setTimeout(() => {
      console.log("checking");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);
    // 3. cleanup fnc -> 모든 사이드 이펙트를 컨트롤할수있음
    return () => {
      console.log("cleanUP");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
