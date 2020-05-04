import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AutoCompleteModule } from 'ionic4-auto-complete';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {RlTagInputModule} from 'angular2-tag-input';
import { ConfiguracionesService } from './services/configuraciones.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { NetworkService } from './services/network.service';
import { Network } from '@ionic-native/network/ngx';
import { AnuncioService } from './services/anuncio.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';
import { MasSellPointPage } from './mas-sell-point/mas-sell-point.page';
import { MasqrPage } from './masqr/masqr.page';
import { MasqrPageModule } from './masqr/masqr.module';
import { MasSellPointPageModule } from './mas-sell-point/mas-sell-point.module';
import { QrPageModule } from './qr/qr.module';
import { SellPointPageModule } from './sell-point/sell-point.module';
import { LectorPageModule } from './lector/lector.module';
import { DetailsPageModule } from './details/details.module';
import { BuypointPageModule } from './buypoint/buypoint.module';
import { RestoreAccountPageModule } from './restore-account/restore-account.module';
import { QrPage } from './qr/qr.page';
import { SellPointPage } from './sell-point/sell-point.page';
import { LectorPage } from './lector/lector.page';
import { DetailsPage } from './details/details.page';
import { BuypointPage } from './buypoint/buypoint.page';
import { RestoreAccountPage } from './restore-account/restore-account.page';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { DatePipe } from '@angular/common';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import { SearchPage } from './search/search.page';
import { InterceptorService } from './services/interceptor.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ViewPage } from './view/view.page';

@NgModule({
  declarations: [AppComponent,MasqrPage,MasSellPointPage,DetailsPage,SellPointPage,QrPage,BuypointPage,ViewPage,LectorPage],
  entryComponents: [MasqrPage,MasSellPointPage,DetailsPage,SellPointPage,QrPage,BuypointPage,ViewPage,LectorPage],
  imports: [TagInputModule,
    BrowserModule,
    RlTagInputModule,
    FormsModule,
    NgxQRCodeModule,
    /*MasqrPageModule,
    MasSellPointPageModule,
    QrPageModule,
    SellPointPageModule,
    LectorPageModule,
    DetailsPageModule,
    BuypointPageModule,
    RestoreAccountPageModule,*/

    BrowserAnimationsModule,IonicModule.forRoot(), AppRoutingModule, AutoCompleteModule, HttpClientModule,
    IonicStorageModule.forRoot(),  NgSelectModule ],
  providers: [
    StatusBar,
    SplashScreen,
    Clipboard,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    DatePipe,
    File,
    WebView,
    FilePath,
    InAppBrowser,
    ImagePicker,
    SocialSharing,
    Insomnia,
    Crop,
    FileTransfer,
    ConfiguracionesService,
    AnuncioService,
    SQLite,
    Toast,
    Network,
    NetworkService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
