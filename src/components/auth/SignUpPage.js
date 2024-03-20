import React, {useState} from 'react';
import {Card, Col, Form, Row, Spinner} from "react-bootstrap";
import logo from "../../assets/images/logo2.png"
import logoAr from "../../assets/images/logo-ar.svg"
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useRegisterMutation} from "../../redux/services/api";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";
const SignUpPage = () => {
    const navigate = useNavigate()
    const lang = useSelector(state => state?.auth?.lang)
    const [viewPassword, setViewPassword] = useState(false)
    const [registration, { isLoading }] = useRegisterMutation()
    const { register, handleSubmit, formState: { errors }, setError } = useForm()

    const onRegister = async (data) => {
        const fullName = data.name.split(' ');
        const [first_name, last_name] = fullName;
        const email = data?.email
        const password = data?.password
        if (fullName?.length !== 2) {
            setError('name', {message: 'Please Enter also Last Name' });
        }else{
            const isRegister = await registration({first_name, last_name, email, password})
            console.log(isRegister)
            if(isRegister?.data?.success){
                isRegister?.data?.msg && toast.success(isRegister?.data?.msg , {id: 'register-success', duration: 4000})
                setTimeout(() => {
                    navigate('/auth/login')
                }, 2000)

            }else{
                if(isRegister?.error.data?.error){
                    toast.error(isRegister?.error.data?.error , {id: 'register-error', duration: 4000})
                }
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
                                Get Started with{' '}
                                <Link to="/" className="s-14 text-decoration-none fw-500">Circle Care</Link>
                            </h4>
                            <h4 className="s-14 fw-500 text-muted text-center mb-5">Login to your admin account</h4>

                            <Form id="register" onSubmit={handleSubmit(onRegister)}>
                                <div className="input-bg rounded-3 p-2 px-3 mb-4">
                                    <Row className="align-items-center justify-content-center gx-3">
                                        <Col xs={'auto'}>
                                            <i className="fas fa-user s-28 d-block"/>
                                        </Col>
                                        <Col>
                                            <Form.Label htmlFor="email" className="form-label s-12 fw-400 text-muted">
                                                Your Full Name {' '} &nbsp;
                                                {errors?.name && <span className="text-danger s-12 fw-400 mb-0">{errors?.name?.message}</span>}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                                placeholder="John Doe"
                                                {...register("name", { required: 'Please Enter Your Name' })}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="input-bg rounded-3 p-2 px-3 mb-4">
                                    <Row className="align-items-center justify-content-center gx-3">
                                        <Col xs={'auto'}>
                                            <i className="fas fa-envelope s-28 d-block"/>
                                        </Col>
                                        <Col>
                                            <Form.Label htmlFor="email" className="form-label s-12 fw-400 text-muted">
                                                Your Email Address {' '} &nbsp;
                                                {errors?.email && <span className="text-danger s-12 fw-400 mb-0">{errors?.email?.message}</span>}
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                                placeholder="emaple@gmail.com"
                                                {...register("email", { required: 'Please Enter Your Email' })}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="input-bg rounded-3 p-2 px-3 mb-5">
                                    <Row className="align-items-center justify-content-center gx-3">
                                        <Col xs={'auto'}>
                                            <i className="fas fa-lock s-28 d-block"/>
                                        </Col>
                                        <Col>
                                            <Form.Label htmlFor="email" className="form-label s-12 fw-400 text-muted">
                                                Create a Strong Password {' '} &nbsp;
                                                {errors?.password && <span className="text-danger s-12 fw-400 mb-0">{errors?.password?.message}</span>}
                                            </Form.Label>
                                            <Form.Control
                                                type={viewPassword ? "text" : "password"}
                                                id="email"
                                                className="shadow-none border-0 rounded-0 bg-transparent s-16 text-dark fw-400 py-0 px-0"
                                                placeholder="********"
                                                {...register("password", { required: 'Please Enter Your Password' })}
                                            />
                                        </Col>
                                        <Col xs={'auto'}>
                                            {viewPassword ? <i className="far fa-eye s-20 d-block" role="button" onClick={() => setViewPassword(false)}/> : <i className="far fa-eye-slash s-20 d-block" role="button" onClick={() => setViewPassword(true)}/>}
                                        </Col>
                                    </Row>
                                </div>
                            </Form>

                            <Row className="mb-4 justify-content-center">
                                <Col xs={'auto'}>
                                    <p className="s-14 text-muted fw-400">
                                        Already have an account?{' '}
                                        <Link to="/auth/login" className="s-14 text-decoration-none fw-500">Login</Link>
                                    </p>
                                </Col>
                            </Row>

                            <Row className="justify-content-center">
                                <Col xs={6}>
                                    <button form="register" type="submit" className="btn btn-primary btn-lg w-100 rounded-4 text-capitalize fw-500 text-white s-18">
                                        Create Account
                                        {isLoading && <Spinner animation="border" size="sm" className="ms-2 border-2 d-inline-block" />}
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

export default SignUpPage;