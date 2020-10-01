import React from "react";
import * as css from "./LoginFormInput.module.scss";

// Assets
import eye from "../../../../assets/icons/eye.png";

const LoginFormInput = (props) => {
  return (
    <div className={css.formInput}>
      <input
        id={props.id}
        ref={props.passwordRef}
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        autoComplete={props.isPasswordType ? "on" : "off"} />
      <label htmlFor={props.id}>{props.label}</label>
      {props.isPasswordType
        && <img className={css.passShowAndHide} src={eye} alt="show-and-hide-password" onClick={props.handleDisplayPassword} />}
    </div>
  )
}

export default LoginFormInput;