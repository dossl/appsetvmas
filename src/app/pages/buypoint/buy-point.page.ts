import { Component, OnInit } from '@angular/core';
import { NavController,Platform } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { ToastController } from '@ionic/angular';
import { VariableConfiguracion } from '../../models/variable-configuracion.model';
import { NetworkService } from '../../services/network.service';
import { Usuario } from '../../models/usuario.model';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'


@Component({
  selector: 'app-buy-point',
  templateUrl: './buy-point.page.html',
  styleUrls: ['./buy-point.page.scss'],
})
export class BuyPointPage implements OnInit {

  inicio = true

  monto:any

  saldo:any
  selectsaldo: any
  telefono:any

  puntos:any

  movil = false
  banco = false
  direc  = false

  precio_Punto:VariableConfiguracion = new VariableConfiguracion(0,'','','','')

  min_Punto_Trans_Bancaria:VariableConfiguracion = new VariableConfiguracion(0,'','','','')

  min_Punto_Saldo_Telefonico:VariableConfiguracion = new VariableConfiguracion(0,'','','','')

  activar_Tran_Bancaria:VariableConfiguracion = new VariableConfiguracion(0,'','','','')

  activar_Tran_Saldo: VariableConfiguracion = new VariableConfiguracion(0,'','','','')
  isConnected = false;

  no_Tarjeta: VariableConfiguracion

  no_Movil: VariableConfiguracion

  currentUser: Usuario

  configMovil: VariableConfiguracion  = new VariableConfiguracion(0,'','','','')

  configBanco: VariableConfiguracion  = new VariableConfiguracion(0,'','','','')

  configDirec: VariableConfiguracion  = new VariableConfiguracion(0,'','','','')
  
  
  
  constructor(public navCtrl: NavController,private insomnia: Insomnia,public network: Network,private service: AnuncioService,public toastCtrl: ToastController,private networkService: NetworkService, public platform: Platform, public splashscreen: SplashScreen
    ) {
      /*this.platform.ready().then(()=>{
        this.splashscreen.hide();
      })*/
     }

 


  ngOnInit() {
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
    this.testconnetion()
    if(this.isConnected){
      this.loadMovil();
      this.loadBanco();
      this.loadDirec();
      this.precio_Puntos();
      this.min_Puntos_Trans_Bancaria()
      this.min_Puntos_Saldo_Telefonico()
      this.activar_Trans_Bancaria()
      this.activar_Trans_Saldo()
     // this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    }
  }

  ionViewWillEnter(){
    //this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    this.service.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
    })
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
  }

  loadMovil(){
    let valor = 'Num_Transf_Saldo'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.configMovil = res as VariableConfiguracion;
      console.log(this.configMovil)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }
  
  loadBanco(){
    let valor = 'Num_Transf_Banco'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.configBanco = res as VariableConfiguracion;
      console.log(this.configBanco)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  loadDirec(){
    let valor = 'Txt_Contac_Direct'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.configDirec = res as VariableConfiguracion;
      console.log(this.configDirec)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  precio_Puntos(){
    let valor = 'Precio_Puntos'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.precio_Punto = res as VariableConfiguracion;
      console.log(this.precio_Punto)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }


  min_Puntos_Trans_Bancaria(){
    let valor = 'Min_Puntos_Trans_Bancaria'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.min_Punto_Trans_Bancaria = res as VariableConfiguracion;
      console.log(this.min_Punto_Trans_Bancaria)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }


  min_Puntos_Saldo_Telefonico(){
    let valor = 'Min_Puntos_Saldo_Telefónico'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.min_Punto_Saldo_Telefonico = res as VariableConfiguracion;
      console.log(this.min_Punto_Saldo_Telefonico)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }


  activar_Trans_Bancaria(){
    let valor = 'Activar_Trans_Bancaria'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.activar_Tran_Bancaria = res as VariableConfiguracion;
      console.log(this.activar_Tran_Bancaria.Valor)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  num_tarjeta(){
    let valor = 'No_Tarjeta'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.no_Tarjeta = res as VariableConfiguracion;
      console.log(this.no_Tarjeta)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }

  num_Movil(){
    let valor = 'No_Movil'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.no_Movil = res as VariableConfiguracion;
      console.log(this.no_Movil)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }


  activar_Trans_Saldo(){
    let valor = 'Activar_Trans_Saldo'
    this.service.getVariableConfiguracionByCodigo(valor).then(res=>{
      this.activar_Tran_Saldo = res as VariableConfiguracion;
      console.log(this.activar_Tran_Saldo.Valor)
    }).catch((error)=>{
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
  }


  optionsFnSaldo() {
    console.log(this.saldo);
    let item = this.saldo;
    this.selectsaldo = item;

    if (this.selectsaldo === 'Num_Transf_Saldo'){
           this.movil = true
           this.banco = false
           this.direc = false
    } else if (this.selectsaldo === 'Num_Transf_Banco'){
         this.banco = true
         this.movil = false
         this.direc = false
    }else if(this.selectsaldo === 'Txt_Contac_Direct'){
         this.direc = true
         this.movil = false
         this.banco = false
    }
  }


  iniciar(){
   /* if(this.inicio === false){
      this.inicio = true;
    }else if (this.inicio === true){
       this.inicio = false;
    }*/
  }

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  cancel(){
    this.navCtrl.navigateForward('/virtual-office')
  }

  send(){
    console.log(this.selectsaldo)
    console.log(this.monto)
    console.log(this.configBanco.Valor)
    console.log(this.configMovil.Valor)
    console.log(this.currentUser.UsuarioId)
    this.service.buyPoint(this.selectsaldo,this.monto,this.configBanco.Valor,this.configMovil.Valor,this.currentUser.UsuarioId).then(res=>{
      console.log(res)
      this.navCtrl.navigateForward('/virtual-office')
    }).catch(err=>{
      this.presentToast('Por favor no se puede realizar la compra de puntos en estos momentos, compruebe tu conexión a Internet');
    })

    /*this.service.buyPoint('Num_Transf_Saldo',10,'555555555','53235750',16).then(res=>{
      console.log(res)
    }).catch(err=>{
      this.presentToast('Por favor no se puede realizar la compra de puntos en estos momentos, compruebe tu conexión a Internet');
    })*/
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

}
