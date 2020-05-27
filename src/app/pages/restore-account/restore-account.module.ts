import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RestoreAccountPage } from './restore-account.page';

const routes: Routes = [
  {
    path: '',
    component: RestoreAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RestoreAccountPage],
  entryComponents: [RestoreAccountPage]
})
export class RestoreAccountPageModule {}
