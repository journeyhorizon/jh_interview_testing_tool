import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import * as css from "./Dashboard.module.scss";

// Assets
import intervieweeList from "../../../assets/icons/interviewee-list.png";
import logout from "../../../assets/icons/logout.png";

// ALIAS
const CATEGORY_INTERVIEWEE_LIST = "INTERVIEWEE LIST";
const CATEGORY_LOGOUT = "LOGOUT";

const MenuCategory = (props) => {
  const imageSource = (type) => {
    switch (type) {
      case CATEGORY_INTERVIEWEE_LIST:
        return intervieweeList;
      case CATEGORY_LOGOUT:
        return logout;
      default: return null;
    }
  }

  return (
    <div className={css.category}>
      <img className={css.categoryIcon} src={imageSource(props.type)} alt="icon" />
      <h3 className={css.categoryName}>{props.type}</h3>
    </div>
  )
}

const Dashboard = (props) => {
  useEffect(() => {
    !sessionStorage.getItem("admin") && props.history.push("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
  }

  return (
    <div className={css.container}>
      <Link className={css.link} to={`/admin/intervieweelist`}>
        <MenuCategory type={CATEGORY_INTERVIEWEE_LIST} />
      </Link>
      <Link className={css.link} to={`/admin`} onClick={handleLogout}>
        <MenuCategory type={CATEGORY_LOGOUT} />
      </Link>
    </div>
  )
}

export default Dashboard;
