import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';
import logo from '../../assets/images/LogoFINAL.svg'
import logoAr from '../../assets/images/logo-ar.svg'
import user from '../../assets/images/user.svg'
import { Link, Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import { useSelector } from "react-redux";
import Socket from "../../Socket";

const Layout = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const token = useSelector(state => state?.auth?.token);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const isAuth = () => {
        return token !== null && token !== undefined && token !== '';
    }

    useEffect(() => {
        console.log('Initializing socket', Socket)
        // for backend and frontend connections
        Socket.emit("connection");
    }, [])



    return (
        <div>
            {isAuth() ? (
                <Row className="g-0">
                    <Col className={`border px-3 bg-white position-fixed top-0 ${lang === 'en' ? 'start-0' : 'end-0'}`} style={{ maxWidth: 295, height: '100dvh', overflowY: 'auto' }}>
                        {lang === 'en' ? (
                            <img src={logo} alt="circle-care-app" height={100} className="d-block mx-auto my-4" />
                        ) : (
                            <img src={logoAr} alt="circle-care-app" height={100} className="d-block mx-auto my-4" />
                        )}
                        <h6 className="fw-600 s-12 text-secondary">
                            {lang === 'en' ? 'OVERVIEW' : 'ملخص'}
                        </h6>
                        <Row className="align-items-center p-2 ms-2 mb-2">
                            <Col xs="auto">
                                <i className="fa-light fa-grid-2 d-block s-22"></i>
                            </Col>
                            <Col>
                                <Link to="/" className="fw-400 s-15 text-menu mb-0 text-decoration-none">
                                    {lang === 'en' ? 'Dashboard' : 'لوحة القيادة'}
                                </Link>
                            </Col>
                        </Row>
                        <Row className="align-items-center p-2 ms-2 mb-2">
                            <Col xs="auto">
                                <i className="fa-light fa-users d-block s-22"></i>
                            </Col>
                            <Col>
                                <Link to="/sub-admin" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                    {lang === 'en' ? 'Sub Admins' : 'المشرفون الفرعيون'}
                                </Link>
                            </Col>
                        </Row>
                        <Row className="align-items-center p-2 ms-2 mb-2">
                            <Col xs="auto">
                                <i className="fa-light fa-users d-block s-22"></i>
                            </Col>
                            <Col>
                                <Link to="/user-list" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                    {lang === 'en' ? 'End Users' : 'المستخدمين النهائيين'}
                                </Link>
                            </Col>
                        </Row>
                        <h6 className="fw-600 s-12 text-secondary">
                            {lang === 'en' ? 'THE APP' : 'التطبيق'}
                        </h6>
                        <div className="">
                            <Row className="align-items-center p-2 ms-2 mb-2" role="button" onClick={() => setOpen(!open)}>
                                <Col xs="auto">
                                    <i className="fa-light fa-folder d-block s-22" />
                                </Col>
                                <Col>
                                    <Link to="/questionnaire" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                        {lang === 'en' ? 'Questionnaire' : 'استبيان'}
                                    </Link>
                                </Col>
                                <Col xs="auto">
                                    <i className={`fa-light fa-chevron-down d-block s-20 ${open ? 'fa-rotate-90' : ''}`} />
                                </Col>
                            </Row>
                            <Collapse in={open}>
                                <Row className="align-items-center p-2 ms-5 mb-2">
                                    <Col xs="auto">
                                        <i className="fa-light fa-plus d-block s-22"></i>
                                    </Col>
                                    <Col>
                                        <Link to="/questionnaire/add-new" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                            {lang === 'en' ? 'Add New' : 'استبيان'}
                                        </Link>
                                    </Col>
                                </Row>
                            </Collapse>
                        </div>
                        <div className="">
                            <Row className="align-items-center p-2 ms-2 mb-2" role="button" onClick={() => setOpen2(!open2)}>
                                <Col xs="auto">
                                    <i className="fa-light fa-gem d-block s-22" />
                                </Col>
                                <Col>
                                    <Link to="daily-task" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                        {lang === 'en' ? 'Daily Task' : 'مهام يومية'}
                                    </Link>
                                </Col>
                                <Col xs="auto">
                                    <i className={`fa-light fa-chevron-down d-block s-20 ${open2 ? 'fa-rotate-90' : ''}`} />
                                </Col>
                            </Row>
                            <Collapse in={open2}>
                                <Row className="align-items-center p-2 ms-2 mb-2">
                                    <Col xs="auto">
                                        <i className="fa-light fa-plus d-block s-22"></i>
                                    </Col>
                                    <Col>
                                        <Link to={'daily-task/add-new'} className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                            {lang === 'en' ? 'Add New' : 'استبيان'}
                                        </Link>
                                    </Col>
                                </Row>
                            </Collapse>
                        </div>
                        <div className="">
                            <Row className="align-items-center p-2 ms-2 mb-2" role="button" onClick={() => setOpen3(!open3)}>
                                <Col xs="auto">
                                    <i className="fa-light fa-folder d-block s-22" />
                                </Col>
                                <Col>
                                    <Link to="article" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                        {lang === 'en' ? 'Articles / Videos' : 'مقالات / فيديو'}
                                    </Link>
                                </Col>
                                <Col xs="auto">
                                    <i className={`fa-light fa-chevron-down d-block s-20 ${open3 ? 'fa-rotate-90' : ''}`} />
                                </Col>
                            </Row>
                            <Collapse in={open3}>
                                <Row className="align-items-center p-2 ms-2 mb-2">
                                    <Col xs="auto">
                                        <i className="fa-light fa-plus d-block s-22"></i>
                                    </Col>
                                    <Col>
                                        <Link to={'article/add-new'} className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                            {lang === 'en' ? 'Add New' : 'استبيان'}
                                        </Link>
                                    </Col>
                                </Row>
                            </Collapse>
                        </div>
                        <h6 className="fw-600 s-12 text-secondary">
                            {lang === 'en' ? 'LEGAL' : 'قانوني'}
                        </h6>
                        <Row className="align-items-center p-2 ms-2 mb-2">
                            <Col xs="auto">
                                <i className="fa-light fa-book d-block s-22"></i>
                            </Col>
                            <Col>
                                <Link to="/guidelines" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                    {lang === 'en' ? 'Guidelines' : 'القواعد الارشادية'}
                                </Link>
                            </Col>
                        </Row>
                        <h6 className="fw-600 s-12 text-secondary">
                            {lang === 'en' ? 'CONTACT' : 'اتصال'}
                        </h6>
                        <Row className="align-items-center p-2 ms-2 mb-2">
                            <Col xs="auto">
                                <i className="fa-light fa-comment-dots d-block s-22"></i>
                            </Col>
                            <Col>
                                <Link to="/support" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                    {lang === 'en' ? 'Support' : 'يدعم'}
                                </Link>
                            </Col>
                        </Row>
                        <Row className="align-items-center p-2 ms-2 mb-2">
                            <Col xs="auto">
                                <i className="fa-sharp fa-light fa-gear d-block s-22" />
                            </Col>
                            <Col>
                                <Link to="/setting" className="fw-400 s-15 text-menu text-decoration-none mb-0">
                                    {lang === 'en' ? 'Setting' : 'جلسة'}
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                    <Col className={`position-relative`} style={{ marginLeft: lang === 'en' ? 295 : 0, marginRight: lang === 'ar' ? 295 : 0 }}>
                        <Header />
                        <div className="p-3">
                            <Outlet />
                        </div>
                    </Col>
                </Row>
            ) : <Navigate to="/auth/login" />}

        </div>
    );
};

export default Layout;