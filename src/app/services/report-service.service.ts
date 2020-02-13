import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  baseUrl: string = "http://52.172.51.143:5000";
  constructor(private http: HttpClient) {
  }
  public getExamList(userId): Observable<any> {
    return this.http.get(`${this.baseUrl}/v1/omr/examitem?userid=${userId}`);
  }
  public getStudentList(userId, examId): Observable<any> {
    return this.http.get(`${this.baseUrl}/v1/omr/examreport/${examId}?userid=${userId}`);
  }
  public getSegmentList(userId, examId, studentId): Observable<any> {
    return this.http.get(`${this.baseUrl}/v1/omr/examreport/${examId}?studentid=${studentId}&&userid=${userId}`);
  }
}