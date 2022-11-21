import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocationsService } from 'src/app/services/locations.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss'],
})
export class SelectLocationComponent implements OnInit {

  locations: any= [];
  formData = new FormData();

  constructor(
    private locationsService: LocationsService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllLocations();
  }

  getAllLocations() {
    try {
      let userId: any= localStorage.getItem("denisAuthToken")
      this.spinner.show();
      this.formData.append('userId', userId);

      this.locationsService.getLocations(this.formData).subscribe({
        next: (response: any) => {
          if (response.success == 1) {
            this.spinner.hide();

            this.toaster.success(response.message, 'Success', {
              timeOut: 3000,
            });
            return this.locations= response.data;

          } else {
            this.spinner.hide();

            return this.toaster.error(response.message, 'Error', {
              timeOut: 3000,
            });
          }
        },
        error: (e) => {
          console.log(e)
          this.spinner.hide();
          return this.toaster.error(e.error, 'Error', {
            timeOut: 3000,
          });
        }
      })
    } catch (ex) {
      console.log(ex);
    }
  }

  onClickLocation(id: number) {
    this.router.navigate(['/home'], { queryParams: { location: id } });
  }
}
