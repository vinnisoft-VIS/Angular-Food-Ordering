import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { MDBModalService } from 'angular-bootstrap-md';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild('timingsModal', { static: true }) timingsModal: MDBModalService | any;

  selectedProducts: [] | any = [];

  subTotal: number = 0;
  totalTax: number = 0;
  totalOrderAmount: number = 0;
  totalAddOnsPrice: number = 0;
  formData: any;
  orderTimings: any[] = [];

  loggedInUserId = localStorage.getItem("denisAuthToken");

  orderDetails: any = {
    "userId": "",
    "orders": [],
    "pickupTime": "",
    "preparingTime": "",
    "GrandTotal": "",
    "locationId": this.route.snapshot.queryParamMap.get('location')
  };

  selectedOrderTime = "--:--"

  constructor(
    private spinner: NgxSpinnerService,
    private productService: ProductsService,
    private orderService: OrderService,
    private toaster: ToastrService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      this.orderService.$order.subscribe({
        next: (response: any[]) => {
          this.selectedProducts = response;
          this.orderTotal();
          this.getPickUpTimes(false);
          this.cdRef.detectChanges();
        },
        error: (e) => {
          console.log(e)
          return this.toaster.error(e.error, 'Error', {
            timeOut: 3000
          });
        }
      })
  }

  increaseCount(product: any) {
    product.count++;

    this.getPickUpTimes(false);
    return this.orderTotal();
  }

  decreaseCount(product: any) {
    if (product.count === 1) {
      return;
    } else {
      product.count--;
      this.getPickUpTimes(false);
      return this.orderTotal();
    }
  }

  onClickDelete(productIndex: number) {
    this.orderService.removeProduct(productIndex);
    return this.orderTotal();
  }

  onClickCustomize(productIndex: number) {
    this.orderService.customizeOrderProduct(productIndex);
  }

  getSubTotal() {
    this.subTotal = 0;
    for (let i = 0; i < this.selectedProducts.length; i++) {
      this.subTotal += +this.selectedProducts[i].product.fullPrice;
      if (this.selectedProducts[i].selectedAddOns && this.selectedProducts[i].selectedAddOns.length) {
        for (let j = 0; j < this.selectedProducts[i].selectedAddOns.length; j++) {
          this.subTotal += +this.selectedProducts[i].selectedAddOns[j].price;
        }
      }
      this.subTotal = this.subTotal * this.selectedProducts[i].product.count;
    }
    return this.subTotal;
  }

  // getTotalTax() {
  //   this.totalTax = 0;
    
  //   for (let i = 0; i < this.selectedProducts.length; i++) {
  //     this.totalTax += +this.selectedProducts[i].product.productTax;
  //     if (this.selectedProducts[i].selectedAddOns && this.selectedProducts[i].selectedAddOns.length) {
  //       for (let j = 0; j < this.selectedProducts[i].selectedAddOns.length; j++) {
  //         this.totalTax += +this.selectedProducts[i].selectedAddOns[j].tax;
  //       }
  //     }
  //     this.totalTax = this.totalTax * this.selectedProducts[i].product.count;
  //   }

  //   return this.totalTax;
  // }

  orderTotal() {
    this.getSubTotal();
    this.getAddOnsPrice();
    for (let i = 0; i < this.selectedProducts.length; i++) {
      this.totalOrderAmount += (+this.selectedProducts[i].product.fullPrice) * this.selectedProducts[i].product.count;
    }
    return this.totalOrderAmount;
  }

  getAddOnsPrice() {
    this.totalAddOnsPrice = 0;
    this.totalOrderAmount = 0;
    for (let i = 0; i < this.selectedProducts.length; i++) {
      if (this.selectedProducts[i].selectedAddOns && this.selectedProducts[i].selectedAddOns.length) {
        for (let j = 0; j < this.selectedProducts[i].selectedAddOns.length; j++) {
          this.totalAddOnsPrice += +this.selectedProducts[i].selectedAddOns[j].price + +this.selectedProducts[i].selectedAddOns[j].tax;
        }
      }

    }
    this.totalAddOnsPrice  = +this.totalAddOnsPrice;
    return this.totalOrderAmount = this.totalAddOnsPrice;
  }

  appendFormData() {
    this.spinner.show();
    let data: object = {};
    let productIds: any = [];
    let quantities: any = [];

    this.formData = new FormData();

    for (let i = 0; i < this.selectedProducts.length; i++) {
      productIds.push(this.selectedProducts[i].product.id);
      quantities.push(JSON.stringify(this.selectedProducts[i].product.count));

    }

    this.formData.append("userId", localStorage.getItem("denisAuthToken"));
    this.formData.append("productIDs", productIds);
    this.formData.append("quantities", quantities);
    this.formData.append("locationId", this.route.snapshot.queryParamMap.get('location'));
    return this.formData;
  }

  getPickUpTimes(openTimingsList: boolean) {
    this.orderDetails = {
      ...this.orderDetails,
      "orders": [],
      "pickupTime": "",
      "preparingTime": "",
      "GrandTotal": ""
    };

    try {
      this.orderTimings = [];
      this.appendFormData();
      this.productService.getOrderPickupTimings(this.formData).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          if (response.success == 1) {
            if (openTimingsList) {
              this.timingsModal.show();
            }

            this.selectedOrderTime = response.singleTime;
            this.orderDetails["userId"] = this.loggedInUserId;
            this.orderDetails["pickupTime"] = this.selectedOrderTime.toString();
            this.orderDetails["preparingTime"] = response.preparingTime.toString();
            this.orderDetails["GrandTotal"] = this.totalOrderAmount.toString();
            for (let i = 0; i < response.data.length; i++) {
              this.orderTimings.push({
                time: response.data[i],
                checked: false
              })
            }

            return this.orderTimings;
          } else {
            return this.selectedOrderTime = "--:--";
          }
        },
        error: (e) => {
          console.log(e)
          this.spinner.hide();
          return;
        }
      })
    } catch (ex) {
      console.log(ex);
    }

  }

  onSelectPickupTime(timing: any) {

    if (this.selectedOrderTime !== "--:--") {

      document.getElementsByName("timingsCheckbox").forEach((el: any) => {
        el.checked = false;
      });
    }
    this.selectedOrderTime = timing.time;
    return this.timingsModal.hide();
  }

  placeOrder() {

    try {
      if (this.selectedOrderTime === "--:--") return;
      this.orderDetails["orders"] = [];
      this.spinner.show();
      this.orderDetails["pickupTime"] = this.selectedOrderTime.toString();
      for (let i = 0; i < this.selectedProducts.length; i++) {
        this.orderDetails["orders"].push({
          "productId": +this.selectedProducts[i].product.id,
          "ingredients": this.selectedProducts[i].selectedIngredients && this.selectedProducts[i].selectedIngredients.map((item: any) => item.id) || [],
          "addOns": this.selectedProducts[i].selectedAddOns && this.selectedProducts[i].selectedAddOns.map((item: any) => item.id) || [],
          "quantity": this.selectedProducts[i].product.count
        })
      }
      return this.orderService.placeOrder(this.orderDetails);
      
    } catch (ex) {
      console.log(ex);
    }
  }

  // reverseArr(input: any[]) {
  //   var ret = new Array;
  //   for (let i = input.length - 1; i >= 0; i--) {
  //     input[i].originalIndex = i;
  //     ret.push(input[i]);
  //   }
  //   return ret;
  // }
}
