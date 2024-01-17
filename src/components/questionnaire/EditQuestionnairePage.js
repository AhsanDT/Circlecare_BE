import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, NavDropdown, Modal, FloatingLabel, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import { useFieldArray, useForm } from "react-hook-form";

import {
    useUpdateQuestionareMutation,
    useViewQuestionareMutation
} from "../../redux/services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import {v4 as uuidv4} from "uuid";


const AddQuestionnairePage = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const { id } = useParams()
    const navigate = useNavigate()
    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        getValues,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            questions: [{ question: '', options: [] }]
        }
    })

    const [updateRequest, { isLoading }] = useUpdateQuestionareMutation()
    const [viewRequest] = useViewQuestionareMutation()

    const [add, setAdd] = useState([])

    const [show, setShow] = useState(false);
    const [optionValue, setOptionValue] = useState('')
    const [option, setOption] = useState([])

    const [filterText, setFilterText] = React.useState('')

    const handleAdd = () => {
        // setAdd([...add, {question: ''}])
        setValue('questions', [...getValues('questions'), { question: '' }])
    }
    const handleDuplicate = (index) => {
        const currentItems = getValues('questions');
        currentItems.splice(index + 1, 0, currentItems[index]);
        setValue('questions', currentItems);
    }
    const handleAddOptions = (field, index) => {
        const current = watch(`questions[${index}].options`) === undefined ? [] : getValues(`questions[${index}].options`)
        const currentVal = watch(`tryQuestion[${index}]`)
        const currentVal2 = watch(`tryQuestion2[${index}]`)
        const body = {
            label: currentVal,
            points: currentVal2,
        }
        setValue(`questions[${index}].options`, [...current, body])
    }
    const handleRemove = (index) => {
        const currentItems = getValues('questions');
        currentItems.splice(index, 1);
        setValue('questions', currentItems);
    }
    const handleRemoveOptions = (item, pIndex, index) => {
        const currentItems = watch(`questions[${pIndex}].options`).filter((v, i) => i !== index);
        console.log('currentItems', currentItems)
        // currentItems.splice(index, 1);
        setValue(`questions[${pIndex}].options`, currentItems)
    }

    // dropdown
    const handleAddSubQue = (field, index) => {
        const current = watch(`questions[${index}].options`) === undefined ? [] : getValues(`questions[${index}].options`)
        setValue(`questions[${index}].options`, [...current, {}])
    }
    const handleRemoveSubQue = (field, index) => {
        const current = watch(`questions[${index}].options`) === undefined ? [] : getValues(`questions[${index}].options`)
        current.splice(-1)
        // current.splice(0, current.length)
        setValue(`questions[${index}].options`, current)
    }
    const handleAddSubOption = (field, i, k) => {
        const current = watch(`questions[${i}].options[${k}].sub_options`) === undefined ? [] : getValues(`questions[${i}].options[${k}].sub_options`)
        setValue(`questions[${i}].options[${k}].sub_options`, [...current, {}])
    }
    const handleRemoveSubOption = (field, i, k) => {
        const currentItems = watch(`questions[${i}].options[${k}].sub_options`).filter((val) => val !== field);
        setValue(`questions[${i}].options[${k}].sub_options`, currentItems)
    }

    const handleForm = (data) => {
        console.log('form data===', data)
        delete data.tryQuestion
        delete data.tryQuestion2
        data.content_type = lang === 'en' ? 'English' : 'Arabic'
        data.questions.length > 0 && data.questions.map((item, index) => {
            data.questions[index].qid = uuidv4()
        })
        updateRequest({ id, ...data })
            .unwrap()
            .then((res) => {
                console.log('res', res)
                toast.success(res?.data, { id: 'update-question-success', duration: 4000 })
                reset()
                navigate('/questionnaire')
            })
            .catch((err) => {
                console.log('error', err)
                toast.error(err?.data?.error ? err?.data?.error : err?.data?.msg , { id: 'add-question-error2', duration: 4000 })
            })
    }


    useEffect(() => {
        if (watch(`questions[0].type`) === 'Dropdown') {
            const current = watch(`questions[0].options`) === undefined ? [] : getValues(`questions[0].options`)
            setValue(`questions[0].options`, [])
            const current2 = watch(`questions[0].options[0].sub_options`) === undefined ? [] : getValues(`questions[0].options[0].sub_options`)
            setValue(`questions[0].options[0].sub_options`, [])
        } else {
            const current = watch(`questions[0].options`) === undefined ? [] : getValues(`questions[0].options`)
            setValue(`questions[0].options`, [])
        }
    }, [watch(`questions[0].type`)])

    useEffect(() => {
        if (id) {
            viewRequest(id)
                .unwrap()
                .then((res) => {
                    console.log('res', res)
                    setValue('questions', res?.data[0]?.questions)
                    setValue('title', res?.data[0]?.title)
                    setValue('month', res?.data[0]?.month)
                    setValue('description', res?.data[0]?.description)
                })
        }
    }, [id])

    return (
        <>
            <Card>
                <Card.Body>

                    <Row className="align-items-center justify-content-between mb-3">
                        <Col xs="auto">
                            <h5 className="mb-0 s-20 text-primary fw-600">Edit</h5>
                        </Col>
                        <Col xs={2}>
                            <Button form="questionare-add-form" type="submit" disabled={isLoading} variant="primary" className="shadow-none s-14 text-white w-100">
                                {lang === 'en' ? 'Save' : 'يحفظ'}
                            </Button>
                        </Col>
                    </Row>
                    <Form id="questionare-add-form" onSubmit={handleSubmit(handleForm)} className="row g-3">
                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Title' : 'العنوان'}
                                {errors.title && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Title Here..."
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('title', { required: true })}
                                isInvalid={errors.title}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Month' : 'الشهر'}
                                {errors.month && <span className="text-danger">*</span>}
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('month', { required: true })}
                                isInvalid={errors.month}
                            >
                                <option value="">{lang === 'en' ? 'Select Month' : 'اختر الشهر'}</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </Form.Select>
                        </Col>
                        <Col md={12}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Description (Optional)' : 'الوصف (اختياري)'}
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('description', { required: false })}
                            />
                        </Col>
                        {watch('questions')?.map((field, i) => (
                            <Col key={i} md={12}>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <Row className="g-3 align-items-center justify-content-between">
                                            <Col md={6}>
                                                <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                                    {lang === 'en' ? 'Question' : 'سؤال'}
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder={lang === 'en' ? 'Enter question here' : 'أدخل السؤال هنا'}
                                                    className="shadow-none s-15 text-dark fw-400 border-2"
                                                    {...register(`questions[${i}].question`, { required: true })}
                                                    isInvalid={errors.questions?.[i]?.question}
                                                />
                                                {watch(`questions[${i}].type`) === 'Dropdown' ? (
                                                    <>
                                                        {watch(`questions[${i}].options`)?.length > 0 && (
                                                            <>
                                                                {watch(`questions[${i}].options`)?.map((field, k) => (
                                                                    <Card key={k} className='my-2'>
                                                                        <Card.Body>
                                                                            <Form.Label className="text-secondary fw-400 s-14 mb-1">Sub Question</Form.Label>
                                                                            <Form.Control
                                                                                type="text"
                                                                                placeholder="Enter Sub question here"
                                                                                className="shadow-none s-15 text-dark fw-400 border-2"
                                                                                {...register(`questions[${i}].options[${k}].sub_question`, { required: true })}
                                                                            />

                                                                            {watch(`questions[${i}].options[${k}].sub_options`)?.map((field, j) => (
                                                                                <Row key={j} className="gx-2 p-2 py-3 align-items-center">
                                                                                    <Col xs={10}>
                                                                                        <Form.Control
                                                                                            type="text"
                                                                                            placeholder="Enter Option Here" className="shadow-sm s-15 text-dark fw-400 border-0 mb-2"
                                                                                            {...register(`questions[${i}].options[${k}].sub_options[${j}].label`)}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col xs={10}>
                                                                                        <Form.Control
                                                                                            type="text"
                                                                                            placeholder="Enter Points Here" className="shadow-sm s-15 text-dark fw-400 border-0 mb-2"
                                                                                            {...register(`questions[${i}].options[${k}].sub_options[${j}].points`)}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col xs="auto">
                                                                                        <Button
                                                                                            variant="primary"
                                                                                            className="shadow-none s-14 text-white"
                                                                                            onClick={() => handleRemoveSubOption(field, i, k)}>
                                                                                            <i className="fa-regular fa-close s-20 text-white d-block" />
                                                                                        </Button>
                                                                                    </Col>
                                                                                </Row>
                                                                            ))}
                                                                            <Button
                                                                                variant="primary"
                                                                                className="shadow-none s-14 text-white"
                                                                                onClick={() => handleAddSubOption(field, i, k)}>
                                                                                <i className="fa-regular fa-plus s-20 text-white d-block" />
                                                                            </Button>
                                                                        </Card.Body>
                                                                    </Card>
                                                                ))}
                                                            </>
                                                        )}
                                                        <Row>
                                                            <Col>
                                                                <Button
                                                                    variant="primary"
                                                                    className="shadow-none s-14 text-white w-100"
                                                                    onClick={() => handleAddSubQue(field, i)}
                                                                >
                                                                    <i className="fa-regular fa-plus s-20 text-white d-block" />
                                                                </Button>
                                                            </Col>
                                                            <Col>
                                                                <Button
                                                                    variant="primary"
                                                                    className="shadow-none s-14 text-white w-100"
                                                                    onClick={() => handleRemoveSubQue(field, i)}
                                                                >
                                                                    <i className="fa-regular fa-close s-20 text-white d-block" />
                                                                </Button>
                                                            </Col>
                                                        </Row>

                                                    </>
                                                ) : (
                                                    <>
                                                        {watch(`questions[${i}].options`)?.map((item, k) => (
                                                            <Row key={k} className="gx-2 p-2 py-3 align-items-center">
                                                                <Col xs="auto">
                                                                    {watch(`questions[${i}].type`) === 'Multiple Choice' && (
                                                                        <i className="fa-light fa-square-check s-18 text-secondary d-block"></i>
                                                                    )}
                                                                    {watch(`questions[${i}].type`) === 'Checkboxes' && (
                                                                        <i className="fa-light fa-circle s-18 text-secondary d-block" />
                                                                    )}
                                                                </Col>
                                                                <Col>
                                                                    <p className="s-14 m-0 text-secondary">{item.label}</p>
                                                                </Col>
                                                                <Col>
                                                                    <p className="s-14 m-0 text-secondary">{item.points}</p>
                                                                </Col>
                                                                <Col xs="auto">
                                                                    <i className="fa-regular fa-close s-20 text-dark d-block" role="button" onClick={() => handleRemoveOptions(item, i, k)} />
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                        <Row className="gx-2 p-2 py-3 align-items-center">
                                                            <Col xs="auto">
                                                                {watch(`questions[${i}].type`) === 'Multiple Choice' && (
                                                                    <i className="fa-light fa-square-check s-18 text-secondary d-block"></i>
                                                                )}
                                                                {watch(`questions[${i}].type`) === 'Checkboxes' && (
                                                                    <i className="fa-light fa-circle s-18 text-secondary d-block" />
                                                                )}
                                                            </Col>
                                                            <Col xs="auto">
                                                                <p className="s-14 m-0 text-secondary">
                                                                    {lang === 'en' ? 'Add Option' : 'ضعخياًراجدًيدا'}
                                                                </p>
                                                            </Col>
                                                            <Col>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder={lang === 'en' ? "Enter Option Here" : 'اكتب سؤالك'} className="shadow-sm s-15 text-dark fw-400 border-0"
                                                                    {...register(`tryQuestion[${i}]`)}
                                                                // value={optionValue}
                                                                // onChange={(e) => setOptionValue(e.target.value)}
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder={lang === 'en' ? "Enter Score" : 'أدخل النتيجة'} className="shadow-sm s-15 text-dark fw-400 border-0"
                                                                    {...register(`tryQuestion2[${i}]`)}
                                                                />
                                                            </Col>
                                                            <Col xs="auto">
                                                                <Button
                                                                    variant="primary"
                                                                    className="shadow-none s-14 text-white"
                                                                    onClick={() => handleAddOptions(field, i)}>
                                                                    <i className="fa-regular fa-plus s-20 text-white d-block" />
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </Col>
                                            <Col md={6}>
                                                <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                                    {lang === 'en' ? 'Select Type of Answer' : 'اختر الإجابة'}
                                                </Form.Label>
                                                {console.log('swe', watch(`questions[${i}].options`))}
                                                <Form.Select
                                                    className="shadow-none s-15 text-dark fw-400 border-2"
                                                    {...register(`questions[${i}].type`, { required: true })}

                                                >
                                                    <option value="Multiple Choice">
                                                        {lang === 'en' ? 'Multiple Choice' : 'متعدد الخيارات'}
                                                    </option>
                                                    <option value="Checkboxes">
                                                        {lang === 'en' ? 'Checkboxes' : 'خانات الاختيار'}
                                                    </option>
                                                    <option value="Dropdown">
                                                        {lang === 'en' ? 'Dropdown' : 'اسقاط'}
                                                    </option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                        <hr className="border-1" />
                                        <Row className="g-3 align-items-center justify-content-end">
                                            <Col md="auto">
                                                <i
                                                    className="fa-regular fa-copy text-dark s-22 d-block"
                                                    role="button"
                                                    onClick={() => handleDuplicate(i)}
                                                />
                                            </Col>
                                            <Col md="auto">
                                                <i
                                                    className="fa-regular fa-trash text-dark s-22 d-block"
                                                    role="button"
                                                    onClick={() => handleRemove(i)}
                                                />
                                            </Col>
                                            <Col md="auto">
                                                |
                                            </Col>
                                            <Col md="auto">
                                                {errors.questions?.[i]?.required && <span className="text-danger s-16">Required</span>}
                                                <Form.Check // prettier-ignore
                                                    type="switch"
                                                    id="custom-switch"
                                                    className="d-inline-block m-0 ms-3 s-22"
                                                    // label="Check this switch"
                                                    {...register(`questions[${i}].is_required`, { required: true })}
                                                />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}

                        <div className="col-auto">
                            <Button variant="primary" className="shadow-none s-14 text-white" onClick={handleAdd}>
                                {lang === 'en' ? 'Add Question' : 'أضف سؤال'}
                            </Button>
                        </div>


                    </Form>
                </Card.Body>
            </Card>

            {modalView}
        </>
    );
};

export default AddQuestionnairePage;