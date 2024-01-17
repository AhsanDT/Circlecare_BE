import React, { useEffect, useState } from 'react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useGetPrivacyQuery, useSavePrivacyMutation } from "../../redux/services/api";
import moment from "moment/moment";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import {useSelector} from "react-redux";

const PrivacyAndPolicy = () => {
    const lang = useSelector(state => state?.auth?.lang);

    const [value, setValue2] = useState('');
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

    const { data, refetch, isLoading: isFetching } = useGetPrivacyQuery()
    const [saveRequest, { isLoading }] = useSavePrivacyMutation()

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]


    const handleSave = (data) => {
        saveRequest(data)
            .unwrap()
            .then((res) => {
                toast.success(res?.data, { id: 'privacy-success', duration: 4000 })
                reset()
                refetch()
            })
            .catch((error) => {
                toast.error(error.data.error, { id: 'privacy-error', duration: 4000 })
            })
    }

    useEffect(() => {
        if (data) {
            console.log('dataknlkn==', data)
            setValue('text', data?.data[0]?.text)
        }
    }, [data])


    useEffect(() => {
        refetch()
    }, [])

    isFetching && <>Loading...</>
    return (
        <>
            <div className="position-relative">
                <div className="position-absolute" style={{ top: 4, right: lang === 'en' ? 10 : 'inherit', left: lang === 'en' ? 'inherit' : 10 }}>
                    <button form="privacy-form" type="submit" className="btn bg-primary text-white s-14">
                        {isLoading ? '...' : 'Save Changes'}
                    </button>
                </div>
                <Form id="privacy-form" onSubmit={handleSubmit(handleSave)}>
                    <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={watch('text')}
                        onChange={(e) => setValue('text', e)}
                    />
                    {errors.text && <span className="text-danger s-14">This field is required</span>}
                </Form>
            </div>
        </>
    );
};

export default PrivacyAndPolicy;