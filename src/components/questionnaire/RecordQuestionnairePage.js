import React, {useMemo, useState} from 'react';
import { Button, Card, Col, Form, InputGroup, Row, NavDropdown, Modal, FloatingLabel, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import {useParams} from "react-router-dom";
import {useViewQuestionaresQuery} from "../../redux/services/api";


const RecordQuestionnairePage = () => {
    const { id } = useParams()
    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()

    const [show, setShow] = useState(false);
    const [filterText, setFilterText] = React.useState('')

    const { data , isLoading } = useViewQuestionaresQuery(id)


    const columns = [
        {
            name: 'First Name',
            selector: (row) => row.first_name,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: (row) => row.last_name,
            sortable: true,
        },
        // {
        //     name: 'Age',
        //     selector: (row) => row.email,
        //     sortable: true,
        // },
        {
            name: 'Gender',
            selector: (row) => row.gender,
            sortable: true,
        },
        {
            name: 'Qualified',
            selector: (row) => <>
                {row?.completed ? <span className="text-success px-3 py-1 rounded-pill" style={{backgroundColor: '#32936F29'}}>{'Yes'}</span> : <span className="text-danger px-3 py-1 rounded-pill" style={{backgroundColor: '#D6163F33'}}>{'No'}</span>}
            </>,
            sortable: true,
        },
        {
            name: 'Chat',
            cell: (row, i) => {
                return (
                    <>
                        <OverlayTrigger
                            placement="left"
                            overlay={<Tooltip id="button-tooltip-2">View Chat</Tooltip>}
                        >
                            <i className="fa-regular fa-message-dots text-primary s-20 cursor-pointer"></i>
                        </OverlayTrigger>
                    </>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            with: 220,
        },
    ]

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const filteredItems = useMemo(() => data?.data?.filter((item) => item.first_name && item.first_name.toLowerCase().includes(filterText.toLowerCase())), [data, filterText])

    if(isLoading) return <div className="text-center">Loading...</div>

    return (
        <>
            <Card>
                <Card.Body>
                    <Row className="align-items-center justify-content-end mb-3">
                        <Col lg={3}>
                            <InputGroup className="m-0">
                                <InputGroup.Text className="bg-transparent">
                                    <i className="fa-light fa-search d-block s-15" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="bg-transparent shadow-none s-14"
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col lg={2}>
                            <Button variant="secondary" className="shadow-none s-14 text-white w-100" onClick={() => setShow(true)}>
                                Download CSV
                            </Button>
                        </Col>
                    </Row>
                    <DataTable
                        fixedHeaderScrollHeight="500px"
                        columns={columns}
                        data={filteredItems}
                        customStyles={customStyles}
                        pagination={true}
                        fixedHeader={true}
                    // dense={true}
                    />
                </Card.Body>
            </Card>
            {modalView}
        </>
    );
};

export default RecordQuestionnairePage;