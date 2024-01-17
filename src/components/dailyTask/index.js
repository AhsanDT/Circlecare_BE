import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, NavDropdown, Modal, FloatingLabel, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import { useNavigate } from "react-router-dom";
import { useDeleteDailyTaskMutation, useGetDailyTaskQuery, useGetQuestionareQuery } from "../../redux/services/api";
import toast from 'react-hot-toast';
import moment from "moment";
const DailyTaskPage = () => {
    const navigate = useNavigate()
    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()
    const [show, setShow] = useState(false);
    const [filterText, setFilterText] = React.useState('')

    const { data, refetch, isFetching, isError, isLoading } = useGetDailyTaskQuery()

    const [removeRequest] = useDeleteDailyTaskMutation()

    const handleRemove = (id) => {
        refetch()
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

    const filteredItems = data?.data?.filter(
        (item) => item.title && item.title.toLowerCase().includes(filterText.toLowerCase()),
    )

    useEffect(() => {
        refetch()
    }, [])

    const columns = [
        {
            name: 'Task Title',
            selector: (row) => row.title,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Date Assigned',
            selector: (row) => moment(row.calendar).format('DD MMM YYYY'),
            sortable: true,
        },
        {
            name: 'Media',
            selector: (row) => row.media_url.split('.')[1].startsWith('mp4') ? (
                <div className="position-relative" style={{width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.7)'}}>
                    <div className="position-absolute top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <i className="fa-regular fa-play text-white"/>
                    </div>
                    <video width="40" height="40">
                        <source src={process.env.REACT_APP_BASE_URL + row.media_url} type="video/mp4" />
                        Error Message
                    </video>
                </div>
            ) : (
                <img src={process.env.REACT_APP_BASE_URL + row.media_url} alt='media' width={40} height={40} style={{ objectFit: 'cover' }} />
            ),
            sortable: true,
        },
        {
            name: 'Type',
            selector: (row) => row.task_type,
            sortable: true,
        },
        // {
        //     name: 'Assigned To',
        //     selector: (row) => row.task_type,
        //     sortable: true,
        // },
        {
            name: 'Status',
            selector: (row) => <>
                {row?.status ? <span className="text-success px-3 py-1 rounded-pill" style={{ backgroundColor: '#32936F29' }}>{'Active'}</span> : <span className="text-danger px-3 py-1 rounded-pill" style={{ backgroundColor: '#FD003A1A' }}>{'Deactive'}</span>}
            </>,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row, i) => {
                return (
                    <>

                        {/* <i className="fa-regular fa-eye text-primary s-16 cursor-pointer me-2" onClick={() => navigate('/questionnaire/record/1')} /> */}



                        <i
                            className="fa-regular fa-edit text-primary s-16 cursor-pointer me-2"
                            onClick={() => navigate(`/daily-task/edit/${row?._id}`)}
                        />

                        {/* <OverlayTrigger
                            placement="left"
                            overlay={<Tooltip id="button-tooltip-2">Unpublish</Tooltip>}
                        >
                            <i
                                className="fa-regular fa-ban text-danger s-16 cursor-pointer me-2"
                            />
                        </OverlayTrigger>  */}

                        <i
                            className="fa-regular fa-trash-alt text-danger s-16 cursor-pointer"
                            onClick={() => handleRemove(row?._id)}
                        />

                    </>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            with: 220,
        },
    ]



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
                            <Button variant="primary" className="shadow-none s-14 text-white w-100" onClick={() => navigate('/daily-task/add-new')}>
                                <i className="fa-light fa-plus d-inline-block s-15" />
                                &nbsp;&nbsp;
                                Add Daily Task
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

export default DailyTaskPage;