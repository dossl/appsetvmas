import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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
export class HomePage implements OnInit, AfterViewInit {

  RECENTS_TAB = 'RECENTS';
  MOST_SEEN_TAB = 'MOST_SEEN';
  tab = this.RECENTS_TAB;

  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: 70 };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 112 };

  slideOpts = {
    initialSlide: 0,
    slidePerView: 1,
    speed: 3000,
    autoplay: true,
    enablekeyboardcontroll: true
  };

  isConnected = false;
  bannersTop: Banner[] = [];
  bannersBottom: Banner[] = [];
  searchText = '';

  mostSeen: AnunciosModel[];
  mostSeenPage = 1;
  recents: AnunciosModel[];
  recentsPage = 1;
  pagination = this.servCo.getCantPorPaginasHome();
  loading = true;
  loadingBannerTop = true;
  loadingBannerBottom = true;
  skeletorCard = [];

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

  ngAfterViewInit(): void {
    this.skeletorCard = [];
    const cardCount = parseInt(((window.innerHeight - 190) / 142).toFixed(0), 0) + 1;
    for (let index = 0; index < cardCount; index++) {
      this.skeletorCard.push({});
    }
    this.loadAuto();
  }

  ngOnInit() {
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
      if (this.tab === this.RECENTS_TAB) {
        this.recentsPage++;
        this.loadRecents(() => {
          event.target.complete();
        });
      } else {
        this.mostSeenPage++;
        this.loadMostSeen(() => {
          event.target.complete();
        });
      }

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.recents.length === 500 || this.mostSeen.length === 500) {
        event.target.disabled = true;
      }
    }, 500);
  }

  testconnetion() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  async loadBanner() {
    this.loadingBannerTop = true;
    this.loadingBannerBottom = true;
    if (this.isConnected) {
      this.servAnuncio.getBannerSuperior().then(data => {
        this.bannersTop = data as Banner[];
        console.log(this.bannersTop);
        setTimeout(() => {
          this.loadingBannerTop = false;
        }, 2000);
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      });
      this.servAnuncio.getBannerInferior().then(data => {
        this.bannersBottom = data as Banner[];
        console.log(this.bannersBottom);
        setTimeout(() => {
          this.loadingBannerBottom = false;
        }, 2000);
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      });
    } else {
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerSuperior(BannerId INTEGER PRIMARY KEY, ' +
          'Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ' +
          'ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerSuperior WHERE isVisible=? ORDER BY BannerId DESC', [true]).then(res => {
          this.bannersTop = res as Banner[];
          setTimeout(() => {
            this.loadingBannerTop = false;
          }, 2000);
        }).catch(e => console.log(e));
      });
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerInferior(BannerId INTEGER PRIMARY KEY, ' +
          'Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ' +
          'ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerInferior ORDER BY BannerId DESC', []).then(res => {
          this.bannersBottom = res as Banner[];
          setTimeout(() => {
            this.loadingBannerBottom = false;
          }, 2000);
        }).catch(e => console.log(e));
      });
    }

  }

  async loadAds() {
    this.loading = true;
    this.loadRecents();
    this.loadMostSeen();
  }

  loadRecents(callback = () => { }) {
    if (this.isConnected) {
      this.servAnuncio.getAnunciosRecientes('', this.searchText, 'asc', this.recentsPage, this.pagination).then(data => {
        this.recents = _.concat(this.recents || [], data);
        for (const i of (this.recents as AnunciosModel[])) {
          if (i.ImageContent !== undefined && i.ImageContent !== null) {
            i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
            console.log(i.Imagen);
          } else {
            i.Imagen = i.Categoria.ImageName;
          }

        }
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        callback();
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        callback();
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
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          callback();
        }).catch(e => {
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          callback();
        });
      });
    }
  }

  loadMostSeen(callback = () => { }) {
    if (this.isConnected) {
      this.servAnuncio.getAnunciosPopulares('', this.searchText, 'asc', this.mostSeenPage, this.pagination).then(data => {
        this.mostSeen = data as AnunciosModel[];
        for (const i of (this.mostSeen as AnunciosModel[])) {
          if (i.ImageContent !== undefined && i.ImageContent !== null) {
            i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
          } else {
            i.Imagen = i.Categoria.ImageName;
          }
        }
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        callback();
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        callback();
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
            }
          }
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          callback();
        }).catch(e => {
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          callback();
        });
      });
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message
    });
    return await toast.present();
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

  async details(ad: AnunciosModel) {
    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: { id: ad.AnuncioId, anuncio: ad },
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
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

  open(ad: AnunciosModel) {
    if (ad.Url) {
      this.openWeb(ad.Url);
    } else {
      this.details(ad);
    }
  }

  getIndexesForSlidesBottom() {
    const index = parseInt((this.bannersBottom.length / 4).toFixed(), 0) +
      (this.bannersBottom.length % 4 > 0 ? 1 : 0);
    const indexes = [];
    for (let i = 0; i < index; i++) {
      indexes.push(i * 4);
    }
    return indexes;
  }

  getImagesForSlideBottom(index) {
    const images = [];
    for (let i = 0; i < 4; i++) {
      if (index + i > _.size(this.bannersBottom) - 1) {
        const pos = (_.size(this.bannersBottom) - index + i) * -1;
        images.push(this.bannersBottom[pos - 1]);
      } else {
        images.push(this.bannersBottom[index + i]);
      }
    }
    return images;
  }

  onSearch(event) {
    this.loadAds();
  }
}
