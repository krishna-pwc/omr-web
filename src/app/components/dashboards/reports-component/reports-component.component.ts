import { Component, OnInit, NgZone } from '@angular/core';
import { ReportServiceService } from 'src/app/services/report-service.service';
import * as _ from 'lodash';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-reports-component',
  templateUrl: './reports-component.component.html',
  styleUrls: ['./reports-component.component.scss']
})
export class ReportsComponentComponent implements OnInit {
  private chart: am4charts.XYChart;
  currentTab: string = 'tab1';
  loggedUser: string = 'admin';
  examList: any;
  studentList: any;
  segmentList: any;
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
  constructor(private reportServiceService: ReportServiceService, private zone: NgZone) { }
  ngOnInit() {
    this.reportServiceService.getExamList('admin').subscribe(response => {
      this.examList = response.data;
      if (_.isEmpty(this.selectedExam)) {
        this.selectedExam = this.examList[0];
      }
      this.reportServiceService.getStudentList(this.loggedUser, _.get(this.selectedExam, 'examid')).subscribe(response => {
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
      { field: '', header: 'Option' }
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
    this.reportServiceService.getSegmentList(this.loggedUser, _.get(this.selectedExam, 'examid'), _.get(this.selectedStudent, 'studentid')).subscribe(response => {
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
  showChart() {
    let chartData = [];
    let self = this;
    let tempObj = [];
    _.map(this.pieChartModel, function (parentObj) {
      _.assign(parentObj, { 'percent': _.sumBy(self.segmentList.segments, parentObj.code) })
      tempObj = [];
      _.map(self.segmentList.segments, function (childObj) {
        tempObj.push(_.assign(_.pick(childObj, 'name'), { 'percent': _.get(childObj, parentObj.code) }));
      });
      console.log(tempObj);
      // chartData.push(parentObj);
    });
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("questionSummaryChart", am4charts.PieChart);
      // Set data
      let selected;
      // let types = [{
      //   type: "Fossil Energy",
      //   percent: 70,
      //   color: chart.colors.getIndex(0),
      //   subs: [{
      //     type: "Oil",
      //     percent: 15
      //   }, {
      //     type: "Coal",
      //     percent: 35
      //   }, {
      //     type: "Nuclear",
      //     percent: 20
      //   }]
      // }, {
      //   type: "Green Energy",
      //   percent: 30,
      //   color: chart.colors.getIndex(1),
      //   subs: [{
      //     type: "Hydro",
      //     percent: 15
      //   }, {
      //     type: "Wind",
      //     percent: 10
      //   }, {
      //     type: "Other",
      //     percent: 5
      //   }]
      // }];
      let types = [{
        type: "Right Answer",
        percent: 20,
        color: "#4caf50",
        subs: [{
          type: "Speed and Distance",
          percent: 10
        }, {
          type: "Principal and Interest",
          percent: 10
        }]
      }, {
        type: "Wrong Answer",
        percent: 6,
        color: "#ef5350",
        subs: [{
          type: "Speed and Distance",
          percent: 3
        }, {
          type: "Principal and Interest",
          percent: 3
        }]
      }, {
        type: "Not Attempted",
        percent: 4,
        color: "#ffca28",
        subs: [{
          type: "Speed and Distance",
          percent: 2
        }, {
          type: "Principal and Interest",
          percent: 2
        }]
      }];

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