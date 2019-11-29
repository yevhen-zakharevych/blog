import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "src/app/shared/interfaces";
import { AuthService } from "../shared/services/auth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent implements OnInit {
  public loginForm: FormGroup;
  public submitted: boolean;
  public message: string;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.submitted = false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params["authentication"]) {
        this.message = "Enter data";
      }
    });
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitted = true;

    const user: User = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      returnSecureToken: true
    };

    this.auth.login(user).subscribe(
      () => {
        this.submitted = false;
        this.loginForm.reset();
        this.router.navigate(["/admin", "dashboard"]);
      },
      () => {
        this.submitted = false;
      }
    );
  }
}
