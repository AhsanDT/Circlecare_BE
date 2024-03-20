import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Form } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { useForm } from 'react-hook-form';


const MessageList = ({ items, isShow, user, create, modules, formats }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        getValues,
        control,
        formState: { errors },
    } = useForm()



    const handleSave = async (data) => {
        const newData = data
        if (newData?.text?.trim() == '<p><br></p>') {
            newData['text'] = ''
        } else {
            console.log('isSh', isShow)
            await create('message', {
                user_id: isShow?._id,
                sender_id: user?.data[0]?._id,
                reciever_id: isShow?._id,
                content: newData?.text?.trim(),
                created_at: new Date(),
            });
            reset()
        }
        console.log('data==', newData?.text?.trim())
    }

    useEffect(() => {
        if (isShow?._id) {

        }
    }, [isShow])
    return (
        <>
            {items?.length > 0 && (
                <div className="col-8 bg-white">
                    <div className="p-1" style={{ maxHeight: 443, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
                        {items?.map((item, key) => (
                            <div className="border p-3 pb-2 mb-2">
                                <div className="row g-0 p-2 border-bottom">
                                    <div className="col-auto">
                                        <img src={user} alt="user" className="rounded-circle me-3" width={50} height={50} />
                                    </div>
                                    <div className="col">
                                        {item?.data?.sender_id == isShow?.id ? (
                                            <p className="mb-0 fw-400 text-dark s-16">{isShow?.data?.name}</p>
                                        ) : (
                                            <p className="mb-0 fw-400 text-dark s-16">{user?.first_name}&nbsp;{user?.last_name}</p>
                                        )}
                                        <p className="mb-0 fw-300 text-dark s-14">
                                            {moment(item?.createdAt).format(`DD/MM/YYYY - h:mm A`)}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-2 pb-0">
                                    <p className="mb-0 fw-300 text-dark s-14 m-0 text-capitalize" dangerouslySetInnerHTML={{ __html: item?.data?.content }} />
                                </div>
                            </div>
                        ))}
                        <div className="border p-3 mb-2">
                            <div className="row g-0 p-2 border-bottom">
                                <div className="col-auto">
                                    <img src={user} alt="user" className="rounded-circle me-3" width={50} height={50} />
                                </div>
                                <div className="col">
                                    <p className="mb-0 fw-400 text-dark s-16">Circle Care</p>
                                    <p className="mb-0 fw-300 text-dark s-14">
                                        09/15/2022 - 8:36 PM
                                    </p>
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="mb-0 fw-300 text-dark s-14">
                                    Thank you so much for your feedback. We will check the issue and make sure we will fix this as soon as possible.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="p-1">
                        <div className="border support rounded-4 border-primary overflow-hidden position-relative">
                            <div className="position-absolute" style={{ top: 4, right: 10 }}>
                                <button form="privacy-form" type="submit" className="btn bg-primary text-white s-14">
                                    Save Changes
                                </button>
                            </div>
                            <Form
                                id="privacy-form"
                                onSubmit={handleSubmit(handleSave)}
                            >
                                <ReactQuill
                                    theme="snow"
                                    modules={modules} formats={formats}
                                    value={watch('text')}
                                    onChange={(e) => setValue('text', e)}
                                />
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default MessageList;