import React, {useState} from 'react';
import {Card, Col, Form, Row, Spinner} from "react-bootstrap";
import logo from "../../assets/images/logo2.png"
import logoAr from "../../assets/images/logo-ar.svg"
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {useForm} from "react-hook-form";
import {useVerifyMutation} from "../../redux/services/api";
import {useSelector} from "react-redux";

const VerifyPage = () => {
    const lang = useSelector(state => state?.auth?.lang)
    const navigate = useNavigate()
    const [verify, { isLoading }] = useVerifyMutation()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const email = window.localStorage.getItem('email')
    const onVerify = async (data) => {
        const otp = data?.verifyCode
        const isVerify = await verify({email, otp})
        console.log(isVerify)
        if(isVerify?.data?.success){
            isVerify?.data?.msg && toast.success(isVerify?.data?.msg , {id: 'verify-success', duration: 4000})
            window.localStorage.setItem('otp', otp)
            navigate('/auth/create-password')
        }else{
            if(isVerify?.error.data?.error){
                toast.error(isVerify?.error.data?.error , {id: 'verify-error', duration: 4000})
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
                                Verifying you...
                            </h4>
                            <h4 className="s-14 fw-500 text-muted text-center mb-5">
                                Please enter the verification code that we’ve <br/>
                                sent to your email
                                <Link to="/" className="s-14 text-decoration-none fw-500">{email}</Link>
                            </h4>

                            <form id="verify" onSubmit={handleSubmit(onVerify)} className="mb-5">
                                <div className="input-bg rounded-3 p-2 px-3 ">
                                    <Row className="align-items-center justify-content-center gx-3">
                                        <Col xs={'auto'}>
                                            <i className="far fa-check-circle s-22 d-block"></i>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="tel"
                                                className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 px-0"
                                                placeholder="Verification Code"
                                                {...register('verifyCode', { required: 'Please Enter Verification Code' })}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                {errors?.verifyCode && <p className="text-danger mt-1">{errors.verifyCode.message}</p>}
                            </form>



                            <Row className="justify-content-center">
                                <Col xs={4}>
                                    <button form="verify" type="sumit" className="btn btn-primary btn-lg w-100 rounded-4 text-capitalize fw-500 text-white s-18">
                                        Verify
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

export default VerifyPage;