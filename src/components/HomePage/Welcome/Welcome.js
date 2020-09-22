import React from "react";
import * as css from "./Welcome.module.scss";
import * as inputCss from "./WelcomeFormInput/WelcomeFormInput.module.scss";

// Components
import WelcomeFormInput from "./WelcomeFormInput/WelcomeFormInput";

// Data
import interviewee from "../../../mockdata/interviewee.json";

// Assets
import logoColor from "../../../assets/logo-color.png";

// ALIAS
const NOTIFICATION_FOR_LACK_OF_INFORMATION = "Please enter all fields";
const NOTIFICATION_FOR_INVALID_INPUT = "Input is on invalid form";

class Welcome extends React.Component {
  constructor() {
    super();

    this.state = {
      fullname: "",
      email: "",
      phone: "",
      warningNotification: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    localStorage.getItem("interviewee") && this.props.history.push("/testlist");
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.checkFulfillInputFormForShowingButton();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.fullname === "" || this.state.email === "" || this.state.phone === "") {
      this.changeDisplayOfElement("warningNotification", "flex");
      this.setState({ warningNotification: NOTIFICATION_FOR_LACK_OF_INFORMATION });
    } else {
      const inputElementEmail = document.getElementById("intervieweeEmail");
      const inputElementPhone = document.getElementById("intervieweePhone");
      const regExpEmail = new RegExp(inputElementEmail.getAttribute("pattern"));
      const regExpPhone = new RegExp(inputElementPhone.getAttribute("pattern"));

      if (!regExpEmail.test(inputElementEmail.value) || !regExpPhone.test(inputElementPhone.value)) {
        this.handleInvalidInput(regExpEmail, inputElementEmail, regExpPhone, inputElementPhone);
      } else {
        this.handleValidInput();
      }
    }
  }

  checkFulfillInputFormForShowingButton() {
    if (this.state.fullname !== "" && this.state.email !== "" && this.state.phone !== "")
      this.changeDisplayOfElement("goButton", "block");
    else this.changeDisplayOfElement("goButton", "none");
  }

  changeDisplayOfElement(elementId, displayStatus) {
    document.getElementById(elementId).style.display = displayStatus;
  }

  modifyIsErrorInput(elementId, isError, specifiedClass) {
    isError ? document.getElementById(elementId).classList.add(inputCss.inputError, specifiedClass)
      : document.getElementById(elementId).classList.remove(inputCss.inputError, specifiedClass);
  }

  handleInvalidInput(regExpEmail, inputElementEmail, regExpPhone, inputElementPhone) {
    this.changeDisplayOfElement("warningNotification", "flex");
    this.setState({ warningNotification: NOTIFICATION_FOR_INVALID_INPUT });

    if (!regExpEmail.test(inputElementEmail.value))
      this.modifyIsErrorInput("intervieweeEmail", true, inputCss.inputEmailError);
    else this.modifyIsErrorInput("intervieweeEmail", false, inputCss.inputEmailError);

    if (!regExpPhone.test(inputElementPhone.value))
      this.modifyIsErrorInput("intervieweePhone", true, inputCss.inputPhoneError);
    else this.modifyIsErrorInput("intervieweePhone", false, inputCss.inputPhoneError);
  }

  handleValidInput() {
    this.modifyIsErrorInput("intervieweeEmail", false, inputCss.inputEmailError);
    this.modifyIsErrorInput("intervieweePhone", false, inputCss.inputPhoneError);
    this.changeDisplayOfElement("warningNotification", "none");
    this.setState({ warningNotification: "" });

    const { warningNotification, ...intervieweeDetail } = this.state;
    localStorage.setItem("interviewee", JSON.stringify({ id: interviewee.length, ...intervieweeDetail }));
    this.props.history.push("/testlist");
  }

  render() {
    return (
      <div className={css.container}>
        <img className={css.titleImage} src={logoColor} alt="logo-company" />
        <p className={css.description}>Type your basic information below</p>
        <form className={css.intervieweeInformationForm}>
          <WelcomeFormInput
            id="intervieweeFullname"
            class={inputCss.inputFullname}
            type="text"
            name="fullname"
            placeholder="Fullname"
            value={this.state.fullname}
            onChange={this.handleChange}
          />
          <WelcomeFormInput
            id="intervieweeEmail"
            class={inputCss.inputEmail}
            type="text"
            name="email"
            placeholder="Email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <WelcomeFormInput
            id="intervieweePhone"
            class={inputCss.inputPhone}
            type="tel"
            name="phone"
            placeholder="Phone"
            pattern="[0-9]{10}"
            value={this.state.phone}
            onChange={this.handleChange}
          />
          <div id="warningNotification" className={css.notification}>{this.state.warningNotification}</div>
          <button id="goButton" className={css.formButton} onClick={this.handleSubmit}>Go!</button>
        </form>
      </div>
    )
  }
}

export default Welcome;