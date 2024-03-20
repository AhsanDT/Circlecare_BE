import React, {useState} from 'react';
import {Card, Col, Form, Row, Spinner} from "react-bootstrap";
import logo from "../../assets/images/logo2.png"
import logoAr from "../../assets/images/logo-ar.svg"
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {useForgotMutation} from "../../redux/services/api";
import {useSelector} from "react-redux";
const RecoverPage = () => {
    const lang = useSelector(state => state?.auth?.lang)
    const navigate = useNavigate()
    const [viewPassword, setViewPassword] = useState(false)
    const [forgot, { isLoading }] = useForgotMutation()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onForgot = async (data) => {
        // const email = 'shahab.9865@iqra.edu.pk'
        // const password = 'Test@123'
        const email = data?.email
        const isForgot = await forgot({email})
        console.log(isForgot)
        if(isForgot?.data?.success){
            isForgot?.data?.msg && toast.success(isForgot?.data?.msg , {id: 'forgot-success', duration: 4000})
            window.localStorage.setItem('email', email)
            navigate('/auth/verify')
        }else{
            if(isForgot?.error.data?.error){
                toast.error(isForgot?.error.data?.error , {id: 'forgot-error', duration: 4000})
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
                                Recover your password
                            </h4>
                            <h4 className="s-14 fw-500 text-muted text-center mb-5">
                                Type in your email address so we can send you <br/>
                                a verification code
                            </h4>

                            <Form id="forgot" onSubmit={handleSubmit(onForgot)} className="input-bg rounded-3 p-2 px-3 mb-5">
                                <Row className="align-items-center justify-content-center gx-3">
                                    <Col xs={'auto'}>
                                        <i className="fas fa-envelope s-28 d-block"/>
                                    </Col>
                                    <Col>
                                        <Form.Label htmlFor="email" className="form-label s-12 fw-400 text-muted">
                                            Email Address {' '} &nbsp;
                                            {errors?.email && <span className="text-danger s-12 fw-400 mb-0">{errors?.email?.message}</span>}
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            id="email"
                                            className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                            placeholder="admin@circlecare.com"
                                            {...register("email", { required: 'Please Enter Your Email' })}
                                        />
                                    </Col>
                                </Row>
                            </Form>

                            <Row className="justify-content-center">
                                <Col xs={4}>
                                    <button
                                        form="forgot"
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 rounded-4 text-capitalize fw-500 text-white s-18"
                                    >
                                        Confirm
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

export default RecoverPage;