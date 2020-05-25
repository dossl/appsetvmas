import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ScrollHideDirective, ScrollHideConfig } from '../directives/scroll-hide.directive';
import { AnunciosModel } from '../models/anuncios.model';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { AnuncioService } from '../services/anuncio.service';
import { NetworkService } from '../services/network.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ToastController } from '@ionic/angular';
import { DetailsPage } from '../details/details.page';
import { Banner } from '../models/banner.model';
import { Usuario } from '../models/usuario.model';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ViewPage } from '../view/view.page';
import { ModalController, AlertController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import * as _ from 'lodash';

export interface AnuncioImagen {
  Id: number;
  Imagen: string;
  Titulo: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  RECENTS_TAB = 'RECENTS';
  MOST_SEEN_TAB = 'MOST_SEEN';
  tab = this.RECENTS_TAB;

  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: 0 };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 222 };

  slideOpts = {
    initialSlide: 1,
    slidePerView: 1,
    speed: 1000,
    autoplay: true,
    enablekeyboardcontroll: true
  };
  isConnected = false;
  barnersTop: Banner[] = [];
  barnersBottom: Banner[] = [];
  seachText = '';

  mostSeen: AnunciosModel[];
  recents: AnunciosModel[];
  pagination = this.servCo.getCantPorPaginasHome();

  currentUser: Usuario;
  nameUser: any;
  WifiWizard2: any;

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  constructor(
    private servCo: ConfiguracionesService, private servAnuncio: AnuncioService, private networkService: NetworkService,
    private sqlite: SQLite, public toastCtrl: ToastController, private alertCtrl: AlertController,
    public modalController: ModalController, private insomnia: Insomnia, private iab: InAppBrowser,
    public loadingCtrl: LoadingController, private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
    this.loadAuto();
    this.insomnia.keepAwake().then(() => {
      console.log('success');
    });
  }

  segmentChanged(ev: any) {
    this.tab = ev.detail.value;
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: ' <strong>¿Seguro que desea salir de su usuario en Setvmas?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.currentUser = null;
            localStorage.clear();
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.testconnetion();
    if (!this.isConnected) {
      this.testconnetion();
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentuser'));
    if (this.currentUser) {
      const index = this.currentUser.Correo.indexOf('@');
      if (index !== -1) {
        this.nameUser = this.currentUser.Correo.substr(0, index);
      }
    } else {
      this.servAnuncio.getCurrentUser().then(user => {
        this.currentUser = user as Usuario;
        if (this.currentUser) {
          const index = this.currentUser.Correo.indexOf('@');
          if (index !== -1) {
            this.nameUser = this.currentUser.Correo.substr(0, index);
          }
        }
      });
    }
  }

  loadAuto() {
    this.testconnetion();
    this.loadBanner();
    this.loadAds();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.recents.length === 1000 || this.mostSeen.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }


  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.loadBanner();
  //     if (this.group == true) {
  //       this.presentLoading();
  //       this.servAnuncio.getAnunciosRecientes('', this.seachText, 'asc', 1, this.cantPorPagina).then(data => {
  //         this.recents = data as AnunciosModel[];
  //         for (const i of (this.recents as AnunciosModel[])) {
  //           if (i.ImageContent !== undefined && i.ImageContent !== null) {
  //             i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
  //             console.log(i.Imagen);
  //           } else {
  //             i.Imagen = i.Categoria.ImageName;
  //           }

  //         }
  //         console.log(this.recents);
  //       }).catch((error) => {
  //         this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
  //       });
  //     } else if (this.group1 === false) {
  //       this.presentLoading();
  //       this.servAnuncio.getAnunciosPopulares('', this.seachText, 'asc', 1, this.cantPorPagina).then(data => {
  //         this.mostSeen = data as AnunciosModel[];
  //         for (const i of (this.mostSeen as AnunciosModel[])) {
  //           if (i.ImageContent !== undefined && i.ImageContent !== null) {
  //             i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
  //             console.log(i.Imagen);
  //           } else {
  //             i.Imagen = i.Categoria.ImageName;
  //           }

  //         }
  //         console.log(this.mostSeen);
  //       }).catch((error) => {
  //         this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
  //       });
  //     }
  //   }, 180000);
  // }

  testconnetion() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  loadBanner() {
    if (this.isConnected) {
      this.servAnuncio.getBannerSuperior().then(data => {
        this.barnersTop = data as Banner[];
        console.log(this.barnersTop);
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      });
      this.servAnuncio.getBannerInferior().then(data => {
        this.barnersBottom = data as Banner[];
        console.log(this.barnersBottom);
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      });
    } else {
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerSuperior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerSuperior WHERE isVisible=? ORDER BY BannerId DESC', [true]).then(res => {
          this.barnersTop = res as Banner[];
        }).catch(e => console.log(e));
      });
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerInferior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerInferior ORDER BY BannerId DESC', []).then(res => {
          this.barnersBottom = res as Banner[];
        }).catch(e => console.log(e));
      });
    }

  }

  loadAds() {
    if (this.tab === this.RECENTS_TAB) {
      if (this.isConnected) {
        this.servAnuncio.getAnunciosRecientes('', this.seachText, 'asc', 1, this.pagination).then(data => {
          this.recents = data as AnunciosModel[];
          for (const i of (this.recents as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              console.log(i.Imagen);
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }
          console.log(this.recents);
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        });
      } else {
        this.sqlite.create({
          name: 'setVMas.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosRecientes(AnuncioId INTEGER PRIMARY KEY, ' +
            'Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, ' +
            'Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ' +
            'ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ' +
            'ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
            .then(res => console.log('Executed SQL'))
            .catch(e => console.log(e));
          db.executeSql('SELECT * FROM AnunciosRecientes ORDER BY AnuncioId DESC', []).then(res => {
            this.recents = [];
            this.recents = res as AnunciosModel[];
            for (const item of (this.recents as AnunciosModel[])) {
              if (item.ImageContent !== undefined && item.ImageContent !== null) {
                item.Imagen = 'data:' + item.ImageMimeType + ';base64,' + item.ImageContent;
                console.log(item.Imagen);
              }
            }
          }).catch(e => console.log(e));
        });
      }
    } else {
      if (this.isConnected) {
        this.servAnuncio.getAnunciosPopulares('', this.seachText, 'asc', 1, this.pagination).then(data => {
          this.mostSeen = data as AnunciosModel[];
          for (const i of (this.mostSeen as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              console.log(i.Imagen);
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }
          console.log(this.mostSeen);
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        });
      } else {
        this.sqlite.create({
          name: 'setVMas.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosPopulares(AnuncioId INTEGER PRIMARY KEY, ' +
            'Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, ' +
            'CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, ' +
            'FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, ' +
            'Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
            .then(res => console.log('Executed SQL'))
            .catch(e => console.log(e));
          db.executeSql('SELECT * FROM AnunciosPopulares WHERE isVisible=? ORDER BY AnuncioId DESC', [true]).then(res => {
            this.mostSeen = [];
            this.mostSeen = res as AnunciosModel[];
            for (const item of (this.mostSeen as AnunciosModel[])) {
              if (item.ImageContent !== undefined && item.ImageContent !== null) {
                item.Imagen = 'data:' + item.ImageMimeType + ';base64,' + item.ImageContent;
                console.log(item.Imagen);
              }
            }
          }).catch(e => console.log(e));
        });
      }
    }
  }


  // toggleGroup() {
  //   if (this.group === false) {
  //   } else if (this.group === true) {
  //     this.icon = 'arrow-dropdown';
  //     this.group = false;
  //     this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  //   }
  // }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message
    });
    return await toast.present();
  }


  async details(id?) {
    const anuncio: AnunciosModel = _.find(this.tab === this.RECENTS_TAB ? this.recents : this.mostSeen, { AnuncioId: id });

    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: { id, anuncio },
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  toggleConection() {
    document.getElementById('enable').style.webkitAnimation = 'pulse linear .60s';
    document.getElementById('enable').style.animation = 'pulse linear .60s';

    if (this.isConnected === false) {
      this.WifiWizard2.enableWifi();
      this.testconnetion();
    } else if (this.isConnected === true) {
      this.isConnected = false;
      this.WifiWizard2.disableWifi();
    }
  }

  sendShare(titulo?, id?) {
    const url = 'https://setvmas.com/#/detalles-anuncio/' + id;
    this.socialSharing.share(titulo, titulo, null, url);
  }

  openWeb(url) {
    const option: InAppBrowserOptions = {
      zoom: 'no',
      hardwareback: 'no'
    };
    const browser = this.iab.create(url, '_self', option);
    browser.show();
  }
}
