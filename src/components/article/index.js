import React, { useMemo, useState, useEffect } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, NavDropdown, Modal, FloatingLabel, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import { useNavigate } from "react-router-dom";
import { useDeleteArticleMutation, useGetArticleQuery } from "../../redux/services/api";
import toast from 'react-hot-toast';

const ArticlePage = () => {
    const navigate = useNavigate()
    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()

    const [show, setShow] = useState(false);
    const [filterText, setFilterText] = React.useState('')

    const { data, isLoading, refetch } = useGetArticleQuery()

    const [removeRequest] = useDeleteArticleMutation()

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            removeRequest(id)
                .unwrap()
                .then((res) => {
                    if (res?.success) {
                        refetch()
                        toast.success(res?.data, { id: 'remove-success', duration: 4000 })

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
            name: 'Task Title',
            selector: (row) => row.title,
            sortable: true,
        },
        // {
        //     name: 'Media',
        //     selector: (row) => row.media_url,
        //     sortable: true,
        // },
        {
            name: 'Type',
            selector: (row) => row.article_type,
            sortable: true,
        },
        // {
        //     name: 'Assigned To',
        //     selector: (row) => row.trade,
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
                        <i
                            onClick={() => navigate(`/article/edit/${row?._id}`)}
                            className="fa-regular fa-edit text-primary s-16 cursor-pointer me-2"
                        />

                        {/* <OverlayTrigger
                            placement="left"
                            overlay={<Tooltip id="button-tooltip-2">Unpublish</Tooltip>}
                        >
                            <i
                                className="fa-regular fa-ban text-danger s-16 cursor-pointer me-2"
                                onClick={() => setRemoveModal(true)}
                            />
                        </OverlayTrigger> */}

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
            with: '220px',
        },
    ]

    useEffect(() => {
        refetch()
    }, [])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const filteredItems = useMemo(() => data?.data?.filter((item) => item.title && item.title.toLowerCase().includes(filterText.toLowerCase())), [data, filterText])

    // if (isError) return <div>An error has occurred!</div>
    if (isLoading){
        <div className="text-center">Loading...</div>
    }



    return (
        <>
            <Card>
                <Card.Body>
                    <Row className="align-items-center justify-content-end mb-3">
                        <Col xs="auto">
                            <Button variant="primary" className="shadow-none s-14 text-white" onClick={() => refetch()}>
                                {isLoading ? '...' : 'Refresh'}
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
                            <Button variant="primary" className="shadow-none s-14 text-white w-100" onClick={() => navigate('/article/add-new')}>
                                <i className="fa-light fa-plus d-inline-block s-15" />
                                &nbsp;&nbsp;
                                Add
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

export default ArticlePage;
