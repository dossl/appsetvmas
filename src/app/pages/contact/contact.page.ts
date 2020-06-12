import { Component, OnInit, Renderer } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { AnunciosModel } from '../../models/anuncios.model';
import { SettingsService } from '../../services/settings.service';
import { AnuncioService } from '../../services/anuncio.service';
import { NetworkService } from '../../services/network.service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Toast } from '@ionic-native/toast/ngx';
import { PaginasEstaticasModel } from '../../models/paginas-estaticas.model';
import { Banner } from '../../models/banner.model';
import { Usuario } from '../../models/usuario.model';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    slidePerView: 1,
    speed: 400,
    autoplay: true,
    enablekeyboardcontroll: true
  };
  nube = 'cloud-outline';
  isConnected = false;
  barnerSuperior: Banner[];
  barnerInferior: Banner[];

  txtbuscar = '';
  displayImage: any;
  displayImageSuperior: any;
  displayImageInferior: any;
  bocina = false;
  nombre: any;
  email: any;
  asunto: any;
  texto: any;
  base64: any;
  arrow = 'arrow-dropup';
  menus = false;
  currentUser: Usuario;
  nameUser: any;
  WifiWizard2: any;
  formData: PaginasEstaticasModel = new PaginasEstaticasModel(0, '', '');

  constructor(
    private toast: Toast,
    private servAnuncio: AnuncioService,
    private networkService: NetworkService) {
  }

  ngOnInit() {
    this.checkConnetion(() => {
      if (this.isConnected) {
        this.servAnuncio.getPaginasEstaticasByid(5).then(res => {
          this.formData = res as PaginasEstaticasModel;
          console.log(this.formData);
        });
      } else {
        this.formData = {
          Contenido: 'Para contactar directamente al equipo de trabajo y administración Setvmas, ' +
            'el sitio de los anuncios clasificados de Cuba.',
          PaginasEstaticasId: 5,
          Titulo: 'Contáctanos'
        };
      }
    });
  }

  checkConnetion(callback = () => { }) {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      callback();
    });
  }


  ionViewWillEnter() {
  }

  send(nombre, email, asunto, texto) {
    console.log('send data');
    this.servAnuncio.enviarCorreo(nombre, email, asunto, texto).then(res => {
      console.log(res);
      this.toast.show('Correo enviado', '5000', 'center').subscribe(toast => {
        console.log(toast);
      });
    });
  }

}
