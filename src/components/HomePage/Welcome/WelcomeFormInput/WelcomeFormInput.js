import React from "react";
import * as css from "./WelcomeFormInput.module.scss";

const WelcomeFormInput = (props) => {
  return (
    <div className={css.formInput}>
      <input
        id={props.id}
        className={props.class}
        ref={props.inputRef}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        pattern={props.pattern}
        value={props.value}
        onChange={props.handleChange}
        autoComplete="off"
        required
      />
      <label htmlFor={props.id}></label>
    </div>
  )
}

export default WelcomeFormInput;