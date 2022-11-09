
import moment from 'moment';
import SVG from "react-inlinesvg";
import { connect } from "react-redux";
import axiosInstance from "utility/utils/useAxios";
import { Button, Badge } from "reactstrap";
import AuthActions from "redux/auth/actions";
import PageTitle from "components/common/PageTitle";
import Pagination from "components/common/Pagination";
import RoyTooltip from "components/common/RoyTooltip";
import ReactTableWrapper from "../services/reacttbl.style";
import CustomToast from "components/notifications/CustomToast";
import React, { useState, useEffect, useCallback } from "react";
import { contentLoader, empty } from 'utility/helper/constant';

const { getUser } = AuthActions;

const initSnackBar = {
    flag: false,
    heading: "",
    description: ""
};

const UsersPage = (props) => {
    const [snackBar, setSnackBar] = useState(initSnackBar);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageLength, setPageLength] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // ** Distructure props
    const { handleGetUser } = props;

    // ** Get data on mount
    const callApi = useCallback(() => {
        setIsLoading(true);
        const params = {
            page_number: currentPage,
            page_size: pageLength
        };
        axiosInstance.get('/admin/users', { params })
        .then((response) => {
            setIsLoading(false);
            handleGetUser(response.data.data);
            setTotalPage(response.data.data.totalItems);
          // settblData(dummyData);
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error)
        })
    }, [handleGetUser, currentPage, pageLength]);

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

    // ** Toggle status
    const activeInactiveStatusHandler = data => {
        setSnackBar({
            flag: true,
            heading: "Status Change Action",
            description: `you have to call api to change status, Your id is: ${data.id}`
        });
    };

    let sn = 1;

    return (
        <ReactTableWrapper {...props}>
            <div>
                <PageTitle
                    title="sidebar.userList"
                    className="plr-15"
                    // breadCrumb={[
                    //     {
                    //         name: "sidebar.tables"
                    //     },
                    //     {
                    //         name: "sidebar.regulartabels"
                    //     }
                    // ]}
                />
                <div className="row ma-0">
                    <div className="col-sm-12 pb-30">
                        <div className="roe-card-style">
                            <div className="roe-card-header">
                                <span className="hash"># </span>{" "}
                                User List
                            </div>
                            <div className="roe-card-body">
                                {!isLoading ? (Array.isArray(props.users) && props.users.length > 0) ? 
                                    <div className="my-table-custom-class">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>SN</th>
                                                        <th>User</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Date Join</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {props.users && props.users.map((e, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{sn++}</td>
                                                                <td> {e.firstname + ' ' + e.lastname}</td>
                                                                <td>{e.email}</td>
                                                                <td>{e.phone}</td>
                                                                <td>{moment.utc(e.completedAt).local().format('MM/DD/YYYY')}</td>
                                                                <td>
                                                                    {e.blocked ? (
                                                                        <Badge className="c-danger">Inactive</Badge>
                                                                        ) : (
                                                                        <Badge className="c-success">Active</Badge>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {e.status ? (
                                                                        <RoyTooltip
                                                                            id={`active-${e.id}`}
                                                                            title={"Click to Deactivate"}
                                                                            placement="left"
                                                                        >
                                                                            <div id={`active-${e.id}`}>
                                                                                <Button
                                                                                    style={{ minWidth: "125px" }}
                                                                                    className="c-btn c-info mr-10"
                                                                                    onClick={() =>
                                                                                        activeInactiveStatusHandler(e.id)
                                                                                    }
                                                                                >
                                                                                    <div className="fs-14 medium-text">
                                                                                        Enable
                                                                                    </div>
                                                                                </Button>
                                                                            </div>
                                                                        </RoyTooltip>
                                                                        ) : (
                                                                        <RoyTooltip
                                                                            id={`deactive-${e.id}`}
                                                                            title={"Click to Active"}
                                                                            placement="left"
                                                                        >
                                                                            <div id={`deactive-${e.id}`}>
                                                                                <Button
                                                                                    style={{ minWidth: "125px" }}
                                                                                    className="c-btn c-danger mr-10"
                                                                                    onClick={() =>
                                                                                    activeInactiveStatusHandler(e.id)
                                                                                    }
                                                                                >
                                                                                    <div className="fs-14 medium-text">
                                                                                        Disable
                                                                                    </div>
                                                                                </Button>
                                                                            </div>
                                                                        </RoyTooltip>
                                                                    )}
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
                                    </div> : 
                                    <div className="d-flex align-items-center flex-column justify-content-center text-center py-5">
                                        <SVG src={empty} />
                                        <div className="text-center">
                                            <span className="text-muted font-size-xl d-block mb-2">
                                                You haven’t save any users yet.
                                            </span>
                                        </div>
                                    </div>
                                : <div className="d-flex align-items-center flex-column justify-content-center text-center py-5">
                                <SVG src={contentLoader} /></div>}
                            </div>
                        </div>
                    </div>
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
        handleGetUser: data => dispatch(getUser(data))
    };
};

export default connect(
    mapStateToProps,
    mapActionToProps
)(UsersPage);
