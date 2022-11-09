import React from "react";
import * as Yup from "yup";
import { compose } from "redux";
import { Formik } from "formik";
import classnames from 'classnames'
import { Spinner } from 'reactstrap';
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { withRouter } from "react-router-dom";
import axiosInstance from "utility/utils/useAxios";
import { useToasts } from 'react-toast-notifications';
import { bitwayLogo, loginBack } from "utility/helper/constant";

const { login } = AuthActions;

const Login = props => {
    const { addToast } = useToasts();

    const validationSchema = Yup.object({
        username: Yup.string().required('Please Enter Any Username'),
        password: Yup.string().required('Please Enter Any Password'),
    })

    const loginContainer = {
        backgroundImage: `url(${loginBack})`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        position: "fixed",
        overflow: "auto",
        top: 0,
        bottom: 0,
    };

    return (
        <div className="container-fluid" style={loginContainer}>
            <div className="form-container">
                <div className="login-icon d-flex justify-content-center text-center py-4 rounded my-4">
                    <img src={bitwayLogo} alt="icon"  width="120px" height="auto" />
                </div>
                <div className="login-title">Sign in to your account</div>
                <Formik 
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}  
                    onSubmit={(values, { setSubmitting }) => {
                        // same shape as initial values
                        axiosInstance.post('/admin/login', {
                            username: values.username, password: values.password
                        })
                        .then((response) => {
                            const data = {
                                accessToken: response.data.data.accessToken,
                                refreshToken: response.data.data.refreshToken,
                                adminData: response.data.data.admin
                            };
                            props.login(data);
                            props.history.push("/dashboard");
                            addToast(response.data.message, { appearance: 'success' });
                        })
                        .catch((error) => {
                            if (error.response) {
                                setSubmitting(false);
                                addToast(error.response.data.message, { appearance: 'error' });
                            }
                        })
                    }}
                >
                    {({ handleSubmit, handleChange, values, handleBlur, errors, touched, isSubmitting, isValid, submitCount, isValidating }) => (
                        <form className="pa-24" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className={classnames('form-control react-form-input', { 'is-invalid': errors.username && touched.username && true })}
                                    name="username"
                                    onChange={handleChange}
                                    value={values.username}
                                    onBlur={handleBlur}
                                    placeholder="Username"
                                />
                                {errors.username && touched.username && <span className="error-msg">{errors.username}</span>}
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className={classnames('form-control react-form-input', { 'is-invalid': errors.password && touched.password && true })}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Password"
                                />
                                {errors.password && touched.password && <span className="error-msg">{errors.password}</span>}
                            </div>

                            <div className="form-check text-center mtb-16">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="exampleCheck1"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="exampleCheck1"
                                >
                                    Remember me
                                </label>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="btn form-button c-primary">
                                {isSubmitting ? <Spinner color='white' size='sm' /> : 'Login'}
                            </button>
                            <div
                                className="text-center link-label"
                                onClick={() => props.history.push("/forgotPassword")}
                            >
                                Forgot Password ?
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default compose(
    withRouter,
    connect(
        null,
        { login }
    )
)(Login);
