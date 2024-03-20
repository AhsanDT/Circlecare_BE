import React, { useEffect } from 'react';
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import User from '../../assets/images/user.svg'
import camera from '../../assets/images/camera.svg'
import { useGetUserInfoQuery, useUpdateAvatarMutation, useUpdateInfoMutation } from "../../redux/services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";

const SettingPage = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm()
    const { data: user, refetch, isFetching, isLoading } = useGetUserInfoQuery()
    const [avatarRequest] = useUpdateAvatarMutation()
    const [infoRequest, { isLoading: isAdding }] = useUpdateInfoMutation()

    const updatePhoto = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('file', e.target.files[0])
        avatarRequest(data)
            .unwrap()
            .then((res) => {
                console.log(res)
                toast.success(res?.msg, { id: 'update-photo-success', duration: 4000 })
                refetch()
            })
            .catch((err) => {
                console.log(err)
            })

    }
    const onUpdate = (data) => {
        infoRequest(data)
            .unwrap()
            .then((res) => {
                reset()
                console.log(res)
                toast.success(res?.data, { id: 'update-info-success', duration: 4000 })
                refetch()
            })
            .catch((err) => {
                toast(err?.data?.error, { id: 'update-info-error', duration: 4000 })
            })
    }

    isLoading && <div>Loading...</div>
    isFetching && <div>Fetching...</div>

    useEffect(() => {
        if (user) {
            console.log('users', user)
            setValue('first_name', user?.data[0]?.first_name)
            setValue('last_name', user?.data[0]?.last_name)
            setValue('email', user?.data[0]?.email)
        }
    }, [user])

    useEffect(() => {
        refetch()
    }, [])

    return (
        <>
            <Card>
                <Card.Body>
                    <Row className="align-items-center justify-content-between mb-3">
                        <Col xs="auto">
                            <div className="position-relative">
                                <label htmlFor="user-input" role="button" className="position-absolute bottom-0 end-0 p-2">
                                    <img src={camera} alt="" width={35} height={35} className="img-cover" />
                                </label>
                                <input className="d-none" type="file" id="user-input" onChange={updatePhoto} />
                                {user?.data[0]?.avatar ? (
                                    <img src={process.env.REACT_APP_BASE_URL + user?.data[0]?.avatar} alt="" width={200} height={200} className="img-cover rounded-3 border" />
                                ) : (
                                    <img src={User} alt="" width={200} height={200} className="img-cover rounded-3 border" />
                                )}

                            </div>
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit(onUpdate)} className="row g-3">
                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'First Name' : 'الاسم الأول'}:
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('first_name', { required: true })}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Last Name' : 'اسم العائلة'}:
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('last_name', { required: true })}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Email' : 'بريد إلكتروني'}:
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('email', { required: true })}
                            />
                        </Col>
                        {/*<Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Password' : 'كلمة المرور'}:
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('password', { required: false })}
                            />
                        </Col>*/}
                        <Col md="auto" className="mt-auto mb-1">
                            <Button variant="primary" type="submit" disabled={isAdding} className="shadow-none s-14 text-white w-100">
                                Save Changes
                            </Button>
                        </Col>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};

export default SettingPage;