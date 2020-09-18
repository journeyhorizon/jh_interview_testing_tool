import React from "react";
import * as css from "./LoginFormInput.module.scss";

// Assets
import eye from "../../../../assets/icons/eye.png";

class LoginFormInput extends React.Component {
  render() {
    return (
      <div className={css.formInput}>
        <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.handleChange} autoComplete={this.props.isPasswordType ? "on" : "off"} />
        <label htmlFor={this.props.id}>{this.props.label}</label>
        {this.props.isPasswordType && <img className={css.passShowAndHide} src={eye} alt="show-and-hide-password" onClick={this.props.handleDisplayPassword} />}
      </div>
    )
  }
}

export default LoginFormInput;