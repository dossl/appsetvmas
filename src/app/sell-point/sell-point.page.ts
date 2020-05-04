import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController,Platform } from '@ionic/angular';
import { AnuncioService } from '../services/anuncio.service';
import { NetworkService } from '../services/network.service';
import { Usuario } from '../models/usuario.model';
import { PointSell } from '../models/sell-points.model';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'

@Component({
  selector: 'app-sell-point',
  templateUrl: './sell-point.page.html',
  styleUrls: ['./sell-point.page.scss'],
})
export class SellPointPage implements OnInit {

  constructor(private modal: PopoverController,private insomnia: Insomnia,public network: Network,private service: AnuncioService,private networkService: NetworkService,public toastCtrl: ToastController,public platform: Platform, public splashscreen: SplashScreen,) { 
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
   })*/
  }

  nombre:any

  puntos:any
  isConnected = false;

  currentUser: Usuario

  
  ngOnInit() {
    this.testconnetion()
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
    //this.currentUser = JSON.parse(localStorage.getItem("currentuser"))
  }

  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
    this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
  }

  async close() {
    await this.modal.dismiss();
  }


  send(nombre,puntos){
    this.service.sellPoint(this.currentUser.UsuarioId,nombre,puntos).then(res=>{
      console.log(res)
      this.modal.dismiss();
    }).catch(res=>{
      this.presentToast('Por favor no se puede realizar la venta de puntos en estos momentos, compruebe tu conexión a Internet');
    })
  }

  async cancel(){
    const modal = await this.modal.getTop()
    modal.dismiss();
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

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

}
