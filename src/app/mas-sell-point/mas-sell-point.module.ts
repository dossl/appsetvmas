import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MasSellPointPage } from './mas-sell-point.page';

const routes: Routes = [
  {
    path: '',
    component: MasSellPointPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
 // declarations: [MasSellPointPage],
 // entryComponents: [MasSellPointPage]
})
export class MasSellPointPageModule {}
