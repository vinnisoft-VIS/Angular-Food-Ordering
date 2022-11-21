import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, IterableDiffers, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-ingredients',
  templateUrl: './product-ingredients.component.html',
  styleUrls: ['./product-ingredients.component.scss']
})
export class ProductIngredientsComponent implements OnInit, AfterViewInit {

  ingredients: any = [];
  addOns: any = [];
  productName: string = "";
  
  constructor(
    public orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.orderService.$ingredients.subscribe({
      next: (response: any) => {
        this.ingredients = response.ingredients;
        this.addOns = response.addons;
        this.cdRef.detectChanges();
      }
    })
  }

  onChangeSelectList(ingredient: boolean) {

    if(ingredient) {
      this.orderService.filterCheckedIngredients();
    } else {
      this.orderService.filterCheckedAddOns();
    }
  }
}
