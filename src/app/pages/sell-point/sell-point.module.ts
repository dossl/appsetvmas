import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SellPointPage } from './sell-point.page';

const routes: Routes = [
  {
    path: '',
    component: SellPointPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
 // declarations: [SellPointPage],
 // entryComponents: [SellPointPage]
})
export class SellPointPageModule {}
