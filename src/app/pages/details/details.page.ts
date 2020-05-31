import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { PopoverController, NavParams, LoadingController, Platform, ModalController, IonSelect, ToastController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { AnunciosModel } from '../../models/anuncios.model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Etiqueta } from '../../models/etiqueta.model';
import { AnuncioetiquetaModel } from '../../models/anuncioetiqueta.model';
import { Usuario } from '../../models/usuario.model';
import { TipoOpcionModel } from '../../models/tipo-opcion.model';
import { NetworkService } from '../../services/network.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ReportPopoverPage } from '../report-popover/report-popover.page';
import { LocalDataService, StaticData } from '../../services/local-data.service';
import { MotivoDenuncia } from '../../models/motivo-denuncia.model';
import { Denuncia } from '../../models/denuncia.model';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {

  moment = moment;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 3,
    loop: true,
    centeredSlides: true,
  };
  isConnected: boolean;
  currentUser: Usuario;
  anuncio: AnunciosModel;
  customAlertOptions: any = {
    header: 'Denunciar este anuncio',
    subHeader: 'Seleccione un motivo',
    translucent: true
  };
  reasons: MotivoDenuncia[];
  reported = false;

  @ViewChild('reportSelect', { static: false }) reportSelect: IonSelect;

  constructor(
    public popover: PopoverController, public network: Network, private service: AnuncioService,
    public loadingCtrl: LoadingController, private networkService: NetworkService, private localService: LocalDataService,
    public platform: Platform, private router: Router, private socialSharing: SocialSharing,
    public toastController: ToastController, private photoViewer: PhotoViewer) {
    if (_.get(this.router.getCurrentNavigation(), 'extras.state')) {
      // this.anuncio = JSON.parse('{"AnuncioId":120,"Titulo":"Coles","Accion":"Vendo","Descripcion":"Coles de varios tipos  y colores. $3.00 pesos la libra.","NombreContacto":"Pedro el colero","TelefonoContacto":"14146146146","CorreoContacto":"bla@bla.com","Precio":3,"IsVisible":true,"IsActivo":true,"Provincia":"Mayabeque","Municipio":"Bejucal","FechaCreacion":"2020-05-17T23:20:06.9061615","FechaModificacion":"2020-05-17T23:37:02.5987605","ImageName":"f439fea1-db46-430b-9bf0-7b3eb12de89c.jpg","ImageContent":"","ImageMimeType":"image/jpeg","Url":"","IsDestacado":true,"IsWeb":false,"Tipo":"Avanzado","ProductoNuevo":false,"ContadorView":9,"Usuario":{"UsuarioId":410,"Correo":"user3@softwaresinlimite.com","Url":null,"Telefono":"13446134","Edad":null,"Direccion":null,"Municipio":null,"Provincia":null,"Rol":"Cliente","Puntos":9721,"CantReferidos":0,"Activo":false,"Bloqueado":false,"Anfitrion":"00A5","Visible":false,"Clase":null,"Codigo":"0035","FechaCreacion":"2020-05-17T20:00:39.6259573","FechaUltimaEntrada":"0001-01-01T00:00:00","FechaUltimoAnuncio":"2020-05-18T03:19:30.243"},"AlmacenImagen":[{"AlmacenImagenId":190,"Imagen":null,"ImageContent":"","ImageMimeType":"image/jpeg","ImageName":"57bc0a1c-c873-4ee0-bf11-e3467f9a2258.jpg","AnuncioId":120,"IsFree":true},{"AlmacenImagenId":191,"Imagen":null,"ImageContent":"","ImageMimeType":"image/jpeg","ImageName":"e1d09cb3-dc1d-4ee4-990c-64f11f3ff7f2.jpg","AnuncioId":120,"IsFree":true}],"Etiquetas":[{"EtiquetaId":465,"Nombre":"comida","CantUsada":4,"IsFree":true,"Categorias":[]},{"EtiquetaId":463,"Nombre":"vegetales","CantUsada":4,"IsFree":true,"Categorias":[]},{"EtiquetaId":461,"Nombre":"fresca","CantUsada":4,"IsFree":true,"Categorias":[]}],"Categoria":{"CategoriaId":20,"Nombre":"Otros productos y servicios","ImageName":"bb349c87-8296-4cb8-bf73-5d1965ad6a32.jpg","ImageContent":"","ImageMimeType":"image/jpeg","CantAutoRenovables":0,"Etiquetas":[{"EtiquetaId":465,"Nombre":"comida","CantUsada":4,"IsFree":false,"Categorias":[]}]},"OpcionesAvanzadas":[{"OpcionAvanzadaId":154,"TextoLabel":"Destacado","NombreCodigo":"DESTACADO","Precio":1,"CantidadFrecuencia":1,"MinimoComprar":0,"CantidadDias":1,"FechaDesactivacion":"2020-05-18T23:37:02.7215332","IsActivo":true,"AnuncioId":120,"TipoOpcionId":1},{"OpcionAvanzadaId":155,"TextoLabel":"Autorrenovable 24 horas","NombreCodigo":"AUTO_24","Precio":8,"CantidadFrecuencia":7,"MinimoComprar":0,"CantidadDias":1,"FechaDesactivacion":"2020-05-18T23:37:02.7239418","IsActivo":true,"AnuncioId":120,"TipoOpcionId":3},{"OpcionAvanzadaId":156,"TextoLabel":"Banner inferior","NombreCodigo":"BAN_INF","Precio":70,"CantidadFrecuencia":10,"MinimoComprar":0,"CantidadDias":2,"FechaDesactivacion":"2020-05-19T23:37:02.7262413","IsActivo":true,"AnuncioId":120,"TipoOpcionId":10},{"OpcionAvanzadaId":157,"TextoLabel":"Banner superior","NombreCodigo":"BAN_SUP","Precio":150,"CantidadFrecuencia":30,"MinimoComprar":0,"CantidadDias":2,"FechaDesactivacion":"2020-05-19T23:37:02.7279107","IsActivo":true,"AnuncioId":120,"TipoOpcionId":11}],"Banners":[{"BannerId":187,"Nombre":null,"Url":null,"Tipo":"Inferior","CantidadDias":2,"AnuncioId":120,"IsActivo":true,"ImageContent":"","ImageMimeType":"image/jpeg","ImageName":"f439fea1-db46-430b-9bf0-7b3eb12de89c.jpg","FechaCreacion":"2020-05-18T03:27:39.016","FechaUltView":null,"FechaDesactivacion":null},{"BannerId":188,"Nombre":"","Url":"","Tipo":"Superior escritorio","CantidadDias":4,"AnuncioId":120,"IsActivo":true,"ImageContent":"","ImageMimeType":"image/jpeg","ImageName":"a520f3d7-dc39-44f2-bf86-3c56122b53d5.banners.jpg","FechaCreacion":"2020-05-18T03:36:45.163","FechaUltView":null,"FechaDesactivacion":null},{"BannerId":189,"Nombre":"","Url":"","Tipo":"Superior movil","CantidadDias":4,"AnuncioId":120,"IsActivo":true,"ImageContent":"","ImageMimeType":"image/jpeg","ImageName":"564252d3-3e77-472c-90f9-21d25d05049d.jpg","FechaCreacion":"2020-05-18T03:36:45.163","FechaUltView":null,"FechaDesactivacion":null}],"Imagen":"data:image/jpeg;base64,"}');
      this.anuncio = _.get(this.router.getCurrentNavigation(), 'extras.state.ad');
    }
  }

  checkConnetion() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  ionViewWillEnter() {
    this.checkConnetion();
    this.localService.getData((data: StaticData) => {
      this.reasons = data.reportReasons;
    });
    this.service.getCurrentUser().then((user: Usuario) => {
      this.currentUser = user;
    });
  }

  async presentPopover(ev: any) {
    this.reportSelect.open(ev);
  }

  ionChangeReport(ev) {
    if (!this.isConnected) {
      this.showMessage('Por favor verifique la conexión y vuelva a intentarlo.');
      return;
    }
    const report = new Denuncia(0, 'En Revisión', new Date(), new Date(),
      ev.detail.value, this.currentUser.UsuarioId, this.anuncio.AnuncioId);
    this.service.reportAd(report).then((res) => {
      this.showMessage('Su denuncia ha sido procesada satisfactoriamente.');
      this.reported = true;
    });
  }

  async showMessage(message) {
    const toast = await this.toastController.create({
      message,
      duration: 10000,
    });
    toast.present();
  }

  sendShare(titulo?, id?) {
    const url = 'https://setvmas.com/#/detalles-anuncio/' + id;
    this.socialSharing.share(titulo, titulo, null, url);
  }

  openPhoto(name) {
    this.photoViewer.show(`https://setvmas.com/api/uploads/almacen/${name}`);
  }

}
