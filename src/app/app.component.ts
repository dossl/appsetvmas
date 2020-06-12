import { Component } from '@angular/core';
import { Platform, PopoverController, LoadingController, ToastController, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService } from './services/network.service';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { AnunciosModel } from './models/anuncios.model';
import { VariableConfiguracion } from './models/variable-configuracion.model';
import { Banner } from './models/banner.model';
import { Etiqueta } from './models/etiqueta.model';
import { Categoria } from './models/categoria.model';
import { Toast } from '@ionic-native/toast/ngx';
import { AnuncioService } from './services/anuncio.service';
import { MasqrPage } from './pages/masqr/masqr.page';
import { MasSellPointPage } from './pages/mas-sell-point/mas-sell-point.page';
import { Usuario } from './models/usuario.model';
import { TipoOpcionModel } from './models/tipo-opcion.model';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isConnected = false;
  currentUser: Usuario;
  userPoint = 0;

  constructor(
    private platform: Platform, private statusBar: StatusBar, private networkService: NetworkService,
    private modal: PopoverController, private service: AnuncioService
  ) {
    this.initializeApp();
  }

  checkConnection() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // let status bar overlay webview
      // this.statusBar.overlaysWebView(true);

      // set status bar to white
      this.statusBar.backgroundColorByHexString('#000030');
      this.checkConnection();
      this.currentUser = this.service.getLocalCurrentUser();
      if (this.currentUser) {
        this.userPoint = this.currentUser.Puntos;
        console.log(this.currentUser);
      }
    });
  }

  async sell() {
    const modal = await this.modal.create({
      component: MasSellPointPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async qr() {
    const modal = await this.modal.create({
      component: MasqrPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

}
