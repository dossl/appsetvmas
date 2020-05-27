import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams,Platform } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { Usuario } from '../../models/usuario.model';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { NetworkService } from '../../services/network.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'


@Component({
  selector: 'app-masqr',
  templateUrl: './masqr.page.html',
  styleUrls: ['./masqr.page.scss'],
})
export class MasqrPage implements OnInit {

  referido: any
  currentUser: Usuario
  id:any
  encodeData: any;
  barcodeScannerOptions: BarcodeScannerOptions;
  isConnected = false;
  constructor(private modal: PopoverController,private insomnia: Insomnia,public network: Network,private service: AnuncioService,private barcodeScanner: BarcodeScanner,private networkService: NetworkService,public platform: Platform, public splashscreen: SplashScreen,) {
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
    })*/
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
   }

  ngOnInit() {
    this.testconnetion()
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
    //this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    this.service.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
      this.referido = this.currentUser.Codigo
    }) 
    /*this.id = this.currentUser.UsuarioId
    this.service.getUsuarioByid(this.id).then(res=>{
      this.referido = res as Usuario
      console.log(this.referido.Anfitrion)
    }).catch(err=>{
        console.log(err)
    })*/

    /*this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.referido.Anfitrion)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodeData = encodedData;
        },
        err => {
          console.log("Error occured : " + err);
        }
      );*/

  }

  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
    this.service.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
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

}
