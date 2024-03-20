import React, {useEffect, useState} from 'react';
import {Button, Modal} from "react-bootstrap";

const useRemove = () => {
    const [show, setShow] = useState(false);

    const confirm = async () => {
        return true
    }
    
    const modalView = <>
        {show && (
            <Modal show={show} centered={true} onHide={() => {
                setShow(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="fw-500 s-16 text-center text-muted">
                        Are you sure you want to permanently delete <br/>
                        this sub admin?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        className="text-white"
                        onClick={() => {
                            setShow(false)
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="danger"
                        className="text-white"
                        onClick={() => {
                            setShow(false)
                        }}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        )}
    </>
    
    return [show, setShow, confirm, modalView]
};

export default useRemove;