import React, { useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, NavDropdown, Modal, FloatingLabel } from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import { useGetSubAdminsQuery, useRegisterMutation, useRemoveSubAdminsMutation } from "../../redux/services/api";
import toast from "react-hot-toast";
import { downloadCSV } from '../../utils';
import { useForm } from 'react-hook-form';

const SubAdminPage = () => {
    const [removeModal, setRemoveModal, confirmed, modalView] = useRemove()
    const { register, handleSubmit, formState: { errors }, setError } = useForm()

    const [show, setShow] = useState(false);

    const [filterText, setFilterText] = React.useState('')

    const { data: subAdmins, refetch, isLoading } = useGetSubAdminsQuery()
    const [registration] = useRegisterMutation()
    const [removeRequest] = useRemoveSubAdminsMutation()



    const onRegister = async (data) => {
        const isRegister = await registration(data)
            console.log(isRegister)
            if(isRegister?.data?.success){
                isRegister?.data?.msg && toast.success(isRegister?.data?.msg , {id: 'register-success', duration: 4000})
                refetch()
                setShow(false)
            }else{
                if(isRegister?.error.data?.error){
                    toast.error(isRegister?.error.data?.error , {id: 'register-error', duration: 4000})
                }
            }
    }

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
    isLoading && <div className="text-center">Loading...</div>

    const filteredItems = React.useMemo(() => subAdmins?.data?.filter(
        (item) => item.first_name && item.first_name.toLowerCase().includes(filterText.toLowerCase()),
    ), [filterText, subAdmins])

    console.log('subAdmins', subAdmins)

    const columns = [
        {
            name: 'Sub Admin Name',
            selector: (row) => <>{row.first_name} &nbsp; {row.last_name}</>,
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
                        {/*<i className="fa-light fa-eye text-primary s-14 cursor-pointer me-2"/>*/}
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
                                variant="secondary" className="text-white shadow-none s-14"
                                onClick={() => downloadCSV(filteredItems, 'sub-admin')}
                            >
                                Download CSV
                            </Button>
                        </Col>
                        <Col lg="auto">
                            <Button variant="primary" className="shadow-none s-14 text-white w-100" onClick={() => setShow(true)}>
                                <i className="fa-light fa-plus d-inline-block s-15" />
                                &nbsp;&nbsp;
                                Add Sub Admin
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


            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton className="border-bottom-0">
                    <Modal.Title>
                        Add New Sub Admin
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="sub-admin-register" onSubmit={handleSubmit(onRegister)}>
                        <FloatingLabel
                            label="First Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="First Name "
                                className="shadow-none"
                                {...register("first_name", { required: 'Please Enter Your Name' })}
                                onInvalid={errors?.first_name}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            label="Last Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Last Name"
                                className="shadow-none"
                                {...register("last_name", { required: 'Please Enter Your Name' })}
                                onInvalid={errors?.last_name}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            label="Email"
                            className="mb-3"
                        >
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                className="shadow-none"
                                {...register("email", { required: 'Please Enter Your Email' })}
                                onInvalid={errors?.email}
                                required={true}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            label="Password"
                            className="mb-3"
                        >
                            <Form.Control
                                type="password"
                                placeholder="Temporary Password "
                                className="shadow-nonw"
                                {...register("password", { required: 'Please Enter Your Email' })}
                                onInvalid={errors?.password}
                            />
                        </FloatingLabel>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center border-top-0">
                    <Button
                        form='sub-admin-register'
                        type='submit'
                        variant="primary" className="px-5 text-white"
                        >
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            {modalView}
        </>
    );
};

export default SubAdminPage;