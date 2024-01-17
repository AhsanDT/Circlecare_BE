import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    InputGroup,
    Row,
    NavDropdown,
    Modal,
    FloatingLabel,
    OverlayTrigger,
    Tooltip
} from "react-bootstrap";
import DataTable from 'react-data-table-component'
import { customStyles } from "../../assets/js/customTable";
import useRemove from "../../global/hooks/useRemove";
import { useForm } from "react-hook-form";
import moment from "moment";
import {
    useAddArticleMediaMutation,
    useAddArticleMutation,
    useAddDailyTaskMutation,
    useGetArticleDetailQuery,
    useGetDailyTaskDetailQuery, useUpdateArticleMutation
} from "../../redux/services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {useSelector} from "react-redux";

const EditArticlePage = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()
    const { id } = useParams()
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [optionValue, setOptionValue] = useState('')
    const [option, setOption] = useState([])
    const [filterText, setFilterText] = React.useState('')

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

    const { data } = useGetArticleDetailQuery(id)
    const [editRequest, { isLoading }] = useUpdateArticleMutation()
    const [addMedia] = useAddArticleMediaMutation()

    const hamdleAddMedia = (event) => {
        const form = new FormData()
        form.append('file', event.target.files[0])

        addMedia(form)
            .unwrap()
            .then((res) => {
                setValue('media_url', res?.data)
            })
    }

    const handleAdd = (data) => {
        data.content_type = lang === 'en' ? 'English' : 'Arabic'
        data.media_url = data.media_url ? data.media_url : 'https://www.example.com'
        data.video_url = 'https://www.example.com'
        data.calendar = data.calendar ? moment(data.calendar).format('YYYY-MM-DD') : null
        data.time = data.time ? moment(data.time, 'hh:mm').format('hh:mmA') : null

        console.log('form data===', data)

        editRequest({ id, ...data })
            .unwrap()
            .then((res) => {
                toast.success(res?.data, { id: 'update-daily-task-success', duration: 4000 })
                reset()
                navigate('/article')
            })
            .catch((error) => {
                toast.error(error.data.error, { id: 'update-daily-task-error', duration: 4000 })
            })
    }

    useEffect(() => {
        setValue('article_type', data?.data[0]?.article_type)
        setValue('month', data?.data[0]?.month)
        setValue('title', data?.data[0]?.title)
        setValue('month', data?.data[0]?.month)
        setValue('calendar', data?.data[0]?.calendar)
        setValue('time', moment(data?.data[0]?.time, 'hh:mmA').format('hh:mm'))
        setValue('media_url', data?.data[0]?.media_url)
        setValue('video_url', data?.data[0]?.video_url)

            setValue(`health_survey_score.min`, data?.data[0]?.health_survey_score.min)
        setValue(`health_survey_score.max`, data?.data[0]?.health_survey_score.max)

        setValue(`q_les_qsf_score.min`, data?.data[0]?.q_les_qsf_score.min)
        setValue(`q_les_qsf_score.max`, data?.data[0]?.q_les_qsf_score.max)

            setValue(`qid_sr_score.min`, data?.data[0]?.qid_sr_score.min)
            setValue(`qid_sr_score.max`, data?.data[0]?.qid_sr_score.max)

        setValue('cancer_type', data?.data[0]?.cancer_type)
        setValue('tumor_stage', data?.data[0]?.tumor_stage)
        setValue('current_cancer_treatment[0]', data?.data[0]?.current_cancer_treatment[0])
        setValue('other_conditions', data?.data[0]?.other_conditions)
        setValue('severity_of_symptoms', data?.data[0]?.severity_of_symptoms)

        setValue('description', data?.data[0]?.description)
    }, [data])

    return (
        <>
            <Card>
                <Card.Body>
                    <Row className="align-items-center justify-content-between mb-3">
                        <Col xs="auto">
                            <h5 className="mb-0 s-20 text-primary fw-600">
                                Add
                            </h5>
                        </Col>
                        <Col xs={2}>
                            <Button form="article-form" type="submit" disabled={isLoading} variant="primary" className="shadow-none s-14 text-white w-100">
                                Save
                            </Button>
                        </Col>
                    </Row>
                    <Form id="article-form" onSubmit={handleSubmit(handleAdd)} className="row g-3 align-items-end">
                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">Task Type</Form.Label>
                            <Row>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type"
                                        label={`Article`}
                                        value={'Article'}
                                        {...register('article_type', { required: true })}
                                        isValid={errors.article_type}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type"
                                        label={`Video`}
                                        value={'Video'}
                                        {...register('article_type', { required: true })}
                                        isValid={errors.article_type}
                                    />
                                </Col>
                            </Row>

                        </Col>
                        <Col md={6}>
                            {/*<Form.Label className="text-secondary fw-400 s-14 mb-1">Task Type</Form.Label>*/}
                            <Row>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type-check"
                                        label={`Daily`}
                                        value={'Daily'}
                                        {...register('month', { required: true })}
                                        isValid={errors.month}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type-check"
                                        label={`Weekly`}
                                        value={'Weekly'}
                                        {...register('month', { required: true })}
                                        isValid={errors.month}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type-check"
                                        label={`Monthly`}
                                        value={'Monthly'}
                                        {...register('month', { required: true })}
                                        isValid={errors.month}
                                    />
                                </Col>
                            </Row>

                        </Col>

                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Title
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('title', { required: true })}
                                isValid={errors.title}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">Date</Form.Label>
                            <Form.Control
                                type="date"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('calendar', { required: true })}
                                isValid={errors.calendar}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">Time</Form.Label>
                            <Form.Control
                                type="time"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('time', { required: true })}
                                isValid={errors.time}
                            />
                        </Col>
                        <h5>Healthy Survey</h5>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Heath Survey Score:
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Min"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('health_survey_score.min', { required: true })}
                                        isValid={errors.health_survey_score}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Max"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('health_survey_score.max', { required: true })}
                                        isValid={errors.health_survey_score}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Q LES QSF:
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Min"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('q_les_qsf_score.min', { required: true })}
                                        isValid={errors.q_les_qsf_score}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Max"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('q_les_qsf_score.max', { required: true })}
                                        isValid={errors.q_les_qsf_score}
                                    />
                                </Col>
                            </Row>
                        </Col>

                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                QID SR:
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Min"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('qid_sr_score.min', { required: true })}
                                        isValid={errors.qid_sr_score}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Max"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('qid_sr_score.max', { required: true })}
                                        isValid={errors.qid_sr_score}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <h5>General Health Information</h5>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Cancer Type
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('cancer_type', { required: false })}
                                isValid={errors.cancer_type}
                            >
                                <option value="">Select</option>
                                <option value="Bladder Cancer">Bladder Cancer</option>
                                <option value="Breast Cancer">Breast Cancer</option>
                                <option value="Kidney Cancer">Kidney Cancer</option>
                                <option value="Thyroid Cancer">Thyroid Cancer</option>
                                <option value="Cervical Cancer">Cervical Cancer</option>
                                <option value="Colorectal Cancer">Colorectal Cancer</option>
                                <option value="Gynecological Cancer">Gynecological Cancer</option>
                                <option value="Head and neck cancers">Head and neck cancers</option>
                                <option value="Liver cancer">Liver cancer</option>
                                <option value="Lung Cancer">Lung Cancer</option>
                                <option value="Lymphoma">Lymphoma</option>
                                <option value="Mesothelioma">Mesothelioma</option>
                                <option value="Myeloma">Myeloma</option>
                                <option value="Ovarian cancer">Ovarian cancer</option>
                                <option value="Prostate cancer">Prostate cancer</option>
                                <option value="Skin cancer">Skin cancer</option>
                                <option value="Uterine cancer">Uterine cancer</option>
                                <option value="Vaginal and vulvar cancers">Vaginal and vulvar cancers</option>
                                <option value="None">None</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Stage of Tumor
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('tumor_stage', { required: false })}
                                isValid={errors.tumor_stage}
                            >
                                <option value="">Select</option>
                                <option value="None">None</option>
                                <option value="Stage I">Stage I</option>
                                <option value="Stage II">Stage II</option>
                                <option value="Stage III">Stage III</option>
                                <option value="Stage IV">Stage IV</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Current Cancer Treatments
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('current_cancer_treatment[0]', { required: false })}
                                isValid={errors.current_cancer_treatment}
                            >
                                <option value="">Select</option>
                                <option value="Hormonal treatment">Hormonal treatment</option>
                                <option value="Radiotherapy">Radiotherapy</option>
                                <option value="Chemotherapy">Chemotherapy</option>
                                <option value="Hormonal treatment">Hormonal treatment</option>
                                <option value="No Treatments">No Treatments</option>
                                <option value="other">other</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Other Conditions
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('other_conditions', { required: false })}
                                isValid={errors.other_conditions}
                            >
                                <option value="">Select</option>
                                <option value="Hypertension">Hypertension</option>
                                <option value="Diabetes">Diabetes</option>
                                <option value="Heart conditions">Heart conditions</option>
                                <option value="HIV">HIV</option>
                                <option value="HBV">HBV</option>
                                <option value="HCV">HCV</option>
                                <option value="Bipolar Disorder">Bipolar Disorder</option>
                                <option value="Depression">Depression</option>
                                <option value="Schizophrenia">Schizophrenia</option>
                                <option value="Respiratory diseases">Respiratory diseases</option>
                                <option value="Cerebrovascular disease">Cerebrovascular disease</option>
                                <option value="Kidney disease">Kidney disease</option>
                                <option value="Liver disease">Liver disease</option>
                                <option value="Lung diseases">Lung diseases</option>
                                <option value="Disabilities">Disabilities</option>
                                <option value="Obesity">Obesity</option>
                                <option value="Blood diseases">Blood diseases</option>
                                <option value="Pregnancy or recent pregnancy">Pregnancy or recent pregnancy</option>
                                <option value="Smoking (current and former)">Smoking (current and former)</option>
                                <option value="Solid organ or blood stem cell transplantation">Solid organ or blood stem cell transplantation</option>
                                <option value="Use of corticosteroids or other immunosuppressive medications">Use of corticosteroids or other immunosuppressive medications</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Severity of Symptoms
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('severity_of_symptoms', { required: false })}
                                isValid={errors.severity_of_symptoms}
                            >
                                <option value="">Select</option>
                                <option value="Depression">Depression</option>
                                <option value="Anxiety">Anxiety</option>
                                <option value="Distress">Distress</option>
                                <option value="Impact on quality of life">Impact on quality of life</option>
                                <option value="Psychosocial impact">Psychosocial impact</option>
                            </Form.Select>
                        </Col>

                        <Col md={12}>
                            <Row className="align-items-center">
                                {watch('article_type') === 'Article' ? (
                                    <>
                                        <Col xs={2}>
                                            <label htmlFor='image' role="button" className={`${!watch('media_url') ? 'border border-danger border-2' : 'border border-primary border-dash'} rounded-3 row g-0 align-items-center justify-content-center overflow-hidden`} style={{ height: 100 }}>
                                                <div className="col-auto text-center">
                                                    <i className="fa-light fa-image text-primary s-38 d-block" />
                                                    <p className="small text-secondary mb-0">Upload Image</p>
                                                </div>
                                            </label>
                                            <input type="file" id='image' className="d-none" onChange={hamdleAddMedia} />
                                        </Col>
                                        {watch('media_url') && (
                                            <Col xs={2}>
                                                <div className={`${!watch('media_url') ? 'border border-danger border-2' : 'border border-primary border-dash'} rounded-3 row g-0 align-items-center justify-content-center overflow-hidden`} style={{ height: 100 }}>
                                                    <img src={process.env.REACT_APP_BASE_URL + watch('media_url')} alt='media' className='w-100 h-100' style={{ objectFit: 'cover' }} />
                                                </div>
                                            </Col>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Col xs={2}>
                                            <label htmlFor='image' role="button" className={`${!watch('media_url') ? 'border border-danger border-2' : 'border border-primary border-dash'} rounded-3 row g-0 align-items-center justify-content-center overflow-hidden`} style={{ height: 100 }}>
                                                <div className="col-auto text-center">
                                                    <i className="fa-light fa-image text-primary s-38 d-block" />
                                                    <p className="small text-secondary mb-0">Upload Video</p>
                                                </div>
                                            </label>
                                            <input type="file" id='image' className="d-none" onChange={hamdleAddMedia} />
                                        </Col>
                                        {watch('media_url') && (
                                            <Col xs={2}>
                                                <div htmlFor='image' role="button" className="border border-primary border-dash rounded-3 row g-0 align-items-center justify-content-center overflow-hidden">
                                                    <video width="100" height="100" controls>
                                                        <source src={process.env.REACT_APP_BASE_URL + watch('media_url')} type="video/mp4" />
                                                        Error Message
                                                    </video>
                                                </div>
                                            </Col>
                                        )}
                                    </>
                                )}
                            </Row>
                        </Col>
                        <Col md={12}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                Description
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('description', { required: true })}
                                isValid={errors.description}
                            />
                        </Col>
                    </Form>
                </Card.Body>
            </Card>

            {modalView}
        </>
    );
};

export default EditArticlePage;