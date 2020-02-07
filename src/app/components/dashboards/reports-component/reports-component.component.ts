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
  studentList: any;
  currentSegment: any;
  displaySegment: boolean = false;
  studentTableColumns: any[];
  resultTableColumns: any[];
  segmentTableColumns: any[];
  selectedStudent: string;
  pieChartModel: any;
  constructor(private reportServiceService: ReportServiceService, private zone: NgZone) { }
  ngOnInit() {
    this.reportServiceService.getJSON().subscribe(response => {
      this.studentList = response;
      this.currentSegment = this.studentList.data[0];
      this.initializeTables();
    });
    this.pieChartModel = [
      {
        code: "rightanswer",
        title: "Right Answer",
        color: "#4caf50"
      },
      {
        code: "wronganswer",
        title: "Wrong Answer",
        color: "#ef5350"
      },
      {
        code: "notattempted",
        title: "Not Attempted",
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
      { field: 'totalmarksinpercentage', header: 'Scored (%)' },
      { field: 'rightanswer', header: 'Right Answer' },
      { field: 'wronganswer', header: 'Wrong Answer' },
      { field: 'notattempted', header: 'Not Attempted' },
      { field: 'totalmarks', header: 'Total Marks' },
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
      { field: 'passingmarks', header: 'Passing Mark (%)' },
      { field: 'marksobtainedpercentage', header: 'Scroed (%)' },
      { field: 'marksobtained', header: 'Total Marks' },
      { field: 'outcome', header: 'Result' }
    ]
  }
  showSegment(rowIndex) {
    this.currentSegment = this.studentList.data[rowIndex];
    this.selectedStudent = _.get(this.currentSegment, 'student.name');
    this.displaySegment = true;
    let self = this;
    this.buildPieChartData();
    setTimeout(function () {
      self.showChart();
    }, 1);
  }
  buildPieChartData() {

  }
  showChart() {
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