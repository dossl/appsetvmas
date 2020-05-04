import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VirtualOfficePage } from './virtual-office.page';
import { NetworkService } from '../services/network.service';
import { SellPointPage } from '../sell-point/sell-point.page';
import { QrPage } from '../qr/qr.page';

const routes: Routes = [
  {
    path: '',
    component: VirtualOfficePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VirtualOfficePage,/*SellPointPage,QrPage*/],
  providers: [NetworkService],
 // entryComponents: [SellPointPage,QrPage]
})
export class VirtualOfficePageModule {}
