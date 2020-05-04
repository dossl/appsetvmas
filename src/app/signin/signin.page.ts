import { Component, OnInit } from '@angular/core';
import { AnuncioService } from '../services/anuncio.service';
import { NetworkService } from '../services/network.service';
import { ToastController, NavController, PopoverController,Platform } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';
import { RestoreAccountPage } from '../restore-account/restore-account.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  email:any
  password:any
  isConnected = false;

  usercurrent: Usuario

  savelog =true

  constructor(
    private toastr: ToastController,
    private servAnuncio: AnuncioService,
     private networkService: NetworkService,
     public navCtrl: NavController,
     public network: Network,
     private insomnia: Insomnia,
     private modal: PopoverController,
     public platform: Platform, public splashscreen: SplashScreen,
  ) { 
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
    })*/
  }

  ngOnInit() {
    this.testconnetion();
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
  }

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
          console.log('Por favor enciende tu conexión a Internet');
          this.presentToast('Por favor enciende tu conexión a Internet');
      }
    });
  }

  savelogin(){
     if (this.savelog === true){
        localStorage.setItem("email",this.email)
        localStorage.setItem("password",this.password)
     }
  }

  sigin(){

    this.servAnuncio.login(this.email, this.password).then(res=>{
        this.navCtrl.navigateForward('/virtual-office')
    }).catch(res=>{
      this.presentToast('Correo o contraseña incorrecta');
    })
    
  }

  async restore(){
   // this.navCtrl.navigateForward('/restore-account')
      const modal = await this.modal.create({
        component: RestoreAccountPage,
        animated: true,
        backdropDismiss: false
      });
      return await modal.present();
  }

  register(){
    this.navCtrl.navigateForward('/signup')
  }
  async presentToast(message: string){
    const toast = await this.toastr.create({
      message,
      duration: 2000
    });
    return await toast.present();
  }

  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
  }

}
