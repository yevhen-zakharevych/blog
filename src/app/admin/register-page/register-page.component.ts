import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { User } from "src/app/shared/interfaces";
import { Router } from "@angular/router";
import { AlertService } from "../shared/services/alert.service";

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.scss"]
})
export class RegisterPageComponent implements OnInit {
  public registerForm: FormGroup;
  public submitted: boolean;
  public message: string;
  constructor(
    public auth: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      passwordConfirm: new FormControl(null, [
        Validators.required,
        confirmPasswordValidator
      ])
    });
  }

  submit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.submitted = true;

    const user: User = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      returnSecureToken: true
    };

    this.auth.register(user).subscribe(
      () => {
        this.submitted = false;
        this.registerForm.reset();
        this.alertService.success("Account has been created.");
        this.router.navigate(["/admin", "login"]);
      },
      error => {
        this.submitted = false;
        this.alertService.danger(error.error.error.message);
      }
    );
  }
}

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get("password");
  const passwordConfirm = control.parent.get("passwordConfirm");

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === "") {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};
