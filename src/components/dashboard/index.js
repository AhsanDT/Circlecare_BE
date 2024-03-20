import React, {useEffect} from 'react';
import { Card, Col, Row } from "react-bootstrap";
import user from "../../assets/images/user.svg";
import LineChart from "./LineChart";
import {useGetActiveUserQuery, useGetDashboardQuery} from '../../redux/services/api';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const { data: app, isLoading, error, isFetching } = useGetDashboardQuery();
    const {data: activeUser, refetch} = useGetActiveUserQuery()

    useEffect(() => {
        refetch()
    }, [refetch]);

    console.log('activeUser', activeUser)

    if (isLoading) return <div>Loading...</div>
    return (
        <>
            <Row>
                <Col lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body>
                            <h6 className="mb-3 fw-00 s-13 text-muted">
                                {lang === 'en' ? 'Overview' : 'ملخص'}
                            </h6>
                            <Row className="justify-content-around">
                                <Col xs="auto">
                                    <h1 className="mb-1 s-24 fw-800 text-info text-center">
                                        {app?.data?.all_app_users}
                                    </h1>
                                    <p className="m-0 fw-500 s-14 text-muted text-center">
                                        {lang === 'en' ? 'Total Users' : 'إجمالي المستخدمين'}
                                    </p>
                                </Col>
                                <Col xs="auto">
                                    <h1 className="mb-1 s-24 fw-800 text-info text-center">
                                        {app?.data?.all_admin_users}
                                    </h1>
                                    <p className="m-0 fw-500 s-14 text-muted text-center">
                                        {lang === 'en' ? 'Total Admins' : 'إجمالي المشرفين'}
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body>
                            <h6 className="mb-3 fw-00 s-13 text-muted">
                                {lang === 'en' ? 'App Revenue Overview' : 'نظرة عامة على إيرادات التطبيقات'}
                            </h6>
                            <Row className="justify-content-around">
                                <Col xs="auto">
                                    <h1 className="mb-1 s-24 fw-800 text-info text-center">
                                        {app?.data?.all_surverys}
                                    </h1>
                                    <p className="m-0 fw-500 s-14 text-muted text-center">
                                        {lang === 'en' ? 'Total Surveys' : 'إجمالي المسوحات'}
                                    </p>
                                </Col>
                                <Col xs="auto">
                                    <h1 className="mb-1 s-24 fw-800 text-info text-center">
                                        {app?.data?.all_articles}
                                    </h1>
                                    <p className="m-0 fw-500 s-14 text-muted text-center">
                                        {lang === 'en' ? 'Total Articles' : 'إجمالي المقالات'}
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body>
                            <h6 className="mb-3 fw-00 s-13 text-muted">
                                {lang === 'en' ? 'Registered users in a week' : 'المستخدمين المسجلين في أسبوع'}
                            </h6>
                            <LineChart users={app?.data?.app_users} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body>
                            <h6 className="mb-3 fw-00 s-13 text-muted">
                                {lang === 'en' ? 'Active Users' : 'المستخدمين النشطين'}
                            </h6>
                            {activeUser?.map((item) => (
                                <Row key={item?.id} className="gx-2 align-items-center mb-2">
                                    <Col xs="auto">
                                        <img src={user} alt="circle-care-app" width={45} height={45} className="rounded-circle" />
                                    </Col>
                                    <Col xs="auto">
                                        <p className="m-0 fw-400 s-16 text-dark">
                                            {item?.appUserId?.first_name} {' '} {item?.appUserId?.last_name}
                                        </p>
                                    </Col>
                                    {item?.isActive && (
                                        <Col xs="auto" className="ms-auto">
                                            <div className="rounded-circle bg-success" style={{ height: 13, width: 13 }} />
                                        </Col>
                                    )}
                                </Row>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default DashboardPage;