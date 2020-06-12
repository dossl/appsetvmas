import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NetworkService } from '../../services/network.service';
import { IonicSelectableModule } from 'ionic-selectable';
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
    RouterModule.forChild(routes),
    AutoCompleteModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicSelectableModule
  ],
  declarations: [AddAnnouncePage],
  //entryComponents: [BuypointPage],
  providers: [
    File,
    WebView,
    FilePath,
    NetworkService,
    Camera
  ]
})
export class AddAnnouncePageModule { }
