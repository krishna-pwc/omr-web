import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report-service.service';
import * as _ from 'lodash';
import { Ng2IzitoastService } from 'ng2-izitoast';
@Component({
  selector: 'app-devcon-reports',
  templateUrl: './devcon-reports.component.html',
  styleUrls: ['./devcon-reports.component.scss']
})
export class DevconReportsComponent implements OnInit {
  stateWiseData: [];
  recommendationArray: [];
  districtWiseData: [];
  districtWiseSchoolList: [];
  schoolList: [];
  stateWiseTableColumns: { field: string; header: string; }[];
  districtWiseTableColumns: { field: string; header: string; }[];
  districtWiseSchoolListTableColumns: { field: string; header: string; }[];
  schoolListTableColumns: { field: string; header: string; }[];
  currentReport: number = 1;
  selectedDistrict: string;
  selectedSchool: string;
  constructor(private reportService: ReportService, public iziToast: Ng2IzitoastService) { }
  ngOnInit() {
    this.getStateWiseData();
    this.getRecommendationData();
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
  }
  getDistrictWiseSchoolList(district) {
    this.selectedDistrict = district;
    this.reportService.getJSON(`./assets/json/devcon/state/${district}/${district}.json`).subscribe(response => {
      this.districtWiseSchoolList = response;
    });
    this.currentReport += 1;
  }
  getSchoolList(district, school) {
    this.selectedSchool = school.schoolname;
    this.reportService.getJSON(`./assets/json/devcon/state/${district}/schools/${school.schoolid}.json`).subscribe(response => {
      this.schoolList = response;
    });
    this.currentReport += 1;
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