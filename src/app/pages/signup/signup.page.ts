import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { ToastController, NavController, PopoverController,Platform } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { LectorPage } from '../lector/lector.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  anfitrion: any
  email:any
  password:any
  confirmpassword:any
  telephone:any
  catcha:any 
  isConnected = false
  error = false

  @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;
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
    this.testconnetion()
    this.addRecaptchaScript();
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
  }

  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
  }


  confirmPassword(){
       if (this.password !== this.confirmpassword){
         this.error = true;
       }else{
         this.error = false
       }
  }

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
          console.log('Por favor enciende tu conexión a Internet');
      }else{
        
      }
    });
  }


  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      this.renderReCaptcha();
    }

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));

  }
  renderReCaptcha() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': '6LePbq4UAAAAAPqwJU8u5g1Of1TIEMyoPpJQpyaD',
      //'sitekey': '6LdoH8YUAAAAAEkXuzxYcO_vyn6fqxDFRhiSKgBt',
      'callback': (response) => {
      }
    });
  }

  register(){
    this.servAnuncio.register(this.email,this.password,this.anfitrion,this.telephone).then(res=>{
      console.log(res)
      this.presentToast('Ud ha recibido un correo, por favor verifique su cuenta. Registrarse');
      this.navCtrl.navigateForward('/home')
    }).catch(error=>{
       this.presentToast('Ya existe un usuario registrado con ese correo, Registrarse');
    })
  }

  async presentToast(message: string){
    const toast = await this.toastr.create({
      message,
      duration: 15000
    });
    return await toast.present();
  }

  async anfitrions(){
    const modal = await this.modal.create({
      component: LectorPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  cancel(){
    this.navCtrl.navigateForward('/signin')
  }

}
