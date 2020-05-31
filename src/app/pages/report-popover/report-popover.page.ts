import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-popover',
  templateUrl: './report-popover.page.html',
  styleUrls: ['./report-popover.page.scss'],
})
export class ReportPopoverPage implements OnInit {

  customAlertOptions: any = {
    header: 'Pizza Toppings',
    subHeader: 'Select your toppings',
    message: '$1.00 per topping',
    translucent: true
  };
  constructor() { }

  ngOnInit() {
  }

}
