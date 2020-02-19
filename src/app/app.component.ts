import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'omr-web';
  constructor(private router: Router) { }
  ngOnInit() { }
  ngAfterViewInit() {
    $(document).find("#nb-global-spinner").hide();
  }
}
