import { Component, OnInit } from '@angular/core';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { PopoverController,Platform } from '@ionic/angular';
import { NetworkService } from '../../services/network.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'

@Component({
  selector: 'app-lector',
  templateUrl: './lector.page.html',
  styleUrls: ['./lector.page.scss'],
})
export class LectorPage implements OnInit {

  scannedData = null;
  barcodeScannerOptions: BarcodeScannerOptions;

  isConnected = false;
  constructor(private barcodeScanner: BarcodeScanner,private insomnia: Insomnia,public network: Network,private modal: PopoverController,private networkService: NetworkService,public platform: Platform, public splashscreen: SplashScreen,) { 
    
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
  }

  ionViewWillEnter(){
    
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
  }

  async scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        alert("Barcode data " + JSON.stringify(barcodeData));
        this.scannedData = barcodeData.text;
        console.log(this.scannedData)
        localStorage.setItem("qr",JSON.stringify(this.scannedData))
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  async close(){
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
