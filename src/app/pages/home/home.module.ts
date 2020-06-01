import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { NetworkService } from '../../services/network.service';
import { ScrollVanishDirective } from '../../directives/scroll-vanish.directive';
import { HideHeaderDirective } from '../../directives/hide-header.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, ScrollVanishDirective, HideHeaderDirective],
  providers: [NetworkService]
})
export class HomePageModule {}
