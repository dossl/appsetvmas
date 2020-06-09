import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, Platform, PopoverController, AlertController, LoadingController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { SettingsService } from '../../services/settings.service';
import { Etiqueta } from '../../models/etiqueta.model';
import { Categoria } from '../../models/categoria.model';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AnunciosModel } from '../../models/anuncios.model';
import { LocalDataService, StaticData } from '../../services/local-data.service';
import * as _ from 'lodash';
import { Usuario } from '../../models/usuario.model';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { Almacenimagen } from '../../models/almacenimagen.model';
import { File } from '@ionic-native/File/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-add-announce',
  templateUrl: './add-announce.page.html',
  styleUrls: ['./add-announce.page.scss'],
})
export class AddAnnouncePage implements OnInit, AfterViewInit {

  pickAttrs = ['CantidadFrecuencia', 'MinimoComprar', 'NombreCodigo', 'TipoOpcionId', 'TextoLabel', 'Precio'];

  cameraOptions: CameraOptions = {
    quality: 100,
    saveToPhotoAlbum: true,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };

  galeryOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    correctOrientation: true
  };

  AD_TAB = 'AD_TAB';
  OPTIONS_TAB = 'OPTIONS_TAB';
  tab = this.AD_TAB;
  ad: AnunciosModel = AnunciosModel.getEmpty();
  localities = [];
  categories: Array<Categoria> = [];
  configurations = {
    Max_Img_Free: 3
  };
  tags: Array<Etiqueta>;
  actionsAdd: Array<string>;
  options: any = {};
  activeOptions = false;
  currentUser: Usuario;
  mainImage: any;
  loading: HTMLIonLoadingElement;

  @ViewChild('categorySelectAdd', { static: false }) categorySelectAdd: IonicSelectableComponent;
  @ViewChild('municipioSelectAdd', { static: false }) municipioSelectAdd: IonicSelectableComponent;

  payOptions = {
    destacado: {
      CantidadDias: 1,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'DESTACADO'
    },
    masEtiquetas: {
      CantidadDias: 1,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'ETIQUETAS'
    },
    autorenovar: {
      CantidadDias: 1,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'AUTO_24'
    },
    web: {
      CantidadDias: 1,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'ENLACE_WEB'
    },
    masImages: {
      CantidadDias: 1,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'IMG_ADI'
    },
    bannnerSuperior: {
      CantidadDias: 1,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'BAN_SUP'
    },
    bannerInferior: {
      CantidadDias: 1,
      IsActivo: false,
      Precio: null,
      NombreCodigo: 'BAN_INF'
    }
  };

  constructor(
    public service: AnuncioService,
    private servCo: SettingsService,
    public navCtrl: NavController,
    public platform: Platform,
    private localService: LocalDataService,
    private alertCtrl: AlertController,
    private camera: Camera,
    private file: File,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  segmentChanged(ev: any) {
    if (ev.detail.value === this.OPTIONS_TAB && !this.checkConditionsTab()) {
      return;
    }
    this.tab = ev.detail.value;
  }

  async presentAlertConfirm(code) {
    const alert = await this.alertCtrl.create(_.merge({ buttons: ['OK'] }, environment.textsOptions[code]));
    alert.present();
  }

  async addTag() {
    const alert = await this.alertCtrl.create({
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'light',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Adicionar',
          cssClass: 'primary',
          handler: (values) => {
            this.ad.Etiquetas.push(values.tag);
          }
        }
      ],
      inputs: [{
        name: 'tag',
        type: 'text',
        placeholder: 'Nombre'
      }],
      header: 'Adicionar Etiqueta'
    });
    alert.present();
  }

  changeAuto(ev) {
    this.payOptions.autorenovar = _.merge(this.payOptions.autorenovar, _.pick(this.options[ev.detail.value],
      this.pickAttrs));
    console.log(this.payOptions);
  }

  changeMyWeb(ev) {
    if (ev.detail.checked) {
      // tslint:disable-next-line: no-string-literal
      this.payOptions.web = _.merge(this.payOptions.web, _.pick(this.options['MI_WEB'], this.pickAttrs));
    } else {
      // tslint:disable-next-line: no-string-literal
      this.payOptions.web = _.merge(this.payOptions.web, _.pick(this.options['ENLACE_WEB'], this.pickAttrs));
    }
    console.log(this.payOptions);
  }

  async presentLoading(callback) {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Por favor, espere...'
    });
    await this.loading.present();
    callback();
  }

  checkConditionsTab() {
    return true;
  }

  ngAfterViewInit() {
    this.presentLoading(() => {
      _.each(_.clone(this.servCo.getProviciasAll()), (prov) => {
        _.each(prov.Municipios, (municipio) => {
          municipio.provincia = prov;
          this.localities.push(municipio);
        });
      });

      this.currentUser = this.service.getLocalCurrentUser();
      if (!this.currentUser) {
        this.service.getGuest().then(user => this.currentUser = user);
      }

      this.localService.getData((data: StaticData) => {
        this.categories = _.clone(data.categories);
        this.configurations = _.clone(data.configurations);
        if (this.loading) {
          this.loading.dismiss();
        }
      });
      this.actionsAdd = _.clone(this.servCo.getAccionesAnuncio());
      this.service.getTipoOpcions('', '', 'asc', 1, 5000).then(options => {
        for (const o of options) {
          this.options[o.NombreCodigo] = o;
        }
        console.log(this.options);

        for (let op of _.values(this.payOptions)) {
          op = _.merge(op, _.pick(this.options[op.NombreCodigo], this.pickAttrs));
        }
      });
    });
  }

  municipioChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (event.value) {
      this.ad.Municipio = event.value.Nombre;
      this.ad.Provincia = event.value.provincia.Nombre;
    }
  }

  categoryChange(event: {
    component: IonicSelectableComponent,
    value: Categoria
  }) {
    const cat: Categoria = _.clone(event.value);
    cat.Etiquetas = [];
    this.ad.Categoria = cat;
    this.presentLoading(() => {
      this.localService.getEtiquetasByCategoria(cat.CategoriaId).then((tags) => {
        this.tags = tags;
        this.loading.dismiss();
      });
    });
  }

  clear() {
    this.municipioSelectAdd.clear();
    this.categorySelectAdd.clear();
    this.tags = [];
  }
  async save() {
    this.ad.Usuario = this.currentUser;
    this.ad.FechaCreacion = new Date();
    this.ad.FechaModificacion = new Date();
    console.log(this.ad);
    const res = await this.service.insertarAnuncio(this.ad);
    alert(JSON.stringify(res));
    // alert('ok');
    this.navCtrl.navigateForward('/home');
  }

  mainPhoto(option: CameraOptions) {
    const mainOptions = _.merge(option, {
      targetWidth: 166,
      targetHeight: 322
    });
    this.camera.getPicture(mainOptions).then((imageData) => {
      this.mainImage = null;
      this.mainImage = 'data:image/jpeg;base64,' + imageData;
      this.ad.ImageContent = this.mainImage;
      this.ad.ImageName = new Date().getTime() + '.jpg';
      this.ad.ImageMimeType = 'image/jpeg';
    }, (err) => {
      console.log(err);
    });
  }

  removeMainPhoto() {
    this.mainImage = null;
    delete this.ad.ImageContent;
    delete this.ad.ImageName;
    delete this.ad.ImageMimeType;
  }

  freeAditionalPhoto(option) {
    this.camera.getPicture(option).then((imageData) => {
      const data = 'data:image/jpeg;base64,' + imageData;
      const image = new Almacenimagen(0, data, data, 'image/jpeg', new Date().getTime() + '.jpg', 0, true);
      this.ad.AlmacenImagen.push(image);
    }, (err) => {
      console.log(err);
    });
  }

  removeFreeAditionalPhoto(imageName) {
    const images = [];
    for (const image of this.ad.AlmacenImagen) {
      if (image.ImageName !== imageName) {
        images.push(image);
      }
    }
    this.ad.AlmacenImagen = images;
  }

  calculate() {
    let total = 0;
    for (const op of _.values(this.payOptions)) {
      if (op.IsActivo && op.CantidadDias > 0) {
        total += op.CantidadDias * op.Precio;
      }
    }
    return total;
  }


}
