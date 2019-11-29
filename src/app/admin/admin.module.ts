import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./shared/components/admin-layout/admin-layout.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { DashboardPageComponent } from "./dashboard-page/dashboard-page.component";
import { CreatePageComponent } from "./create-page/create-page.component";
import { EditPageComponent } from "./edit-page/edit-page.component";
import { SharedModule } from "../shared/modules/shared.module";
import { AuthGuard } from "./shared/services/auth.guard";
import { SearchPipe } from "./shared/pipes/search.pipe";
import { AlertComponent } from "./shared/components/alert/alert.component";
import { AlertService } from "./shared/services/alert.service";
import { RegisterPageComponent } from "./register-page/register-page.component";

const routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      { path: "", redirectTo: "/admin/login", pathMatch: "full" },
      { path: "login", component: LoginPageComponent },
      { path: "register", component: RegisterPageComponent },
      {
        path: "dashboard",
        component: DashboardPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "create",
        component: CreatePageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "post/:id/edit",
        component: EditPageComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CreatePageComponent,
    EditPageComponent,
    SearchPipe,
    AlertComponent,
    RegisterPageComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  providers: [AuthGuard, AlertService]
})
export class AdminModule {}
