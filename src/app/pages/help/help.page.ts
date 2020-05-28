import { Component, OnInit, Renderer } from '@angular/core';
import { NavController,Platform, AlertController } from '@ionic/angular';
import { AnunciosModel } from '../../models/anuncios.model';
import { SettingsService } from '../../services/settings.service';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { PaginasEstaticasModel } from '../../models/paginas-estaticas.model';
import { ToastController } from '@ionic/angular';
import { VariableConfiguracion } from '../../models/variable-configuracion.model';
import { Banner } from '../../models/banner.model';
import { Usuario } from '../../models/usuario.model';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';


@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

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
  WifiWizard2: any;
  txtbuscar =''
  displayImage:any 
  displayImageSuperior:any 
  displayImageInferior:any 
  bocina = false;

  arrow = 'arrow-dropup';
  menus = false;
  base64:any

  nosotro:any
  ayudar: VariableConfiguracion

  //ayudar: PaginasEstaticasModel  = new PaginasEstaticasModel(0,'','')
  help = false
  currentUser: Usuario
  nameUser:any

  formData: PaginasEstaticasModel = new PaginasEstaticasModel( 0, '', '' ) ;
  constructor(public navCtrl: NavController,public render: Renderer,private alertCtrl: AlertController,private insomnia: Insomnia,public network: Network,private servCo: SettingsService, private servAnuncio: AnuncioService, private networkService: NetworkService,private sqlite: SQLite,private sanitizer: DomSanitizer,public toastCtrl: ToastController,public platform: Platform, public splashscreen: SplashScreen,
    ) {
      /*this.platform.ready().then(()=>{
        this.splashscreen.hide();
     })*/
     }

  ngOnInit() {
    this.testconnetion();
    this.loadBanner()
    this.base64 = this.sanitizer.bypassSecurityTrustUrl(";base64,")
    /*this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    if(this.currentUser){
      let index = this.currentUser.Correo.indexOf("@");
      if(index !== -1){
         this.nameUser = this.currentUser.Correo.substr(0,index);
      }
      console.log(this.currentUser)
    }*/
    this.ayudas()
    this.insomnia.keepAwake().then(()=>{
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
      }).catch((error)=>{
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      })
      this.servAnuncio.getBannerInferior().then(data=>{
        this.barnerInferior = data as Banner[];
        this.barnerInferior.forEach(element=>{
          this.displayImageInferior = this.sanitizer.bypassSecurityTrustUrl("data:" + element.ImageMimeType + ';base64,' + element.ImageContent)
        })
       console.log(data)
      }).catch((error)=>{
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
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

  termino(){
     const id = 2
     this.servAnuncio.getPaginasEstaticasByid(id).then(res =>{
      this.formData = res as PaginasEstaticasModel
      this.help = false
     }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }
  nosotros(){
    const id = 3
    this.servAnuncio.getPaginasEstaticasByid(id).then(res =>{
     this.formData = res as PaginasEstaticasModel
     this.nosotro = this.sanitizer.bypassSecurityTrustHtml(this.formData.Contenido)
     console.log(this.nosotro)
     this.help = false
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  politicas(){
    const id = 8
    this.servAnuncio.getPaginasEstaticasByid(id).then(res =>{
     this.formData = res as PaginasEstaticasModel
     this.help = false
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  puntos(){
    const id = 6
    this.servAnuncio.getPaginasEstaticasByid(id).then(res =>{
     this.formData = res as PaginasEstaticasModel
     this.help = false
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  respuestas(){
    const id = 4
    this.servAnuncio.getPaginasEstaticasByid(id).then(res =>{
     this.formData = res as PaginasEstaticasModel
     this.help = false
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  

  ayudas(){
    let valor = 'Txt_Ayuda_app'
    this.servAnuncio.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.ayudar = res as VariableConfiguracion;
      this.help = true
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
    /*const id = 1
    this.servAnuncio.getPaginasEstaticasByid(id).then(res =>{
     this.formData = res as PaginasEstaticasModel
     this.help = false
    }).catch((error)=>{
      this.presentToast(error);
    })*/
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
      duration: 3000
    });
    return await toast.present();
  }

  

}
