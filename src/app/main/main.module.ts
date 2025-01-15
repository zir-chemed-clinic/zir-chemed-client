import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonsComponent } from './persons/persons.component';
import { RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PersonsService } from './services/persons.service';
import { HttpClientModule } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClinicVisitsComponent } from './clinic-visits/clinic-visits.component';
import { EmployeesComponent } from './employees/employees.component';
import { PctComponent } from './pct/pct.component';
import { SaComponent } from './sa/sa.component';
import { InseminationComponent } from './insemination/insemination.component';
import { IuiComponent } from './iui/iui.component';
import { TreatmentsComponent } from './treatments/treatments.component';
import { SubsidizationComponent } from './subsidization/subsidization.component';
import { SummonsClinicVisitsComponent } from './summons-clinic-visits/summons-clinic-visits.component';
import { HomeComponent } from './home/home.component';
import { ClinicVisitsService } from './services/clinic-visits.service';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { EmployeesService } from './services/employees.service';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EditClinicVisitComponent } from './edit-clinic-visit/edit-clinic-visit.component';
import { TreatmentService } from './services/treatment.service';
import { TreatmentsService } from './services/treatments.service';
import { InseminationService } from './services/insemination.service';
import { IuiService } from './services/iui.service';
import { PctService } from './services/pct.service';
import { SaService } from './services/sa.service';
import { SubsidizationService } from './services/subsidization.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AllPersonsComponent } from './all-persons/all-persons.component';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import { AllTreatmentsComponent } from './all-treatments/all-treatments.component';
import {MatDividerModule} from '@angular/material/divider';
import { PctPdfComponent } from './pct-pdf/pct-pdf.component';
import { SaPdfComponent } from './sa-pdf/sa-pdf.component';
import { NgBootstrapDatetimeAngularModule } from "ng-bootstrap-datetime-angular";
import { EmployeeSalaryComponent } from './employee-salary/employee-salary.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {CalendarModule} from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import { HistoryClinicVisitsComponent } from './history-clinic-visits/history-clinic-visits.component';
import { EmailService } from './services/email.service';
import {DialogModule} from 'primeng/dialog';
import {MatIconModule} from '@angular/material';
import { SummaryComponent } from './summary/summary.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
// import {CalendarModule} from 'primeng/calendar';
// import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [PersonsComponent,HomeComponent, ClinicVisitsComponent, EmployeesComponent, PctComponent, SaComponent, InseminationComponent, IuiComponent, TreatmentsComponent, SubsidizationComponent, SummonsClinicVisitsComponent, HomeComponent, EditClinicVisitComponent, AllPersonsComponent, AllEmployeesComponent, AllTreatmentsComponent, PctPdfComponent, SaPdfComponent, EmployeeSalaryComponent, HistoryClinicVisitsComponent, SummaryComponent],
  imports: [
    // CalendarModule,
    // CheckboxModule,
    // BrowserAnimationsModule,
    CalendarModule,
    DialogModule,
    TableModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    NgBootstrapDatetimeAngularModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatSidenavModule,
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatNativeDateModule,
    FormsModule ,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild([
      {path:"" , pathMatch: "full",redirectTo:"summonsClinicVisits"},
      {path:"home",component:HomeComponent},
      {path:"persons",component:PersonsComponent},
      {path:"persons/:personsId",component:PersonsComponent},
      {path:"allPersons",component:AllPersonsComponent},
      {path:"clinicVisits",component:ClinicVisitsComponent},
      {path:"clinicVisits/:clinicVisitsId",component:ClinicVisitsComponent},
      {path:"summonsClinicVisits",component:SummonsClinicVisitsComponent},
      {path:"historyClinicVisits",component:HistoryClinicVisitsComponent},
      {path:"allEmployees",component:AllEmployeesComponent},
      {path:"employees",component:EmployeesComponent},
      {path:"employees/:employeesId",component:EmployeesComponent},
      {path:"employeeSalary",component:EmployeeSalaryComponent},
      {path:"employeeSalary/:employeesId",component:EmployeeSalaryComponent},
      {path:"allTreatments",component:AllTreatmentsComponent},
      {path:"Treatments",component:TreatmentsComponent},
      {path:"Treatments/:TreatmentId",component:TreatmentsComponent},
      {path:"pctPdf",component:PctPdfComponent},
      {path:"saPdf",component:SaPdfComponent},
      {path:"summary",component:SummaryComponent}
    ])
  ], providers:[TreatmentService,PersonsService,ClinicVisitsService,EmployeesService,
    InseminationService,IuiService,PctService,PersonsService,SaService,SubsidizationService,TreatmentsService,EmailService,
    MatDatepickerModule,NgxMatDatetimePickerModule,NgxMatTimepickerModule,MatDatepickerModule]
})
export class MainModule { }
