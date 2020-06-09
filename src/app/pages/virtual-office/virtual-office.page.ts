import { Component, OnInit, Renderer } from '@angular/core';
import { NavController, PopoverController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { AnunciosModel } from '../../models/anuncios.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { NetworkService } from '../../services/network.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SellPointPage } from '../sell-point/sell-point.page';
import { ToastController } from '@ionic/angular';
import { QrPage } from '../qr/qr.page';
import { Banner } from '../../models/banner.model';
import { Usuario } from '../../models/usuario.model';
import { VariableConfiguracion } from '../../models/variable-configuracion.model';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import * as moment from 'moment';




@Component({
  selector: 'app-virtual-office',
  templateUrl: './virtual-office.page.html',
  styleUrls: ['./virtual-office.page.scss'],
})
export class VirtualOfficePage implements OnInit {

  AD_TAB = 'AD_TAB';
  DATA_TAB = 'DATA_TAB';
  tab = this.DATA_TAB;
  moment = moment;

  TIME_INTERVAL = 30000;
  nuevo: any;
  precio: any;
  titulo: any;
  nombre: any;
  telefono: any;
  email: any;
  municipio: any;
  provincia: any;
  images: any;
  etiqueta: any;
  accion: any;
  texto: any;
  selectaccion: any;
  selectprovincia: any;
  selectmunicipio: any;
  destacado: any;
  masetiqueta: any;
  autorrenovable: any;
  frecuencia: any;
  web: any;
  url: any;
  webanuncio: any;
  nombreimagen: any;
  imagenadicional: any;
  imagenbarnerinferior: any;
  imagenbarnersuperior: any;
  diaspagardestacado: any;
  diaspagardescribe: any;
  diaspagarautorrenovable: any;
  diaspagarweb: any;
  diaspagarimagenadicional: any;
  diaspagarbarner: any;
  diaspagarbarnersuperior: any;
  base64: any;
  WifiWizard2: any;
  compras = 0;

  nube = 'cloud-outline';
  isConnected = false;

  slideOpts = {
    initialSlide: 1,
    slidePerView: 1,
    speed: 400,
    autoplay: true,
    enablekeyboardcontroll: true
  };

  anunciolist: any;
  barner: any;
  barnerSuperior: Banner[];
  barnerInferior: Banner[];
  displayImageSuperior: any;
  displayImageInferior: any;

  anuncios: AnunciosModel[];

  category: any;

  borrador = false;
  currentUser: Usuario;

  codigo: any;
  cantReferidos: any;
  iduser: any;
  precio_Punto: any;
  clase: any;
  acumuladoPuntos: any;
  nameUser: any;

  constructor(
    public navCtrl: NavController, public render: Renderer, private insomnia: Insomnia,
    public network: Network, private service: AnuncioService, private sqlite: SQLite,
    private networkService: NetworkService, private modal: PopoverController,
    public toastCtrl: ToastController, public platform: Platform, public splashscreen: SplashScreen,
    public loadingCtrl: LoadingController, private alertCtrl: AlertController,
    private clipboard: Clipboard
  ) {
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
   })*/
    this.barner = [
      { image: 'assets/imgs_test/slide_down1.png', category: 'popular' },
      { image: 'assets/imgs_test/slide_down2.png', category: 'popular' },
    ];
    // this.serv.getAnunciosV2('','','asc',1,50).then(res => {this.anuncio = res as AnunciosModel[]});
    // console.log(this.anuncio)
    this.category = [
      {
        name: 'Lista de Anuncios',
      }
    ];

  }

  segmentChanged(ev: any) {
    this.tab = ev.detail.value;
  }

  ngOnInit() {
    // this.base64 = this.sanitizer.bypassSecurityTrustUrl(";base64,")
    this.testconnetion();
    //this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    //console.log(JSON.parse(localStorage.getItem("currentuser")))
    /*this.service.getCurrentUser().then(res=>{
       this.currentUser = res as Usuario
       if(this.currentUser){
        let index = this.currentUser.Correo.indexOf("@");
        this.codigo = this.currentUser.Codigo
        this.cantReferidos = this.currentUser.CantReferidos
        this.iduser = this.currentUser.UsuarioId
        this.clase = this.currentUser.ClasesUsuarios.Nombre
        this.acumuladoPuntos = this.currentUser.Puntos
        if(index !== -1){
           this.nameUser = this.currentUser.Correo.substr(0,index);
        }
        console.log(this.currentUser)
      }
    })*/

    if (this.isConnected) {
      this.loadBanner();
    }
    this.insomnia.keepAwake().then(() => {
      console.log('success');
    });
  }

  ionViewWillEnter() {
    this.testconnetion();
    if (!this.isConnected) {
      this.testconnetion();
    }
    this.service.getCurrentUser().then(res => {
      this.currentUser = res as Usuario;
      if (this.currentUser) {
        const index = this.currentUser.Correo.indexOf('@');
        this.codigo = this.currentUser.Codigo;
        this.cantReferidos = this.currentUser.CantReferidos;
        this.iduser = this.currentUser.UsuarioId;
        this.clase = this.currentUser.Clase;
        this.acumuladoPuntos = this.currentUser.Puntos;
        if (index !== -1) {
          this.nameUser = this.currentUser.Correo.substr(0, index);
        }
        console.log(this.currentUser);
        this.loadOnline();
        this.precio_Puntos();
      }
    });
  }
  enlace() {
    const userCodigo = this.codigo;
    this.clipboard.copy(userCodigo);
  }


  precio_Puntos() {
    const valor = 'Precio_Puntos';
    this.service.getVariableConfiguracionByCodigo(valor).then(res => {
      this.precio_Punto = parseFloat(res.Valor).toFixed(2);
      console.log(this.precio_Punto);
    }).catch((error) => {
      this.presentToast(error);
    });
  }

  changeStatusAd(ad: AnunciosModel) {
    this.service.ocultarMostrarAnuncio(ad.AnuncioId).then(res => {
      this.presentToast('El anuncio ha sido modificado satisfactoriamente.');
      ad.IsActivo = !ad.IsActivo;
      ad.IsVisible = !ad.IsVisible;
    }).catch(err => this.presentToast('Error durante la actualización de anuncio'));
  }

  conection() {
    document.getElementById('enable').style.webkitAnimation = 'pulse linear .60s';
    document.getElementById('enable').style.animation = 'pulse linear .60s';
    if (this.isConnected === false) {
      this.WifiWizard2.enableWifi();
      this.nube = 'cloud-done';
      this.testconnetion();

    } else if (this.isConnected === true) {
      this.isConnected = false;
      this.nube = 'cloud-outline';
      this.WifiWizard2.disableWifi();
    }

  }

  testconnetion() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        this.nube = 'cloud-outline';

      } else {
        this.nube = 'cloud-done';
      }
    });
  }

  loadBanner() {
    if (this.isConnected) {
      this.service.getBannerSuperior().then(data => {
        this.barnerSuperior = data as Banner[];
        console.log(this.barnerSuperior);
      }).catch((error) => {
        this.presentToast(error);
      });
      this.service.getBannerInferior().then(data => {
        this.barnerInferior = data as Banner[];
        console.log(this.barnerInferior);
      }).catch((error) => {
        this.presentToast(error);
      });
    } else {
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerSuperior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerSuperior WHERE isVisible=? ORDER BY BannerId DESC', [true]).then(res => {
          this.barnerSuperior = res as Banner[];
        }).catch(e => console.log(e));
      });
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerInferior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerInferior ORDER BY BannerId DESC', []).then(res => {
          this.barnerInferior = res as Banner[];
        }).catch(e => console.log(e));
      });
    }

  }

  loadOnline() {
    this.service.getAnunciosByUser('FechaModificacion', this.currentUser.UsuarioId, 'asc', 1, 100).then(data => {
      this.anuncios = data;
      console.log(this.anuncios);
      // this.loadingCtrl.dismiss();
    }).catch(() => {
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    });
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
          handler: () => {
            this.navCtrl.navigateForward('/home');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.currentUser = null;
          }
        }
      ]
    });

    await alert.present();
  }

  onAnnounce() {
    console.log('Announce');
    this.navCtrl.navigateForward('/add-announce');
  }

  onEditAnnounce(id: any) {
    this.service.setAnuncioId(id);
    this.navCtrl.navigateForward('/edit-announce');
  }

  onDeleteAnnounce(anuncioId) {
    if (this.isConnected) {
      this.service.deleteAnuncio(anuncioId).then(data => {
        // this.anuncios = data as AnunciosModel;
        console.log(this.anuncios);
      }).catch((error) => {
        this.presentToast(error);
      });
      this.loadOnline();
    }
  }

  compra() {
    this.navCtrl.navigateForward('/buy-point');
    this.compras = this.compras + 1;
  }

  async vende() {
    const modal = await this.modal.create({
      component: SellPointPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async qr() {
    // if (this.currentUser){
    //  let id = this.currentUser.UsuarioId
    const modal = await this.modal.create({
      component: QrPage,
      //  componentProps:{"id": id},
      animated: true,
      backdropDismiss: false

    });
    return await modal.present();
    //}
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: '',
      duration: 2000
    });
    return await loading.present();
  }
}
