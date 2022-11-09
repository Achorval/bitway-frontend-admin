import React, { Fragment } from "react";
import { connect } from "react-redux";
import PageviewsChartWidget from "components/widgets/pageviewsChartWidget/PageviewsChartWidget";
import {
  MiniLineBackgroundWidget,
  BottomCardLinechartWidget,
  BottomCardLinechartSecondWidget
} from "components/widgets/chartwidgets";

const Dashboard = ({ sidebarTheme }) => {
  return (
    <Fragment>
      <div className="row ma-0">
        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 pt-15 padding-t-15">
          <BottomCardLinechartWidget
            headline="Total Expense"
            subheader="154.12K"
            progress="+1.97%"
          />
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 pt-15 padding-t-15">
          <BottomCardLinechartSecondWidget
            headline="Total Profit"
            subheader="194.62K"
            progress="+1.19%"
          />
        </div>

        <div className="col-xl-3 col1-lg-6 col-md-6 col-sm-6 pt-15 padding-t-15">
          <MiniLineBackgroundWidget
            headline="Total Expenses"
            count="$650"
            barBackground="#FAD79A"
            barColor="#f6a821"
            chartData={[56, 18, 30, 61, 92, 35, 59, 57, 71, 96, 20, 30]}
          />
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 pt-15 padding-t-15">
          <MiniLineBackgroundWidget
            headline="Total Budgets"
            count="$65k"
            barBackground="#FDD8CF"
            barColor="#FA7252"
            chartData={[78, 30, 10, 20, 40, 55, 39, 78, 81, 76, 20, 31]}
          />
        </div>
      </div>
      <div className="row ma-0">
        <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 ptb-15">
          <PageviewsChartWidget sidebarTheme={sidebarTheme} />
        </div>
      </div>

      <div className="tbl-loader">
                    <div className="lds-ring">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
    </Fragment>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger
  };
};

export default connect(mapStateToProps, null)(Dashboard);
