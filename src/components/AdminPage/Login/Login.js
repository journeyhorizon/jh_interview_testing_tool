import React, { useEffect, useRef, useState } from "react";
import * as css from "./Login.module.scss";

// Component
import LoginFormInput from "./LoginFormInput/LoginFormInput";

import { AuthContext } from "../../../context/AuthContext";

// Assets
import logoColor from "../../../assets/logo-color.png";
import eye from "../../../assets/icons/eye.png";
import eyeSlash from "../../../assets/icons/eye-slash.png";

// ALIAS
const NOTIFICATION = {
  LACK_OF_INFORMATION: "Please enter both username and password",
  INCORRECT_INFORMATION: "Username or password is incorrect",
  CORRECT_INFORMATION: "",
};

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return { value, handleChange };
};

const LoginComponent = ({ history, currentUser, login }) => {
  const username = useFormInput("dat.nguyen@journeyh.io");

  const password = useFormInput("D@t2511998");

  const [warningNotification, setWarningNotification] = useState("");

  const passwordElement = useRef();
  const warningNotificationElement = useRef();

  useEffect(() => {
    !!currentUser && history.push("/admin/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(currentUser)]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.value === "" || password.value === "") {
      changeDisplayOfWarningNotification("flex");
      setWarningNotification(NOTIFICATION.LACK_OF_INFORMATION);
    } else {
      login(username.value, password.value)
        .then((res) => {
          // changeDisplayOfWarningNotification("none");
          // setWarningNotification(NOTIFICATION.CORRECT_INFORMATION);
          // history.push("/admin/dashboard");
        })
        .catch((e) => {
          console.log("e 123321123", e);
          changeDisplayOfWarningNotification("flex");
          setWarningNotification(NOTIFICATION.INCORRECT_INFORMATION);
        });
    }
  };

  const changeDisplayOfWarningNotification = (displayStatus) => {
    warningNotificationElement.current.style.display = displayStatus;
  };

  const handleDisplayPassword = (event) => {
    event.target.src = event.target.src === eye ? eyeSlash : eye;
    changeTypeOfPasswordInput();
  };

  const changeTypeOfPasswordInput = () => {
    const inputPassword = passwordElement.current;
    inputPassword.type =
      inputPassword.type === "password" ? "text" : "password";
  };

  return (
    <div className={css.container}>
      <img className={css.titleImage} src={logoColor} alt="logo-company" />
      <p className={css.description}>Prove you're our admin!</p>
      <form className={css.loginForm} onSubmit={handleSubmit}>
        <LoginFormInput
          id="inputUsername"
          type="text"
          name="username"
          label="Username"
          {...username}
        />
        <LoginFormInput
          id="inputPassword"
          type="password"
          name="password"
          label="Password"
          isPasswordType={true}
          handleDisplayPassword={handleDisplayPassword}
          passwordRef={passwordElement}
          {...password}
        />
        <div
          id="warningNotification"
          ref={warningNotificationElement}
          className={css.notification}
        >
          {warningNotification}
        </div>
        <button className={css.formButton}>Login</button>
      </form>
    </div>
  );
};

const Login = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return <LoginComponent {...props} {...context} />;
    }}
  </AuthContext.Consumer>
);

export default Login;
