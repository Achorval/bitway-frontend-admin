import * as Yup from "yup";
import SVG from "react-inlinesvg";
import { useFormik } from "formik";
import classnames from 'classnames'
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import ReactTableWrapper from "./reacttbl.style";
import axiosInstance from "utility/utils/useAxios";
import PageTitle from "components/common/PageTitle";
import Pagination from "components/common/Pagination";
import { useToasts } from 'react-toast-notifications';
import CustomToast from "components/notifications/CustomToast";
import { contentLoader, empty } from 'utility/helper/constant';
import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";

const validationSchema = Yup.object({
    name: Yup.string().required('Please Enter Any Name'),
    imageUrl: Yup.string().required('Please Enter Any Image Url'),
    url: Yup.string().required('Please Enter Any Url'),
    color: Yup.string().required('Please Enter Any Color'),
    rate: Yup.string().required('Please Enter Any Rate'),
    description: Yup.string().required('Please Enter Any Description')
});

const { getServices, selectService } = AuthActions;

const initSnackBar = {
    flag: false,
    heading: "",
    description: ""
};

const ServicesPage = (props) => {
    const [modal, setmodal] = useState(false);
    const [snackBar, setSnackBar] = useState(initSnackBar);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageLength, setPageLength] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [warningAlert, setWarningAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { addToast } = useToasts();

    // ** Close form button
    const closeBtn = (
        <button className="close" onClick={() => setmodal(!modal)}>
            &times;
        </button>
    );

    // ** Distructure props
    const { handleGetServices, handleSelectService } = props;

    // ** UseForm
    const formik = useFormik({
        initialValues: {
            name: '',
            imageUrl: '',
            url: '',
            color: '',
            rate: '',
            description: ''
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            if (props.service === null) {
                createRecord(values);
            } else {
                updateRecord(props.service.id, values);
            }
        }
    });

    // ** Get data on mount
    const callApi = useCallback(() => {
        setIsLoading(true);
        const params = {
            page: currentPage,
            perPage: pageLength
        };
        axiosInstance.get('/admin/services', { params })
        .then((response) => {
            setIsLoading(false);
            handleGetServices(response.data.data);
            setTotalPage(response.data.data.totalItems);
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error)
        })
    }, [handleGetServices, currentPage, pageLength]);

    // Create record 
    const createRecord = (values) => {
        axiosInstance.post('/admin/services/create', {
            name: values.name, 
            imageUrl: values.imageUrl, 
            url: values.url, 
            color: values.color, 
            rate: values.rate, 
            description: values.description
        })
        .then((response) => {
            callApi();
            setmodal(!modal);
            addToast(response.data.message, { appearance: 'success' });
        })
        .catch((error) => {
            if (error.response) {
                addToast(error.response.data.message, { appearance: 'error' });
            };
        })
    }

    // Update record
    const updateRecord = (id, values) => {
        axiosInstance.put('/admin/services/update/'+id, {
            name: values.name,
            imageUrl: values.imageUrl, 
            url: values.url, 
            color: values.color,  
            rate: values.rate, 
            description: values.description
        })
        .then((response) => {
            callApi();
            setmodal(!modal);
            setSnackBar({
                flag: true,
                heading: "Successful!",
                description: `${response.data.message}`
            });
        })
        .catch((error) => {
            console.log(error.response)
        })
    };

    // ** Get data on mount
    useEffect(() => {
        // Call api here
        setPageLength(10);
        callApi();
    }, [callApi, currentPage]);

    // ** Handle page change
    const handlePageChange = page => {
        setCurrentPage(page);
    };

    // ** Handle render
    const renderForm = () => {
        return (
            <form className="pa-24" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className={classnames('form-control', { 'is-invalid': formik.errors.name && formik.touched.name && true })}
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                        placeholder="Name"
                    />
                    {formik.errors.name && formik.touched.name && <span className="error-msg">{formik.errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Image Url</label>
                    <input
                        type="text"
                        className={classnames('form-control', { 'is-invalid': formik.errors.imageUrl && formik.touched.imageUrl && true })}
                        name="imageUrl"
                        value={formik.values.imageUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Image Url"
                    />
                    {formik.errors.imageUrl && formik.touched.imageUrl && <span className="error-msg">{formik.errors.imageUrl}</span>}
                </div>
                <div className="form-group">
                    <label>Url</label>
                    <input
                        type="text"
                        className={classnames('form-control', { 'is-invalid': formik.errors.url && formik.touched.url && true })}
                        name="url"
                        value={formik.values.url}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Url"
                    />
                    {formik.errors.url && formik.touched.url && <span className="error-msg">{formik.errors.url}</span>}
                </div>
                <div className="form-group">
                    <label>Color</label>
                    <input
                        type="text"
                        className={classnames('form-control', { 'is-invalid': formik.errors.color && formik.touched.color && true })}
                        name="color"
                        value={formik.values.color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Color"
                    />
                    {formik.errors.color && formik.touched.color && <span className="error-msg">{formik.errors.color}</span>}
                </div>
                <div className="form-group">
                    <label>Rate</label>
                    <input
                        type="text"
                        className={classnames('form-control', { 'is-invalid': formik.errors.rate && formik.touched.rate && true })}
                        name="rate"
                        value={formik.values.rate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Rate"
                    />
                    {formik.errors.rate && formik.touched.rate && <span className="error-msg">{formik.errors.rate}</span>}
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        className={classnames('form-control', { 'is-invalid': formik.errors.description && formik.touched.description && true })}
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Description"
                    />
                    {formik.errors.description && formik.touched.description && <span className="error-msg">{formik.errors.description}</span>}
                </div>
                <Button type="submit" block className="c-primary mt-4">
                    {props.service !== null ? 'Update' : 'Create' } Service
                </Button>
            </form>
        )
    };

    // ** Handle edit click
    const editClick = (data) => {
        handleSelectService(data)
        // get data and set form fields
        const fields = ['name', 'imageUrl', 'url', 'color', 'rate', 'description'];
        fields.forEach(field => formik.setFieldValue(field, data[field], false));
        setmodal(!modal)
    };

    // ** Handle modal closed
    const handleModalClosed = () => {
        handleSelectService(null)
        const fields = ['name', 'imageUrl', 'url', 'color', 'rate', 'description'];
        fields.forEach(field => formik.setFieldValue(field, '', false));
    };

    // ** Toggle status
    const activeInactiveStatusHandler = (id, status) => {
        axiosInstance.put(`/admin/services/status`, { 
            id, status
        })
        .then((response) => {
            // Call api here
            callApi();
            setSnackBar({
                flag: true,
                heading: "Successful!",
                description: `${response.data.message}`
            });
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    // ** Delect record
    const deleteClick = id => {
        // Here you can view the data and delete through API calling
        setSnackBar({
          flag: true,
          heading: "Delete Handler",
          description: `you have to call api and Delete data, Your id is: ${id}`
        });
    };

    let sn = 1;

    return (
        <ReactTableWrapper {...props}>
            <div>
                <PageTitle
                    title="sidebar.serviceList"
                    className="plr-15"
                />
                <div className="row ma-0">
                    <div className="col-sm-12 pb-30">
                        <div className="roe-card-style">
                            <div className="roe-card-header">
                                <span className="hash"># </span>{" "}
                                Services List
                                <Button className="c-primary float-right" onClick={() => setmodal(!modal)}>
                                    Add Service
                                </Button>
                            </div>
                            <div className="roe-card-body">
                                {!isLoading ? (Array.isArray(props.services) && props.services.length > 0) ? 
                                    <div className="my-table-custom-class">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>SN</th>
                                                        <th>Name</th>
                                                        <th>Image</th>
                                                        <th>Url</th>
                                                        <th>Color</th>
                                                        <th>Rate</th>
                                                        <th>Description</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.services && props.services.map((e, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{sn++}</td>
                                                                <td>{e.name}</td>
                                                                <td><SVG src={e.imageUrl} /></td>
                                                                <td>{e.url}</td>
                                                                <td>{e.color}</td>
                                                                <td>{e.rate}</td>
                                                                <td>{e.description}</td>
                                                                <td>
                                                                    {e.status ? (
                                                                            <div id={`active-${e.id}`}>
                                                                                <Button
                                                                                    style={{ minWidth: "125px" }}
                                                                                    className="c-btn c-success mr-10"
                                                                                    onClick={() =>
                                                                                        activeInactiveStatusHandler(e.id, false)
                                                                                    }
                                                                                >
                                                                                    <div className="fs-14 medium-text">
                                                                                    <i className="fas fa-toggle-off mr-6" /> Active
                                                                                    </div>
                                                                                </Button>
                                                                            </div>
                                                                        ) : (
                                                                            <div id={`deactive-${e.id}`}>
                                                                                <Button
                                                                                    style={{ minWidth: "125px" }}
                                                                                    className="c-btn c-danger mr-10"
                                                                                    onClick={() =>
                                                                                    activeInactiveStatusHandler(e.id, true)
                                                                                    }
                                                                                >
                                                                                    <div className="fs-14 medium-text">
                                                                                    <i className="fas fa-toggle-on mr-6" /> InActive
                                                                                    </div>
                                                                                </Button>
                                                                            </div>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <div className="react-action-class">
                                                                        <Button
                                                                            className="c-btn c-success mr-10"
                                                                            onClick={() => editClick(e)}
                                                                            >
                                                                            <div className="fs-14 medium-text">
                                                                                <i className="fas fa-edit" />
                                                                            </div>
                                                                        </Button>
                                                                        <Button
                                                                            className="c-btn c-danger"
                                                                            onClick={() => {
                                                                                deleteClick(e.id)
                                                                                setWarningAlert(!warningAlert)
                                                                            }}
                                                                        >
                                                                            <div className="fs-14 medium-text">
                                                                                <i className="fas fa-trash" />
                                                                            </div>
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Pagination
                                            onPageChange={page => handlePageChange(page)}
                                            pages={totalPage}
                                            page={currentPage}
                                        />
                                    </div> : 
                                    <div className="d-flex align-items-center flex-column justify-content-center text-center py-5">
                                        <SVG src={empty} />
                                        <div className="text-center">
                                            <span className="text-muted font-size-xl d-block mb-2">
                                                You haven’t save any service yet.
                                            </span>
                                        </div>
                                    </div>
                                : <div className="d-flex align-items-center flex-column justify-content-center text-center py-5">
                                <SVG src={contentLoader} /></div>}
                                <CustomToast
                                    heading={snackBar.heading}
                                    width={400}
                                    show={snackBar.flag}
                                    transition
                                    position="top-middle"
                                    className="c-success break-word"
                                    message={snackBar.description}
                                    onCloseCLick={() => setSnackBar(initSnackBar)}
                                />
                            </div>
                        </div>
                    </div>
                    <Modal onClosed={handleModalClosed} isOpen={modal} toggle={() => setmodal(!modal)}>
                        <ModalHeader toggle={() => setmodal(!modal)} close={closeBtn}>
                            <span className='mb-1'>{props.service !== null ? 'Edit' : 'Add New'} Service</span>
                        </ModalHeader>
                        <ModalBody className='p-0'>
                            {renderForm()}
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        </ReactTableWrapper>
    );
};

const mapStateToProps = state => {
    return {
        ...state.auth
    };
};

const mapActionToProps = (dispatch) => {
    return {
        handleGetServices: data => dispatch(getServices(data)),
        handleSelectService: data => dispatch(selectService(data))
    };
};

export default connect(
    mapStateToProps,
    mapActionToProps
)(ServicesPage);
