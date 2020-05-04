import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MasqrPage } from './masqr.page';

const routes: Routes = [
  {
    path: '',
    component: MasqrPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
 // declarations: [MasqrPage],
  //entryComponents: [MasqrPage]
})
export class MasqrPageModule {}
