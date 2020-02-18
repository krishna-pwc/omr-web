import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponentComponent } from './components/dashboards/reports-component/reports-component.component';
import { DevconReportsComponent } from './components/dashboards/devcon-reports/devcon-reports.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: ReportsComponentComponent },
  { path: 'reports', component: DevconReportsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }