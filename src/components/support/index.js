import React, {useEffect, useMemo, useState} from 'react';
import { Form, InputGroup } from "react-bootstrap";
import userProfile from '../../assets/images/user.svg';
import ReactQuill from "react-quill";
import { useForm } from "react-hook-form";
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import {
    useGetActiveUserQuery,
    useGetAllChatQuery,
    useGetAllMessageMutation,
    useGetAppUserQuery,
    useGetUserInfoQuery, useSendFileMutation, useSendMessageMutation
} from '../../redux/services/api';
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import Socket from "../../Socket";
import InfiniteScroll from "react-infinite-scroll-component";
import {saveChat} from "../../redux/reducer/chatSlice";



const Support = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const dispatch = useDispatch();
    const userId = useSelector(state => state?.auth?.user?._id);
    const admin = useSelector(state => state?.auth?.user);
    const chatMessages = useSelector(state => state?.chat?.chat);
    const {data: chatList, } = useGetAllChatQuery(userId)
    const [getMessagesRequest, result] = useGetAllMessageMutation()
    const [sendMessageRequest, result2] = useSendMessageMutation()
    const [sendFileRequest] = useSendFileMutation()
    const [filterText, setFilterText] = useState('')

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
            matchVisual: false,
        },
    }
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

    const handleAddMedia = (event) => {
        const form = new FormData()
        form.append('file', event.target.files[0])

        sendFileRequest(form)
            .unwrap()
            .then((res) => {
                setValue('media_url', res?.data)
            })
    }

    const handleSave = async (data) => {
        data.text = data.text && data.text.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '');
        const newData = data 
        if (newData?.text?.trim() == '<p><br></p>') {
            newData['text'] = ''
        } else {
            console.log('isSh', isShow)
            const form = new FormData()
            form.append('chatId', isShow?._id)
            form.append('id', userId)
            form.append('message', newData?.text?.trim())
            form.append('file', newData?.media_url ? newData?.media_url : '')

            const data = {
                chatId: isShow?._id,
                id: userId,
                message: newData?.text?.trim(),
                file: newData?.media_url ? newData?.media_url : ''
            }
            console.log('file:', data)
            // for send message direct socket
            Socket.emit("new message", data, (res) => {
                console.log("Send Message", res);
            });
            reset()
            newData['text'] = ''
            document.getElementById('scrollableDiv').scrollTo(0,0)
            // sendMessageRequest(form).unwrap()
        }
        console.log('data==', newData?.text?.trim())
    }

    const handleChat = async (item) => {
        setIsShow(item)
        getMessagesRequest(item?._id).unwrap()
    }



    useEffect(() => {
        const message = {
            chatId: isShow?._id,
            id: userId,
            message: watch('text')?.trim(),
        };

        // for connection setup
        Socket.emit("setup", message.id, (res) => {
            console.log("setup", res);
        });
        // for join room and chat first call access chat api than call this function
        Socket.emit("join room", message.chatId, (res) => {
            //   console.log("res room Connented", res);
            console.log("join room", res, message.chatId);
        })

        // for message Received
        Socket.on("message received", (msg) => {
            console.log("message recieved", msg);
            dispatch(saveChat(msg))
        });
        // for user active
        Socket.on("connected", (res) => {
            res(true);
        });

        return () => {
            Socket.off("message received");
        };
    }, [isShow]);

    const filterUsers = useMemo(() => {
        return (
            chatList?.filter((item) => item?.chatName?.toLowerCase().includes(filterText?.toLowerCase() ) )
        )
    }, [chatList, filterText])

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
                                Flagged
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
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                        </InputGroup>
                    </div>

                    <div className="" style={{ height: 480, overflowY: 'auto' }}>
                        {filterUsers?.map((item, key) => {
                            return (
                                <div key={key} className={`row g-0 p-2 border-bottom ${item?._id == isShow?._id ? 'bg-light' : ''}`} role='button' onClick={() => handleChat(item)}>
                                    <div className="col-auto">
                                        {item?.avatar ? (
                                            <img src={item?.avatar} alt="user" className="rounded-circle me-3" width={40} height={40} />
                                        ) : (
                                            <img src={userProfile} alt="user2" className="rounded-circle me-3" width={40} height={40} />
                                        )}
                                    </div>
                                    <div className="col">
                                        <p className="mb-0 fw-400 text-dark s-16">
                                            {item?.chatName}
                                        </p>
                                        <div className="mb-0 text-dark s-14 margin-zero" dangerouslySetInnerHTML={{ __html: item?.latestMessage?.message?.split('<p><br></p><p><br></p>').join(' ')?.substring(0,8)+'...'}} />
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
                        <div
                            id="scrollableDiv"
                            style={{
                                height: 493,
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column-reverse",
                            }}
                            className="chat-bg p-2"
                        >
                            <InfiniteScroll
                                dataLength={result?.isSuccess && chatMessages?.length}
                                // next={fetchMoreData}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    // flexDirection: "column-reverse",
                                    overflow: "hidden",
                                }}
                                inverse={true}
                                // hasMore={true}
                                //   loader={<h6 className="text-center">Loading...</h6>}
                                scrollableTarget="scrollableDiv"
                            >
                                {result?.isSuccess && chatMessages?.map((item, key) => (

                                    <div className="border p-3 pb-2 mb-2">
                                        {item?.sender == userId ? (
                                            <>
                                                <div className="row g-0 p-2 border-bottom justify-content-center">
                                                    <div className="col">
                                                        <p className="mb-0 fw-400 text-dark text-end text-capitalize s-16">
                                                            {item?.sender != userId ? item?.chatId?.chatName : admin?.first_name + ' ' + admin?.last_name}
                                                        </p>
                                                        {/*{item?.data?.sender_id == isShow?._id ? (
                                                <p className="mb-0 fw-400 text-dark s-16">{isShow?.first_name}&nbsp;{isShow?.last_name}</p>
                                            ) : (
                                                <p className="mb-0 fw-400 text-dark s-16">{user?.data[0]?.first_name}&nbsp;{user?.data[0]?.last_name}</p>
                                            )}*/}
                                                        <p className="mb-0 fw-300 text-dark text-end s-14">
                                                            {moment(item?.createdAt).format(`DD/MM/YYYY - h:mm A`)}
                                                        </p>
                                                    </div>
                                                    {item?.chatId?.avatar && (
                                                        <div className="col-auto">
                                                            <img src={item?.sender != userId ? item?.chatId?.avatar : process.env.REACT_APP_BASE_URL+admin?.avatar} alt="user" className="rounded-circle ms-3" width={40} height={40} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-2 pb-0 text-end margin-zero" dangerouslySetInnerHTML={{ __html: item?.message?.split('<p><br></p><p><br></p>').join(' ') }} />
                                                {item?.file && (
                                                    <img src={process.env.REACT_APP_BASE_URL+item?.file} className="d-block ms-auto" alt="file" width={100} height={60} style={{objectFit: 'contain'}}/>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="row g-0 p-2 border-bottom">
                                                    {item?.chatId?.avatar && (
                                                        <div className="col-auto">
                                                            <img src={item?.sender != userId ? item?.chatId?.avatar : admin?.avatar} alt="user" className="rounded-circle me-3" width={40} height={40} />
                                                        </div>
                                                    )}
                                                    <div className="col">
                                                        <p className="mb-0 fw-400 text-dark text-capitalize s-16">
                                                            {item?.sender != userId ? item?.chatId?.chatName : admin?.first_name + ' ' + admin?.last_name}
                                                        </p>
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
                                                <div className="p-0 pb-0" dangerouslySetInnerHTML={{ __html: item?.message?.split('<p><br></p><p><br></p>').join(' ') }}/>
                                                {item?.file && (
                                                    <img src={process.env.REACT_APP_BASE_URL+item?.file} className="d-block ms-auto" alt="file" width={100} height={60} style={{objectFit: 'contain'}}/>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </InfiniteScroll>
                        </div>
                        {isShow && (
                            <div className="p-1">
                                {watch('media_url') && (
                                    <>
                                        <div className="position-relative overflow-hidden" style={{width: 100, height: 100}}>
                                            <div className="position-absolute top-0 end-0">
                                                <i className="fa-solid fa-circle-xmark d-block" role="button" onClick={() => setValue('media_url', '')}/>
                                            </div>
                                            <img src={process.env.REACT_APP_BASE_URL + watch('media_url')} alt="file" width="100%" height="100%" style={{objectFit: 'cover'}}/>
                                        </div>
                                    </>
                                )}
                                <div className="border support rounded-4 border-primary overflow-hidden position-relative">
                                    <div className="position-absolute" style={{ top: 5, right: lang === 'en' ? 10 : 'inherit', left: lang === 'en' ? 'inherit' : 10 }}>
                                        <label htmlFor="file-circle" className="btn btn-light me-2">
                                            <i className="fa-regular fa-image"></i>
                                        </label>
                                        <button form="privacy-form" type="submit" className="btn bg-primary text-white s-14">
                                            {result2?.isLoading ? '...' : 'Send Message'}
                                        </button>
                                    </div>
                                    <Form
                                        id="privacy-form"
                                        onSubmit={handleSubmit(handleSave)}
                                    >
                                        <input id="file-circle" type="file" accept="image/*" className="d-none" onChange={handleAddMedia}/>
                                        <ReactQuill
                                            theme="snow"
                                            modules={modules} formats={formats}
                                            value={watch('text')}
                                            onChange={(e) => setValue('text', e)}
                                        />
                                    </Form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Support;