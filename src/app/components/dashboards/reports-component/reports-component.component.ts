import { Component, OnInit } from '@angular/core';
import { ReportServiceService } from 'src/app/services/report-service.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-reports-component',
  templateUrl: './reports-component.component.html',
  styleUrls: ['./reports-component.component.scss']
})
export class ReportsComponentComponent implements OnInit {
  currentTab: string = 'tab1';
  studentList: any;
  currentSegment: any;
  displaySegment: boolean = true;
  studentTableColumns: any[];
  resultTableColumns: any[];
  segmentTableColumns: any[];
  selectedStudent: string;
  constructor(private reportServiceService: ReportServiceService) { }

  ngOnInit() {
    this.reportServiceService.getJSON().subscribe(response => {
      this.studentList = response;
      this.currentSegment = this.studentList.data[0];
      this.initializeTables();
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
  }
  toNumber(num) {
    return _.replace(num, '%', '');
  }
}