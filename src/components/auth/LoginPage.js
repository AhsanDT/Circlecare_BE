import React, {useState} from 'react';
import {Card, Col, Form, Row} from "react-bootstrap";
import logo from "../../assets/images/logo2.png"
import logoAr from "../../assets/images/logo-ar.svg"
import {Link, useNavigate} from "react-router-dom";
import {useGetAccessTokenMutation, useLoginMutation} from "../../redux/services/api";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";

const LoginPage = () => {
    const lang = useSelector(state => state?.auth?.lang)
    const navigate = useNavigate()
    const [viewPassword, setViewPassword] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm()
    const [login, {isLoading}] = useLoginMutation()
    const [accessTokenRequest] = useGetAccessTokenMutation()

    const onLogin = async (data) => {
        const email = data?.email
        const password = data?.password
        login({email, password})
            .unwrap()
            .then((res) => {
                if (res?.success) {
                    toast.success(res?.msg, {id: 'login-success', duration: 4000})
                    navigate('/')
                    // accessTokenRequest({rf_token: res?.refresh_token})
                    //     .unwrap()
                    //     .then((response) => {
                    //
                    //     })
                }
            })
            .catch((err) => {
                if (err?.data) {
                    toast.error(err?.data?.error, {id: 'login-error', duration: 4000})
                }
            })
    }
    return (
        <>
            <Row className="justify-content-center align-items-center vh-100">
                <Col lg={5}>
                    <Card className="rounded-4 border-0 shadow">
                        <Card.Body className="p-4">
                            {lang === 'en' ? (
                                <img src={logo} alt="circle-care-app" height={132} className="d-block mx-auto mb-3"/>
                            ) : (
                                <img src={logoAr} alt="circle-care-app" height={132} className="d-block mx-auto mb-3"/>
                            )}

                            <h4 className="s-15 fw-600 text-dark text-center">Welcome back!</h4>
                            <h4 className="s-14 fw-500 text-muted text-center mb-5">Login to your admin account</h4>
                            <Form id="login" onSubmit={handleSubmit(onLogin)}>
                                <div className="input-bg rounded-3 p-2 px-3 mb-4">
                                    <Row className="align-items-center justify-content-center gx-3">
                                        <Col xs={'auto'}>
                                            <i className="fas fa-envelope s-28 d-block"/>
                                        </Col>
                                        <Col>
                                            <Form.Label htmlFor="email" className="form-label s-12 fw-400 text-muted">
                                                Email Address{' '} &nbsp;
                                                {errors?.email && <span
                                                    className="text-danger s-12 fw-400 mb-0">{errors?.email?.message}</span>}
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                                placeholder="admin@circlecare.com"
                                                {...register("email", {required: 'Please Enter Your Email'})}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="input-bg rounded-3 p-2 px-3 mb-1">
                                    <Row className="align-items-center justify-content-center gx-3">
                                        <Col xs={'auto'}>
                                            <i className="fas fa-lock s-28 d-block"/>
                                        </Col>
                                        <Col>
                                            <Form.Label htmlFor="email" className="form-label s-12 fw-400 text-muted">
                                                Password {' '} &nbsp;
                                                {errors?.password && <span
                                                    className="text-danger s-12 fw-400 mb-0">{errors?.password?.message}</span>}
                                            </Form.Label>
                                            <Form.Control
                                                type={viewPassword ? "text" : "password"}
                                                className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                                placeholder="********"
                                                {...register("password", {required: 'Please Enter Your Password'})}
                                            />
                                        </Col>
                                        <Col xs={'auto'}>
                                            {viewPassword ? <i className="far fa-eye s-20 d-block" role="button"
                                                               onClick={() => setViewPassword(false)}/> :
                                                <i className="far fa-eye-slash s-20 d-block" role="button"
                                                   onClick={() => setViewPassword(true)}/>}
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                            <Row className="mb-5">
                                <Col xs={'auto'} className="ms-auto">
                                    <Link to="/auth/recover" className="s-14 text-decoration-none fw-500">Recover
                                        Password</Link>
                                </Col>
                            </Row>

                            <Row className="mb-5 justify-content-center">
                                <Col xs={'auto'}>
                                    <p className="s-14 text-muted fw-400">
                                        Don’t have an account? <Link to="/auth/sign-up"
                                                                     className="s-14 text-decoration-none fw-500">Sign
                                        Up</Link>
                                    </p>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col xs={4}>
                                    <button form="login" type="submit"
                                            className="btn btn-primary btn-lg w-100 rounded-4 text-capitalize fw-500 text-white s-18">
                                        Login
                                        {isLoading && <span className="spinner-border spinner-border-sm border-2 ms-2"
                                                            role="status"/>}
                                    </button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default LoginPage;