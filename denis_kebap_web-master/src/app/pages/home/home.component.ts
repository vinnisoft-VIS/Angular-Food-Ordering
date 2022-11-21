import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LocationsService } from 'src/app/services/locations.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  locationId: any;
  categories: any[] = [];
  locations: any = [];
  selectedLocation: any = this.route.snapshot.queryParamMap.get('location');
  searchText: string = "";
  subject = new Subject();
  loggedInUserId = localStorage.getItem("denisAuthToken");
  searchResults: any[] = [];
  selectedProduct: any = null;
  selectedProducts: any = [];

  constructor(
    private route: ActivatedRoute,
    private locationsService: LocationsService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private productService: ProductsService,
    private authService: AuthenticationService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {

    // this.subject
    //   .pipe(debounceTime(1000))
    //   .subscribe(() => {
    //     if (!this.searchText) {
    //       this.searchResults = [];
    //       return this.getCategoriesByLocation();
    //     }
    //     return this.searcProduct();
    //   });
  }

  ngAfterViewInit(): void {
    this.getCategoriesByLocation();
    this.getAllLocations();
    this.orderService.$order.subscribe({
      next: (response: any[]) => {
        this.selectedProducts = response;
      },
      error: (e) => {
        console.log(e)
        return this.toaster.error(e.error, 'Error', {
          timeOut: 3000
        });
      }
    })
  }

  getCategoriesByLocation() {
    try {
      this.spinner.show();
      this.locationId = this.route.snapshot.queryParamMap.get('location');

      let loc = new HttpParams().set("location", this.locationId)
      this.productService.getCategoriesByLocation(loc).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          if (response.success == 1) {
            return this.categories = response.data;
          } else {
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

  logout() {
    this.authService.logout();
  }

  getAllLocations() {
    try {
      let userId: any = localStorage.getItem("denisAuthToken");
      const formData = new FormData();

      this.spinner.show();
      formData.append('userId', userId);
      this.locationsService.getLocations(formData).subscribe({
        next: (response: any) => {
          if (response.success == 1) {
            this.spinner.hide();
            return this.locations = response.data;

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

  async onChangeLocation(locationId: any) {
    this.router.navigate(['/home'], { queryParams: { location: locationId } }).then(response => {
      this.getCategoriesByLocation();
    }).catch(error => console.log(error));

  }

  searcProduct() {
    try {
      let searchFormData = new FormData();
      searchFormData.append("search_text", this.searchText);
      searchFormData.append("location", this.locationId);
      searchFormData.append("userId", JSON.parse(JSON.stringify(this.loggedInUserId)));

      this.spinner.show();
      this.productService.searchProduct(searchFormData).subscribe({
        next: (response: any) => {
          if (response.success == 1) {
            this.spinner.hide();
            return this.searchResults = response.data;

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

  onSearch() {
    // this.subject.next(this.searchText);
  }
}
