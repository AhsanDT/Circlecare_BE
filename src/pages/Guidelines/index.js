import React from 'react';
import {Card, Col, Row} from "react-bootstrap";
import PrivacyAndPolicy from "./PrivacyAndPolicy";
import Faq from "./Faq";
import Tutorial from "./Tutorial";
import TermsAndCondition from "./TermsAndCondition";

const Guidlines = () => {

    const [tab, setTab] = React.useState('1')


    return (
        <>
            <Card className="rounded-3 shadow-sm">
                <Card.Body className="p-0">
                  <Row className="g-0">
                      <Col xs={3} className="border-end">
                          <div className="py-5">
                              <div
                                  className={`py-3 p-2  ${tab === '1' && 'border-top border-bottom shadow-sm' }`}
                                  onClick={() => setTab('1')}
                                  role="button"
                              >
                                  <h5 className={`mb-0 s-14 ${tab === '1' ? 'text-dark fw-600' : 'text-muted fw-400'}`}>
                                      Terms and Conditions
                                  </h5>
                              </div>
                              <div
                                  className={`py-3 p-2  ${tab === '2' && 'border-top border-bottom shadow-sm' }`}
                                  onClick={() => setTab('2')}
                                  role="button"
                              >
                                  <h5 className={`mb-0 s-14 ${tab === '2' ? 'text-dark fw-600' : 'text-muted fw-400'}`}>
                                      Privacy Policy
                                  </h5>
                              </div>
                              <div
                                  className={`py-3 p-2  ${tab === '3' && 'border-top border-bottom shadow-sm' }`}
                                  onClick={() => setTab('3')}
                                  role="button"
                              >
                                  <h5 className={`mb-0 s-14 ${tab === '3' ? 'text-dark fw-600' : 'text-muted fw-400'}`}>
                                      FAQs
                                  </h5>
                              </div>
                              <div
                                  className={`py-3 p-2  ${tab === '4' && 'border-top border-bottom shadow-sm' }`}
                                  onClick={() => setTab('4')}
                                  role="button"
                              >
                                  <h5 className={`mb-0 s-14 ${tab === '4' ? 'text-dark fw-600' : 'text-muted fw-400'}`}>
                                      Tutorial
                                  </h5>
                              </div>
                          </div>
                      </Col>
                      <Col xs={9}>
                          {tab === '1' && <TermsAndCondition />}
                          {tab === '2' && <PrivacyAndPolicy />}
                            {tab === '3' && <Faq />}
                            {tab === '4' && <Tutorial />}
                      </Col>
                  </Row>
                </Card.Body>
            </Card>
        </>
    );
};

export default Guidlines;