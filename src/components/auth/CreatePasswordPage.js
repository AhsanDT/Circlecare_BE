import React, {useState} from 'react';
import {Card, Col, Form, Row, Spinner} from "react-bootstrap";
import logo from "../../assets/images/logo2.png"
import logoAr from "../../assets/images/logo-ar.svg";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {useResetMutation} from "../../redux/services/api";
import {useSelector} from "react-redux";

const CreatePasswordPage = () => {
    const lang = useSelector(state => state?.auth?.lang)
    const navigate = useNavigate()
    const [viewPassword, setViewPassword] = useState(false)
    const [viewPassword2, setViewPassword2] = useState(false)
    const [verify, { isLoading }] = useResetMutation()
    const { register, watch, handleSubmit, formState: { errors } } = useForm()

    const email = window.localStorage.getItem('email')
    const otp = window.localStorage.getItem('otp')
    const onReset = async (data) => {
        const isReset = await verify({email, otp, password: data?.password})
        console.log(isReset)
        if(isReset?.data?.success){
            isReset?.data?.msg && toast.success(isReset?.data?.msg , {id: 'verify-success', duration: 4000})
            navigate('/auth/login')
        }else{
            if(isReset?.error.data?.error){
                toast.error(isReset?.error.data?.error , {id: 'verify-error', duration: 4000})
            }
        }
    }
    return (
        <>
            <Row className="justify-content-center align-items-center vh-100" >
                <Col lg={5}>
                    <Card className="rounded-4 border-0 shadow">
                        <Card.Body className="p-4">
                            {lang === 'en' ? (
                                <img src={logo} alt="circle-care-app" height={132} className="d-block mx-auto mb-3"/>
                            ) : (
                                <img src={logoAr} alt="circle-care-app" height={132} className="d-block mx-auto mb-3"/>
                            )}
                            <h4 className="s-15 fw-600 text-dark text-center">
                                Create a new password
                            </h4>
                            <h4 className="s-14 fw-500 text-muted text-center mb-5">
                                Enter a strong password that is different from <br/>
                                your previous one
                            </h4>

                            <Form id="reset" onSubmit={handleSubmit(onReset)}>
                            <div className="input-bg rounded-3 p-2 px-3 mb-3">
                                <Row className="align-items-center justify-content-center gx-3">
                                    <Col xs={'auto'}>
                                        <i className="fas fa-lock s-28 d-block"/>
                                    </Col>
                                    <Col>
                                        <Form.Label className="form-label s-12 fw-400 text-muted">
                                            Create a New Password {' '} &nbsp;
                                            {errors?.password && <span className="text-danger s-12 fw-400 mb-0">{errors?.password?.message}</span>}
                                        </Form.Label>
                                        <Form.Control
                                            type={viewPassword ? "text" : "password"}
                                            className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                            {...register("password", { required: 'Please Enter Your Password' })}
                                        />
                                    </Col>
                                    <Col xs={'auto'}>
                                        {viewPassword ? <i className="far fa-eye s-20 d-block" role="button" onClick={() => setViewPassword(false)}/> : <i className="far fa-eye-slash s-20 d-block" role="button" onClick={() => setViewPassword(true)}/>}
                                    </Col>
                                </Row>
                            </div>
                            <div className="input-bg rounded-3 p-2 px-3 mb-5">
                                <Row className="align-items-center justify-content-center gx-3">
                                    <Col xs={'auto'}>
                                        <i className="fas fa-lock s-28 d-block"/>
                                    </Col>
                                    <Col>
                                        <Form.Label className="form-label s-12 fw-400 text-muted">
                                            Confirm New Password {' '} &nbsp;
                                            {errors?.confirmPassword && <span className="text-danger s-12 fw-400 mb-0">{errors?.confirmPassword?.message}</span>}
                                        </Form.Label>
                                        <Form.Control
                                            type={viewPassword2 ? "text" : "password"}
                                            className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                            {...register("confirmPassword", { required: 'Please Enter Your Password Again', validate: (value) => value === watch('password') || 'The passwords do not match' })}
                                        />
                                    </Col>
                                    <Col xs={'auto'}>
                                        {viewPassword2 ? <i className="far fa-eye s-20 d-block" role="button" onClick={() => setViewPassword2(false)}/> : <i className="far fa-eye-slash s-20 d-block" role="button" onClick={() => setViewPassword2(true)}/>}
                                    </Col>
                                </Row>
                            </div>
                            </Form>

                            <Row className="justify-content-center">
                                <Col xs={5}>
                                    <button form="reset" type="submit" className="btn btn-primary btn-lg w-100 rounded-4 text-capitalize fw-500 text-white s-18">
                                        Set Password
                                        {isLoading && <Spinner animation="border" variant="light" size="sm" className="ms-2 border-2 d-inline-block" />}
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

export default CreatePasswordPage;