import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import * as firebase from "firebase/app";
// react bootstarp components
import { Button, Row, Col, Modal, FormControl } from "react-bootstrap";
// material ui components
import {
  TextField,
  InputAdornment,
  IconButton,
  Hidden,
} from "@material-ui/core";
// icons form material ui
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";
import Utilities from "../../../../Utilities/Utilities";

export default function UserList() {
  const [state, setState] = React.useState({
    infoId: "",
    // username
    username: "",
    // first Name
    firstName: "",
    firstNameError: "",
    // last Name
    lastName: "",
    lastNameError: "",
    // email
    email: "",
    emailError: "",
    // password
    password: "",
    passwordError: "",
    // city,
    city: "",
    // date of birth
    dateOfBirth: moment().format("YYYY-MM-DD"),
    phoneNumber: "",
    educationLevel: "",
    // confirm password
    // cPassword:"",
    // cPasswordError:"",
  });

  const columns = [
    { title: "Avatar" },
    { title: "First Name" },
    { title: "Last Name" },
    { title: "Email" },
    { title: "Phone Number" },
    { title: "Date of Birth" },
    { title: "City" },
    { title: "Session Paid" },
    { title: "Cash Spent" },
    { title: "Rating" },
    { title: "Education Level" },
    { title: "# Reports Filed" },
    { title: "Actions" },
  ];

  // show password for update or not
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showMesg, setShowMesg] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPath, setProfilePicPath] = useState(
    "https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
  );
  const [oldPass, setOldPass] = useState("");
  const [userData, setUserData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  // model toogler
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  // disables button toogles
  const [btnDisabled, setBtnDisabled] = useState(true);
  // password view toogles state
  const [typeis, setTypeis] = useState("password");
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  useEffect(() => {
    setUserData([]);
    fetch("https://issyne.falconconsulting.fr/admin_panel/get_student/", {
      mathod: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${globalState.auth.authToken}`,
      },
    })
      .then((res) => res.json())
      .then(async (responseJson) => {
        var userDatais = [];
        await responseJson.map((item) => {
          userDatais.push([
            `<img src="https://issyne.falconconsulting.fr/${item.avatar}" style="width:50px;height:50px" />`,
            item.firstName,
            item.lastName,
            item.email,
            item.phoneNumber,
            moment(item.dateOfBirth).format("ddd MM YYYY"),
            item.city,
            item.amountOfSessionsPaid,
            item.totalCashSpent !== undefined ? item.totalCashSpent : 0,
            item.averageRatingGiven,
            item.educationLevel,
            item.totalReportsFiled <= 1
              ? `<span class="badge badge-pill badge-success">${item.totalReportsFiled}</span>`
              : `<span class="badge badge-pill badge-danger">${item.totalReportsFiled}</span>`,
            [item.id, item.email],
          ]);
        });
        // debugger;
        console.log(typeof userDatais);
        await setUserData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [updateData]);

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files[0];
    setProfilePic(fileUploaded);
    const Update = state;
    Update.resturant_desc = state.resturant_desc + ".";
    setState(Update);
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    reader.onload = function(e) {
      // console.log(reader.result);
      setProfilePicPath(reader.result);
      handleBtnDisables();
    };
  };

  // handle button disable function
  const handleBtnDisables = () => {
    // debugger;
    const {
      firstName,
      lastName,
      email,
      password,
      emailError,
      passwordError,
      firstNameError,
      lastNameError,
      username,
      city,
      dateOfBirth,
    } = state;
    var stateUpdate = state;
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== "" &&
      username !== "" &&
      city !== "" &&
      dateOfBirth !== ""
    ) {
      if (
        firstNameError === "" &&
        lastNameError === "" &&
        emailError === "" &&
        passwordError === ""
      ) {
        setBtnDisabled(false);
      } else {
        setBtnDisabled(true);
      }
    } else {
      setBtnDisabled(true);
    }
  };

  //  reset state data
  const handleResetState = () => {
    setState({
      infoId: "",
      // username
      username: "",
      // first Name
      firstName: "",
      firstNameError: "",
      // last Name
      lastName: "",
      lastNameError: "",
      // email
      email: "",
      emailError: "",
      // password
      password: "",
      passwordError: "",
      // city,
      city: "",
      // date of birth
      dateOfBirth: moment().format("YYYY-MM-DD"),
      // phone Number
      phoneNumber: "",
      educationLevel: "",
      // confirm password
      // cPassword:"",
      // cPasswordError:"",
    });
    setShowPasswordField(false);
  };

  // handle Change to fields
  const handleEmailChange = (e) => {
    if (Utilities.ValidateEmail(e.target.value)) {
      setState({ ...state, emailError: "" });
      handleBtnDisables();
    } else {
      setState({ ...state, emailError: "Invalid Email" });
      handleBtnDisables();
    }
    setState({ ...state, email: e.target.value });
    handleBtnDisables();
  };

  const handleChange = (e) => {
    var stateUpdate = { ...state };
    stateUpdate[e.target.name] = e.target.value;
    setState(stateUpdate);
    handleBtnDisables();
  };

  const handleToogle = () => {
    typeis === "password" ? setTypeis("text") : setTypeis("password");
  };

  // handleCloseModels
  const handleClose = () => {
    setShow(false);
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    handleResetState();
  };

  // handle add new record
  const handleAdd = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      username,
      city,
      dateOfBirth,
      phoneNumber,
      educationLevel,
    } = state;

    const form = new FormData();

    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("username", username);
    form.append("email", email);
    form.append("password", password);
    form.append("phoneNumber", phoneNumber);
    form.append("educationLevel", educationLevel);
    form.append("token", null);
    form.append("city", city);
    form.append("dateOfBirth", dateOfBirth);
    if (profilePic !== null) {
      form.append("profileImage", profilePic);
    }
    WebServiceManager.postApiCallForm(
      {
        endPoint: "student/register",
        dataToInsert: form,
        token: globalState.auth.authToken,
      },
      (statusCode, responseAdd) => {
        handleClose();
        handleResetState();
        setUpdateData(!updateData);
      }
    );
  };

  // handle Edit Click and process all data for fields
  const handleEdit = (id) => {
    var stateUpdate = state;
    WebServiceManager.getApiWithParamCall(
      {
        endPoint: "admin_panel/get_student_data",
        dataToFetch: id[1],
        token: globalState.auth.authToken,
      },
      (statusCode, responseUser) => {
        if (responseUser.success === true) {
          const {
            avatar,
            city,
            dateOfBirth,
            email,
            firstName,
            lastName,
            phoneNumber,
            token,
            username,
            educationLevel,
            password,
          } = responseUser.user;
          stateUpdate.firstName = firstName;
          stateUpdate.lastName = lastName;
          stateUpdate.email = email;
          stateUpdate.password = password;
          stateUpdate.infoId = email;
          stateUpdate.city = city;
          stateUpdate.dateOfBirth = moment(dateOfBirth).format("YYYY-MM-DD");
          stateUpdate.educationLevel = educationLevel;
          stateUpdate.username = username;
          stateUpdate.phoneNumber = phoneNumber;
          setState(stateUpdate);
          if (avatar !== undefined && avatar !== "") {
            setProfilePicPath(`http://locahost:4000/${avatar}`);
          }
          setShowEdit(true);
        } else {
          alert(responseUser.message);
        }
      }
    );
  };

  // handle Edit submit (update call.)
  const handleUpdate = (id) => {
    const {
      firstName,
      lastName,
      email,
      password,
      username,
      city,
      dateOfBirth,
      phoneNumber,
      educationLevel,
    } = state;

    const form = new FormData();

    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("username", username);
    form.append("email", email);
    form.append("password", password);
    form.append("phoneNumber", phoneNumber);
    form.append("educationLevel", educationLevel);
    form.append("token", null);
    form.append("city", city);
    form.append("dateOfBirth", dateOfBirth);
    if (profilePic !== null) {
      form.append("profileImage", profilePic);
    }
    WebServiceManager.putApiForm(
      {
        endPoint: "admin_panel/update_student",
        dataToUpdate: form,
        token: globalState.auth.authToken,
      },
      async (statusCode, responseUpdate) => {
        debugger;
        console.log("updates");
        await setShowEdit(false);
        setUpdateData(!updateData);
      }
    );
  };

  // handle delete function
  const handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      WebServiceManager.DeleteApiInURL(
        {
          endPoint: "admin_panel/delete_student",
          dataToDelete: id[0],
          token: globalState.auth.authToken,
        },
        (statusCode, response) => {
          setUpdateData(!updateData);
        }
      );
    }
  };

  // handle Show Password
  const handleShowPassword = () => {
    setShowPasswordField(!showPasswordField);
    if (showPasswordField !== true) {
      setOldPass(state.password);
      var stateUpdate = state;
      stateUpdate.password = "";
      setState(stateUpdate);
      handleBtnDisables();
    } else {
      var stateUpdate = state;
      stateUpdate.password = oldPass;
      setState(stateUpdate);
      setOldPass("");
    }
  };

  const actionsList = {
    deleteAction: handleDelete,
    updateAction: handleEdit,
    addAction: () => setShow(true),
  };

  console.log("this.st", state.dateOfBirth);

  return (
    <>
      {console.log("usersata", userData)}
      {userData.length > 0 ? (
        <DataTableComponent
          actionCol={12}
          columns={columns}
          data={userData}
          actions={actionsList}
        />
      ) : (
        <>
          <Row style={{ flexDirection: "row-reverse" }}>
            <Button vairent="primary" onClick={() => setShow(true)}>
              Add
            </Button>
          </Row>
          <hr />
          <p style={{ textAlign: "center" }}>No Record Found</p>
        </>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={3}>
              <FormControl
                type="file"
                className="display-hide"
                name="profilePic"
                onChange={handleFileChange}
                id="imggg"
                style={{ display: "none" }}
                accept="image/jpeg"
              ></FormControl>
              <img
                onClick={() => {
                  document.querySelector("#imggg").click();
                }}
                src={profilePicPath}
                style={{ width: 100, height: 100, borderRadius: "50%" }}
                className="reg-imgg"
                alt=""
              />
            </Col>
            <Col md={9}>
              <TextField
                id="outlined-username"
                label="Username"
                value={state.username}
                name="username"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-first-name"
                label="First Name"
                value={state.firstName}
                name="firstName"
                helperText={state.firstNameError}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-last-name"
                label="Last Name"
                value={state.lastName}
                name="lastName"
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-email"
                label="Email"
                value={state.email}
                name="email"
                onChange={(e) => handleEmailChange(e)}
                margin="normal"
                helperText={state.emailError}
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-password"
                label="Password"
                type={typeis}
                value={state.password}
                name={"password"}
                onChange={handleChange}
                margin="normal"
                helperText={state.passwordError}
                variant="outlined"
                // this is where visible button will be added
                InputProps={{
                  // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToogle}
                        onMouseDown={handleToogle}
                      >
                        {typeis === "password" ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-dob"
                label="Date Of Birth"
                value={state.dateOfBirth}
                name="dateOfBirth"
                type="date"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-city"
                label="City"
                value={state.city}
                name="city"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-phoneNumber"
                label="Phone Number"
                value={state.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-education"
                label="Education Level"
                value={state.educationLevel}
                name="educationLevel"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleAdd}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit model */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={3}>
              <FormControl
                type="file"
                className="display-hide"
                name="profilePic"
                onChange={handleFileChange}
                id="imggg"
                style={{ display: "none" }}
                accept="image/jpeg"
              ></FormControl>
              <img
                onClick={() => {
                  document.querySelector("#imggg").click();
                }}
                src={profilePicPath}
                style={{ width: 100, height: 100, borderRadius: "50%" }}
                className="reg-imgg"
                alt=""
              />
            </Col>
            <Col md={9}>
              <TextField
                id="outlined-username"
                label="Username"
                value={state.username}
                name="username"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-first-name-updated"
                label="First Name"
                value={state.firstName}
                name="firstName"
                helperText={state.firstNameError}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-last-name-updated"
                label="Last Name"
                value={state.lastName}
                name="lastName"
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-email-update"
                label="Email"
                disabled={true}
                value={state.email}
                name="email"
                onChange={(e) => handleEmailChange(e)}
                margin="normal"
                helperText={state.emailError}
                variant="outlined"
              />
            </Col>
            <Col sm={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPasswordField}
                      onChange={handleShowPassword}
                      name="showPassword"
                    />
                  }
                  label="Change Password"
                />
              </FormGroup>
            </Col>
            {showPasswordField ? (
              <Col md={12}>
                <TextField
                  id="outlined-password-update"
                  label="Password"
                  type={typeis}
                  value={state.password}
                  name="password"
                  onChange={handleChange}
                  margin="normal"
                  helperText={state.passwordError}
                  variant="outlined"
                  // this is where visible button will be added
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToogle}
                          onMouseDown={handleToogle}
                        >
                          {typeis === "password" ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Col>
            ) : (
              ""
            )}
            <Col md={6}>
              <TextField
                id="outlined-dob"
                label="Date Of Birth"
                value={state.dateOfBirth}
                name="dateOfBirth"
                type="date"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-city"
                label="City"
                value={state.city}
                name="city"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-phoneNumber"
                label="Phone Number"
                value={state.phoneNumber}
                name="phoneNumber"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-education"
                label="Education Level"
                value={state.educationLevel}
                name="educationLevel"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={btnDisabled}
            onClick={handleUpdate}
          >
            Update User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
