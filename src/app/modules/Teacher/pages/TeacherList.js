import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import * as firebase from "firebase/app";
// react bootstarp components
import {
  Button,
  Row,
  Col,
  Modal,
  FormControl,
  Tabs,
  Tab,
} from "react-bootstrap";
// material ui components
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
// icons form material ui
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// chips
import ChipInput from "material-ui-chip-input";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";
import Utilities from "../../../../Utilities/Utilities";

export default function TeacherList() {
  //  reffeance for input field
  const hiddenFileInput = useRef(null);
  const filter = createFilterOptions();

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
    // date of birth
    dateOfBirth: moment().format("YYYY-MM-DD"),
    // phoneNumber,
    phoneNumber: "",
    experience: "",
    // address
    address: "",
    zipCode: "",
    lat: "",
    long: "",
    addressError: "",
    // confirm password
    // cPassword:"",
    // cPasswordError:"",
  });

  const columns = [
    { title: "Avatar" },
    { title: "Full Name" },
    { title: "Email" },
    { title: "Phone Number" },
    { title: "Date of Birth" },
    { title: "Address" },
    { title: "Experience" },
    { title: "Matrics" },
    { title: "Rating" },
    { title: "# Reports Filed" },
    { title: "Status" },
    { title: "Actions" },
  ];

  // show password for update or not
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [yourChips, setYourChips] = useState([]);
  const [showMesg, setShowMesg] = useState(false);
  const [key, setKey] = useState("idCard");
  // image file states
  const [profilePic, setProfilePic] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [kbis, setKbis] = useState(null);
  const [diploma, setDiplome] = useState(null);
  // image file path
  const [profilePicPath, setProfilePicPath] = useState(
    "https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
  );
  const [idCardPath, setIdCardPath] = useState("");
  const [kbisPath, setKbisPath] = useState("");
  const [diplomaPath, setDiplomaPath] = useState("");

  // password replace for password change
  const [oldPass, setOldPass] = useState("");

  // data list for users
  const [userData, setUserData] = useState([]);
  // status to update data/refresh data
  const [updateData, setUpdateData] = useState(false);
  // loader
  const [loader, setLoader] = useState(false);
  // value fro address autocomplete list.
  const [values, setValues] = useState([]);
  // model toogler
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
  // disables button toogles
  const [btnDisabled, setBtnDisabled] = useState(true);
  // password view toogles state
  const [typeis, setTypeis] = useState("password");
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  useEffect(() => {
    // console.log("Tag |Chnage")
  }, [yourChips]);

  useEffect(() => {
    setUserData([]);
    fetch("https://issyne.falconconsulting.fr/admin_panel/get_teacher/", {
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
            item.firstName + " " + item.lastName,
            item.email,
            item.phoneNumber,
            moment(item.dateOfBirth).format("ddd MM YYYY"),
            item.address,
            item.experience,
            convertStringToList(item.metrics),
            item.rating.toFixed(1),
            item.totalReportsFiled <= 1
              ? `<span class="badge badge-pill badge-success">${item.totalReportsFiled}</span>`
              : `<span class="badge badge-pill badge-danger">${item.totalReportsFiled}</span>`,
            item.currentStatus !== undefined ? item.currentStatus : "item1",
            [item.id, item.email],
          ]);
        });
        await setUserData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [updateData]);

  function convertStringToList(elm) {
    elm = elm.split("");
    elm = elm.filter((e) => e !== "[" && e !== "'" && e !== "]");
    var b = "";
    var c = [];
    elm.map((item) => {
      if (item === ",") {
        c.push(b);
        b = "";
      } else {
        b = b + item;
      }
    });
    c.push(b);

    return c;
  }

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (event.target.name === "profilePic") {
      setProfilePic(fileUploaded);
      const Update = state;
      Update.resturant_desc = state.resturant_desc + ".";
      setState(Update);
      var reader = new FileReader();
      reader.readAsDataURL(fileUploaded);
      reader.onload = function(e) {
        // console.log(reader.result);
        setProfilePicPath(reader.result);
      };
    } else if (event.target.name === "idCard") {
      setIdCard(fileUploaded);
    } else if (event.target.name === "kbis") {
      setKbis(fileUploaded);
    } else if (event.target.name === "diploma") {
      setDiplome(fileUploaded);
    } else {
      alert(event.target.name);
    }
    setLoader(!loader);
    handleBtnDisables();
  };

  // handle button disable function
  const handleBtnDisables = () => {
    // debugger;
    const {
      firstName,
      lastName,
      email,
      password,
      username,
      address,
      lat,
      long,
      dateOfBirth,
      experience,
    } = state;
    var stateUpdate = state;
    debugger;
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== "" &&
      username !== "" &&
      address !== "" &&
      dateOfBirth !== "" &&
      experience !== "" &&
      idCard !== null &&
      kbis !== null &&
      diploma !== null
    ) {
      if (lat !== "" && long !== "") {
        const stateUpdate = state;
        stateUpdate.addressError = "";
        setState(stateUpdate);
        setBtnDisabled(false);
      } else {
        const stateUpdate = state;
        stateUpdate.addressError = "Select From Suggestion to proceed.";
        setState(stateUpdate);
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
      // date of birth
      dateOfBirth: moment().format("YYYY-MM-DD"),
      // phoneNumber,
      phoneNumber: "",
      experience: "",
      // address
      address: "",
      zipCode: "",
      lat: "",
      long: "",
      addressError: "",
      // confirm password
      // cPassword:"",
      // cPasswordError:"",
    });
    setShowPasswordField(false);
    setProfilePic(null);
    setProfilePicPath(
      "https://www.pngkit.com/png/full/302-3022217_roger-berry-avatar-placeholder.png"
    );
    setYourChips([]);
    setIdCard(null);
    setKbis(null);
    setDiplome(null);
    setDiplomaPath("");
    setIdCardPath("");
    setKbisPath("");
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
      address,
      dateOfBirth,
      phoneNumber,
      experience,
    } = state;
    const form = new FormData();
    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("username", username);
    form.append("email", email);
    form.append("password", password);
    form.append("phoneNumber", phoneNumber);
    form.append("experience", experience);
    form.append("token", null);
    form.append("metrics", yourChips);
    form.append("status", "item2");
    form.append("address", address);
    form.append("dateOfBirth", dateOfBirth);
    if (profilePic !== null) {
      form.append("profileImage", profilePic);
    }
    form.append("idCard", idCard);
    form.append("kbis", kbis);
    form.append("diploma", diploma);

    WebServiceManager.postApiCallForm(
      {
        endPoint: "teacher/register",
        dataToInsert: form,
        token: globalState.auth.authToken,
      },
      (statusCode, responseAdd) => {
        debugger;
        if (responseAdd.message === undefined) {
          handleClose();
          handleResetState();
          setUpdateData(!updateData);
        } else {
          window.alert("Error=> ", responseAdd.message);
        }
      }
    );
  };

  // handle Edit Click and process all data for fields
  const handleEdit = (id) => {
    var stateUpdate = state;
    WebServiceManager.getApiWithParamCall(
      {
        endPoint: "admin_panel/get_teacher_data",
        dataToFetch: id[1],
        token: globalState.auth.authToken,
      },
      (statusCode, responseUser) => {
        if (responseUser.success === true) {
          const {
            avatar,
            address,
            dateOfBirth,
            email,
            firstName,
            lastName,
            phoneNumber,
            token,
            username,
            experience,
            password,
            idCard,
            kbis,
            diploma,
            metrics,
          } = responseUser.user;
          stateUpdate.firstName = firstName;
          stateUpdate.lastName = lastName;
          stateUpdate.email = email;
          stateUpdate.password = password;
          stateUpdate.infoId = email;
          stateUpdate.address = address;
          stateUpdate.dateOfBirth = moment(dateOfBirth).format("YYYY-MM-DD");
          stateUpdate.experience = experience;
          stateUpdate.username = username;
          stateUpdate.phoneNumber = phoneNumber;
          stateUpdate.lat = 0;
          stateUpdate.long = 0;
          setState(stateUpdate);
          if (avatar !== undefined && avatar !== "") {
            setProfilePicPath(`https://issyne.falconconsulting.fr/${avatar}`);
          }
          // set path for show in document  models;
          setIdCardPath(`https://issyne.falconconsulting.fr/${idCard}`);
          setKbisPath(`https://issyne.falconconsulting.fr/${kbis}`);
          setDiplomaPath(`https://issyne.falconconsulting.fr/${diploma}`);

          // settags for matrices
          setYourChips(convertStringToList(metrics));
          setIdCard("test");
          setKbis("test");
          setDiplome("test");
          // show update model
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
      address,
      dateOfBirth,
      phoneNumber,
      experience,
    } = state;
    // debugger;
    const form = new FormData();
    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("username", username);
    form.append("email", email);
    form.append("password", password);
    form.append("phoneNumber", phoneNumber);
    form.append("experience", experience);
    form.append("token", null);
    debugger;
    form.append("metrics", yourChips);
    form.append("status", "item2");
    form.append("address", address);
    form.append("dateOfBirth", dateOfBirth);
    if (profilePic !== null) {
      form.append("profileImage", profilePic);
    }
    if (idCard !== null && idCard !== "test") {
      form.append("idCard", idCard);
    }
    if (kbis !== null && kbis !== "test") {
      form.append("kbis", kbis);
    }
    if (diploma !== null && diploma !== "test") {
      form.append("diploma", diploma);
    }
    WebServiceManager.putApiForm(
      {
        endPoint: "admin_panel/update_teacher",
        dataToUpdate: form,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUpdate) => {
        if (responseUpdate.status === true) {
          console.log("updates");
          setShowEdit(false);
          setUpdateData(!updateData);
        } else {
          window.alert("Error", responseUpdate.error);
        }
      }
    );
  };

  // handle delete function
  const handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      WebServiceManager.DeleteApiInURL(
        {
          endPoint: "admin_panel/delete_teacher",
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
    viewDocAction: () => setShowDoc(true),
  };

  const handleAddChip = (chip) => {
    console.log("chip", chip);
    setYourChips([...yourChips, chip]);
  };
  const handleDeleteChip = (chip, index) => {
    // Remove item 'seven' from array
    var delArray = yourChips.filter(function(e) {
      return e !== chip;
    });
    setYourChips(delArray);
  };

  const GetAllAdress = (e) => {
    var stateUpdate = state;
    if (stateUpdate.lat === "" || stateUpdate.long === "") {
      stateUpdate.address = e.target.value;
      stateUpdate.addressError =
        "Please Select From Option to avail location functionilty in app.";
      setState(stateUpdate);
    }
    // calling api to get request result for address.
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=street&autocomplete=1&limit=15"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("res address", responseJson);
        var addressToSet = [];
        // debugger;
        for (var i = 0; i < responseJson.features.length; i++) {
          addressToSet.push({
            id: i,
            label: responseJson.features[i].properties.label,
            city: responseJson.features[i].properties.city,
            PostalCode: responseJson.features[i].properties.postcode,
            lat: responseJson.features[0].geometry.coordinates[1],
            lng: responseJson.features[0].geometry.coordinates[0],
          });
        }
        if (addressToSet.length === responseJson.features.length) {
          setValues(addressToSet);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const SetAddress = async (item) => {
    const selectedItem = item.target.textContent;
    for (var i = 0; i < values.length; i++) {
      if (values[i].label === selectedItem) {
        var stateUpdate = state;
        var zipCode = values[i].PostalCode;
        var lat = values[i].lat;
        var lng = values[i].lng;
        // var newAddress = values[i].label.split(String(zipCode));
        stateUpdate.address = values[i].label;
        stateUpdate.zipCode = zipCode;
        stateUpdate.lat = lat;
        stateUpdate.long = lng;
        stateUpdate.addressError = "";
        console.log("updated Data", stateUpdate);
        await setState(stateUpdate);
        console.log("New", state);
        // dummy state to update fields
        setLoader(!loader);
        handleBtnDisables();
      }
    }
  };

  return (
    <>
      {userData.length > 0 ? (
        <DataTableComponent
          actionCol={11}
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
      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={2}>
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
            <Col md={5}>
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
            <Col md={5}>
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
                id="outlined-email"
                label="Email"
                value={state.email}
                type="email"
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
                label="Experience"
                value={state.experience}
                name="experience"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <Autocomplete
                id="country-select-demo"
                options={values}
                style={{ marginTop: 15 }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                autoSelect
                onChange={SetAddress}
                renderOption={(option) => (
                  <React.Fragment>{option.label}</React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    variant="outlined"
                    value={state.address}
                    onChange={GetAllAdress}
                    helperText={state.addressError}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Col>
            <Col md={6} style={{ margin: "10px 0px" }}>
              <ChipInput
                fullWidth={true}
                label="Matrics"
                helperText="Matrics courses"
                value={yourChips}
                defaultValue={[]}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip, index) => handleDeleteChip(chip, index)}
                variant="outlined"
              />
            </Col>
          </Row>
          {/* row divider */}
          <Row style={{ marginTop: 20, marginLeft: 20 }}>
            <h2>Documents</h2>
          </Row>
          <hr style={{ borderTop: "1px solid black" }} />
          <Row>
            <Col md={6}>
              <label className="labelFile">
                ID Card <span style={{ color: "red" }}>*</span>
              </label>
              <TextField
                id="outlined-idcard"
                name="idCard"
                type="file"
                onChange={handleFileChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <label className="labelFile">
                KBIS <span style={{ color: "red" }}>*</span>
              </label>
              <TextField
                id="outlined-kbis"
                name="kbis"
                type="file"
                onChange={handleFileChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <label className="labelFile">
                Diploma <span style={{ color: "red" }}>*</span>
              </label>
              <TextField
                id="outlined-diploma"
                name="diploma"
                type="file"
                onChange={handleFileChange}
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
            Add Teacher
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit model */}
      <Modal show={showEdit} size="lg" onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={2}>
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
            <Col md={5}>
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
            <Col md={5}>
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
                id="outlined-email"
                label="Email"
                value={state.email}
                type="email"
                name="email"
                disabled={true}
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
                label="Experience"
                value={state.experience}
                name="experience"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <Autocomplete
                id="country-select-demo"
                options={values}
                style={{ marginTop: 15 }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                autoSelect
                onChange={SetAddress}
                renderOption={(option) => (
                  <React.Fragment>{option.label}</React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    variant="outlined"
                    value={state.address}
                    onChange={GetAllAdress}
                    helperText={state.addressError}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Col>
            <Col md={12} style={{ margin: "10px 0px" }}>
              <ChipInput
                fullWidth={true}
                label="Matrics"
                helperText="Matrics courses"
                value={yourChips}
                defaultValue={[]}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip, index) => handleDeleteChip(chip, index)}
                variant="outlined"
              />
            </Col>
          </Row>
          {/* row divider */}
          <Row style={{ marginTop: 20, marginLeft: 20 }}>
            <h2>Documents</h2>
            <Button
              variant="warning"
              onClick={() => setShowDoc(true)}
              style={{ marginLeft: 20 }}
            >
              View Old Documents
            </Button>
          </Row>
          <hr style={{ borderTop: "1px solid black" }} />
          <Row>
            <Col md={6}>
              <label className="labelFile">ID Card</label>
              <TextField
                id="outlined-idcard"
                name="idCard"
                type="file"
                onChange={handleFileChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <label className="labelFile">KBIS</label>
              <TextField
                id="outlined-kbis"
                name="kbis"
                type="file"
                onChange={handleFileChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <label className="labelFile">Diploma</label>
              <TextField
                id="outlined-diploma"
                name="diploma"
                type="file"
                onChange={handleFileChange}
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
            Update Teacher
          </Button>
        </Modal.Footer>
      </Modal>
      {/* document model */}
      <Modal show={showDoc} size="md" onHide={() => setShowDoc(false)}>
        <Modal.Header closeButton>Documents</Modal.Header>
        <Modal.Body>
          <h3>Documents</h3>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            <Tab eventKey="idCard" title="ID Card">
              <img
                src={idCardPath}
                alt="idcard"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </Tab>
            <Tab eventKey="kbis" title="KBIS">
              <img
                src={kbisPath}
                alt="kbis"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </Tab>
            <Tab eventKey="diploma" title="Diploma">
              <img
                src={diplomaPath}
                alt="diploma"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDoc(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
