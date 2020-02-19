import { Component, OnInit, NgZone } from '@angular/core';
import { ReportService } from 'src/app/services/report-service.service';
import * as _ from 'lodash';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Ng2IzitoastService } from 'ng2-izitoast';
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-reports-component',
  templateUrl: './reports-component.component.html',
  styleUrls: ['./reports-component.component.scss']
})
export class ReportsComponentComponent implements OnInit {
  private chart: am4charts.XYChart;
  currentTab: string = 'tab1';
  loggedUser: string;
  examList: any;
  studentList: any;
  segmentList: any;
  recommendationArray: any;
  displaySegment: boolean = false;
  studentTableColumns: { field: string; header: string; }[];
  resultTableColumns: { field: string; header: string; }[];
  segmentTableColumns: { field: string; header: string; }[];
  answerTableColumns: { field: string; header: string; }[];
  selectedStudent: object;
  pieChartModel: any;
  selectedSegment: object;
  selectedExam: any;
  displayAnswer: boolean = false;
  constructor(private reportService: ReportService, private zone: NgZone, public iziToast: Ng2IzitoastService) { }
  ngOnInit() {
    this.loggedUser = localStorage.getItem('currentUser');
    this.getRecommendationData();
    this.reportService.getExamList(this.loggedUser).subscribe(response => {
      this.examList = response.data;
      if (_.isEmpty(this.selectedExam)) {
        this.selectedExam = this.examList[0];
      }
      this.reportService.getStudentList(this.loggedUser, _.get(this.selectedExam, 'examid')).subscribe(response => {
        this.studentList = response;
        this.initializeTables();
      });
    });
    this.pieChartModel = [
      {
        code: "rightanswer",
        type: "Right Answer",
        color: "#4caf50"
      },
      {
        code: "wronganswer",
        type: "Wrong Answer",
        color: "#ef5350"
      },
      {
        code: "notattempted",
        type: "Not Attempted",
        color: "#ffca28"
      }
    ]
  }
  getRecommendationData() {
    this.reportService.getJSON('./assets/json/devcon/schoolRecommendation.json').subscribe(response => {
      this.recommendationArray = response;
    });
  }
  initializeTables() {
    this.studentTableColumns = [
      { field: 'rollno', header: 'RollNo' },
      { field: 'name', header: 'Name' },
      { field: 'class', header: 'Class' },
      { field: 'section', header: 'Section' },
      { field: 'schoolcode', header: 'School Code' }
    ]
    this.resultTableColumns = [
      { field: 'rollno', header: 'RollNo' },
      { field: 'name', header: 'Name' },
      { field: 'marksobtainedinpercentage', header: 'Scored (%)' },
      { field: 'rightanswer', header: 'Right Answer' },
      { field: 'wronganswer', header: 'Wrong Answer' },
      { field: 'notattempted', header: 'Not Attempted' },
      { field: 'marksobtained', header: 'Total Marks' },
      { field: 'outcome', header: 'Result' },
      { field: '', header: 'Option' }
    ]
    this.segmentTableColumns = [
      { field: 'name', header: 'Section' },
      { field: 'noofquestions', header: 'Total Question' },
      { field: 'rightanswer', header: 'Right Answer' },
      { field: 'wronganswer', header: 'Wrong Answer' },
      { field: 'notattempted', header: 'Not Attempted' },
      { field: 'totalmarks', header: 'Outof' },
      { field: 'marksobtained', header: 'Total Marks' },
      { field: 'passingmarks', header: 'Passing Mark (%)' },
      { field: 'marksobtainedpercentage', header: 'Scored (%)' },
      { field: 'outcome', header: 'Result' },
      { field: '', header: 'Option' },
      { field: '', header: 'Action' }
    ]
    this.answerTableColumns = [
      { field: 'questionno', header: 'Question No' },
      { field: 'answer', header: 'Answer' },
      { field: 'marksobtained', header: 'Marks Obtained' },
      { field: 'marksdeducted', header: 'Marks Deducted' },
      { field: 'outcome', header: 'Result' }
    ]
  }
  showSegment(selectedStudent) {
    this.selectedStudent = selectedStudent;
    this.reportService.getSegmentList(this.loggedUser, _.get(this.selectedExam, 'examid'), _.get(this.selectedStudent, 'studentid')).subscribe(response => {
      this.segmentList = response;
      this.displaySegment = true;
      this.buildPieChartData();
    });
  }
  showAnswer(type, rowIndex) {
    this.selectedSegment = type === 'single' ? [this.segmentList.segments[rowIndex]] : this.segmentList.segments;
    this.displayAnswer = true;
    this.displaySegment = false;
  }
  buildPieChartData() {
    let self = this;
    setTimeout(function () {
      self.showChart();
    }, 1);
  }
  getSegmentDetails(segment) {
    let redirectUrl = '';
    this.iziToast.settings({
      position: 'topCenter',
      titleSize: '18',
      timeout: 2000,
      close: false,
      transitionIn: 'flipInX',
      transitionOut: 'flipOutX',
      onClosed: function () {
        window.open(redirectUrl, '_blank');
      }
    });
    let recommendation = _.find(_.get(this.recommendationArray, 'segmentdata'), { segmentname: _.trim(segment.name) });
    (segment.marksobtainedpercentage >= recommendation.studentclearperc[0].operator1Valperc && segment.marksobtainedpercentage <= recommendation.studentclearperc[0].operator2Valperc) ?
      (this.iziToast.error({ title: recommendation.studentclearperc[0].msg }), redirectUrl = recommendation.studentclearperc[0].recommendation)
      : (segment.marksobtainedpercentage >= recommendation.studentclearperc[1].operator1Valperc && segment.marksobtainedpercentage <= recommendation.studentclearperc[1].operator2Valperc) ?
        (this.iziToast.warning({ title: recommendation.studentclearperc[1].msg }), redirectUrl = recommendation.studentclearperc[1].recommendation)
        : (segment.marksobtainedpercentage >= recommendation.studentclearperc[2].operator1Valperc && segment.marksobtainedpercentage <= recommendation.studentclearperc[2].operator2Valperc) ?
          (this.iziToast.success({ title: recommendation.studentclearperc[2].msg }), redirectUrl = recommendation.studentclearperc[2].recommendation)
          : (this.iziToast.success({ title: recommendation.studentclearperc[3].msg }), redirectUrl = recommendation.studentclearperc[3].recommendation)
  }
  showChart() {
    let chartData = [];
    let self = this;
    let tempObj = [];
    _.map(this.pieChartModel, function (parentObj) {
      _.assign(parentObj, { 'percent': _.sumBy(self.segmentList.segments, parentObj.code) })
      tempObj = [];
      _.map(self.segmentList.segments, function (childObj) {
        tempObj.push(_.assign({ 'type': _.get(childObj, 'name') }, { 'percent': _.get(childObj, parentObj.code) }));
      });
      chartData.push(_.assign(_.omit(parentObj, 'code'), { 'subs': tempObj }));
    });
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("questionSummaryChart", am4charts.PieChart);
      // Set data
      let selected;
      let types = chartData;
      // Add data
      chart.data = generateChartData();
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "percent";
      pieSeries.dataFields.category = "type";
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.slices.template.propertyFields.isActive = "pulled";
      pieSeries.slices.template.strokeWidth = 0;
      function generateChartData() {
        let chartData = [];
        for (var i = 0; i < types.length; i++) {
          if (i == selected) {
            for (var x = 0; x < types[i].subs.length; x++) {
              chartData.push({
                type: types[i].subs[x].type,
                percent: types[i].subs[x].percent,
                color: types[i].color,
                pulled: true
              });
            }
          } else {
            chartData.push({
              type: types[i].type,
              percent: types[i].percent,
              color: types[i].color,
              id: i
            });
          }
        }
        return chartData;
      }
      pieSeries.slices.template.events.on("hit", function (event) {
        if ((<any>event.target.dataItem.dataContext).id != undefined) {
          selected = (<any>event.target.dataItem.dataContext).id;
        } else {
          selected = undefined;
        }
        chart.data = generateChartData();
      });
    });
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}