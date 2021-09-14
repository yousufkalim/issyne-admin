import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
// material ui components
import { TextField } from "@material-ui/core";
// -----------------

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";

// import qr code genrator
import { QRCode } from "react-qr-svg";

export default function PackagesList() {
  const [state, setState] = React.useState({
    infoId: "",
    coins: "",
    price: "",
  });

  const columns = [
    { title: "Name" },
    { title: "Coins" },
    { title: "Price" },
    { title: "Actions" },
  ];

  const [packagesData, setPackagesData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  // model toogler
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  // disables button toogles
  const [btnDisabled, setBtnDisabled] = useState(true);
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  // populate data on load and on list change
  useEffect(() => {
    setPackagesData([]);
    fetch("https://issyne.falconconsulting.fr/get_package", {
      mathod: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${globalState.auth.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        var userDatais = [];
        responseJson.map((item, index) => {
          userDatais.push([
            `Package #${index}`,
            item.data.coins,
            item.data.price,
            item.id,
          ]);
        });
        setPackagesData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [updateData]);

  // handle button disable function
  const handleBtnDisables = () => {
    const { coins, price } = state;
    if (coins !== "" && price !== "") {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  //  reset state data
  const handleResetState = () => {
    setState({
      infoId: "",
      coins: "",
      price: "",
    });
  };

  const handleChange = (e) => {
    var stateUpdate = { ...state };
    stateUpdate[e.target.name] = e.target.value;
    setState(stateUpdate);
    handleBtnDisables();
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
    const { coins, price } = state;
    const formData = {
      coins,
      price,
    };
    WebServiceManager.postApiCall(
      {
        endPoint: "post_package",
        dataToInsert: JSON.stringify(formData),
        token: globalState.auth.authToken,
      },
      (statusCode, responseAdd) => {
        if (statusCode === "200") {
          handleClose();
          handleResetState();
          setUpdateData(!updateData);
        } else {
          alert(responseAdd.message);
        }
      }
    );
  };

  // handle Edit Click
  const handleEdit = (id) => {
    var stateUpdate = state;
    packagesData.map((item) => {
      if (item[3] === id) {
        stateUpdate.coins = item[1];
        stateUpdate.price = item[2];
        stateUpdate.infoId = id;

        setState(stateUpdate);
        handleBtnDisables();
        setShowEdit(true);
      }
    });
  };

  // handle Edit submit (update call.)
  const handleUpdate = () => {
    const { coins, price, infoId } = state;
    const formData = {
      id: infoId,
      coins,
      price,
    };

    WebServiceManager.postApiCall(
      {
        endPoint: "update_package",
        dataToInsert: JSON.stringify(formData),
        token: globalState.auth.authToken,
      },
      (statusCode, responseUpdate) => {
        setShowEdit(false);
        setUpdateData(!updateData);
      }
    );
  };

  // handle delete function
  const handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      WebServiceManager.postApiCall(
        {
          endPoint: "delete_package",
          dataToInsert: JSON.stringify({ id }),
          token: globalState.auth.authToken,
        },
        (statusCode, response) => {
          setUpdateData(!updateData);
        }
      );
    }
  };

  const actionsList = {
    deleteAction: handleDelete,
    updateAction: handleEdit,
    addAction: () => setShow(true),
  };

  return (
    <>
      {packagesData.length > 0 ? (
        <DataTableComponent
          actionCol={3}
          columns={columns}
          data={packagesData}
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
      {/* add modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Coins"
                name="coins"
                value={state.coins}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Price"
                value={state.price}
                name="price"
                onChange={handleChange}
                helperText={state.lastNameError}
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
            Add Table
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Coins"
                name="coins"
                value={state.coins}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Price"
                value={state.price}
                name="price"
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
            Update Table
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
