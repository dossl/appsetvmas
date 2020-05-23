import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { NavController, PopoverController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { AddAnnouncePage } from '../add-announce/add-announce.page';
import { AnuncioService } from '../services/anuncio.service';
import { AnunciosModel } from '../models/anuncios.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { NetworkService } from '../services/network.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SellPointPage } from '../sell-point/sell-point.page';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { QrPage } from '../qr/qr.page';
import {timer} from 'rxjs/observable/timer'
import { Banner } from '../models/banner.model';
import { Usuario } from '../models/usuario.model';
import { VariableConfiguracion } from '../models/variable-configuracion.model';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { element } from 'protractor';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'




@Component({
  selector: 'app-virtual-office',
  templateUrl: './virtual-office.page.html',
  styleUrls: ['./virtual-office.page.scss'],
})
export class VirtualOfficePage implements OnInit {

   TIME_INTERVAL = 30000;
  nuevo: any;
  precio: any
  titulo: any
  nombre:any
  telefono:any
  email:any
  municipio:any
  provincia:any
  images:any
  etiqueta:any
  accion:any
  texto:any
  selectaccion:any
  selectprovincia:any
  selectmunicipio:any
  destacado:any
  masetiqueta:any
  autorrenovable:any
  frecuencia:any
  web:any
  url:any
  webanuncio:any
  nombreimagen:any
  imagenadicional:any
  imagenbarnerinferior:any
  imagenbarnersuperior:any
  diaspagardestacado:any
  diaspagardescribe:any
  diaspagarautorrenovable:any
  diaspagarweb:any
  diaspagarimagenadicional:any
  diaspagarbarner:any
  diaspagarbarnersuperior:any
  base64:any
  WifiWizard2: any;
  compras = 0
  
  nube = "cloud-outline"
  isConnected = false;

  slideOpts = {
    initialSlide:1,
    slidePerView:1,
    speed: 400,
    autoplay: true,
   enablekeyboardcontroll: true
  }

  shownGroup = null;
  shownGroup1 = null;
  icon = 'arrow-dropdown'
  icon1 = 'arrow-dropdown'

  anunciolist: any;
  barner: any;
  barnerSuperior: Banner[];
  barnerInferior: Banner[];
  displayImageSuperior:any 
  displayImageInferior:any 

  anuncio: AnunciosModel
  anuncioborrador: AnunciosModel[] = []

  arrow = 'arrow-dropup';
  menus = false;

  bocina = false;
  group = false
  group1 = false

  category: any

  borrador = false
  currentUser: Usuario

  codigo:any
  cantReferidos:any
  iduser:any
  precio_Punto:any
  clase:any
  acumuladoPuntos:any
  nameUser:any

  constructor(public navCtrl: NavController,public render: Renderer,private insomnia: Insomnia,public network: Network,private service: AnuncioService, private sqlite: SQLite, private networkService: NetworkService,private sanitizer: DomSanitizer,private modal: PopoverController,public toastCtrl: ToastController,
    public platform: Platform, public splashscreen: SplashScreen,
    public loadingCtrl: LoadingController,private alertCtrl: AlertController,private clipboard: Clipboard) { 
      /*this.platform.ready().then(()=>{
        this.splashscreen.hide();
     })*/  
    this.barner = [
      {image: 'assets/imgs_test/slide_down1.png',category:'popular'},
      {image: 'assets/imgs_test/slide_down2.png',category:'popular'},
    ]
  // this.serv.getAnunciosV2('','','asc',1,50).then(res => {this.anuncio = res as AnunciosModel[]});
  // console.log(this.anuncio)
    this.category =  [
      {
        name: 'Lista de Anuncios',
      }
    ]

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
    
    if(this.isConnected){
       this.actualizar()
       this.loadBanner()
    }
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
  }

  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
    this.service.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
      if(this.currentUser){
       let index = this.currentUser.Correo.indexOf("@");
       this.codigo = this.currentUser.Codigo
       this.cantReferidos = this.currentUser.CantReferidos
       this.iduser = this.currentUser.UsuarioId
       this.clase = this.currentUser.Clase
       this.acumuladoPuntos = this.currentUser.Puntos
       if(index !== -1){
          this.nameUser = this.currentUser.Correo.substr(0,index);
       }
       console.log(this.currentUser)
     }
    })
  }
  actualizar(){
     this.anuncioborrador.forEach(element=>{
      if ((element.OpcionesAvanzadas.length == 0) || (element.Usuario.Puntos < 100)){
        this.service.insertarAnuncio(element).then(data=>{
          console.log(data)
          this.presentToast("!!Actualizando la nube!!");
          if(data){
            this.sqlite.create({
              name: 'setVMas.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              db.executeSql('DELETE * FROM anunciosborrador', [true]).then(res => {
  
              }).catch(e => console.log(e));
            })
          }
        }).catch((error)=>{
          this.presentToast(error.message);
        })
      }
     })
  }
  enlace(){
    let userCodigo = this.codigo
    this.clipboard.copy(userCodigo);
  }


  precio_Puntos(){
    let valor = 'Precio_Puntos'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.precio_Punto = res as VariableConfiguracion;
      console.log(this.precio_Punto)
    }).catch((error)=>{
      this.presentToast(error);
    })
  }
  conection(){
    
    document.getElementById("enable").style.webkitAnimation = "pulse linear .60s"
    document.getElementById("enable").style.animation = "pulse linear .60s"
    if(this.isConnected === false){
      this.WifiWizard2.enableWifi()
      this.nube = "cloud-done"
      this.testconnetion();
      
    }else if(this.isConnected === true){
       this.isConnected = false
       this.nube = "cloud-outline"
       this.WifiWizard2.disableWifi()
    }
    
  }

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
          this.nube = "cloud-outline"
          
      }else{
        this.nube = "cloud-done"
      }
    });
  }

  loadBanner(){
    if (this.isConnected){
      this.service.getBannerSuperior().then(data=>{
        this.barnerSuperior = data as Banner[];
        console.log(this.barnerSuperior)
      }).catch((error)=>{
        this.presentToast(error);
      })
      this.service.getBannerInferior().then(data=>{
        this.barnerInferior = data as Banner[];
        console.log(this.barnerInferior)
      }).catch((error)=>{
        this.presentToast(error);
      })
    }else {
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

  toggleGroup() {
   // this.anunciolist = JSON.parse(JSON.stringify(this.anuncio));
    if (this.group === false) {
        this.icon = 'arrow-dropup';
        this.group = true
        if (this.isConnected){
          this.presentLoading();
          this.loadOnline()
        }  
        
    }else if (this.group === true) {
      this.icon = 'arrow-dropdown';
      this.group = false
    }
  };

  toggleGroup1() {
    
     if (this.group1 === false) {
      this.icon1 = 'arrow-dropup';
      this.group1 = true
      this.presentLoading();
      this.loadLocal();

     }else if (this.group1 === true) {
      this.icon1 = 'arrow-dropdown';
      this.group1 = false
     }
   };


   loadOnline(){
    setTimeout(()=>{
      this.service.getAnuncios('', '', 'asc', 1, 10).then(data=>{
        this.anuncio = data as AnunciosModel;
        console.log(this.anuncio)
        this.loadingCtrl.dismiss();
      }).catch((error)=>{
       this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
     })
    },180000)     
   }

   loadLocal(){
     
    this.sqlite.create({
      name: 'setVMas.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS anunciosborrador(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT, ListadoEtiquetas TEXT, Categoria TEXT, CategoriaImagen TEXT,Banner TEXT,OpcionAvanzadas TEXT, IsDestacado INT, Usuario TEXT, ImagenesAdicionales TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      db.executeSql('SELECT * FROM anunciosborrador ORDER BY AnuncioId DESC', []).then(res => {
        this.anuncioborrador = res as AnunciosModel[]
        /*this.anuncioborrador = [];
        for(var i=0; i<res.rows.length; i++) {
          this.anuncioborrador.push({AnuncioId:res.rows.item(i).anuncioId,Titulo:res.rows.item(i).titulo,Descripcion:res.rows.item(i).descripcion,NombreContacto:res.rows.item(i).nombreContacto,TelefonoContacto:res.rows.item(i).telefonoContacto,CorreoContacto:res.rows.item(i).correoContacto,Precio:res.rows.item(i).precio,Provincia:res.rows.item(i).provincia,Municipio:res.rows.item(i).municipio,Accion:res.rows.item(i).accion,Imagen:res.rows.item(i).imagen,Categoria:res.rows.item(i).categoria})
          this.loadingCtrl.dismiss();
        }*/
      }).catch(e => console.log(e));
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

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  isGroupShown1(group) {
    return this.shownGroup1 === group;
  };
   

  async onNotificate(){
    if(this.bocina === false){
      this.bocina = true;
    }else if (this.bocina === true){
       this.bocina = false;
      await this.onAnnounce();
    }
    console.log(this.bocina)
    //this.anunciolist = JSON.parse(JSON.stringify(this.anuncio));
  }


   onAnnounce(){
    console.log("Announce")
    this.navCtrl.navigateForward('/add-announce')
  }


  
  

  onEditAnnounce(id:any){
        this.service.setAnuncioId(id)
        this.navCtrl.navigateForward('/edit-announce')
  }

  onDeleteAnnounce(anuncioId){
    if (this.isConnected){
      this.service.deleteAnuncio(anuncioId).then(data=>{
        this.anuncio = data as AnunciosModel;
        console.log(this.anuncio)
      }).catch((error)=>{
        this.presentToast(error);
      })
      this.loadOnline()
    }  
  }


  onDeleteAnnounceBorrador(anuncioId){
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM anunciosborrador WHERE anuncioId=?', [anuncioId])
        .then(res => {
          console.log(res);
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
      this.loadLocal()
  }


  compra(){
    this.navCtrl.navigateForward('/buy-point')
    this.compras = this.compras + 1
  }

  async vende(){
    const modal = await this.modal.create({
      component: SellPointPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async qr(){
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


  menu(){
    if (this.menus === false){
      this.menus = true
      this.arrow = 'arrow-dropdown'
    }else if(this.menus === true){
      this.menus = false
      this.arrow = 'arrow-dropup'
    }
  }


  inicio(){
    this.navCtrl.navigateForward('/home')
  }
  
  oficina(){
    this.navCtrl.navigateForward('/virtual-office')
  }
  
  ayuda(){
    this.navCtrl.navigateForward('/help')
  }
  search(){
    this.navCtrl.navigateForward('/search')
  }
  
  contacto(){
    this.navCtrl.navigateForward('/contact')
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
     // duration: 3000
    });
    return await toast.present();
  }


  login(){
    this.navCtrl.navigateForward('/signin')
  }

  logout(){
    this.service.logout()
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: '',
      duration: 2000
    });
    return await loading.present();
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
  
  
}
