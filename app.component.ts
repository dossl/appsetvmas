import { Component } from '@angular/core';

import { Platform, PopoverController, LoadingController, ToastController, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService } from './services/network.service';
import { SellPointPage } from './sell-point/sell-point.page';
import { QrPage } from './qr/qr.page';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { AnunciosModel } from './models/anuncios.model';
import { VariableConfiguracion } from './models/variable-configuracion.model';
import { Banner } from './models/banner.model';
import { Etiqueta } from './models/etiqueta.model';
import { Categoria } from './models/categoria.model';
import { Toast } from '@ionic-native/toast/ngx';
import { AnuncioService } from './services/anuncio.service';
import { MasqrPage } from './masqr/masqr.page';
import { MasSellPointPage } from './mas-sell-point/mas-sell-point.page';
import { Usuario } from './models/usuario.model';
import { FormBuilder,FormGroup, Validators,FormControl} from '@angular/forms'
import { TipoOpcionModel } from './models/tipo-opcion.model';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {


  arraycategoria:Categoria[]
  arrayEtiqueta:Etiqueta[]
  barnerSuperior: Banner[]
  barnerInferior: Banner[]
  configuration: VariableConfiguracion[]
  recientes: AnunciosModel[]
  populares: AnunciosModel[]
  anuncios: AnunciosModel[]

  isConnected = false;

  online_active : any;
  online_noactive : any;
  offline_active : any;
  offline_noactive : any;

  online = 'ONLINE'
  offline = 'OFFLINE'
  style = ''
  active = false

  listaTipoOpciones: TipoOpcionModel[]

  currentUser: Usuario
  userPoint = 0


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private networkService: NetworkService,
    private modal: PopoverController,
    public toastCtrl: ToastController,
    private service: AnuncioService,
    private sqlite: SQLite, 
    private insomnia: Insomnia,
    public network: Network,
    public menus: MenuController,
    private toast: Toast,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
  ) {
    this.sideMenu();
    this.initializeApp();
    /*this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })*/
    this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    if(this.currentUser){
      this.userPoint = this.currentUser.Puntos
      console.log(this.currentUser)
    }
    let menu = localStorage.getItem("home")
    console.log(menu)
    /*if (menu === 'online'){
      this.isConnected = true
    } else if (menu === 'offline'){
      this.isConnected = false
    }*/
    this.testconnetion();
    /*if(!this.isConnected){
      setTimeout(()=>{
        this.testconnetion();
      },10000)
    }*/
    
  }

  ionViewWillEnter(){
    /*this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    if(this.currentUser){
      this.userPoint = this.currentUser.Puntos
      console.log(this.currentUser)
    }*/
    this.service.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
      if(this.currentUser){
        this.userPoint = this.currentUser.Puntos
        console.log(this.currentUser)
     }
    })
  }

  conection(){
    if(this.isConnected === false){
      this.testconnetion();
      localStorage.setItem("menu","online")
    }else if(this.isConnected === true){
       this.isConnected = false
       this.networkService.networkDisconnetion()
       localStorage.setItem("menu","offline")
    }
    
  }

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) { 
       this.active = false 
      }else{
        this.active = true;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async vende(){
    const modal = await this.modal.create({
      component: MasSellPointPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async qr(){
    const modal = await this.modal.create({
      component: MasqrPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  sideMenu()
  {
    this.online_active =
    [
      {
        title : "INICIO",
        url   : "/home",
        icon  : ""
      },
      {
        title : "OFICINA",
        url   : "/virtual-office",
        icon  : ""
      },
      {
        title : "ANUNCIAR",
        url   : "/add-announce",
        icon  : ""
      },
      {
        title : "DESCARGAR BD",
        url   : '',
        fn   : () => this.downloadBD(),
        icon  : ""
      },
      {
        title : "AYUDA",
        url   : "/help",
        icon  : ""
      }
    ]

    this.online_noactive =
    [
      {
        title : "INICIO",
        url   : "/home",
        icon  : ""
      },
      {
        title : "ANUNCIAR",
        url   : "/add-announce",
        icon  : ""
      },
      {
        title : "DESCARGAR BD",
        url   : '',
        fn   : () => this.downloadBD(),
        icon  : ""
      },
      {
        title : "AYUDA",
        url   : "/help",
        icon  : ""
      }
    ]

    this.offline_active =
    [
      {
        title : "INICIO",
        url   : "/home",
        icon  : ""
      },
      {
        title : "OFICINA",
        url   : "/virtual-office",
        icon  : ""
      },
      {
        title : "CREAR ANUNCIO",
        url   : "/add-announce",
        icon  : ""
      },
      {
        title : "AYUDA",
        url   : "/help",
        icon  : ""
      }
    ]


    this.offline_noactive =
    [
      {
        title : "Inicio",
        url   : "/home",
        icon  : ""
      },
      {
        title : "Ayuda",
        url   : "/help",
        icon  : ""
      }
    ]
  }


  async presentToast(text) {
    const toast = await this.toastCtrl.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  inicio(){
    this.navCtrl.navigateForward('/home')
    this.menus.close()
  }

  oficina(){
    this.navCtrl.navigateForward('/virtual-office')
    this.menus.close()
  }

  anunciar(){
    this.navCtrl.navigateForward('/add-announce')
    this.menus.close()
  }

  ayuda(){
    this.navCtrl.navigateForward('/help')
    this.menus.close()
  }

  downloadBD(){
    console.log("download bd")
    this.presentLoading();
    this.service.getCategoriaAll('','','asc',1,5000).then(data=>{
      this.arraycategoria = data as Categoria[]
      console.log(this.arraycategoria)
    }).catch((error)=>{
      console.log('Error fetch',error)
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })

    this.service.getTipoOpcions('', '', 'asc', 1, 5000)
            .then(res => {
              this.listaTipoOpciones = res as TipoOpcionModel[];
            
      });

   this.service.getEtiquetas('Nombre','','asc',1,5000).then(data=>{
      this.arrayEtiqueta = data as Etiqueta[]
      console.log(this.arrayEtiqueta)
    }).catch((error)=>{
      console.log('Error',error)
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })

    this.service.getBannerSuperior().then(data=>{
      this.barnerSuperior = data as Banner[];
      console.log(this.barnerSuperior)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
    this.service.getBannerInferior().then(data=>{
      this.barnerInferior = data as Banner[];
      console.log(this.barnerInferior)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })

    this.service.getconfiguration("","","asc",1,100).then(data=>{
      this.configuration = data as VariableConfiguracion[]
      console.log(this.configuration)
    })

    this.service.getAnunciosRecientes('', '', 'asc', 1, 8).then(data=>{
      this.recientes = data as AnunciosModel[];
      console.log(this.recientes)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })


    this.service.getAnunciosPopulares('', '', 'asc', 1, 8).then(data=>{
      this.populares = data as AnunciosModel[];
      console.log(this.populares)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })

    this.service.getAnuncios('', '', 'asc', 1, 8).then(data=>{
         this.anuncios = data as AnunciosModel[]
         console.log(this.anuncios)
    })
    this.sqlite.create({
      name: 'setVMas.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS Categoria(CategoriaId INTEGER PRIMARY KEY, Nombre TEXT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, CantAutoRenovables INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.arraycategoria.forEach(element=>{
        db.executeSql('INSERT INTO Categoria VALUES(NULL,?,?,?,?,?,?,?/)',[element.Nombre,element.ImageContent,element.ImageMimeType,element.ImageName,element.CantAutoRenovables])
        .then(res => {
          console.log(res);
          this.toast.show('Categoria descargadas', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })
      
      db.executeSql('CREATE TABLE IF NOT EXISTS Etiqueta(EtiquetaId INTEGER PRIMARY KEY, Nombre TEXT, CantUsada TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.arrayEtiqueta.forEach(element=>{
        db.executeSql('INSERT INTO Etiqueta VALUES(NULL,?,?/)',[element.Nombre,element.CantUsada])
        .then(res => {
          console.log(res);
          this.toast.show('Etiquetas descargadas', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        }) 
      })
      
      db.executeSql('CREATE TABLE IF NOT EXISTS BannerSuperior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.barnerSuperior.forEach(element=>{
        db.executeSql('INSERT INTO BannerSuperior VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?/)',[element.Nombre,element.Url,element.Tipo,element.CantidadDias,element.ImageContent,element.ImageMimeType,element.ImageName, element.FechaCreacion,element.FechaUltView, element.FechaDesactivacion, element.IsActivo])
        .then(res => {
          console.log(res);
          this.toast.show('Banners Superior descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })  
      })
       db.executeSql('CREATE TABLE IF NOT EXISTS BannerInferior(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.barnerInferior.forEach(element=>{
        db.executeSql('INSERT INTO BannerInferior VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?/)',[element.Nombre,element.Url,element.Tipo,element.CantidadDias,element.ImageContent,element.ImageMimeType,element.ImageName, element.FechaCreacion,element.FechaUltView, element.FechaDesactivacion, element.IsActivo])
        .then(res => {
          console.log(res);
          this.toast.show('Banners Inferior descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })
    
      db.executeSql('CREATE TABLE IF NOT EXISTS VariableConfiguracion(VariableConfiguracionId INTEGER PRIMARY KEY, Nombre TEXT, Valor TEXT, Tipo TEXT, NombreCodigo INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.configuration.forEach(element=>{
        db.executeSql('INSERT INTO VariableConfiguracion VALUES(NULL,?,?,?,?/)',[element.Nombre,element.Valor,element.Tipo,element.NombreCodigo])
        .then(res => {
          console.log(res);
          this.toast.show('Variable Configuracion descargado', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })

      db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosRecientes(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.recientes.forEach(element=>{
        db.executeSql('INSERT INTO AnunciosRecientes VALUES(NULL,?,?,?,?,?,?/)',[element.Titulo,element.Descripcion,element.NombreContacto,element.TelefonoContacto,element.CorreoContacto,element.Precio,element.IsActivo, element.IsVisible, element.FechaCreacion, element.FechaModificacion, element.ImageContent, element.ImageMimeType, element.ImageName, element.Url, element.Provincia, element.Municipio, element.ProductoNuevo, element.Accion, element.Imagen])
        .then(res => {
          console.log(res);
          this.toast.show('Anuncios Recientes descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })
       

      db.executeSql('CREATE TABLE IF NOT EXISTS TipoOpcion(TipoOpcionId INTEGER PRIMARY KEY, Nombre TEXT, TextoLabel TEXT, Precio TEXT, CantidadFrecuencia INT, MinimoComprar INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.listaTipoOpciones.forEach(element=>{
        db.executeSql('INSERT INTO TipoOpcion VALUES(NULL,?,?,?,?/)',[element.Nombre,element.TextoLabel,element.Precio,element.CantidadFrecuencia,element.MinimoComprar])
        .then(res => {
          console.log(res);
          this.toast.show('TipoOpcion descargado', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })

      

      db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosPopulares(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.populares.forEach(element=>{
        db.executeSql('INSERT INTO AnunciosPopulares VALUES(NULL,?,?,?,?,?,?/)',[element.Titulo,element.Descripcion,element.NombreContacto,element.TelefonoContacto,element.CorreoContacto,element.Precio,element.IsActivo, element.IsVisible, element.FechaCreacion, element.FechaModificacion, element.ImageContent, element.ImageMimeType, element.ImageName, element.Url, element.Provincia, element.Municipio, element.ProductoNuevo, element.Accion, element.Imagen])
        .then(res => {
          console.log(res);
          this.toast.show('Anuncios Populares descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })


    db.executeSql('CREATE TABLE IF NOT EXISTS Anuncios(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT, Etiquetas TEXT, Categoria TEXT,Banner TEXT,OpcionAvanzadas TEXT, IsDestacado INT, Usuario TEXT, AlmacenImagen TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.anuncios.forEach(element=>{
        db.executeSql('INSERT INTO Anuncios VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?/)',[element.Titulo,element.Descripcion,element.NombreContacto,element.TelefonoContacto,element.CorreoContacto,element.Precio,element.IsActivo, element.IsVisible, element.FechaCreacion, element.FechaModificacion, element.ImageContent, element.ImageMimeType, element.ImageName, element.Url, element.Provincia, element.Municipio, element.ProductoNuevo, element.Accion, element.Imagen,element.Etiquetas, element.Categoria,element.Banners,element.OpcionesAvanzadas, element.IsDestacado, element.Usuario, element.AlmacenImagen])
        .then(res => {
          console.log(res);
          this.toast.show('Anuncios descargados', '5000','center').subscribe(toast => {
            console.log(toast);
            this.loadingCtrl.dismiss();
          });
        })
      })
    })

    this.navCtrl.navigateForward('/home')
    this.menus.close()



         
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Descargando Bd...',
      duration: 2000
    });
    setTimeout(()=>{
      this.testconnetion();
    },2000)
    if (this.isConnected){
      return await loading.present();
    }else if (!this.isConnected){
          this.loadingCtrl.dismiss()
    }
    
  }

  
}
