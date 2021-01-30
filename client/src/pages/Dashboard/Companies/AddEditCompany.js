import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "yup-phone";
import { alertService } from "../../../services";
import API from "../../../utils/API";
import Row from "../../../components/Row";
import Col from "../../../components/Col";
import Container from "../../../components/Container";
import { USERID } from "../../../constants/apiConstants"; 

function AddEditCompany({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  
  const [userType, setUserType] = useState("");

  function typeUsers() {
    const userId = localStorage.getItem(USERID);
    API.getUser(userId).then((res) => {
      console.log(res.data.type);
      setUserType(res.data.type);
     
    });
  }

  // form validation rules
  const validationSchema = Yup.object().shape({
    id: Yup.string(),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    phone: Yup.string()
      .phone("US", true, "Format invalid")
      .required("Phone is required"),
    type: Yup.string(),
    address: Yup.string().required("Street name is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip_code: Yup.string().required("Zip code is required"),
    country: Yup.string().required("Country is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .concat(isAddMode ? Yup.string().required("Password is required") : null)
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .when("password", (password, schema) => {
        if (password || isAddMode)
          return schema.required("Confirm Password is required");
      })
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  // functions to build form returned by useForm() hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    errors,
    formState,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function onSubmit(data) {
    return isAddMode ? createUser(data) : updateUser(id, data);
  }

  function createUser(data) {
    return API.saveUser(data)
      .then(() => {
        alertService.success("User has been created", {
          keepAfterRouteChange: true,
        });
        history.push(".");
      })
      .catch(alertService.error);
  }

  function updateUser(id, data) {
    console.log(data);
    return API.updateUser(id, data)
      .then((res) => {
        console.log(res);
        alertService.success("User updated", { keepAfterRouteChange: true });
        history.push("..");
      })
      .catch(alertService.error);
  }

  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAddMode) {
      // get user and set form fields
      API.getUser(id).then((user) => {
        const fields = [
          "id",
          "first_name",
          "last_name",
          "email",
          "phone",
          "type",
          "address",
          "city",
          "zip_code",
          "state",
          "country",
        ];
        fields.forEach((field) => setValue(field, user.data[field]));
        setUser(user.data);
      });
    }
    typeUsers();
  }, []);

  return (
    <Container style={{ marginTop: 30 }}>
      <Row>
        <Col size="md-2" />
        <Col size="md-8">
          <form
            className="card"
            onSubmit={handleSubmit(onSubmit)}
            onReset={reset}
          >
            <div className="card-header">
              <h1>{isAddMode ? "Add User" : "Edit User"}</h1>
            </div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group col-2">
                  <label>ID</label>
                  <input
                    name="id"
                    style={{
                      background: "rgba(0,0,0,0.07)",
                      pointerEvents: "none",
                    }}
                    type="text"
                    ref={register}
                    className={`form-control ${errors.id ? "is-invalid" : ""}`}
                  />
                  <div className="invalid-feedback">{errors.id?.message}</div>
                </div>
                <div className="form-group col-5">
                  <label>First Name</label>
                  <input
                    name="first_name"
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    type="text"
                    ref={register}
                    className={`form-control ${
                      errors.first_name ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.first_name?.message}
                  </div>
                </div>
                <div className="form-group col-5">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.last_name ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.last_name?.message}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-5">
                  <label>Email</label>
                  <input
                    name="email"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.email?.message}
                  </div>
                </div>
                <div className="form-group col-4">
                  <label>Phone</label>
                  <input
                    name="phone"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.phone?.message}
                  </div>
                </div>
                <div className="form-group col-3">
                  <label>Type</label>
                  
                  <select
                    className="form-control form-select form-select-sm"
                    name="type"
                    ref={register}
                    value={user.type}
                    aria-label=".form-select-sm"  
                    disabled= {userType === "Owner" ? true : false}                  
                    style={{ background: "rgba(0,0,0,0.07)", height:"33px", textAlign:"top"}}
                  >             
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Guest">Guest</option>
                  </select>                  
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-8">
                  <label>Address</label>
                  <input
                    name="address"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.address?.message}
                  </div>
                </div>
                <div className="form-group col-4">
                  <label>City</label>
                  <input
                    name="city"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.city ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">{errors.city?.message}</div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-4">
                  <label>State</label>
                  <input
                    name="state"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.state ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.state?.message}
                  </div>
                </div>
                <div className="form-group col-4">
                  <label>Zip Code</label>
                  <input
                    name="zip_code"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.zip_code ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.zip_code?.message}
                  </div>
                </div>
                <div className="form-group col-4">
                  <label>Country</label>
                  <input
                    name="country"
                    type="text"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.country ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.country?.message}
                  </div>
                </div>
              </div>
              {!isAddMode && (
                <div>
                  <h3 className="pt-3">Change Password</h3>
                  <p>Leave blank to keep the same password</p>
                </div>
              )}
              <div className="form-row">
                <div className="form-group col-6">
                  <label>
                    Password
                    {!isAddMode &&
                      (!showPassword ? (
                        <span>
                          {" "}
                          {/* <a
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-primary"
                          >
                            Show
                          </a> */}
                          {/*Activate Function to show Encrypted Password*/}
                        </span>
                      ) : (
                        <em> - {user.password}</em>
                      ))}
                  </label>
                  <input
                    name="password"
                    type="password"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.password?.message}
                  </div>
                </div>
                <div className="form-group col-6">
                  <label>Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    ref={register}
                    style={{ background: "rgba(0,0,0,0.07)" }}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.confirmPassword?.message}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="form-group">
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="btn btn-primary"
                >
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Save
                </button>
                <Link to={isAddMode ? "." : ".."} className="btn btn-link">
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </Col>
        <Col size="md-2" />
      </Row>
    </Container>
  );
}

export { AddEditCompany };
