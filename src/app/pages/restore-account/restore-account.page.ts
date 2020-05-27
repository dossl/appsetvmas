import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, PopoverController,Platform } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'


@Component({
  selector: 'app-restore-account',
  templateUrl: './restore-account.page.html',
  styleUrls: ['./restore-account.page.scss'],
})
export class RestoreAccountPage implements OnInit {

  correo:any
  isConnected = false
  constructor(
    private toastr: ToastController,
    private servAnuncio: AnuncioService,
     private networkService: NetworkService,
     public navCtrl: NavController,
     public network: Network,
     private insomnia: Insomnia,
     public platform: Platform, public splashscreen: SplashScreen,
     private modal: PopoverController
  ) { 
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
   })*/
  }

  ngOnInit() {
    this.testconnetion()
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
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


  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
  }

  restore(){
    this.servAnuncio.recuperar(this.correo).then(res=>{
      this.presentToast('Ud ha recibido un correo, por favor recupere su cuenta. Recuperar cuenta');
      this.modal.dismiss();
      console.log(res)
    }).catch(error=>{
      this.presentToast('No existe ningún usuario registrado con ese correo. Recuperar cuenta');
    })
  }

  async presentToast(message: string){
    const toast = await this.toastr.create({
      message,
      duration: 15000
    });
    return await toast.present();
  }

  async cancel(){
    const modal = await this.modal.getTop()
    modal.dismiss();
  }

}
