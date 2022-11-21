import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, Observable, throwError } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl = environment.BASE_URL;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  handleLoader(toggle: boolean) {
    return () => {
      if (toggle) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    }
  }

  getCategoriesByLocation(locationId: HttpParams): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorylists?${locationId}`)
      .pipe(tap(this.handleLoader(true)), catchError(this.handleError), finalize(this.handleLoader(false)));
  }

  getProductsByCategory(payload: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/productlists`, payload)
      .pipe(tap(this.handleLoader(true)), catchError(this.handleError), finalize(this.handleLoader(false)));
  }

  getProductDetails(id: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/productviewwithtax`, id)
      .pipe(tap(this.handleLoader(true)), catchError(this.handleError), finalize(this.handleLoader(false)));
  }

  getOrderPickupTimings(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pickupTimeLists`, payload)
      .pipe(tap(this.handleLoader(true)), catchError(this.handleError), finalize(this.handleLoader(false)));
  }

  placeOrder(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addCartViaAngular`, payload)
      .pipe(tap(this.handleLoader(true)), catchError(this.handleError), finalize(this.handleLoader(false)));
  }

  searchProduct(searchText: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/searchproduct`, searchText)
      .pipe(tap(this.handleLoader(true)), catchError(this.handleError), finalize(this.handleLoader(false)));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.error || "Server Error"));
  };
}
