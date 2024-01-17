import React, { useEffect } from 'react';
import { Col, Form, NavDropdown, Row } from "react-bootstrap";
import user from "../../assets/images/user.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { changeLang, removeAuth } from '../../redux/reducer/authSlice';
import { useForm } from "react-hook-form";

const Header = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const pathname = useLocation()
    let currentLang = localStorage.getItem('current_language')
    const [language, setLanguage] = React.useState(false);


    const handleLogout = () => {
        dispatch(removeAuth())
        // navigate('/auth/login')
    }


    useEffect(() => {
        if (currentLang) {
            changeLanguage(currentLang)
        }
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang === 'en')
        localStorage.setItem('current_language', lang)
        if (lang === 'en') {
            document.getElementsByTagName('html')[0].setAttribute('lang', 'en')
            // change direction
            document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr')
            dispatch(changeLang('en'))
        } else {
            // change html lang attribute
            document.getElementsByTagName('html')[0].setAttribute('lang', 'ar')
            // change direction
            document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl')
            dispatch(changeLang('ar'))
        }
    }




    console.log('pathname', pathname)
    return (
        <>
            <div className="bg-white position-sticky top-0">
                <Row className="g-0 p-3">
                    <Col xs="auto">
                        <h6 className="m-0 s-20">
                            {pathname?.pathname === '/' ? 'Dashboard' : (
                                <>
                                    {pathname?.pathname?.split('/')?.splice(0, 2)?.map((item, index) => (
                                        <span key={index} className='text-capitalize'>
                                            {console.log('item', item)}
                                            {item?.split('-')[0]} {' '} {item?.split('-')[1]}
                                        </span>
                                    ))}
                                </>
                            )}
                        </h6>
                    </Col>
                    <Col xs="auto" className={`${lang === 'en' ? 'ms-auto me-3' : 'me-auto ms-3'}`}>
                        <Row className="align-items-center gx-1">
                            <Col xs="auto">
                                <span className={`s-14 ${language ? 'text-muted fw-300' : 'text-dark fw-600'}`}>
                                    Arabic
                                </span>
                            </Col>
                            <Col xs="auto">
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    className={`d-inline-block m-0 s-22 ${lang === 'en' ? 'ms-3' : 'me-3'}`}
                                    checked={language}
                                    onChange={(e) => {
                                        e.target.checked ? changeLanguage('en') : changeLanguage('ar')
                                    }}
                                />
                            </Col>
                            <Col xs="auto">
                                <span className={`s-14 ${language ? 'text-dark fw-600' : 'text-muted fw-300'}`}>
                                    English
                                </span>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs="auto">
                        <NavDropdown
                            title={
                                <>
                                    <img src={user} alt="circle-care-app" width={32} height={32} className="rounded-3" />
                                </>
                            }
                            id="basic-nav-dropdown"
                        >
                            <NavDropdown.Item onClick={() => navigate('/user-list')}>
                                User List
                            </NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/setting')}>
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Col>
                </Row>
                <hr className="m-0" />
                <Row className="gx-2 p-1 px-3 align-items-center">
                    <Col xs="auto">
                        <Link to="/">
                            <i className="fa-solid fa-house d-block s-12 text-success" />
                        </Link>
                    </Col>
                    <Col xs="auto">
                        <p className="m-0 fw-400 s-12 text-muted">
                            {pathname?.pathname === '/' ? 'Dashboard' : (
                                <>
                                    {pathname?.pathname?.split('/')?.map((item, index) => (
                                        item &&
                                        <Link key={index} className='text-capitalize text-muted text-decoration-none'>
                                            {' '} / &nbsp;
                                            {item?.split('-')[0]} {' '} {item?.split('-')[1]}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </p>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Header;