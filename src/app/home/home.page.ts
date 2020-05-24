import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer } from '@angular/core';
import { NavController, PopoverController, LoadingController, Platform } from '@ionic/angular';
import { AnunciosModel } from '../models/anuncios.model';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { AnuncioService } from '../services/anuncio.service';
import { NetworkService } from '../services/network.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { DetailsPage } from '../details/details.page';
import { Banner } from '../models/banner.model';
import { Usuario } from '../models/usuario.model';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { element } from 'protractor';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx'
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ViewPage } from '../view/view.page';
import { ModalController, AlertController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';

export interface AnuncioImagen {
  Id: number,
  Imagen: string,
  Titulo: string
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  slideOpts = {
    initialSlide: 1,
    slidePerView: 1,
    speed: 400,
    autoplay: true,
    enablekeyboardcontroll: true
  }
  isConnected = false;

  shownGroup = null;
  icon = 'arrow-dropdown'
  icon1 = 'arrow-dropdown'

  arrow = 'arrow-dropup'
  menus = false;
  animation = false

  group = false
  group1 = false
  populareslist: any;
  recienteslist: any
  barner: any;
  barnerSuperior: Banner[];
  barnerInferior: Banner[];

  anuncio: any
  txtbuscar = ''

  populares: AnunciosModel[]
  recientes: AnunciosModel[]
  cantPorPagina = this.servCo.getCantPorPaginasHome();

  bocina = false;

  currentUser: Usuario
  category: any
  displayImage: any
  displayImageSuperior: any
  displayImageInferior: any
  base64: any
  nameUser: any
  width: any
  height: any
  WifiWizard2: any;
  anunciod: AnunciosModel
  imagenArray: AnuncioImagen[] = []
  imagenMovil: any = null
  titulo: any = ''

  imagenMovil1: any = null
  titulo1: any = ''

  imagenMovil2: any = null
  titulo2: any = ''

  imagenMovil3: any = null
  titulo3: any = ''

  imagenMovil4: any = null
  titulo4: any = ''

  @ViewChild('popular', { static: false }) popular: ElementRef
  @ViewChild('icono', { static: false }) icono;

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  constructor(public navCtrl: NavController, public render: Renderer, private servCo: ConfiguracionesService, private servAnuncio: AnuncioService, private networkService: NetworkService, private sqlite: SQLite, private sanitizer: DomSanitizer, public toastCtrl: ToastController, public platform: Platform, public splashscreen: SplashScreen,
    private modal: PopoverController, private alertCtrl: AlertController, public modalController: ModalController, private insomnia: Insomnia, private iab: InAppBrowser, public loadingCtrl: LoadingController, private clipboard: Clipboard, private socialSharing: SocialSharing) { }

  ngOnInit() {
    //this.presentLoading();
    // this.testconnetion();
    // this.loadBanner()
    // this.loadAuto()
    this.insomnia.keepAwake().then(() => {
      console.log('success')
    })
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
            this.navCtrl.navigateForward('/home')
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.currentUser = null
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.testconnetion()
    if (!this.isConnected) {
      this.testconnetion();
    }
    // this.loadAuto()
    this.currentUser = JSON.parse(localStorage.getItem("currentuser"))
    if (this.currentUser) {
      let index = this.currentUser.Correo.indexOf("@");
      if (index !== -1) {
        this.nameUser = this.currentUser.Correo.substr(0, index);
      }
      console.log(this.currentUser)
    }

    this.servAnuncio.getCurrentUser().then(res => {
      this.currentUser = res as Usuario
      if (this.currentUser) {
        let index = this.currentUser.Correo.indexOf("@");
        if (index !== -1) {
          this.nameUser = this.currentUser.Correo.substr(0, index);
        }
        console.log(this.currentUser)
      }
    })
    //this.imagenMovil = JSON.parse(localStorage.getItem("ImageMovil")) 
    //this.titulo = localStorage.getItem("TituloAnuncio")
  }

  loadAuto() {
    this.presentLoading();
    this.testconnetion();
    this.loadBanner()
    this.toggleGroup()
  }
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.recientes.length == 1000 || this.populares.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }


  ngAfterViewInit() {
    /*this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    if(this.currentUser.Correo !== undefined || this.currentUser.Correo !== null){
      let index = this.currentUser.Correo.indexOf("@");
      if(index !== -1){
         this.nameUser = this.currentUser.Correo.substr(0,index);
      }
      console.log(this.currentUser)
    }*/
    setTimeout(() => {
      this.loadBanner()
      if (this.group == true) {
        this.presentLoading();
        this.servAnuncio.getAnunciosRecientes('', this.txtbuscar, 'asc', 1, this.cantPorPagina).then(data => {
          this.recientes = data as AnunciosModel[];
          for (const i of (this.recientes as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              console.log(i.Imagen)
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }
          console.log(this.recientes)
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        })
      } else if (this.group1 === false) {
        this.presentLoading();
        this.servAnuncio.getAnunciosPopulares('', this.txtbuscar, 'asc', 1, this.cantPorPagina).then(data => {
          this.populares = data as AnunciosModel[];
          for (const i of (this.populares as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              console.log(i.Imagen)
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }
          console.log(this.populares)
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        })
      }
    }, 180000)
  }

  testconnetion() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  logScrollStart() {
    console.log('logScrollStart : When Scroll Starts');
  }

  logScrolling() {
    console.log('logScrolling : When Scrolling');
  }

  logScrollEnd() {
    console.log('logScrollEnd : When Scroll Ends');
  }

  loadBanner() {
    if (this.isConnected) {
      this.servAnuncio.getBannerSuperior().then(data => {
        this.barnerSuperior = data as Banner[];
        console.log(this.barnerSuperior)
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      })
      this.servAnuncio.getBannerInferior().then(data => {
        this.barnerInferior = data as Banner[];
        this.loadingCtrl.dismiss();
        console.log(this.barnerInferior)
      }).catch((error) => {
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      })
    } else {
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerSuperior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerSuperior WHERE isVisible=? ORDER BY BannerId DESC', [true]).then(res => {
          this.barnerSuperior = res as Banner[];
        }).catch(e => console.log(e));
      })
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS BannerInferior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(e));
        db.executeSql('SELECT * FROM BannerInferior ORDER BY BannerId DESC', []).then(res => {
          this.barnerInferior = res as Banner[];
        }).catch(e => console.log(e));
      })
    }

  }

  /*toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
        this.icon = 'arrow-dropdown';
    } else {
      this.shownGroup = group;
      this.icon = 'arrow-dropup';
      this.servAnuncio.getAnunciosRecientes('', '', 'asc', 1, this.cantPorPagina).then(data=>{
              this.recientes = data;
              console.log(this.recientes)
      })
    }
  };*/

  toggleGroup() {
    if (this.group === false) {
      this.icon = 'arrow-dropup';
      this.group = true
      if (this.isConnected) {
        this.presentLoading();
        this.servAnuncio.getAnunciosRecientes('', this.txtbuscar, 'asc', 1, this.cantPorPagina).then(data => {
          this.recientes = data as AnunciosModel[];
          for (const i of (this.recientes as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              console.log(i.Imagen)
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }
          console.log(this.recientes)
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        })
      } else {
        this.sqlite.create({
          name: 'setVMas.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosRecientes(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
            .then(res => console.log('Executed SQL'))
            .catch(e => console.log(e));
          db.executeSql('SELECT * FROM AnunciosRecientes ORDER BY AnuncioId DESC', []).then(res => {
            this.recientes = [];
            /*for(var i=0; i<res.rows.length; i++) {
              this.recientes.push({AnuncioId:res.rows.item(i).AnuncioId,Titulo:res.rows.item(i).Titulo,Descripcion:res.rows.item(i).Descripcion,NombreContacto:res.rows.item(i).NombreContacto,TelefonoContacto:res.rows.item(i).TelefonoContacto,CorreoContacto:res.rows.item(i).CorreoContacto,Precio:res.rows.item(i).Precio,IsActivo:res.rows.item(i).IsActivo,IsVisible:res.rows.item(i).IsVisible,FechaCreacion:res.rows.item(i).FechaCreacion,FechaModificacion:res.rows.item(i).FechaModificacion,ImageContent:res.rows.item(i).ImageContent,ImageMimeType:res.rows.item(i).ImageMimeType,ImageName:res.rows.item(i).ImageName,Url:res.rows.item(i).Url,Provincia:res.rows.item(i).Provincia,ContadorView:res.rows.item(i).ContadorView,ProductoNuevo:res.rows.item(i).ProductoNuevo,Accion:res.rows.item(i).Accion,Imagen:res.rows.item(i).Imagen})
            }*/
            this.recientes = res as AnunciosModel[]
            for (const i of (this.recientes as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
                console.log(i.Imagen)
              } else {
                i.Imagen = i.Categoria.ImageName;
              }

            }
          }).catch(e => console.log(e));
        })
      }
      this.loadingCtrl.dismiss();
      /*this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM AnuncioImagen', []).then((data) => {
          for (let i = 0; i < data.rows.length; i++) {
            let item = data.rows.item(i).Imagen;
            this.imagenMovil = data.rows.item(i).Imagen.substr(0)
            this.titulo = data.rows.item(i).Titulo
            alert("List " + JSON.stringify( data.rows.item(i).Imagen.substr(0)))
          }
         
        }).catch(e => {console.log(e)
        //  alert("error " + JSON.stringify(e))
        });
      })*/
    } else if (this.group === true) {
      this.icon = 'arrow-dropdown';
      this.group = false
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  }

  toggleGroup1() {
    if (this.group1 === false) {
      this.icon1 = 'arrow-dropup';
      this.group1 = true
      if (this.isConnected) {
        this.presentLoading();
        this.servAnuncio.getAnunciosPopulares('', this.txtbuscar, 'asc', 1, this.cantPorPagina).then(data => {
          this.populares = data as AnunciosModel[];
          for (const i of (this.populares as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              console.log(i.Imagen)
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }
          console.log(this.populares)
        }).catch((error) => {
          this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
        })
      } else {
        this.sqlite.create({
          name: 'setVMas.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosPopulares(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
            .then(res => console.log('Executed SQL'))
            .catch(e => console.log(e));
          db.executeSql('SELECT * FROM AnunciosPopulares WHERE isVisible=? ORDER BY AnuncioId DESC', [true]).then(res => {
            this.populares = [];
            /*for(var i=0; i<res.rows.length; i++) {
              this.populares.push({AnuncioId:res.rows.item(i).AnuncioId,Titulo:res.rows.item(i).Titulo,Descripcion:res.rows.item(i).Descripcion,NombreContacto:res.rows.item(i).NombreContacto,TelefonoContacto:res.rows.item(i).TelefonoContacto,CorreoContacto:res.rows.item(i).CorreoContacto,Precio:res.rows.item(i).Precio,IsActivo:res.rows.item(i).IsActivo,IsVisible:res.rows.item(i).IsVisible,FechaCreacion:res.rows.item(i).FechaCreacion,FechaModificacion:res.rows.item(i).FechaModificacion,ImageContent:res.rows.item(i).ImageContent,ImageMimeType:res.rows.item(i).ImageMimeType,ImageName:res.rows.item(i).ImageName,Url:res.rows.item(i).Url,Provincia:res.rows.item(i).Provincia,ContadorView:res.rows.item(i).ContadorView,ProductoNuevo:res.rows.item(i).ProductoNuevo,Accion:res.rows.item(i).Accion,Imagen:res.rows.item(i).Imagen})
            }*/
            this.populares = res as AnunciosModel[]
            for (const i of (this.populares as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
                console.log(i.Imagen)
              } else {
                i.Imagen = i.Categoria.ImageName;
              }

            }
          }).catch(e => console.log(e));
        })
      }
      this.loadingCtrl.dismiss();
    } else if (this.group1 === true) {
      this.icon1 = 'arrow-dropdown';
      this.group1 = false
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }

  }

  /*toggleGroup1(group) {
    if (this.isGroupShown1(group)) {
        this.shownGroup = null;
        this.icon1 = 'arrow-dropdown';
    } else {
      this.shownGroup = group;
      this.icon1 = 'arrow-dropup';
      this.servAnuncio.getAnunciosPopulares('', '', 'asc', 1, this.cantPorPagina).then(data=>{
        this.populares = data;
        console.log(this.populares)
      })
      
    }
  };*/


  isGroupShown(group) {
    return this.shownGroup === group;
  };

  isGroupShown1(group) {
    return this.shownGroup === group;
  };


  onNotificate() {
    if (this.bocina === false) {
      this.bocina = true;
    } else if (this.bocina === true) {
      this.bocina = false;
      this.onAnnounce();
    }
    console.log(this.bocina)
  }


  async onAnnounce() {
    console.log("Announce")
    this.navCtrl.navigateForward('/add-announce')
  }

  menu() {
    if (this.menus === false) {
      this.menus = true
      this.arrow = 'arrow-dropdown'
    } else if (this.menus === true) {
      this.menus = false
      this.arrow = 'arrow-dropup'
    }
  }

  inicio() {
    this.navCtrl.navigateForward('/home')
  }

  oficina() {
    this.navCtrl.navigateForward('/virtual-office')
  }

  search() {
    this.navCtrl.navigateForward('/search')
  }
  ayuda() {
    this.navCtrl.navigateForward('/help')
  }

  contacto() {
    this.navCtrl.navigateForward('/contact')
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      //duration: 3000
    });
    return await toast.present();
  }


  async details(id?) {
    let anuncio: AnunciosModel

    if (this.group == true) {
      this.recientes.forEach(element => {
        if (element.AnuncioId === id) {
          this.anunciod = element
        }
      })
    } else if (this.group1 == true) {
      this.populares.forEach(element => {
        if (element.AnuncioId === id) {
          this.anunciod = element
        }
      })
    }

    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: { "id": id, "anuncio": this.anunciod },
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }


  async view(id?) {
    let anuncio: AnunciosModel

    if (this.group == true) {
      this.recientes.forEach(element => {
        if (element.AnuncioId === id) {
          this.anunciod = element
        }
      })
    } else if (this.group1 == true) {
      this.populares.forEach(element => {
        if (element.AnuncioId === id) {
          this.anunciod = element
        }
      })
    }
    console.log("modal")
    const modal = await this.modalController.create({
      component: ViewPage,
      componentProps: { "id": id, "anuncio": this.anunciod },
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }


  login() {
    this.navCtrl.navigateForward('/signin')
  }

  logout() {
    this.servAnuncio.logout()
  }

  conection() {

    document.getElementById("enable").style.webkitAnimation = "pulse linear .60s"
    document.getElementById("enable").style.animation = "pulse linear .60s"

    if (this.isConnected === false) {
      this.WifiWizard2.enableWifi()
      this.testconnetion();
      //this.animation = true


    } else if (this.isConnected === true) {
      this.isConnected = false
      this.WifiWizard2.disableWifi()
      //this.animation = false
    }

  }

  sendShare(titulo?, id?) {
    let url = 'https://setvmas.com/#/detalles-anuncio/' + id
    this.socialSharing.share(titulo, titulo, null, url);
  }

  miWeb(url) {
    const option: InAppBrowserOptions = {
      zoom: 'no',
      hardwareback: 'no'
    }
    let browser = this.iab.create(url, '_self', option)
    browser.show()
  }

  /*enlace(){
    let userCodigo = 'https://setvmas.com/'+this.codigo
    this.clipboard.copy(userCodigo);
  }*/

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: '',
      duration: 38000
    });
    return await loading.present();
  }

  async presentLoading1() {
    const loading = await this.loadingCtrl.create({
      message: '',
      duration: 2000
    });
    return await loading.present();
  }


}
