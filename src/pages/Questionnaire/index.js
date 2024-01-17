import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, NavDropdown, Modal, FloatingLabel, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import { useNavigate } from "react-router-dom";
import {useDeleteQuestionareMutation, useGetQuestionareQuery} from "../../redux/services/api";
import { useSelector } from "react-redux";
import moment from 'moment';
import toast from "react-hot-toast";


const Questionnaire = () => {
    const navigate = useNavigate()

    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()
    const [show, setShow] = useState(false);
    const [filterText, setFilterText] = React.useState('')

    const { data, refetch, isError, isFetching, isLoading } = useGetQuestionareQuery()
    const [removeRequest] = useDeleteQuestionareMutation()

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            removeRequest(id)
                .unwrap()
                .then((res) => {
                    if (res?.success) {
                        toast.success(res?.data, { id: 'remove-success', duration: 4000 })
                        refetch()
                    }
                })
                .catch((err) => {
                    if (err?.data) {
                        toast.error(err?.data?.error, { id: 'remove-error', duration: 4000 })
                    }
                })
        }
    }

    const columns = [
        {
            name: 'Title of Questionnaire',
            selector: (row) => row.title,
            width: '280px',
            sortable: true,
        },
        {
            name: 'Date Created',
            selector: (row) => moment(row.createdAt).format('DD-MM-YYYY'),
            with: '200px',
            sortable: true,
        },
        {
            name: 'Month',
            selector: (row) => row.month,
            sortable: true,
        },
        {
            name: 'Questions',
            selector: (row) => row.month,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => <>
                {row?.status ? <span className="text-success px-3 py-1 rounded-pill" style={{ backgroundColor: '#32936F29' }}>{'Active'}</span> : <span className="text-danger px-3 py-1 rounded-pill" style={{ backgroundColor: '#FD003A1A' }}>{'Deactive'}</span>}
            </>,
            with: '200px',
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row, i) => {
                return (
                    <>
                        <i
                            className="fa-regular fa-eye text-primary s-16 cursor-pointer me-2"
                            onClick={() => navigate(`/questionnaire/record/${row?._id}`)}
                        />

                        <i
                            className="fa-regular fa-edit text-primary s-16 cursor-pointer me-2"
                            onClick={() => navigate(`/questionnaire/edit/${row?._id}`)}
                        />

                        <i
                            className="fa-light fa-trash-alt text-danger s-14 cursor-pointer"
                            onClick={() => handleRemove(row?._id)}
                        />

                        {/*<OverlayTrigger
                            placement="left"
                            overlay={<Tooltip id="button-tooltip-2">Unpublish</Tooltip>}
                        >
                            <i
                                className="fa-regular fa-ban text-danger s-16 cursor-pointer me-2"
                                onClick={() => setRemoveModal(true)}
                            />
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="left"
                            overlay={<Tooltip id="button-tooltip-2">Delete</Tooltip>}
                        >
                            <i
                                className="fa-regular fa-trash-alt text-danger s-16 cursor-pointer"
                                onClick={() => setRemoveModal(true)}
                            />
                        </OverlayTrigger>*/}
                    </>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            with: 220,
        },
    ]

    useEffect(() => {
        refetch()
    }, [])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const filteredItems = useMemo(() => data?.data?.filter((item) => item.title && item.title.toLowerCase().includes(filterText.toLowerCase())), [data, filterText])

    // if (isError) return <div>An error has occurred!</div>
    if (isLoading) return <div className="text-center">Loading...</div>





    return (
        <>
            <Card>
                <Card.Body>
                    <Row className="align-items-center justify-content-end mb-3">
                        <Col xs="auto">
                            <Button variant="primary" className="shadow-none s-14 text-white" onClick={() => refetch()}>
                                {isFetching ? '...' : 'Refresh'}
                            </Button>
                        </Col>
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
                            <Button variant="primary" className="shadow-none s-14 text-white w-100" onClick={() => navigate('/questionnaire/add-new')}>
                                <i className="fa-light fa-plus d-inline-block s-15" />
                                &nbsp;&nbsp;
                                Add Questionnaire
                            </Button>
                        </Col>
                    </Row>
                    <DataTable
                        fixedHeaderScrollHeight="500px"
                        columns={columns}
                        data={filteredItems}
                        responsive={true}
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

export default Questionnaire;