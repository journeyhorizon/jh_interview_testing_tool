import React, { useEffect, useRef, useState } from "react";
import * as css from "./Welcome.module.scss";
import * as inputCss from "./WelcomeFormInput/WelcomeFormInput.module.scss";
import * as types from "../../../types";
import { v4 as uuidv4 } from 'uuid';

// Components
import WelcomeFormInput from "./WelcomeFormInput/WelcomeFormInput";

// Api
import myApi from "../../../api/myApi";

// Assets
import logoColor from "../../../assets/logo-color.png";

// ALIAS
const NOTIFICATION = {
  LACK_OF_INFORMATION: "Please enter all fields",
  INVALID_INPUT: "Input is on invalid form",
  VALID_INPUT: ""
};

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  return { value, handleChange };
}

const Welcome = (props) => {
  const fullname = useFormInput("");
  const email = useFormInput("");
  const phone = useFormInput("");
  const [warningNotification, setWarningNotification] = useState("");

  const emailInputRef = useRef();
  const phoneInputRef = useRef();
  const notificationRef = useRef();
  const goButtonRef = useRef();

  useEffect(() => {
    localStorage.getItem("interviewee") && props.history.push("/testlist");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const checkFulfillInputFormForShowingButton = () => {
      if (fullname.value !== "" && email.value !== "" && phone.value !== "")
        changeDisplayOfElement(goButtonRef, "block");
      else changeDisplayOfElement(goButtonRef, "none");
    }

    checkFulfillInputFormForShowingButton();
  }, [fullname.value, email.value, phone.value])

  const handleSubmit = (event) => {
    event.preventDefault();

    if (fullname.value === "" || email.value === "" || phone.value === "") {
      changeDisplayOfElement(notificationRef, "flex");
      setWarningNotification(NOTIFICATION.LACK_OF_INFORMATION);
    } else {
      const regExpEmail = new RegExp(emailInputRef.current.pattern);
      const regExpPhone = new RegExp(phoneInputRef.current.pattern);

      if (!regExpEmail.test(emailInputRef.current.value) || !regExpPhone.test(phoneInputRef.current.value)) {
        handleInvalidInput(regExpEmail, regExpPhone);
      } else handleValidInput();
    }
  }

  const changeDisplayOfElement = (elementRef, displayStatus) => {
    elementRef.current.style.display = displayStatus;
  }

  const handleInvalidInput = (regExpEmail, regExpPhone) => {
    changeDisplayOfElement(notificationRef, "flex");
    setWarningNotification(NOTIFICATION.INVALID_INPUT);

    if (!regExpEmail.test(emailInputRef.current.value))
      modifyIsErrorInput(emailInputRef, true, inputCss.inputEmailError);
    else modifyIsErrorInput(emailInputRef, false, inputCss.inputEmailError);

    if (!regExpPhone.test(phoneInputRef.current.value))
      modifyIsErrorInput(phoneInputRef, true, inputCss.inputPhoneError);
    else modifyIsErrorInput(phoneInputRef, false, inputCss.inputPhoneError);
  }

  const handleValidInput = async () => {
    modifyIsErrorInput(emailInputRef, false, inputCss.inputEmailError);
    modifyIsErrorInput(phoneInputRef, false, inputCss.inputPhoneError);
    changeDisplayOfElement(notificationRef, "none");
    setWarningNotification(NOTIFICATION.VALID_INPUT);

    const intervieweeLength = await myApi().get(
      "/interviewee/getLength",
      { params: { tableName: types.INTERVIEWEE_TABLE_NAME } })
      .then(response => response.data);

    const intervieweeDetail = {
      fullname: fullname.value,
      email: email.value,
      phone: phone.value
    };

    localStorage.setItem("interviewee", JSON.stringify({ id: uuidv4(), ...intervieweeDetail }));
    props.history.push("/testlist");
  }

  const modifyIsErrorInput = (elementRef, isError, specifiedClass) => {
    isError ? elementRef.current.classList.add(inputCss.inputError, specifiedClass)
      : elementRef.current.classList.remove(inputCss.inputError, specifiedClass);
  }

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
          {...fullname}
        />
        <WelcomeFormInput
          id="intervieweeEmail"
          class={inputCss.inputEmail}
          type="text"
          name="email"
          placeholder="Email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          inputRef={emailInputRef}
          {...email}
        />
        <WelcomeFormInput
          id="intervieweePhone"
          class={inputCss.inputPhone}
          type="tel"
          name="phone"
          placeholder="Phone"
          pattern="^[0-9]{10}$"
          inputRef={phoneInputRef}
          {...phone}
        />
        <div ref={notificationRef} className={css.notification}>{warningNotification}</div>
        <button ref={goButtonRef} className={css.formButton} onClick={handleSubmit}>Go!</button>
      </form>
    </div>
  )
}

export default Welcome;
