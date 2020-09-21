import React from "react";
import * as css from "./WelcomeFormInput.module.scss";

class WelcomeFormInput extends React.Component {
  render() {
    return (
      <div className={css.formInput}>
        <input id={this.props.id} className={this.props.class} type={this.props.type} name={this.props.name} placeholder={this.props.placeholder} pattern={this.props.pattern} value={this.props.value} onChange={this.props.onChange} required />
        <label htmlFor={this.props.id}></label>
      </div>
    )
  }
}

export default WelcomeFormInput;