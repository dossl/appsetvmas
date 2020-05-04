import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddAnnouncePage } from './add-announce.page';

import { AutoCompleteModule } from 'ionic4-auto-complete';

import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { IonicStorageModule } from '@ionic/storage';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { NetworkService } from '../services/network.service';
import { BuypointPage } from '../buypoint/buypoint.page';
const routes: Routes = [
  {
    path: '',
    component: AddAnnouncePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    RouterModule.forChild(routes),
    AutoCompleteModule, HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [AddAnnouncePage],
  //entryComponents: [BuypointPage],
  providers: [Camera,
    File,
    WebView,
    FilePath,NetworkService]
})
export class AddAnnouncePageModule {}
