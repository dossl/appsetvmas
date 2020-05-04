import { Component, OnInit, Renderer } from '@angular/core';
import { NavController,Platform, AlertController } from '@ionic/angular';
import { AnunciosModel } from '../models/anuncios.model';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { AnuncioService } from '../services/anuncio.service';
import { NetworkService } from '../services/network.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Toast } from '@ionic-native/toast/ngx';
import { PaginasEstaticasModel } from '../models/paginas-estaticas.model';
import { Banner } from '../models/banner.model';
import { Usuario } from '../models/usuario.model';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  slideOpts = {
    initialSlide:1,
    slidePerView:1,
    speed: 400,
    autoplay: true,
    enablekeyboardcontroll: true
  }
  nube = "cloud-outline"
  isConnected = false;
  barnerSuperior: Banner[];
  barnerInferior: Banner[];
  
  txtbuscar =''
  displayImage:any 
  displayImageSuperior:any 
  displayImageInferior:any 
  bocina = false;
  nombre:any
  email:any
  asunto:any
  texto:any
  base64:any
  arrow = 'arrow-dropup';
  menus = false;
  currentUser: Usuario
  nameUser:any
  WifiWizard2: any;
  formData: PaginasEstaticasModel = new PaginasEstaticasModel( 0, '', '' ) ;

  constructor(public navCtrl: NavController,public render: Renderer,private alertCtrl: AlertController,private insomnia: Insomnia,public network: Network,private toast: Toast,private servCo: ConfiguracionesService, private servAnuncio: AnuncioService, private networkService: NetworkService,private sqlite: SQLite,private sanitizer: DomSanitizer,public platform: Platform, public splashscreen: SplashScreen) { 
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
   })*/
  }

  ngOnInit() {
   //this.base64 = this.sanitizer.bypassSecurityTrustUrl(";base64,")
   this.testconnetion()
   this.loadBanner()
   this.insomnia.keepAwake().then(()=>{
    console.log('success')
   })
    /*this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    if(this.currentUser){
      let index = this.currentUser.Correo.indexOf("@");
      if(index !== -1){
         this.nameUser = this.currentUser.Correo.substr(0,index);
      }
      console.log(this.currentUser)
    }*/
    const id = 5
     this.servAnuncio.getPaginasEstaticasByid(id).then(res =>{
      this.formData = res as PaginasEstaticasModel
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


  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
    this.servAnuncio.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
      if(this.currentUser){
       let index = this.currentUser.Correo.indexOf("@");
       if(index !== -1){
          this.nameUser = this.currentUser.Correo.substr(0,index);
       }
       console.log(this.currentUser)
     }
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

  login(){
    this.navCtrl.navigateForward('/signin')
  }

  logout(){
    this.servAnuncio.logout()
  }

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
          console.log('Por favor enciende tu conexión a Internet');
          this.nube = "cloud-outline"
          
      }else{
        this.nube = "cloud-done"
      }
    });
  }


  loadBanner(){
    if (this.isConnected){
      this.servAnuncio.getBannerSuperior().then(data=>{
        this.barnerSuperior = data as Banner[];
        this.barnerSuperior.forEach(element=>{
          this.displayImageSuperior = this.sanitizer.bypassSecurityTrustUrl("data:" + element.ImageMimeType + ';base64,' + element.ImageContent)
        })
        console.log(data)
      })
      this.servAnuncio.getBannerInferior().then(data=>{
        this.barnerInferior = data as Banner[];
        this.barnerInferior.forEach(element=>{
          this.displayImageInferior = this.sanitizer.bypassSecurityTrustUrl("data:" + element.ImageMimeType + ';base64,' + element.ImageContent)
        })
       console.log(data)
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
          this.barnerSuperior.forEach(element=>{
            this.displayImageSuperior = this.sanitizer.bypassSecurityTrustUrl("data:" + element.ImageMimeType + ';base64,' + element.ImageContent)
          })
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
          this.barnerInferior.forEach(element=>{
            this.displayImageInferior = this.sanitizer.bypassSecurityTrustUrl("data:" + element.ImageMimeType + ';base64,' + element.ImageContent)
          })
        }).catch(e => console.log(e));
      })
    }
    
  }

  onNotificate(){
    if(this.bocina === false){
      this.bocina = true;
    }else if (this.bocina === true){
       this.bocina = false;
       this.onAnnounce();
    }
    console.log(this.bocina)
  }


  async onAnnounce(){
    console.log("Announce")
    this.navCtrl.navigateForward('/add-announce')
  }

  send(nombre,email,asunto,texto){
      console.log("send data")
      this.servAnuncio.enviarCorreo(nombre,email,asunto,texto).then(res=>{
        console.log(res);
            this.toast.show('Correo enviado', '5000','center').subscribe(toast => {
              console.log(toast);
            });
      })
  }

  cancel(){
    this.navCtrl.navigateForward('/home')
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
  
  contacto(){
    this.navCtrl.navigateForward('/contact')
  }

  search(){
    this.navCtrl.navigateForward('/search')
  }
  

}
