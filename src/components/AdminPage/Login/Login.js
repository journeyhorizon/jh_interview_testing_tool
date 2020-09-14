import React from "react";
import * as css from "./Login.module.scss";

// Assets
import logoColor from "../../../assets/logo-color.png";
import eye from "../../../assets/icons/eye.png";
import eyeSlash from "../../../assets/icons/eye-slash.png";

// ALIAS
const NOTIFICATION_FOR_LACK_OF_INFORMATION = "Please enter both username and password";
const NOTIFICATION_FOR_INCORRECT_INFORMATION = "Username or password is incorrect";

class Login extends React.Component {
  constructor(props) {
    super();

    this.state = {
      username: "",
      password: "",
      warningNotification: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleDisplayPassword = this.handleDisplayPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    sessionStorage.getItem("admin") && this.props.history.push("/admin/dashboard");
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDisplayPassword(event) {
    event.target.src = event.target.src === eye ? eyeSlash : eye;
    this.changeTypeOfPasswordInput();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.username === "" || this.state.password === "") {
      this.changeDisplayOfWarningNotification("flex");
      this.setState({ warningNotification: NOTIFICATION_FOR_LACK_OF_INFORMATION });
    } else {
      if (this.state.username !== "admin" || this.state.password !== "journeyh.io") {
        this.changeDisplayOfWarningNotification("flex");
        this.setState({ warningNotification: NOTIFICATION_FOR_INCORRECT_INFORMATION });
      } else {
        this.changeDisplayOfWarningNotification("none");
        this.setState({ warningNotification: "" });
        sessionStorage.setItem("admin", true);
        this.props.history.push("/admin/dashboard");
      }
    }
  }

  changeDisplayOfWarningNotification(displayStatus) {
    document.getElementById("warningNotification").style.display = displayStatus;
  }

  changeTypeOfPasswordInput() {
    const inputPassword = document.getElementById("inputPassword");
    inputPassword.type = inputPassword.type === "password" ? "text" : "password";
  }

  render() {
    return (
      <div className={css.container}>
        <img className={css.titleImage} src={logoColor} alt="logo-company" />
        <p className={css.description}>Prove you're our admin!</p>
        <form className={css.loginForm} onSubmit={this.handleSubmit}>
          <div className={css.formInput}>
            <input id="inputUsername" type="text" name="username" value={this.state.username} onChange={this.handleChange} />
            <label htmlFor="inputUsername">Username</label>
          </div>
          <div className={css.formInput}>
            <input id="inputPassword" type="password" name="password" value={this.state.password} onChange={this.handleChange} autoComplete="on" />
            <label htmlFor="inputPassword">Password</label>
            <img className={css.passShowAndHide} src={eye} alt="show-and-hide-password" onClick={this.handleDisplayPassword} />
          </div>
          <div id="warningNotification" className={css.notification}>{this.state.warningNotification}</div>
          <button className={css.formButton}>Login</button>
        </form>
      </div>
    )
  }
}

export default Login;
