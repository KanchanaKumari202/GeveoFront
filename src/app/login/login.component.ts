import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";
import { AlertService } from "../services/alert.service";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private toastr: ToastrService  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] || "/DashBoard";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // this.authenticationService.test().subscribe(val => {
    //     console.log(val);
    // })

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        err => {

          console.log(err.error);
          this.toastr.error(err.error.message, 'Error', {
            timeOut: 3000,
            closeButton: true
          });
         // this.alertService.error(err.error);
          this.loading = false;
        }
      );
  }
}
