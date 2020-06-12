import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { LoadingController, NavController, NavParams, Platform, IonRouterOutlet } from '@ionic/angular';
// import { ScrollHideDirective, ScrollHideConfig } from '../../directives/scroll-hide.directive';
import { HideHeaderDirective } from '../../directives/hide-header.directive';
import { ScrollVanishDirective } from '../../directives/scroll-vanish.directive';
import { AnunciosModel } from '../../models/anuncios.model';
import { SettingsService } from '../../services/settings.service';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ToastController } from '@ionic/angular';
import { DetailsPage } from '../details/details.page';
import { Banner } from '../../models/banner.model';
import { Usuario } from '../../models/usuario.model';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import * as _ from 'lodash';
import { BuscarAnunciosModel } from '../../models/buscar-anuncios.model';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LocalDataService, StaticData } from '../../services/local-data.service';
import { environment } from '../../../environments/environment';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


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
export class HomePage implements AfterViewInit {

  constructor(
    private platform: Platform, private splashScreen: SplashScreen, private routerOutlet: IonRouterOutlet,
    private servCo: SettingsService, private servAnuncio: AnuncioService, private networkService: NetworkService,
    private sqlite: SQLite, public toastCtrl: ToastController, private alertCtrl: AlertController,
    public modalController: ModalController, private insomnia: Insomnia, private iab: InAppBrowser,
    public loadingCtrl: LoadingController, private socialSharing: SocialSharing,
    private router: Router, private localService: LocalDataService, public navCtrl: NavController
  ) {
    //   this.platform.ready().then(()=>{
    //     this.splashscreen.hide();
    //  })
  }

  _ = _;
  rootURL = environment.rootURLImages;
  RECENTS_TAB = 'RECENTS';
  MOST_SEEN_TAB = 'MOST_SEEN';
  tab = this.RECENTS_TAB;

  // footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: 70 };
  // headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 112 };

  slideOpts = {
    initialSlide: 0,
    slidePerView: 1,
    speed: 3000,
    autoplay: true,
    enablekeyboardcontroll: true
  };
  subscription;
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
  enableFilterButton = false;
  filters: BuscarAnunciosModel;
  lastTimeBackPress = 0;

  currentUser: Usuario;
  nameUser: any;
  WifiWizard2: any;

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  loadFirstTime = false;
  ngAfterViewInit(): void {
    this.skeletorCard = [];
    const cardCount = parseInt(((window.innerHeight - 190) / 142).toFixed(0), 0) + 1;
    for (let index = 0; index < cardCount; index++) {
      this.skeletorCard.push({});
    }

  }

  ionViewDidEnter() {
    this.platform.ready().then(async () => {
      this.currentUser = this.servAnuncio.getLocalCurrentUser();
      if (!this.currentUser) {
        this.currentUser = await this.servAnuncio.getGuest();
      } else {
        const index = this.currentUser.Correo.indexOf('@');
        if (index !== -1) {
          this.nameUser = this.currentUser.Correo.substr(0, index);
        }
        this.servAnuncio.refreshCurrentUser((user) => this.currentUser = user, (err) => {});
      }

      setTimeout(() => {
        this.splashScreen.hide();
        this.loadAuto();
      }, 1000);
    });
  }

  // ionViewDidLeave() {
  //   this.subscription.unsubscribe();
  // }

  segmentChanged(ev: any) {
    this.tab = ev.detail.value;
    if (this.tab === this.RECENTS_TAB && _.size(this.recents) === 0) {
      this.loadRecents();
    } else if (this.tab === this.MOST_SEEN_TAB && _.size(this.mostSeen) === 0) {
      this.loadMostSeen();
    }
  }

  applyFilters(page = 1) {
    if (page === 1) {
      this.loading = true;
    }
    if (this.tab === this.RECENTS_TAB) {
      this.recents = [];
      this.recentsPage = page;
      this.loadRecents();
    } else if (this.tab === this.MOST_SEEN_TAB) {
      this.mostSeen = [];
      this.mostSeenPage = page;
      this.loadMostSeen();
    }
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
          handler: async () => {
            this.servAnuncio.logout();
            this.currentUser = await this.servAnuncio.getGuest();
            this.nameUser = null;
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.checkConnetion();
    if (_.size(_.keys(this.servAnuncio.filters)) > 0 && this.servAnuncio.filters !== this.filters) {
      this.applyFilters();
    }
    this.filters = this.servAnuncio.filters || {};
  }

  loadAuto() {
    if (!this.loadFirstTime) {
      this.checkConnetion(() => {
        this.loadBanner();
        this.loadAds();
        this.localService.getData((data: StaticData) => {
          this.enableFilterButton = true;
          this.loadFirstTime = true;
          console.log(data);
        });
      });
    }
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

  checkConnetion(callback = () => { }) {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      callback();
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
    }
  }

  async loadAds() {
    this.loading = true;
    if (this.tab === this.RECENTS_TAB) {
      this.loadRecents(() => {
      });
    } else {
      this.loadMostSeen(() => {
      });
    }
  }

  loadRecents(callback = () => { }) {
    if (this.isConnected) {
      if (_.size(_.keys(this.filters))) {
        this.servAnuncio.buscarAnunciosAvanzados(this.filters, this.recentsPage, this.pagination).then(res => {
          this.recents = _.concat(this.recents || [], res);
          for (const i of (this.recents as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              console.log(i.Imagen);
            } else {
              i.Imagen = i.Categoria.ImageName;
            }
          }
          this.loading = false;
          callback();
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          callback();
        });
      } else {
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
          this.loading = false;
          callback();
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          callback();
        });
      }
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
        this.loading = false;
        callback();
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        this.loading = false;
        callback();
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
      this.checkConnetion();
    } else if (this.isConnected === true) {
      this.isConnected = false;
      this.WifiWizard2.disableWifi();
    }
  }

  async details(ad: AnunciosModel) {
    this.navCtrl.navigateForward('/details', { state: { ad } });
  }

  sendShare(titulo?, id?) {
    const url = 'https://setvmas.com/#/detalles-anuncio/' + id;
    this.socialSharing.share(titulo, titulo, null, url);
  }

  openWeb(url) {
    const browser = this.iab.create(url, '_system');
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
        const pos = (_.size(this.bannersBottom) - index - i);
        images.push(this.bannersBottom[pos < 0 ? pos * -1 : pos]);
      } else {
        images.push(this.bannersBottom[index + i]);
      }
    }
    return images;
  }

  onSearch(event) {
    this.recents = [];
    this.mostSeen = [];
    this.loadAds();
  }

  onSearchClear(event) {
    this.searchText = '';
    this.onSearch(null);
  }
}
