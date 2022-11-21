import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {

  products: any = [];
  formData= new FormData();
  productIngredients: any= [];

  @Input() locationId: number | any;
  @Input() i: number | any;
  @Input() searchResults: any= [];
  
  @Input() categoryId: number | any;
  @Input() categoryName: string | any;

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.searchResults && this.searchResults.length) {
      return this.products = this.searchResults;
    } else {
      return this.getProductsList();
    }
  }

  appendFormData() {
      this.formData.append("location", this.locationId);
      this.formData.append("cat_id", this.categoryId);
      this.formData.append("userId", JSON.stringify(localStorage.getItem('denisAuthToken')));
  }

  getProductsList() {
    try {

      this.appendFormData();
      this.orderService.getProductsList(this.formData).then((response: any) => {
        response.map((item: any) => {
          if(item.name.toLowerCase().includes("veggie")) {
            item.color = "green";
          } else if (item.name.toLowerCase() === "kebap" || item.name.toLowerCase() === "kebap klein") {
            item.color = "brown";
          } else {
            item.color = "black";
          }
          return item;
        })
        this.products = response
      })
    } catch (ex) {
      console.log(ex);
    }
  }

  onClickProduct(productDetails: object) {
    this.orderService.feedProductDetails(productDetails);
  }
}