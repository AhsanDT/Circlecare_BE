import React, {useEffect, useState} from 'react';
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
import { useAddArticleMediaMutation, useAddArticleMutation, useAddDailyTaskMutation } from "../../redux/services/api";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactQuill from "react-quill";



const AddArticlePage = () => {
    const lang = useSelector(state => state?.auth?.lang);
    const navigate = useNavigate()
    const [removeModal, setRemoveModal, confirm, modalView] = useRemove()

    const [show, setShow] = useState(false);
    const [optionValue, setOptionValue] = useState('')
    const [option, setOption] = useState([])
    const [filterText, setFilterText] = React.useState('')
    const [type, setType] = useState(null)

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

    const [addRequest, { isLoading }] = useAddArticleMutation()
    const [addMedia] = useAddArticleMediaMutation()

    const hamdleAddMedia = (event) => {
        const form = new FormData()
        form.append('file', event.target.files[0])
        console.log('file', event.target.files[0])

        addMedia(form)
            .unwrap()
            .then((res) => {
                if(res){
                    setType(event?.target?.files[0]?.type)
                    setValue('media_url', res?.data)
                }
            })
    }

    const handleAdd = (data) => {
        data.content_type = lang === 'en' ? 'English' : 'Arabic'
        data.media_url = data.media_url ? data.media_url : null
        data.video_url = 'https://www.example.com'
        data.calendar = data.calendar ? moment(data.calendar).format('YYYY-MM-DD') : null
        data.time = data.time ? moment(data.time, 'hh:mm').format('hh:mmA') : null

        console.log('form data===', data)

        addRequest(data)
            .unwrap()
            .then((res) => {
                toast.success(res?.data, { id: 'add-daily-task-success', duration: 4000 })
                // reset()
                navigate('/article')
            })
            .catch((error) => {
                toast.error(error.data.error, { id: 'add-daily-task-error', duration: 4000 })
            })
    }

    useEffect(() => {
        setValue('article_type', 'Article')
    }, []);



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
                            <Button form="article-form" type="submit" variant="primary" disabled={isLoading} className="shadow-none s-14 text-white w-100">
                                {lang === 'en' ? 'Save' : 'يحفظ'}
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
                                        label={lang === 'en' ? "Article" : 'شرط'}
                                        value={'Article'}
                                        defaultChecked={true}
                                        {...register('article_type', { required: true })}
                                        isInvalid={errors.article_type}
                                        id="article1"
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type"
                                        label={lang === 'en' ? "Video" : 'فيديو'}
                                        value={'Video'}
                                        {...register('article_type', { required: true })}
                                        isInvalid={errors.article_type}
                                        id="video1"
                                    />
                                </Col>
                            </Row>

                        </Col>
                        <Col md={6}>
                            {/*<Form.Label className="text-secondary fw-400 s-14 mb-1">Task Type</Form.Label>*/}
                            {/*<Row>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type-check"
                                        label={`Daily`}
                                        value={'Daily'}
                                        {...register('month', { required: true })}
                                        isInvalid={errors.month}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type-check"
                                        label={`Weekly`}
                                        value={'Weekly'}
                                        {...register('month', { required: true })}
                                        isInvalid={errors.month}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Check
                                        type={'radio'}
                                        name="task-type-check"
                                        label={`Monthly`}
                                        value={'Monthly'}
                                        {...register('month', { required: true })}
                                        isInvalid={errors.month}
                                    />
                                </Col>
                            </Row>*/}

                        </Col>

                        <Col md={6}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Title' : 'عنوان'}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('title', { required: true })}
                                isInvalid={errors.title}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Date' : 'تاريخ'}
                            </Form.Label>
                            <Form.Control
                                type="date"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('calendar', { required: true })}
                                isInvalid={errors.calendar}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Time' : 'وقت'}
                            </Form.Label>
                            <Form.Control
                                type="time"
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('time', { required: true })}
                                isInvalid={errors.time}
                            />
                        </Col>
                        {/*<h5>
                            {lang === 'en' ? 'Healthy Survey' : 'المسح الصحي'}
                        </h5>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Heath Survey Score:' : 'نقاط المسح الصحي:'}
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Min"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('health_survey_score.min', { required: true })}
                                        isInvalid={errors.health_survey_score}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Max"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('health_survey_score.max', { required: true })}
                                        isInvalid={errors.health_survey_score}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Q LES QSF:' : 'س ليه QSF:'}:
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Min"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('q_les_qsf_score.min', { required: true })}
                                        isInvalid={errors.q_les_qsf_score}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Max"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('q_les_qsf_score.max', { required: true })}
                                        isInvalid={errors.q_les_qsf_score}
                                    />
                                </Col>
                            </Row>
                        </Col>

                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'QID SR:' : 'البطاقة الشخصية ريال سعودي:'}
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Min"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('qid_sr_score.min', { required: true })}
                                        isInvalid={errors.qid_sr_score}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Max"
                                        className="shadow-none s-15 text-dark fw-400 border-2"
                                        {...register('qid_sr_score.max', { required: true })}
                                        isInvalid={errors.qid_sr_score}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <h5>
                            {lang === 'en' ? 'General Health Information' : 'معلومات صحية عامة'}
                        </h5>
                        <Col md={4}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Cancer Type' : 'نوع السرطان'}
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('cancer_type', { required: false })}
                                isInvalid={errors.cancer_type}
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
                                {lang === 'en' ? 'Stage of Tumor' : 'مرحلة الورم'}
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('tumor_stage', { required: false })}
                                isInvalid={errors.tumor_stage}
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
                                {lang === 'en' ? 'Current Cancer Treatments' : 'علاجات السرطان الحالية'}
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('current_cancer_treatment[0]', { required: false })}
                                isInvalid={errors.current_cancer_treatment}
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
                                {lang === 'en' ? 'Other Conditions' : 'شروط أخرى'}
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('other_conditions', { required: false })}
                                isInvalid={errors.other_conditions}
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
                                {lang === 'en' ? 'Severity of Symptoms' : 'شدة الأعراض'}
                            </Form.Label>
                            <Form.Select
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('severity_of_symptoms', { required: false })}
                                isInvalid={errors.severity_of_symptoms}
                            >
                                <option value="">Select</option>
                                <option value="Depression">Depression</option>
                                <option value="Anxiety">Anxiety</option>
                                <option value="Distress">Distress</option>
                                <option value="Impact on quality of life">Impact on quality of life</option>
                                <option value="Psychosocial impact">Psychosocial impact</option>
                            </Form.Select>
                        </Col>*/}

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
                                            <input
                                                type="file"
                                                id='image'
                                                className="d-none"
                                                accept="image/*"
                                                onChange={hamdleAddMedia}
                                            />
                                        </Col>
                                        {watch('media_url') && type?.startsWith('image/') && (
                                            <>
                                            <Col xs={3} className="d-flex align-items-end">
                                                <div className={`${!watch('media_url') ? 'border border-danger border-2' : 'border border-primary border-dash'} rounded-3 row g-0 align-items-center justify-content-center overflow-hidden`} style={{ height: 100, width: 120 }}>
                                                    <img src={process.env.REACT_APP_BASE_URL + watch('media_url')} alt='media' className='w-100 h-100' style={{ objectFit: 'cover' }} />
                                                </div>
                                                <i className="fa fa-trash s-18 text-danger ms-2" role="button" onClick={() => setValue('media_url', null)}></i>
                                            </Col>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Col xs={2}>
                                            <label htmlFor='video' role="button" className={`${!watch('media_url') ? 'border border-danger border-2' : 'border border-primary border-dash'} rounded-3 row g-0 align-items-center justify-content-center overflow-hidden`} style={{ height: 100 }}>
                                                <div className="col-auto text-center">
                                                    <i className="fa-light fa-image text-primary s-38 d-block" />
                                                    <p className="small text-secondary mb-0">Upload Video</p>
                                                </div>
                                            </label>
                                            <input
                                                type="file"
                                                id='video'
                                                className="d-none"
                                                accept="video/*"
                                                onChange={hamdleAddMedia}
                                            />
                                        </Col>
                                        {watch('media_url') && type?.startsWith('video/') && (
                                            <Col xs={3} className="d-flex align-items-end">
                                                <div role="button" className="border border-primary border-dash rounded-3 row g-0 align-items-center justify-content-center overflow-hidden">
                                                    <video width="100" height="100" controls>
                                                        <source src={process.env.REACT_APP_BASE_URL + watch('media_url')} type="video/mp4" />
                                                        Error Message
                                                    </video>
                                                </div>
                                                <i className="fa fa-trash s-18 text-danger ms-2" role="button" onClick={() => setValue('media_url', null)}></i>
                                            </Col>
                                        )}
                                    </>
                                )}
                            </Row>
                        </Col>
                        <Col md={12}>
                            <Form.Label className="text-secondary fw-400 s-14 mb-1">
                                {lang === 'en' ? 'Description' : 'وصف'}
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                className="shadow-none s-15 text-dark fw-400 border-2"
                                {...register('description', { required: true })}
                                isInvalid={errors.description}
                            />
                            {/*<div className={`${errors.description ? 'border border-2 border-danger' : ''}`} style={{height: 200, overflowY: 'auto'}}>*/}
                            {/*    <ReactQuill*/}
                            {/*        theme="snow"*/}
                            {/*        value={watch('description')}*/}
                            {/*        onChange={(e) => setValue('description', e)}*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </Col>
                    </Form>
                </Card.Body>
            </Card>

            {modalView}
        </>
    );
};

export default AddArticlePage;
