import { Injectable } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderSubject = new BehaviorSubject([]);
  private ingredientSubject = new BehaviorSubject({});

  $order = this.orderSubject.asObservable();
  $ingredients = this.ingredientSubject.asObservable();

  private orderProducts: any = [];
  selectedProductIndex = 0;
  products = [];

  constructor(
    private productService: ProductsService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  feedProductDetails(productDetails: any) {
    this.spinner.show();
    let formData = new FormData();
    formData.append("id", productDetails.id);

    this.productService.getProductDetails(formData).subscribe({
      next: (response: any) => {
        this.spinner.hide();

        let { product, ingredients, addons } = response.data;
        product.fullPrice = productDetails.fullPrice;

        if (response.success == 1) {
          ingredients = ingredients && ingredients.map((item: any) =>{ 
            item.checked = true;
            return item;
          });

          addons = addons && addons.map((item: any) => {
            item.fullPrice = +item.price + +item.tax;
            item.checked = false;
            return item;
          });

          product.count = 1;

          this.orderProducts.splice(0, 0, { product, ingredients, addons, selectedIngredients: ingredients, selectedAddOns: [] });
          this.orderProducts = [...this.orderProducts];
          this.orderSubject.next(this.orderProducts);
          this.ingredientSubject.next({ ingredients, addons });
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  filterCheckedIngredients() {
    let index = this.selectedProductIndex;
    let selectedProduct = this.orderProducts[index];
    if (selectedProduct) {
      let selectedIngredients = selectedProduct.ingredients.filter((item : any) => !!item.checked);
      let unSelectedIngredients = selectedProduct.ingredients.filter((item: any) => !!!item.checked);

      selectedProduct.selectedIngredients = selectedIngredients;
      selectedProduct.unSelectedIngredients = unSelectedIngredients;

      this.orderProducts[index] = { ...selectedProduct };
    }
    this.orderProducts = [...this.orderProducts];
    this.orderSubject.next(this.orderProducts);
  }

  filterCheckedAddOns() {
    let index = this.selectedProductIndex;
    let selectedProduct = this.orderProducts[index];
    if (selectedProduct) {
    let selectedAddOns = selectedProduct.addons.filter((item: any) => !!item.checked);
    selectedProduct.selectedAddOns = selectedAddOns;
    this.orderProducts[index] = { ...selectedProduct };
    }
    this.orderProducts = [...this.orderProducts];
    this.orderSubject.next(this.orderProducts);
  }

  removeProduct(index: number) {
    this.selectedProductIndex = 0;
    this.orderProducts.splice(index, 1);
    this.filterCheckedIngredients();
    this.filterCheckedAddOns();
    this.orderProducts = [...this.orderProducts];
    this.orderSubject.next(this.orderProducts);
  }

  customizeOrderProduct(index: number) {
    this.selectedProductIndex = index;
    let selectedProduct = this.orderProducts[index];
    this.ingredientSubject.next({ ingredients: selectedProduct.ingredients, addons: selectedProduct.addons });

  }

  placeOrder(orderDetails: any) {
    this.productService.placeOrder(orderDetails).subscribe({
        next: (response: any) => {
          if (response.success == 1) {
            this.toaster.success(response.message, 'Success', {
              timeOut: 3000
            });
            this.orderProducts = [];
            this.orderProducts = [...this.orderProducts];
            return this.orderSubject.next(this.orderProducts);
          } else {
            return this.toaster.error(response.message, 'Error', {
              timeOut: 3000
            });
          }
        },
        error: (e) => {
          console.log(e)
          return this.toaster.error(e.error, 'Error', {
            timeOut: 3000
          });
        }
      })
  }

  getProductsList(formData: FormData) {
      this.products = [];
      return new Promise((resolve, reject) => {
        this.productService.getProductsByCategory(formData).subscribe({
         next: (response: any) => {
           if (response.success == 1) {
             this.products = response.data;
             this.orderProducts = [];
             this.orderProducts = [...this.orderProducts];
             this.orderSubject.next(this.orderProducts);

             return resolve(this.products);
           } 
         },
         error: (e) => {
           console.log(e)
           reject(e);
           return this.toaster.error(e.error, 'Error', {
             timeOut: 3000,
           });
         }
       })
      })
  }
}
