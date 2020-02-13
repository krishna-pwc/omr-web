import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'omr-web';
  ngOnInit() { }
  ngAfterViewInit() {
    $(document).find("#nb-global-spinner").hide();
  }
}
