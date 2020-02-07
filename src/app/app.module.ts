import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponentComponent } from './components/core/menu-component/menu-component.component';
import { FooterComponentComponent } from './components/core/footer-component/footer-component.component';
import { ReportsComponentComponent } from './components/dashboards/reports-component/reports-component.component';
import { SuiModule } from 'ng2-semantic-ui';
import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponentComponent,
    FooterComponentComponent,
    ReportsComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SuiModule,
    HttpClientModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
