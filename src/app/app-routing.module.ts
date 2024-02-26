import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Views/Login/login/login.component';
import { DashboardComponent } from './Views/Dashboard/Dashboard.component';
import { ToolbarComponent } from './Plantillas/toolbar/toolbar.component';
import { UserComponent } from './Views/user/user.component';
import { RegisterTimeComponent } from './Views/register-time/register-time.component';
import { HistoryComponent } from './Views/history/history.component';
import { AprovveTimeComponent } from './Views/aprovve-time/aprovve-time.component';
import { ParametersComponent } from './Views/parameters/parameters.component';
import { RegistersComponent } from './Views/registers/registers.component';
import { ProfilesComponent } from './Views/profiles/profiles.component';
import { PopupHistoryComponent } from './Views/popup-history/popup-history.component';
import { PopUpAprovveComponent } from './Views/pop-up-aprovve/pop-up-aprovve.component';
import { PopupFestivosComponent } from './Views/popup-festivos/popup-festivos.component';
import { PopUpCreateParameterComponent } from './Views/pop-up-create-parameter/pop-up-create-parameter.component';
import { UsersComponent } from './AdminViews/AdminUsers/users/users.component';
import { PopUpUsersUpdateComponent } from './AdminViews/AdminUsers/pop-up-users-update/pop-up-users-update.component';
import { PopUpUsersCreateComponent } from './AdminViews/AdminUsers/pop-up-users-create/pop-up-users-create.component';
import { ClientsComponent } from './AdminViews/AdminClients/clients/clients.component';
import { PopUpClientsCreateComponent } from './AdminViews/AdminClients/pop-up-clients-create/pop-up-clients-create.component';
import { PopUpClientsUpdateComponent } from './AdminViews/AdminClients/pop-up-clients-update/pop-up-clients-update.component';
import { ApproverComponent } from './AdminViews/AdminApprover/approver/approver.component';
import { PopUpApproverUpdateComponent } from './AdminViews/AdminApprover/pop-up-approver-update/pop-up-approver-update.component';
import { PopUpApproverCreateComponent } from './AdminViews/AdminApprover/pop-up-approver-create/pop-up-approver-create.component';
import { CountriesComponent } from './AdminViews/AdminCountries/countries/countries.component';
import { PopUpCountriesCreateComponent } from './AdminViews/AdminCountries/pop-up-countries-create/pop-up-countries-create.component';
import { PopUpCountriesUpdateComponent } from './AdminViews/AdminCountries/pop-up-countries-update/pop-up-countries-update.component';
import { MenusComponent } from './AdminViews/AdminMenus/menus/menus.component';
import { PopUpMenusCreateComponent } from './AdminViews/AdminMenus/pop-up-menus-create/pop-up-menus-create.component';
import { PopUpMenusUpdateComponent } from './AdminViews/AdminMenus/pop-up-menus-update/pop-up-menus-update.component';
import { RolesComponent } from './AdminViews/AdminRoles/roles/roles.component';
import { PopUpRolesCreateComponent } from './AdminViews/AdminRoles/pop-up-roles-create/pop-up-roles-create.component';
import { PopUpRolesUpdateComponent } from './AdminViews/AdminRoles/pop-up-roles-update/pop-up-roles-update.component';
import { ARPComponent } from './AdminViews/ImportExcel/ARP/ARP.component';
import { BodyComponent } from './Plantillas/sidenav/body/body.component';
import { SidenavComponent } from './Plantillas/sidenav/sidenav/sidenav.component';
import { PopUpHorarioComponent } from './Views/pop-up-horario/pop-up-horario.component';
import { UsersExceptionsComponent } from './AdminViews/usersExceptions/users-exceptions/users-exceptions.component';
import { PopUpAddExceptionComponent } from './AdminViews/usersExceptions/pop-up-add-exception/pop-up-add-exception.component';
import { PopUpUpdateExceptionComponent } from './AdminViews/usersExceptions/pop-up-update-exception/pop-up-update-exception.component';
import { GaugeComponent } from './Views/gauge/gauge.component'
import { SamlCallbackComponent } from './Views/saml-callback/saml-callback.component';
import { ScheduleComponent } from './Views/schedule/schedule/schedule.component';
import { PopUpScheduleUpdateComponent } from './Views/schedule/pop-up-schedule-update/pop-up-schedule-update.component';
import { PopUpScheduleCreateComponent } from './Views/schedule/pop-up-schedule-create/pop-up-schedule-create.component';
import { PopUpAddReportExceptionComponent } from './AdminViews/usersExceptions/pop-up-add-report-exception/pop-up-add-report-exception.component';
import { PopUpAddWorkdayExceptionComponent } from './AdminViews/usersExceptions/pop-up-add-workday-exception/pop-up-add-workday-exception.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'callback', component: SamlCallbackComponent },
  { path: 'toolbar', component: ToolbarComponent },
  { path: 'user', component: UserComponent },
  { path: 'resgitertime', component: RegisterTimeComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'aproveetime', component: AprovveTimeComponent },
  { path: 'parameters', component: ParametersComponent },
  { path: 'registers', component: RegistersComponent },
  { path: 'schedules', component: ScheduleComponent },
  { path: 'admin/users', component: UsersComponent },
  { path: 'admin/clients', component: ClientsComponent },
  { path: 'admin/approvers', component: ApproverComponent },
  { path: 'admin/countries', component: CountriesComponent },
  { path: 'admin/menus', component: MenusComponent },
  { path: 'admin/roles', component: RolesComponent },
  { path: 'arpcomponent', component: ARPComponent },
  { path: 'admin/users-exception', component: UsersExceptionsComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
  LoginComponent,
  DashboardComponent,
  SamlCallbackComponent,
  ToolbarComponent,
  UserComponent,
  RegisterTimeComponent,
  HistoryComponent,
  AprovveTimeComponent,
  ParametersComponent,
  RegistersComponent,
  ScheduleComponent,
  PopUpScheduleUpdateComponent,
  PopUpScheduleCreateComponent,
  ProfilesComponent,
  PopupHistoryComponent,
  PopUpAprovveComponent,
  PopupFestivosComponent,
  PopUpCreateParameterComponent,
  UsersComponent,
  PopUpUsersUpdateComponent,
  PopUpUsersCreateComponent,
  ClientsComponent,
  PopUpClientsCreateComponent,
  PopUpClientsUpdateComponent,
  PopUpAddReportExceptionComponent,
  PopUpAddWorkdayExceptionComponent,
  ApproverComponent,
  PopUpApproverUpdateComponent,
  PopUpApproverCreateComponent,
  CountriesComponent,
  PopUpCountriesCreateComponent,
  PopUpCountriesUpdateComponent,
  MenusComponent,
  PopUpMenusCreateComponent,
  PopUpMenusUpdateComponent,
  RolesComponent,
  PopUpRolesCreateComponent,
  PopUpRolesUpdateComponent,
  ARPComponent,
  BodyComponent,
  SidenavComponent,
  PopUpHorarioComponent,
  UsersExceptionsComponent,
  PopUpAddExceptionComponent,
  PopUpUpdateExceptionComponent,
  GaugeComponent
];
