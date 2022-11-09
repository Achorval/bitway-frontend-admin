import SVG from "react-inlinesvg";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import axiosInstance from "utility/utils/useAxios";
import PageTitle from "components/common/PageTitle";
import Pagination from "components/common/Pagination";
import { useToasts } from 'react-toast-notifications';
import ReactTableWrapper from "../services/reacttbl.style";
import { contentLoader, empty } from 'utility/helper/constant';
import React, { useState, useEffect, useCallback } from "react";
import { Table, Badge, Modal, ModalHeader, ModalBody } from "reactstrap";

const { getHistory } = AuthActions;

const HistoryPage = (props) => {
    const [modal, setModal] = useState(false);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [transDetails, setTransDetails] = useState({});
    // const [status, setStatus] = useState(1);
    // const [service, setService] = useState(1);

    const { addToast } = useToasts();

    // ** Distructure props
    const { handleGetHistory } = props;

    // ** Close form button
    const closeBtn = (
        <button className="close" onClick={() => setModal(!modal)}>
            &times;
        </button>
    );

    // ** Handle modal closed
    const handleModalOpen = (id) => {
        setModal(!modal);
        setIsLoading2(true);
        axiosInstance.get('/admin/transactions/details', { params: {
            id: id
        }})
        .then((response) => {
            setIsLoading2(false);
            setTransDetails(response.data.data);
        })
        .catch((error) => {
            setIsLoading2(false);
            console.log(error.response)
        });
    };

    // ** Get data on mount
    const callApi = useCallback(() => {
        setIsLoading(true);
        const params = {
            page: page,
            perPage: perPage,
            // status: status,
            // service: service
        };
        axiosInstance.get('/admin/transactions', { params })
        .then((response) => {
            setIsLoading(false);
            handleGetHistory(response.data.data);
            setTotalPage(response.data.data.totalItems);
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error)
        });
    }, [handleGetHistory, page, perPage]);

    // ** Get data on mount
    useEffect(() => {
        // Call api here
        callApi();
        setPerPage(10);
    }, [callApi, page]);

    // ** Handle page change
    const handlePageChange = page => {
        setPage(page);
    };

    // ** renders client status
    const renderStatus = value => { 
        var status;
        switch (value) {
        case 'success':
            status = <Badge className="c-success">Success</Badge>;
            break;
        case 'pending':
            status = <Badge className="c-warning">Pending</Badge>;
            break;
        case 'processing':
            status = <Badge className="c-info">Processing</Badge>;
            break;
        default:
            status = <Badge className="c-danger">Failed</Badge>;
            break;
        }
        return status;
    };

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    const handleChange = (e, id, amount, userId, service) => {
        if (window.confirm("Press a button!") === true) {
            axiosInstance.post('/admin/transactions/status/update', { 
                id: id,
                status: e.target.value,
                amount: amount,
                userId: userId,
                service: service
            })
            .then((response) => {
                setModal(!modal);
                callApi();
                addToast(response.data.message, { appearance: 'success' });
            })
            .catch((error) => {
                if (error.response) {
                    addToast(error.response.data.message, { appearance: 'error' });
                }
            });
        } else {
            alert("You canceled!");
        };
    };

    let sn = 1;

    const handleFilter = (e) => {
        e.preventDefault();
         // Call api here
         callApi();
         setPerPage(10);
    };
  
    return (
        <ReactTableWrapper {...props}>
            <div>
                <PageTitle
                    title="sidebar.historyList"
                    className="plr-15"
                />
                <div className="row ma-0">
                    <div className="col-sm-12 pb-30">
                        <div className="roe-card-style">
                            <form onSubmit={(e) => handleFilter(e)}>
                                <div className="row align-items-center p-4">
                                    <div className="col-md-4">
                                        <div className="roe-card-header p-0">
                                            <span className="hash"># </span>{" "}
                                            History List
                                        </div>
                                    </div>
                                    {/* <div className="col-md-3 py-2">
                                        <label>Status</label>
                                        <select className="form-control" required>
                                            <option value="">All</option>
                                            <option value="success">Success</option>
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 py-2">
                                        <label>Service</label>
                                        <select className="form-control" required>
                                            <option value="">All</option>
                                            <option value="withdrawal">Withdrawal</option>
                                            <option value="trade-usdt">Trade USDT</option>
                                            <option value="trade-bitcoin">Trade Bitcoin</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <button className="btn btn-primary w-100">Search</button>
                                    </div> */}
                                </div>
                            </form>
                            <div className="roe-card-body">
                                {!isLoading ? (Array.isArray(props.history) && props.history.length > 0) ? 
                                    <div className="my-table-custom-class">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>SN</th>
                                                        <th>Name</th>
                                                        <th>Service</th>
                                                        <th>Reference</th>
                                                        <th>Narration</th>
                                                        <th>Image</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                        <th>Create Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.history && props.history.map((e, i) => {
                                                        return (
                                                            <tr key={i} onClick={() => handleModalOpen(e.id)} style={{cursor:'pointer'}}>
                                                                <td>{sn++}</td>
                                                                <td>{e.user.firstname + ' ' + e.user.lastname}</td>
                                                                <td>{e.service.name}</td>
                                                                <td>{e.reference}</td>
                                                                <td>{e.narration}</td>
                                                                <td className="text-center">
                                                                    {e.imageUrl && <img src={e.imageUrl} width='40px' height='40px' alt="" />}
                                                                </td>
                                                                <td>
                                                                    {e.type !== 'credit' ? (
                                                                        <Badge className="c-danger">
                                                                            ₦{e.amount}
                                                                        </Badge>
                                                                        ) : (
                                                                        <Badge className="c-success">
                                                                            ₦{e.amount}
                                                                        </Badge>
                                                                    )}
                                                                </td>
                                                                <td>{renderStatus(e.status)}</td>
                                                                <td>
                                                                    {e.createdAt}
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
                                            page={page}
                                        />
                                    </div> : 
                                    <div className="d-flex align-items-center flex-column justify-content-center text-center py-5">
                                        <SVG src={empty} />
                                        <div className="text-center">
                                            <span className="text-muted font-size-xl d-block mb-2">
                                                You haven’t had any transaction list yet.
                                            </span>
                                        </div>
                                    </div>
                                : <div className="d-flex align-items-center flex-column justify-content-center text-center py-5">
                                <SVG src={contentLoader} /></div>}
                            </div>
                        </div>
                    </div>
                </div>
                {!isEmpty(transDetails) && (
                <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                    <ModalHeader toggle={() => setModal(!modal)} close={closeBtn}>
                        <span className='mb-1'>Transaction Details</span>
                    </ModalHeader>
                    <ModalBody className='p-0'>
                        {!isLoading2 ? 
                            <Table className="">
                                <tbody>
                                    {transDetails.imageUrl !== null &&
                                    <tr>
                                        <td colSpan="2" className="text-center">
                                            <img src={transDetails.imageUrl} alt="" width='300px' height='auto' />
                                        </td>
                                    </tr>
                                    }
                                    <tr>
                                        <td>Name</td>
                                        <td>{transDetails.user.firstname + ' ' + transDetails.user.lastname}</td>
                                    </tr>
                                    <tr>
                                        <td>Service</td>
                                        <td>{transDetails.service.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Reference</td>
                                        <td>{transDetails.reference}</td>
                                    </tr>
                                    <tr>
                                        <td>Narration</td>
                                        <td>{transDetails.narration}</td>
                                    </tr>
                                    <tr>
                                        <td>Amount To Receive</td>
                                        <td>{transDetails.amount}</td>
                                    </tr>
                                    {transDetails.bankAccount !== null && <>
                                    <tr>
                                        <td>Bank Name</td>
                                        <td>{transDetails.bankAccount.bankName}</td>
                                    </tr>
                                    <tr>
                                        <td>Account Number</td>
                                        <td>{transDetails.bankAccount.accountNumber}</td>
                                    </tr>
                                    <tr>
                                        <td>Account Name</td>
                                        <td>{transDetails.bankAccount.accountName}</td>
                                    </tr>
                                    </>}
                                    <tr>
                                        <td>Status</td>
                                        <td>
                                            <select 
                                                name="status"
                                                value={transDetails.status}
                                                className="form-control"
                                                onChange={(e) => handleChange(e, transDetails.id, transDetails.amount, transDetails.user.id, transDetails.service.name)}>
                                                <option value="success">Success</option>
                                                <option value="pending">Pending</option>
                                                <option value="failed">Failed</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        : 
                            <div className="d-flex align-items-center flex-column justify-content-center text-center py-5">
                                <SVG src={contentLoader} />
                            </div>
                        }
                    </ModalBody>
                </Modal>
                )}
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
        handleGetHistory: data => dispatch(getHistory(data))
    };
};

export default connect(
    mapStateToProps,
    mapActionToProps
)(HistoryPage);
