import React, { useEffect, useState } from 'react';
import { Form, InputGroup } from "react-bootstrap";
import user from '../../assets/images/user.svg';
import ReactQuill from "react-quill";
import { useForm } from "react-hook-form";
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import {
    useGetAllChatQuery,
    useGetAllMessageMutation,
    useGetAppUserQuery,
    useGetUserInfoQuery, useSendMessageMutation
} from '../../redux/services/api';
import moment from 'moment';
import {useSelector} from "react-redux";


const Support = () => {
    const userId = useSelector(state => state?.auth?.user?._id);
    const {data: chatList, } = useGetAllChatQuery(userId)
    const [getMessagesRequest, result] = useGetAllMessageMutation()
    const [sendMessageRequest, result2] = useSendMessageMutation()

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

    const [chat, setChat] = useState([]);
    const [items, setItems] = useState([])
    const [isShow, setIsShow] = useState(null);

    const { data: appUser, refetch: refetchApp } = useGetAppUserQuery()
    const { data: user, refetch: refetchUser } = useGetUserInfoQuery()

    const modules = {
        toolbar: [
            // 'strike', 'blockquote'
            ['bold', 'italic', 'underline'],
            // [
            //     { list: 'ordered' },
            //     { list: 'bullet' },
            //     { indent: '-1' },
            //     { indent: '+1' },

            // ],

            ['link'],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        },
    }
    /*
     * Quill editor formats
     * See https://quilljs.com/docs/formats/
     */
    const formats = [
        'bold',
        'italic',
        'underline',
        // 'strike',
        // 'blockquote',
        // 'list',
        // 'bullet',
        // 'indent',
        'link',
        // 'image',
        // 'video',
    ]

    const handleSave = async (data) => {
        const newData = data
        if (newData?.text?.trim() == '<p><br></p>') {
            newData['text'] = ''
        } else {
            console.log('isSh', isShow)
            const data = {
                chatId: isShow?._id,
                id: userId,
                message: newData?.text?.trim(),
            }
            sendMessageRequest(data).unwrap()

            // await create('message', {
            //     user_id: isShow?._id,
            //     sender_id: user?.data[0]?._id,
            //     reciever_id: isShow?._id,
            //     content: newData?.text?.trim(),
            //     created_at: Timestamp.now(),
            // });
            reset()
        }
        console.log('data==', newData?.text?.trim())
    }

    const handleChat = async (item) => {
        setIsShow(item)
        getMessagesRequest(item?._id)

        const q = query(collection(db, "message"), where("user_id", "==", item?._id), orderBy('created_at', 'desc'));
        onSnapshot(q, (querySnapshot) => {
            setItems(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }

    const createUser = async () => {
        // await create('user', {
        //     name: "Zaryab Uddin",
        //     email: "mzaryabuddin@gmail.com",
        //     profile_image: "https://www.kindpng.com/picc/m/24-248729_stockvader-predicted-adig-user-profile-image-png-transparent.png",
        //     is_admin: '1',
        //     created_at: new Date(),
        // });
        await create('message', {
            user_id: isShow?._id,
            sender_id: isShow?._id,
            reciever_id: user?.data[0]?._id,
            content: 'Hello Admin I am user how are you?',
            created_at: Timestamp.now(),
        });
    }
    const create = async (table, objects) => {
        try {
            const docRef = await addDoc(collection(db, table), objects);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const getChat = async (user) => {
        console.log('user==', user)
        try {
            let da = []
            const querySnapshot = await getDocs(collection(db, "chats"));
            querySnapshot.forEach((doc, key) => {
                console.log(`${doc.id} => `, doc.data())
                da.push(doc.data())
                console.log('dd', doc.data().sender_id === user?.data[key]?.id)
                if (doc.data().sender_id === user?.data[key]?.id) {
                    da[key].sender = { name: user?.data[key]?.first_name }
                }
            });
            console.log('da==', da)
        } catch (e) {
            console.error("Error getting document: ", e);
        }
    }

    useEffect(() => {
        const q = query(collection(db, 'user'), orderBy('created_at', 'desc'))
        onSnapshot(q, (querySnapshot) => {
            setChat(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, []);

    console.log('chat==', result)

    return (
        <>
            <div className="row g-0">
                <div className="col-4 border-end bg-white pt-3" style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                    <div className="row g-0">
                        <div className="col-6 border-bottom border-primary border-3">
                            <p className="mb-0 fw-400 text-dark text-center pb-2 s-16">
                                Messages
                            </p>
                        </div>
                        <div className="col-6 ">
                            <p className="mb-0 fw-400 text-muted text-center pb-2 s-16">
                                <button onClick={createUser}>
                                    Flagged
                                </button>
                            </p>
                        </div>
                    </div>
                    <div className="p-3">
                        <InputGroup className="m-0">
                            <InputGroup.Text className="bg-transparent">
                                <i className="fa-light fa-search d-block s-15" />
                            </InputGroup.Text>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="bg-transparent shadow-none s-14"
                            // value={filterText}
                            // onChange={(e) => setFilterText(e.target.value)}
                            />
                        </InputGroup>
                    </div>

                    <div className="" style={{ height: 480, overflowY: 'auto' }}>
                        {chatList?.map((item, key) => {
                            return (
                                <div key={key} className="row g-0 p-2 bg-light border-bottom" role='button' onClick={() => handleChat(item)}>
                                    <div className="col-auto">
                                        {item?.photo ? (
                                            <img src={item?.photo} alt="user" className="rounded-circle me-3" width={40} height={40} />
                                        ) : (
                                            <img src={user} alt="user" className="rounded-circle me-3" width={40} height={40} />
                                        )}
                                    </div>
                                    <div className="col">
                                        <p className="mb-0 fw-400 text-dark s-16">
                                            {item?.chatName}
                                        </p>
                                        {/*<p className="mb-0 fw-300 text-dark s-14">
                                            {'item?.email'}
                                        </p>*/}
                                    </div>
                                </div>
                            )
                        })}
                        {/* <div className="row g-0 p-2 border-bottom">
                            <div className="col-auto">
                                <img src={user} alt="user" className="rounded-circle me-3" width={50} height={50} />
                            </div>
                            <div className="col">
                                <p className="mb-0 fw-400 text-dark s-16">Marga Ridge</p>
                                <p className="mb-0 fw-300 text-dark s-14">
                                    The place details section loads slower the...
                                </p>
                            </div>
                        </div> */}
                    </div>
                </div>
                {isShow && (
                    <div className="col-8 bg-white">
                        <div className="p-1" style={{ height: 443, overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse' }}>
                            {result?.isSuccess && result?.data?.map((item, key) => (
                                <div className="border p-3 pb-2 mb-2">
                                    <div className="row g-0 p-2 border-bottom">
                                        {item?.chatId?.photo && (
                                            <div className="col-auto">
                                                <img src={item?.chatId?.photo} alt="user" className="rounded-circle me-3" width={40} height={40} />
                                            </div>
                                        )}
                                        <div className="col">
                                            <p className="mb-0 fw-400 text-dark s-16">{item?.chatId?.chatName}</p>
                                            {/*{item?.data?.sender_id == isShow?._id ? (
                                                <p className="mb-0 fw-400 text-dark s-16">{isShow?.first_name}&nbsp;{isShow?.last_name}</p>
                                            ) : (
                                                <p className="mb-0 fw-400 text-dark s-16">{user?.data[0]?.first_name}&nbsp;{user?.data[0]?.last_name}</p>
                                            )}*/}
                                            <p className="mb-0 fw-300 text-dark s-14">
                                                {moment(item?.createdAt).format(`DD/MM/YYYY - h:mm A`)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-2 pb-0">
                                        <p className="mb-0 fw-300 text-dark s-14 m-0 text-capitalize" dangerouslySetInnerHTML={{ __html: item?.message }} />
                                    </div>
                                </div>
                            ))}
                            {/* <div className="border p-3 mb-2">
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
                            </div> */}

                        </div>
                        <div className="p-1">
                            <div className="border support rounded-4 border-primary overflow-hidden position-relative">
                                <div className="position-absolute" style={{ top: 4, right: 10 }}>
                                    <button form="privacy-form" type="submit" className="btn bg-primary text-white s-14">
                                        {result2?.isLoading ? '...' : 'Save Changes'}
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
            </div>
        </>
    );
};

export default Support;