import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditAnnouncePage } from './edit-announce.page';

import { AutoCompleteModule } from 'ionic4-auto-complete';

import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NetworkService } from '../services/network.service';

const routes: Routes = [
  {
    path: '',
    component: EditAnnouncePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    AutoCompleteModule, HttpClientModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditAnnouncePage],
  providers: [Camera,
    File,
    WebView,
    FilePath,
    NetworkService
  ]
})
export class EditAnnouncePageModule {}
