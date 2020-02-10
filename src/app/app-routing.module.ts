import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponentComponent } from './components/dashboards/reports-component/reports-component.component';


const routes: Routes = [
  { path: '', component: ReportsComponentComponent },
  { path: 'reports', component: ReportsComponentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
