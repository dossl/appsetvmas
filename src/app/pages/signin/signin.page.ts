import { Component, OnInit } from '@angular/core';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { ToastController, NavController, PopoverController, Platform } from '@ionic/angular';
import { Usuario } from '../../models/usuario.model';
import { RestoreAccountPage } from '../restore-account/restore-account.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  email: any;
  password: any;
  isConnected = false;

  usercurrent: Usuario;

  savelog = true;

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
  }

  ngOnInit() {
  }

  testconnetion() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        this.presentToast('Por favor enciende tu conexión a Internet');
      }
    });
  }

  signin() {
    if (!this.isConnected) {
      this.presentToast('Por favor enciende tu conexión a Internet');
      return;
    }
    this.servAnuncio.login(this.email, this.password).then(res => {
      this.navCtrl.navigateForward('/virtual-office');
    }).catch(res => {
      this.presentToast('Correo o contraseña incorrecta');
    });
  }

  async restore() {
    this.navCtrl.navigateForward('/restore-account');
  }

  register() {
    this.navCtrl.navigateForward('/signup');
  }

  async presentToast(message: string) {
    const toast = await this.toastr.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

  ionViewWillEnter() {
    this.testconnetion();
  }

}
