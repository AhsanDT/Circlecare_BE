import React, { useEffect } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import user from '../../../assets/images/user.svg'
import { useGetDetailAppUserQuery } from "../../../redux/services/api";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import moment from "moment";

const UserListDetailPage = () => {
    const { id } = useParams()
    const { data, refetch, isLoading } = useGetDetailAppUserQuery(id)
    useEffect(() => {
        if(id){
            refetch()
        }
    }, [id])



    console.log('appUser', data?.data)
    const appUser = data?.data?.users
    const survey = data?.data?.survey


    if (isLoading) return <>Loading...</>

    return (
        <>
            <Card className="rounded-4">
                <Card.Body>
                    <Row>
                        <Col lg={12}>
                            <h5 className="fw-500 s-14 mb-4 py-2 border-bottom">
                                <i className="fa-light fa-user s-18 me-2 text-primary"></i>
                                User Profile 
                            </h5>
                        </Col>
                        <Col lg={12}>
                            <Row className="align-items-center g-0 border-bottom py-2">
                                <Col lg="auto">
                                    {/*{appUser[0]?.avatar ? (*/}
                                    {/*    <img src={process.env.REACT_APP_BASE_URL + appUser[0]?.avatar} alt="user" width={60} height={60} className="rounded-circle me-5" />*/}
                                    {/*) : ''}*/}
                                </Col>
                                <Col>
                                    <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                        <i className="fa-light fa-user s-18 me-2"></i>
                                        Name :
                                        <span className="text-dark ms-2 fw-600">
                                            {appUser[0]?.first_name}&nbsp; {appUser[0]?.last_name}
                                        </span>
                                    </h5>
                                    {appUser[0]?.dob && (
                                        <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                            <i className="fa-light fa-calendar s-18 me-2"></i>
                                            Birth Date :
                                            <span className="text-dark ms-2 fw-600">
                                                {appUser[0]?.dob && <>
                                                    {appUser[0]?.dob}
                                                    {/*{moment(appUser[0]?.dob)} &nbsp; - &nbsp;*/}
                                                    {/*{moment().diff(appUser[0]?.dob, 'years')} years old*/}
                                                </>}
                                            </span>
                                        </h5>
                                    )}
                                </Col>
                                <Col>
                                    {/*<h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                        <i className="fa-light fa-location-dot s-18 me-2"></i>
                                        Location :
                                        <span className="text-dark ms-2 fw-600">
                                            San Francisco Valley, USA
                                        </span>
                                    </h5>*/}
                                    <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                        <i className="fa-light fa-calendar s-18 me-2"></i>
                                        Email :
                                        <span className="text-dark ms-2 fw-600">
                                            {appUser[0]?.email}
                                        </span>
                                    </h5>
                                </Col>
                                <Col>
                                    {appUser[0]?.gender && (
                                        <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                            <i className="fa-light fa-venus-mars s-18 me-2"></i>
                                            Gender :
                                            <span className="text-dark ms-2 fw-600">
                                                {appUser[0]?.gender}
                                            </span>
                                        </h5>
                                    )}

                                    {appUser[0]?.marital_status && (
                                        <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                            <i className="fa-light fa-calendar s-18 me-2"></i>
                                            Status :
                                            <span className="text-dark ms-2 fw-600">
                                                {appUser[0]?.marital_status}
                                            </span>
                                        </h5>
                                    )}

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className=" mt-4">
                        <Col>
                            <Card className="rounded-4">
                                <Card.Body>
                                    <div className="mb-4">
                                        <h4 className="fw-600 s-18 text-primary mb-3">Demographics</h4>
                                        {appUser[0]?.user_type && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                You are a:
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.user_type}
                                                </span>
                                            </h5>
                                        )}
                                        {appUser[0]?.linguistic_prefrences && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Linguistic Preference :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.linguistic_prefrences}
                                                </span>
                                            </h5>
                                        )}

                                        {appUser[0]?.education_level && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Educational Level :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.education_level}
                                                </span>
                                            </h5>
                                        )}

                                    </div>

                                    <div className="mb-4">
                                        <h4 className="fw-600 s-18 text-primary mb-3">
                                            General Health Information:
                                        </h4>
                                        {appUser[0]?.cancer_type && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Cancer Type :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.cancer_type}
                                                </span>
                                            </h5>
                                        )}

                                        {appUser[0]?.other_conditions && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Other Conditions :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.other_conditions}
                                                </span>
                                            </h5>
                                        )}

                                        {appUser[0]?.severity_of_symptoms && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Severity Of Symptoms :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.severity_of_symptoms}
                                                </span>
                                            </h5>
                                        )}

                                        {appUser[0]?.regular_checkup_reminders && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Regular Checkup Reminders :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.regular_checkup_reminders}
                                                </span>
                                            </h5>
                                        )}

                                        {appUser[0]?.tumor_stage && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Stage of Tumor :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.tumor_stage}
                                                </span>
                                            </h5>
                                        )}
                                        {appUser[0]?.current_cancer_treatment && (
                                            <h5 className="fw-500 s-14 m-0 py-2 text-muted">
                                                Current Cancer Treatments :
                                                <span className="text-dark ms-2 fw-600">
                                                    {appUser[0]?.current_cancer_treatment?.join(', ')}
                                                </span>
                                            </h5>
                                        )}

                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        {survey?.length > 0 && (
                            <Col>
                                <Card className="rounded-4">
                                    <Card.Body>
                                        <div className="mb-4">
                                            <h4 className="fw-600 s-18 text-primary mb-3">
                                                Accomplished Questionnaires
                                            </h4>

                                            <ul style={{ listStyleType: 'decimal' }}>
                                                {survey?.map((item) => (
                                                    <li>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}

                    </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default UserListDetailPage;