import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReportService } from 'src/app/services/report-service.service';
import * as _ from 'lodash';
import { Ng2IzitoastService } from 'ng2-izitoast';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-devcon-reports',
  templateUrl: './devcon-reports.component.html',
  styleUrls: ['./devcon-reports.component.scss']
})
export class DevconReportsComponent implements OnInit, AfterViewInit {
  stateWiseData: [];
  recommendationArray: [];
  statewiseSummaryData: [];
  districtWiseData: [];
  districtWiseSchoolList: [];
  schoolList: [];
  stateWiseTableColumns: { field: string; header: string; }[];
  districtWiseTableColumns: { field: string; header: string; }[];
  districtWiseSchoolListTableColumns: { field: string; header: string; }[];
  schoolListTableColumns: { field: string; header: string; }[];
  currentReport: number = 1;
  selectedDistrict: any;
  selectedSchool: any;
  constructor(private reportService: ReportService, public iziToast: Ng2IzitoastService) { }
  ngOnInit() {
    this.getStateWiseData();
    this.getRecommendationData();
  }
  ngAfterViewInit() {
    this.getStateWisePieChart();
    this.getStateWiseStackedBarChart();
  }
  getStateWiseStackedBarChart() {
    setTimeout(() => {
      // Create chart instance
      let chart = am4core.create("statewiseSummaryStackedBarChart", am4charts.XYChart3D);
      // Create chart instance
      chart.paddingBottom = 30;
      chart.angle = 35;
      // Add data
      chart.data = [{
        "division": "1st Division",
        "value": 205
      }, {
        "division": "2nd Division",
        "value": 85
      }, {
        "division": "3rd Division",
        "value": 56
      }];

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "division";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.inside = true;
      categoryAxis.renderer.grid.template.disabled = true;

      // let labelTemplate = categoryAxis.renderer.labels.template;
      // labelTemplate.rotation = -90;
      // labelTemplate.horizontalCenter = "left";
      // labelTemplate.verticalCenter = "middle";
      // labelTemplate.dy = 10; // moves it a bit down;
      // labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.grid.template.disabled = true;

      // Create series
      let series = chart.series.push(new am4charts.ConeSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "division";

      let columnTemplate = series.columns.template;
      columnTemplate.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      })

      columnTemplate.adapter.add("stroke", function (stroke, target) {
        return chart.colors.getIndex(target.dataItem.index);
      })
    }, 1);
  }
  getStateWisePieChart() {
    setTimeout(function () {
      // Create chart instance
      let chart = am4core.create("statewiseSummaryPieChart", am4charts.PieChart);
      // Set data
      let types = [
        {
          type: "Students Appeared",
          percent: 530,
          color: '#ffca28',
        },
        {
          type: "Students Cleared",
          percent: 346,
          color: '#4caf50',
        },
        {
          type: "Students Failed",
          percent: 184,
          color: '#ef5350',
        }
      ];
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
          chartData.push({
            type: types[i].type,
            percent: types[i].percent,
            color: types[i].color,
            id: i
          });
        }
        return chartData;
      }
    }, 1);
  }
  getDistrictWiseChartDetails() {
    setTimeout(function () {
      // Create chart instance
      let container = am4core.create("disctrictwiseSummaryPieChart", am4core.Container);
      container.width = am4core.percent(100);
      container.height = am4core.percent(100);
      container.layout = "horizontal";

      let chart = container.createChild(am4charts.PieChart);

      // Add data
      chart.data = [{
        "district": "Bengaluru",
        "count": 230,
        "subData": [{ name: "Students Cleared", value: 154, color: "#4caf50" }, { name: "Students Failed", value: 76, color: "#ef5350" }]
      }, {
        "district": "Bidar",
        "count": 150,
        "subData": [{ name: "Students Cleared", value: 112, color: "#4caf50" }, { name: "Students Failed", value: 38, color: "#ef5350" }]
      }, {
        "district": "Vijaypur",
        "count": 150,
        "subData": [{ name: "Students Cleared", value: 80, color: "#4caf50" }, { name: "Students Failed", value: 70, color: "#ef5350" }]
      }];

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "count";
      pieSeries.dataFields.category = "district";
      pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
      //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

      pieSeries.slices.template.events.on("hit", function (event) {
        selectSlice(event.target.dataItem);
      })

      let chart2 = container.createChild(am4charts.PieChart);
      chart2.width = am4core.percent(30);
      chart2.radius = am4core.percent(80);

      // Add and configure Series
      let pieSeries2 = chart2.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "value";
      pieSeries2.dataFields.category = "name";
      pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
      //pieSeries2.labels.template.radius = am4core.percent(50);
      //pieSeries2.labels.template.inside = true;
      //pieSeries2.labels.template.fill = am4core.color("#ffffff");
      pieSeries2.labels.template.disabled = true;
      pieSeries2.ticks.template.disabled = true;
      pieSeries2.alignLabels = false;
      pieSeries2.events.on("positionchanged", updateLines);

      let interfaceColors = new am4core.InterfaceColorSet();

      let line1 = container.createChild(am4core.Line);
      line1.strokeDasharray = "2,2";
      line1.strokeOpacity = 0.5;
      line1.stroke = interfaceColors.getFor("alternativeBackground");
      line1.isMeasured = false;

      let line2 = container.createChild(am4core.Line);
      line2.strokeDasharray = "2,2";
      line2.strokeOpacity = 0.5;
      line2.stroke = interfaceColors.getFor("alternativeBackground");
      line2.isMeasured = false;

      let selectedSlice;

      function selectSlice(dataItem) {

        selectedSlice = dataItem.slice;

        let fill = selectedSlice.fill;

        let count = dataItem.dataContext.subData.length;
        pieSeries2.colors.list = [];
        for (var i = 0; i < count; i++) {
          pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
        }

        chart2.data = dataItem.dataContext.subData;
        pieSeries2.appear();

        let middleAngle = selectedSlice.middleAngle;
        let firstAngle = pieSeries.slices.getIndex(0).startAngle;
        let animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
        animation.events.on("animationprogress", updateLines);

        selectedSlice.events.on("transformed", updateLines);

        //  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
        //  animation.events.on("animationprogress", updateLines)
      }


      function updateLines() {
        if (selectedSlice) {
          let p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
          let p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

          p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
          p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

          let p21 = { x: 0, y: -pieSeries2.pixelRadius };
          let p22 = { x: 0, y: pieSeries2.pixelRadius };

          p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
          p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

          line1.x1 = p11.x;
          line1.x2 = p21.x;
          line1.y1 = p11.y;
          line1.y2 = p21.y;

          line2.x1 = p12.x;
          line2.x2 = p22.x;
          line2.y1 = p12.y;
          line2.y2 = p22.y;
        }
      }

      chart.events.on("datavalidated", function () {
        setTimeout(function () {
          selectSlice(pieSeries.dataItems.getIndex(0));
        }, 1000);
      });
    }, 1);
    setTimeout(() => {
      // Create chart instance
      let chart = am4core.create("disctrictwiseSummaryStackedBarChart", am4charts.XYChart);

      // Add data
      chart.data = [{
        "district": "Bengaluru",
        "1st": 85,
        "2nd": 45,
        "3rd": 24
      }, {
        "district": "Bidar",
        "1st": 50,
        "2nd": 25,
        "3rd": 20
      }, {
        "district": "Vijaypur",
        "1st": 35,
        "2nd": 25,
        "3rd": 20
      }];

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "district";
      categoryAxis.renderer.grid.template.location = 0;


      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.min = 0;

      // Create series
      function createSeries(field, name) {

        // Set up series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "district";
        series.sequencedInterpolation = true;

        // Make it stacked
        series.stacked = true;

        // Configure columns
        series.columns.template.width = am4core.percent(60);
        series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

        // Add label
        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{valueY}";
        labelBullet.locationY = 0.5;
        labelBullet.label.hideOversized = true;

        return series;
      }

      createSeries("1st", "1st Division");
      createSeries("2nd", "2nd Division");
      createSeries("3rd", "3rd Division");

      // Legend
      chart.legend = new am4charts.Legend();
    }, 1);
  }
  getSchoolWiseChartDetails() {
    setTimeout(() => {
      // Create chart instance
      let chart = am4core.create("schoolwiseSummaryBarChart", am4charts.XYChart);
      let tempData = [];
      _.map(_.get(this.districtWiseSchoolList, 'schooldata'), function (obj) {
        tempData.push({
          'school': obj.schoolname,
          'appeared': obj.studentappeared,
          'cleared': obj.studentcleared,
          'failed': obj.studentfailed
        });
      });
      // Add data
      chart.data = tempData;
      // Create axes
      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "school";
      categoryAxis.numberFormatter.numberFormat = "#";
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;

      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.opposite = true;

      // Create series
      function createSeries(field, name) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "school";
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
        series.columns.template.height = am4core.percent(100);
        series.sequencedInterpolation = true;

        let valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "{valueX}";
        valueLabel.label.horizontalCenter = "left";
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = "{name}";
        categoryLabel.label.horizontalCenter = "right";
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color("#fff");
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
      }

      createSeries("appeared", "Appeared");
      createSeries("cleared", "Cleared");
      createSeries("failed", "Failed");
    }, 1);
    setTimeout(() => {
      // Create chart instance
      let chart = am4core.create("schoolwiseSummaryStackedBarChart", am4charts.XYChart);
      let tempData = [];
      _.map(_.get(this.districtWiseSchoolList, 'schooldata'), function (obj) {
        tempData.push({
          'school': obj.schoolname,
          "1st": obj.firstdiv,
          "2nd": obj.seconddiv,
          "3rd": obj.thirddiv
        });
      });
      // Add data
      chart.data = tempData;

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "school";
      categoryAxis.renderer.grid.template.location = 0;


      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.disabled = true;
      valueAxis.min = 0;

      // Create series
      function createSeries(field, name) {

        // Set up series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "school";
        series.sequencedInterpolation = true;

        // Make it stacked
        series.stacked = true;

        // Configure columns
        series.columns.template.width = am4core.percent(60);
        series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

        // Add label
        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{valueY}";
        labelBullet.locationY = 0.5;
        labelBullet.label.hideOversized = true;

        return series;
      }

      createSeries("1st", "1st Division");
      createSeries("2nd", "2nd Division");
      createSeries("3rd", "3rd Division");

      // Legend
      chart.legend = new am4charts.Legend();
    }, 1);
  }
  getSegmentWiseChartDetails() {
    setTimeout(() => {
      let container = am4core.create("segmentwiseSummaryPieChart", am4core.Container);
      container.width = am4core.percent(100);
      container.height = am4core.percent(100);
      container.layout = "horizontal";


      let chart = container.createChild(am4charts.PieChart);
      let tempData = [];
      _.map(_.get(this.schoolList, 'segmentdata'), function (obj) {
        tempData.push({
          'segmentname': obj.segmentname,
          'appeared': obj.studentappeared,
          'subData': [{ name: "Passed", value: obj.studentcleared }, { name: "Failed", value: obj.studentfailed }]
        });
      });
      // Add data
      chart.data = tempData;

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "appeared";
      pieSeries.dataFields.category = "segmentname";
      pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
      //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

      pieSeries.slices.template.events.on("hit", function (event) {
        selectSlice(event.target.dataItem);
      })

      let chart2 = container.createChild(am4charts.PieChart);
      chart2.width = am4core.percent(30);
      chart2.radius = am4core.percent(80);

      // Add and configure Series
      let pieSeries2 = chart2.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "value";
      pieSeries2.dataFields.category = "name";
      pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
      //pieSeries2.labels.template.radius = am4core.percent(50);
      //pieSeries2.labels.template.inside = true;
      //pieSeries2.labels.template.fill = am4core.color("#ffffff");
      pieSeries2.labels.template.disabled = true;
      pieSeries2.ticks.template.disabled = true;
      pieSeries2.alignLabels = false;
      pieSeries2.events.on("positionchanged", updateLines);

      let interfaceColors = new am4core.InterfaceColorSet();

      let line1 = container.createChild(am4core.Line);
      line1.strokeDasharray = "2,2";
      line1.strokeOpacity = 0.5;
      line1.stroke = interfaceColors.getFor("alternativeBackground");
      line1.isMeasured = false;

      let line2 = container.createChild(am4core.Line);
      line2.strokeDasharray = "2,2";
      line2.strokeOpacity = 0.5;
      line2.stroke = interfaceColors.getFor("alternativeBackground");
      line2.isMeasured = false;

      let selectedSlice;

      function selectSlice(dataItem) {

        selectedSlice = dataItem.slice;

        let fill = selectedSlice.fill;

        let count = dataItem.dataContext.subData.length;
        pieSeries2.colors.list = [];
        for (var i = 0; i < count; i++) {
          pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
        }

        chart2.data = dataItem.dataContext.subData;
        pieSeries2.appear();

        let middleAngle = selectedSlice.middleAngle;
        let firstAngle = pieSeries.slices.getIndex(0).startAngle;
        let animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
        animation.events.on("animationprogress", updateLines);

        selectedSlice.events.on("transformed", updateLines);

        //  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
        //  animation.events.on("animationprogress", updateLines)
      }


      function updateLines() {
        if (selectedSlice) {
          let p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
          let p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

          p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
          p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

          let p21 = { x: 0, y: -pieSeries2.pixelRadius };
          let p22 = { x: 0, y: pieSeries2.pixelRadius };

          p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
          p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

          line1.x1 = p11.x;
          line1.x2 = p21.x;
          line1.y1 = p11.y;
          line1.y2 = p21.y;

          line2.x1 = p12.x;
          line2.x2 = p22.x;
          line2.y1 = p12.y;
          line2.y2 = p22.y;
        }
      }

      chart.events.on("datavalidated", function () {
        setTimeout(function () {
          selectSlice(pieSeries.dataItems.getIndex(0));
        }, 1000);
      });
    }, 1000);
  }
  getStateWiseData() {
    this.reportService.getJSON('./assets/json/devcon/state.json').subscribe(response => {
      this.stateWiseData = response.statedata;
      this.initializeTables();
    });
  }
  getRecommendationData() {
    this.reportService.getJSON('./assets/json/devcon/schoolRecommendation.json').subscribe(response => {
      this.recommendationArray = response;
    });
  }
  getDistrictWiseData() {
    this.districtWiseData = [];
    let self = this;
    _.map(['Bengaluru', 'Bidar', 'Vijaypur'], function (obj) {
      self.reportService.getJSON(`./assets/json/devcon/state/${obj}/Dist.json`).subscribe(response => {
        (<any>self).districtWiseData.push(response.distdata);
      });
    });
    this.currentReport += 1;
    this.getDistrictWiseChartDetails();
  }
  getDistrictWiseSchoolList(district) {
    this.selectedDistrict = district;
    this.reportService.getJSON(`./assets/json/devcon/state/${district.distname}/${district.distname}.json`).subscribe(response => {
      this.districtWiseSchoolList = response;
    });
    this.currentReport += 1;
    this.getSchoolWiseChartDetails();
  }
  getSchoolList(district, school) {
    this.selectedSchool = school;
    this.reportService.getJSON(`./assets/json/devcon/state/${district}/schools/${school.schoolid}.json`).subscribe(response => {
      this.schoolList = response;
    });
    this.currentReport += 1;
    this.getSegmentWiseChartDetails();
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
    let recommendation = _.find(_.get(this.recommendationArray, 'segmentdata'), { segmentid: segment.segmentid });
    (segment.studentclearedperc >= recommendation.studentclearperc[0].operator1Valperc && segment.studentclearedperc <= recommendation.studentclearperc[0].operator2Valperc) ?
      (this.iziToast.error({ title: recommendation.studentclearperc[0].msg }), redirectUrl = recommendation.studentclearperc[0].recommendation)
      : (segment.studentclearedperc >= recommendation.studentclearperc[1].operator1Valperc && segment.studentclearedperc <= recommendation.studentclearperc[1].operator2Valperc) ?
        (this.iziToast.warning({ title: recommendation.studentclearperc[1].msg }), redirectUrl = recommendation.studentclearperc[1].recommendation)
        : (segment.studentclearedperc >= recommendation.studentclearperc[2].operator1Valperc && segment.studentclearedperc <= recommendation.studentclearperc[2].operator2Valperc) ?
          (this.iziToast.success({ title: recommendation.studentclearperc[2].msg }), redirectUrl = recommendation.studentclearperc[2].recommendation)
          : (this.iziToast.success({ title: recommendation.studentclearperc[3].msg }), redirectUrl = recommendation.studentclearperc[3].recommendation)
  }
  initializeTables() {
    this.stateWiseTableColumns = [
      { field: 'examid', header: 'Exam ID' },
      { field: 'distname', header: 'State' },
      { field: 'studentappeared', header: 'Students Appeared' },
      { field: 'studentcleared', header: 'Students Cleared' },
      { field: 'studentfailed', header: 'Students Failed' },
      { field: 'studentclearedperc', header: 'Students Cleared (%)' },
      { field: 'studentfailedperc', header: 'Students Failed (%)' },
      { field: 'firstdiv', header: '1st Division' },
      { field: 'firstdivperc', header: '1st Division (%)' },
      { field: 'seconddiv', header: '2nd Division' },
      { field: 'seconddivperc', header: '2nd Division (%)' },
      { field: 'thirddiv', header: '3rd Division' },
      { field: 'thirddivperc', header: '3rd Division (%)' },
      { field: 'options', header: 'Options' }
    ]
    this.districtWiseTableColumns = [
      { field: 'distname', header: 'District' },
      { field: 'studentappeared', header: 'Students Appeared' },
      { field: 'studentcleared', header: 'Students Cleared' },
      { field: 'studentfailed', header: 'Students Failed' },
      { field: 'studentclearedperc', header: 'Students Cleared (%)' },
      { field: 'studentfailedperc', header: 'Students Failed (%)' },
      { field: 'firstdiv', header: '1st Division' },
      { field: 'firstdivperc', header: '1st Division (%)' },
      { field: 'seconddiv', header: '2nd Division' },
      { field: 'seconddivperc', header: '2nd Division (%)' },
      { field: 'thirddiv', header: '3rd Division' },
      { field: 'thirddivperc', header: '3rd Division (%)' },
      { field: 'options', header: 'Options' }
    ]
    this.districtWiseSchoolListTableColumns = [
      { field: 'schoolname', header: 'School Name' },
      { field: 'studentappeared', header: 'Students Appeared' },
      { field: 'studentcleared', header: 'Students Cleared' },
      { field: 'studentfailed', header: 'Students Failed' },
      { field: 'studentclearedperc', header: 'Students Cleared (%)' },
      { field: 'firstdiv', header: '1st Division' },
      { field: 'seconddiv', header: '2nd Division' },
      { field: 'thirddiv', header: '3rd Division' },
      { field: 'options', header: 'Options' }
    ]
    this.schoolListTableColumns = [
      { field: 'segmentname', header: 'Segment Name' },
      { field: 'studentappeared', header: 'Students Appeared' },
      { field: 'studentcleared', header: 'Students Cleared' },
      { field: 'studentfailed', header: 'Students Failed' },
      { field: 'studentclearedperc', header: 'Students Cleared (%)' },
      { field: 'options', header: 'Options' }
    ]
  }
}