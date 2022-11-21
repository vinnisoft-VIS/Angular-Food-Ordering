import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | any;
  formData = new FormData();

  validationMessages = {
    "email": {
      "required": "Email is required.",
      "email": "Email must be a valid email."
    },
    "password": {
      "required": "Password is required.",
      "minlength": "Password must be greater than 6 characters.",
      "maxlength": "Password must be less than 12 characters."
    }
  }

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      roleId: [1],
    });
   }

   get controls(): { [key: string]: AbstractControl } | any {
     return this.loginForm.controls;
   };

  ngOnInit(): void {
  }

  appendFormData() {
    this.formData.append("email", this.loginForm.value.email);
    this.formData.append("password", this.loginForm.value.password);
    this.formData.append("roleId", this.loginForm.value.roleId);

  }
  onClickLogin() {
    try {
      this.spinner.show();
      this.appendFormData();

      this.authService.login(this.formData).subscribe({
        next: (response : any) => {
          if(response.success == 1) {
            this.toaster.success(response.message, 'Success', {
              timeOut: 3000,
            });
            localStorage.setItem('denisAuthToken', response.data.userId);
            this.router.navigate(['/select-location']);

          } else {
            this.toaster.error(response.message, 'Error', {
            timeOut: 3000,
          });
        }
        },
        error: (e) => {
        console.log(e)
        this.spinner.hide();
        this.toaster.error(e.error, 'Error', {
          timeOut: 3000,
        });
        }
      })
    } catch (ex) {
      console.log(ex);
    }
  }

}
