/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ContactsIcon from '@material-ui/icons/Contacts';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';


export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
        ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
        : "";
  };

  return (
      <>
        {/* begin::Menu Nav */}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/*begin::1 Level*/}
          <li
              className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <DashboardIcon />
            </span>
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>
          {/* users */}
          <li
              className={`menu-item ${getMenuItemActive("/user", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/user">
            <span className="svg-icon menu-icon">
              <ContactsIcon />
            </span>
              <span className="menu-text">Student</span>
            </NavLink>
          </li>
          {/* teacher */}
          <li
              className={`menu-item ${getMenuItemActive("/teacher", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/teacher">
            <span className="svg-icon menu-icon">
              <ContactsIcon />
            </span>
              <span className="menu-text">Teacher</span>
            </NavLink>
          </li>
          {/* packages */}
          <li
              className={`menu-item ${getMenuItemActive("/packages", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/packages">
            <span className="svg-icon menu-icon">
              <ReceiptIcon />
            </span>
              <span className="menu-text">Packages</span>
            </NavLink>
          </li>
        </ul>

        {/* end::Menu Nav */}
      </>
  );
}
