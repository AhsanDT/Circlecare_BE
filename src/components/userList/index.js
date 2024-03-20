import React from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import { useNavigate } from "react-router-dom";
import {
    useGetAppUserQuery,
    useGetSubAdminsQuery,
    useRemoveAppUserMutation,
    useRemoveSubAdminsMutation
} from "../../redux/services/api";
import toast from "react-hot-toast";
import { downloadCSV } from '../../utils';

const UserListPage = () => {
    const navigate = useNavigate()
    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()

    const [filterText, setFilterText] = React.useState('')

    const { data: appUser, refetch, isLoading } = useGetAppUserQuery()
    const [removeRequest] = useRemoveAppUserMutation()

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
    isLoading && <div className="text-center">Loading...</div>

    const data = [
        {
            id: 1,
            name: 'John Doe',
            contact: '9876543210',
            email: 'john@gmail.com',
            trade: 'Trade Show 1',
            companyName: 'Active',
        },
        {
            id: 2,
            name: 'John Doe',
            contact: '9876543210',
            email: 'john@gmail.com',
            trade: 'Trade Show 1',
            companyName: 'Active',
        },
    ]

    const filteredItems = React.useMemo(() => appUser?.data?.filter(
        (item) => item.first_name && item.first_name.toLowerCase().includes(filterText.toLowerCase()),
    ), [filterText, appUser])
    const columns = [
        {
            name: 'User Name',
            selector: (row) => row.first_name+' '+row?.last_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        // {
        //     name: 'Phone',
        //     selector: (row) => row.email,
        //     sortable: true,
        // },
        // {
        //     name: 'Location',
        //     selector: (row) => row.email,
        //     sortable: true,
        // },
        {
            name: 'Status',
            selector: (row) => <>
                {row?.status ? <span className="text-success px-3 py-1 rounded-pill" style={{ backgroundColor: '#32936F29' }}>{'Active'}</span> : <span className="text-success px-3 py-1 rounded-pill" style={{ backgroundColor: '#32936F29' }}>{'Deactive'}</span>}
            </>,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row, i) => {
                return (
                    <>
                        <i className="fa-light fa-eye text-primary s-14 cursor-pointer me-2"
                            onClick={() => navigate(`/user-list/${row?._id}`)} />
                        {/*<i className="fa-light fa-edit text-primary s-14 cursor-pointer me-2"/>*/}
                        <i
                            className="fa-light fa-trash-alt text-danger s-14 cursor-pointer"
                            onClick={() => handleRemove(row?._id)}
                        />
                    </>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ]

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
                        <Col xs="auto">
                            <Button 
                                variant="secondary" 
                                className="text-white shadow-none s-14"
                                onClick={() => downloadCSV(filteredItems, 'user-list')}
                                >
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
                        responsive={true}
                    // dense={true}
                    />
                </Card.Body>
            </Card>


            {modalView}
        </>
    );
};

export default UserListPage;