import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, NgZone, OnChanges, SimpleChanges, AfterViewInit  } from '@angular/core';
import { stringify } from 'querystring';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController,NavController, ToastController, Platform, LoadingController, PopoverController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
 
import { finalize } from 'rxjs/operators';
import { AnuncioService } from '../services/anuncio.service';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FormGroup, FormBuilder } from '@angular/forms';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith, take} from 'rxjs/operators';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { AnunciosModel } from '../models/anuncios.model';
import { MunicipiosModel } from '../models/municipios.model';
import { ProvinciasModel } from '../models/provincias.model';
import { Etiqueta } from '../models/etiqueta.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { NetworkService } from '../services/network.service';
import { AnuncioetiquetaModel } from '../models/anuncioetiqueta.model';
import { formatDate } from '@angular/common';
import { Usuario } from '../models/usuario.model';
import { TipoOpcionModel } from '../models/tipo-opcion.model';
import { Opciones } from '../models/opciones.model';
import { CategoriaEtiqueta } from '../models/categoria-etiqueta.model';
import { Categoria } from '../models/categoria.model';
import { BuypointPage } from '../buypoint/buypoint.page';
import { element } from 'protractor';
import { DatePipe } from '@angular/common'
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'
import { VariableConfiguracion } from '../models/variable-configuracion.model';
import { Banner } from '../models/banner.model';
import { Almacenimagen } from '../models/almacenimagen.model';

const STORAGE_KEY = 'my_images';


@Component({
  selector: 'app-add-announce',
  templateUrl: './add-announce.page.html',
  styleUrls: ['./add-announce.page.scss'],
})
export class AddAnnouncePage implements OnInit {
  
  form: FormGroup;

  nuevo = true
  precio: number
  titulo: any
  nombre:any
  telefono:any
  email:any
  municipio:any
  provincia:any
  imagen:any
  //etiqueta:any[] = ['fotografo'];
  etiqueta:Etiqueta[] = []
  arrayetiqueta:Etiqueta[]
  accion:any
  texto:any

  categoria:any
  arraycategoria:Categoria[] = []

  arrayprovincia:any[]
  arraymunicipio:any
  
  selectaccion:any
  selectcategoria:any
  selectprovincia:any
  selectmunicipio:any
  selectfrecuencia:any
  allFruits: string[]

  destacado = false
  //masetiqueta:any[] = ['fotografo'];

  masetiqueta:any
  autorrenovable:any
  frecuencia:any
  web:any
  url:any
  webanuncio:any
  nombreimagen:any
  imagenname:any
  imagenadicional:any
  imagenbarnerinferior:any
  imagenbarnersuperior:any
  diaspagardestacado = 0
  diaspagardescribe = 0
  diaspagarautorrenovable = 0
  diaspagarweb = 0
  diaspagarimagenadicional = 0
  diaspagarbarner =0
  diaspagarbarnersuperior = 0
  

  configAvanzada = false
  icon = 'arrow-dropdown'
  icon1 = 'arrow-dropdown'
  icon2 = 'arrow-dropdown'
  icon3 = 'arrow-dropdown'
  icon4 = 'arrow-dropdown'
  icon5 = 'arrow-dropdown'
  icon6 = 'arrow-dropdown'
  expande = false
  expande1 = false
  expande2 = false
  expande3 = false
  expande4 = false
  expande5 = false
  expande6 = false

  cantidadpuntos = false

  insertar:any

  anuncio: AnunciosModel;
  comprar = false;

 
  cameraOptions: CameraOptions = {
    quality: 100,
    targetWidth: 166,
    targetHeight: 322,
    //allowEdit: true,
    saveToPhotoAlbum: true,
    destinationType: this.camera.DestinationType.DATA_URL,
    //sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  

  public objects:any[];
  public labelAttribute:string;

  images :any = null;
  respData: any;
  platform: any;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<Etiqueta[]>;
 
  formData: AnunciosModel

  etiquetaData: Etiqueta

  isConnected = false;

  allEtiqueta: any 

  //total: number = 8;
  total: number = 0;

  fechaActual: Date;

  diasFinDest: number=0;
  diasFinDesc: number = 0;
  diasFinAuto: number = 0;
  diasFinImg: number = 0;
  diasFinInf: number = 0;
  diasFinSup: number = 0;
  diasFinWeb: number = 0;
  codigoAuto:string;

  usuario: Usuario = new Usuario() 

  comprarPutnos = false;

  currentUser:Usuario
  totalpuntos = 0
  cantpuntosdestacado = 0
  cantpuntosetiquetas = 0
  cantpuntosauto = 0
  cantpuntosweb = 0
  cantpuntosimagenadicional = 0
  cantpuntosbannerinferior = 0
  cantpuntosbannersuperior = 0
  mimeContent = ''

  maxEtiquetas: number = 0;
  maxImgFree: number = 0;
  maxImg: number = 0;
  
  
  listaTipoOpciones: TipoOpcionModel[] = [];
  listaFrecAutoRenovables: any[] = [];

  array: AnunciosModel[] = []


  imageMimeTypeMobil: string = '';
  imageNameMobil: string = '';
  imageMimeTypeInf: string = '';
  imageNameInf: string = '';
  type: any

  bannerMobil: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  
  
  @ViewChild('etiquetaInput', {static: false}) etiquetaInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;


  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath,
    private service: AnuncioService,
    private imagePicker: ImagePicker,
    private crop: Crop,
    private transfer: FileTransfer,
    private formBuilder: FormBuilder,
    private servCo: ConfiguracionesService,
    private sqlite: SQLite,
    private toast: Toast,
    public network: Network,
    private insomnia: Insomnia,
    private networkService: NetworkService,
    private modal: PopoverController,
    public splashscreen: SplashScreen,
    private datePipe: DatePipe,
    public loadingCtrl: LoadingController,
    private filepath: FilePath,


  ) {
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
    })*/
    this.anuncio = new AnunciosModel(0, '', '', '', '',
    '', null, false, false, null, null, '',
    '', '', '', '', '', 0, false, '1',
    '','')
    this.anuncio.Etiquetas = [];
    this.anuncio.OpcionesAvanzadas = [];
    this.anuncio.Banners = [];
    this.anuncio.AlmacenImagen = [];
    this.anuncio.Categoria=new Categoria(0,'','','','',0);
    this.anuncio.ProductoNuevo = true;
    this.url = ''
    this.objects = ['Ropa','Electrodomesticos','Calzado','Computadoras','Moviles','Inmovilario','Alquileres','transporte','Bisuteria','Peluqueria']
    //this.arrayprovincia = this.servCo.getProviciasAll();
    //this.arraymunicipio = this.arrayprovincia[0].Municipios;
    this.arrayprovincia = [
      {nombre:'La Habana',municipio:['Arroyo Naranjo', 'Boyeros', 'Centro Habana',
    'Cerro', 'Cotorro', 'Guanabacoa',
      'Diez de Octubre', 'Habana del Este', 'Habana Vieja',
      'La Lisa','Marianao', 'Playa',
      'Plaza de la Revolución', 'Regla', 'San Miguel del Padrón']},
      {nombre:'Pinar del Río',municipio:[ 'Consolación del Sur', 'Guane', 'La Palma',
      'Los Palacios', 'Mantua', 'Minas de Matahambre',
      'Pinar del Río', 'San Juan y Martínez', 'San Luis',
      'Sandino', 'Viñales']},
      {nombre:'Isla de la Juventud',municipio:[]},
      {nombre:'Artemisa',municipio:['Alquízar', 'Artemisa', 'Bahía Honda',
      'Bauta', 'Caimito',  'Candelaria','Guanajay',
      'Guira de Melena', 'Mariel', 'San Antonio de los Baños',
      'San Cristobal']},
      {nombre:'Mayabeque',municipio:[ 'Batabanó',  'Bejucal', 'Guines',
      'Jaruco', 'Madruga', 'Melena del Sur',
      'Nueva Paz', 'Quivicán', 'San José de las Lajas',
      'San Nicolás de Bari', 'Santa Cruz del Norte']},
      {nombre:'Matanzas',municipio:[ 'Calimete',  'Cárdenas', 'Ciénaga de Zapata',
      'Colón', 'Jaguey Grande', 'Jovellanos', 'Limonar',
      'Los Arabos', 'Martí', 'Matanzas',
      'Pedro Betancourt', 'Perico', 'Unión de Reyes']},
      {nombre:'Villa Clara',municipio:[  'Caibarién', 'Camajuaní', 'Cifuentes',
      'Corralillo','Encrucijada', 'Placetas',
      'Quemado de Guines',  'Ranchuelos', 'Remedios',
      'Sagua la Grande', 'Santa Clara','Santo Domingo']},
      {nombre:'Cienfuegos',municipio:['Abreus', 'Aguada de Pasajeros', 'Cienfuegos',
      'Cruces', 'Cumanayagua', 'Palmira', 'Rodas',
      'Santa Isabel de las Lajas']},
      {nombre:'Sancti Spíritus',municipio:[ 'Cabaiguan', 'Fomento', 'Jatibonico',
      'La Sierpe', 'Sancti Spíritus', 'Taguasco',
      'Trinidad', 'Yaguajay']},
      {nombre:'Ciego de ávila',municipio:[ 'Ciro Redondo', 'Baraguá','Bolivia',
      'Chambas', 'Ciego de ávila', 'Florencia',
      'Majagua', 'Morón', 'Primero de Enero',
      'Venezuela']},
      {nombre:'Camaguey',municipio:[ 'Camaguey', 'Carlos Manuel de Céspedes', 'Esmeralda',
      'Florida', 'Guaimaro', 'Jimaguayú', 'Minas',
      'Najasa', 'Nuevitas', 'Santa Cruz del Sur',
      'Sibanic�', 'Sierra de Cubitas', 'Vertientes']},
      {nombre:'Las Tunas',municipio:[ 'Amancio Rodríguez', 'Colombia', 'Jesús Menéndez',
      'Jobabo', 'Las Tunas', 'Majibacoa', 'Manatí',
      'Puerto Padre']},
      {nombre:'Holguín',municipio:[ 'Antilla', 'B�guanos', 'Banes',
      'Cacocum', 'Calixto García', 'Cueto',
      'Frank País', 'Gibara', 'Holguín', 'Mayarí',
      'Moa', 'Rafael Freyre', 'Sagua de Tánamo',
      'Urbano Noris']},
      {nombre:'Granma',municipio:[ 'Bartolom� Mas�','Bayamo', 'Buey Arriba',
      'Campechuela', 'Cauto Cristo', 'Guisa',
      'Jiguan�', 'Manzanillo', 'Media Luna', 'Niquero',
    'Pil�n', 'R�o Cauto', 'Yara']},
      {nombre:'Santiago de Cuba',municipio:[ 'Contramaestre', 'Guam�', 'Julio Antonio Mella','Palma Soriano', 'San Luis', 'Santiago de Cuba','Segundo Frente', 'Songo la Maya', 'Tercer Frente']},
      {nombre:'Guat�namo',municipio:['Baracoa', 'Caimanera', 'El Salvador','Guant�namo', 'Im�as', 'Mais�', 'Manuel Tames','Niceto P�rez', 'San Antonio del Sur', 'Yateras']},
    ]
    
    this.listaFrecAutoRenovables = this.servCo.getFrecuenciaAutorenovables();
    console.log(this.arrayprovincia)
    /*this.service.getEtiquetas('Nombre','','asc',1,10).then(data=>{
      let arrayEtiqueta:Etiqueta[] = data as Etiqueta[]
      arrayEtiqueta.forEach(ele =>{
        
      })
    }).catch((error)=>{
      console.log('Error',error)
      this.presentToast(error);
    })*/
    this.service.getCategoriaAll('','','asc',1,5000).then(data=>{
      this.arraycategoria = data as Categoria[];
      console.log(this.arraycategoria)
    }).catch((error)=>{
      console.log('Login Incorrect',error)
      this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
    })
    
    /*if (this.isConnected){
          //mode online
        this.service.getEtiquetas('Nombre','','asc',1,10).then(data=>{
          this.etiqueta = data;
          console.log(this.etiqueta)
        })
        this.service.getCategoriaAll('','','asc',1,5000).then(data=>{
          this.categoria = data;
          console.log(this.categoria)
        })
    }*//*else{
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS etiquetas(etiquetaId INTEGER PRIMARY KEY, nombre TEXT, cantUsada INT, categoriaEtiqueta TEXT', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
        db.executeSql('SELECT * FROM etiquetas ORDER BY etiquetaId DESC', []).then(res => {
          this.etiqueta = [];
          this.masetiqueta = []
          for(var i=0; i<res.rows.length; i++) {
            this.etiqueta.push({etiquetaId:res.rows.item(i).etiquetaId,nombre:res.rows.item(i).nombre,cantUsada:res.rows.item(i).cantUsada,categoriaEtiqueta:res.rows.item(i).categoriaEtiqueta})
            this.masetiqueta.push({etiquetaId:res.rows.item(i).etiquetaId,nombre:res.rows.item(i).nombre,cantUsada:res.rows.item(i).cantUsada,categoriaEtiqueta:res.rows.item(i).categoriaEtiqueta})
          }
        }).catch(e => console.log(e));
      })
    }*/
    
    //console.log(this.serviceEtiqueta.getEtiquetasNombre(this.etiqueta))
    //console.log(this.serviceEtiqueta.getEtiquetasNombre(this.masetiqueta))
    /*this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allEtiqueta.slice()));*/
  }

  ngOnInit() {
    this.testconnetion();
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
    /*setTimeout(()=>{
      this.testconnetion();
    },30000)*/
    if (this.isConnected){
     // this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
      /*this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
      this.service.getUsuarioByid(this.currentUser.UsuarioId).then(res=>{
        this.usuario = res as Usuario
        console.log(this.usuario.Puntos)
      }).catch(err=>{
          console.log(err)
      })*/

      this.service.getAnuncios('','','asc',1,5000).then(res=>{
        this.array.push(res as AnunciosModel);
      })

      this.service.getVariableConfiguracionByCodigo("Max_Etiqueta_Anuncio").then(res => this.maxEtiquetas=Number.parseInt((res as VariableConfiguracion).Valor));
      this.service.getVariableConfiguracionByCodigo("Max_Img").then(res => this.maxImg=Number.parseInt((res as VariableConfiguracion).Valor));

      this.service.getTipoOpcions('', '', 'asc', 1, 5000)
            .then(res => {
              this.listaTipoOpciones = res as TipoOpcionModel[];
              console.log(res)
             
              this.cantpuntosdestacado = this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio  
              this.cantpuntosetiquetas = this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").Precio
                            
              this.cantpuntosauto = this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_24").Precio
                            
              this.cantpuntosauto = this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_6").Precio
              this.cantpuntosauto = this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_1").Precio
              this.cantpuntosauto = this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_TOP").Precio

              if (this.anuncio.OpcionesAvanzadas.filter(x => x.NombreCodigo == 'MI_WEB').length>0) {
                this.cantpuntosweb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio +
                  this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio;
              }
              else
                this.cantpuntosweb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio;
                        
              this.cantpuntosweb = this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").Precio
                            
              this.cantpuntosimagenadicional = this.listaTipoOpciones.find(x => x.NombreCodigo == "IMG_ADI").Precio
                          
            this.cantpuntosbannerinferior = this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_INF").Precio
                            
            this.cantpuntosbannersuperior = this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_SUP").Precio

            this.cantpuntosweb = this.listaTipoOpciones.find(x => x.NombreCodigo == 'ENLACE_WEB').Precio +
          this.listaTipoOpciones.find(x => x.NombreCodigo == 'MI_WEB').Precio;

        this.listaFrecAutoRenovables = this.listaTipoOpciones.filter(x => x.NombreCodigo.includes('AUTO_'));
        this.frecuencia = this.listaFrecAutoRenovables[0].Nombre;
            
      });
    }
   
  }

  ionViewWillEnter(){
  //  this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
    this.service.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
   })
   if(this.arraycategoria.length === 0){
    setTimeout(()=>{
      this.presentLoading()
      this.service.getCategoriaAll('','','asc',1,5000).then(data=>{
        this.arraycategoria = data as Categoria[];
        console.log(this.arraycategoria)
      }).catch((error)=>{
        console.log('Login Incorrect',error)
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      })
    },3000)
  }
  }


  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: '',
      duration: 3000
    });
    return await loading.present();
  }

  

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  getUrlImage(name, container){
    if(name)
      return this.servCo.getRootURLApi() + container + "/" + encodeURI(name);
    else
      return "";
   }
   

  calcular(){
    this.totalpuntos = 0
    for (var i = 0; i < this.listaTipoOpciones.length; i++) {
      switch (this.listaTipoOpciones[i].NombreCodigo) {
        case "DESTACADO":
          if(this.destacado){
                 //this.diaspagardestacado = this.formData.OpcionAvanzadas[i].CantidadDias
                 console.log(this.anuncio.OpcionesAvanzadas)
            console.log(this.diaspagardestacado * this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio)   
            this.totalpuntos += this.diaspagardestacado * this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio
          //this.cantpuntosdestacado = Number.parseInt(this.diaspagardestacado) * this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio     
          }
         
          break; 

        case "ETIQUETAS":
          if(this.masetiqueta){
                //this.diaspagardescribe = this.formData.OpcionAvanzadas[i].CantidadDias
              this.totalpuntos += this.diaspagardescribe * this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").Precio
          // this.cantpuntosetiquetas = Number.parseInt(this.diaspagardescribe) * this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").Precio
           
          }
        
          break; 

        case "AUTO_24":
            if(this.autorrenovable){
                 // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
              this.frecuencia = "AUTO_24";
              this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_24").Precio
               //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_24").Precio
            }
          
            break; 
        case "AUTO_6": 
          if(this.autorrenovable){
              // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
              this.frecuencia = "AUTO_6";
             // this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.frecuencia)[0].CantidadDias=this.diaspagarautorrenovable
               this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_6").Precio
            //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_6").Precio
            
          }
          break; 
        case "AUTO_1":
          if(this.autorrenovable){
                 // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
                // this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.frecuencia)[0].CantidadDias=this.diaspagarautorrenovable
                 this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_1").Precio
              //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_1").Precio
            this.frecuencia = "AUTO_1"; 
          }
        
          break; 
        case "AUTO_TOP":  
          if(this.autorrenovable){
               // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
             //  this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.frecuencia)[0].CantidadDias=this.diaspagarautorrenovable
               this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_TOP").Precio
              //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_TOP").Precio
         
          this.frecuencia = "AUTO_TOP";
         
          }
       break; 

        case "ENLACE_WEB":
          if(this.web){
            this.anuncio.Url = this.web
               //  this.diaspagarweb = this.formData.OpcionAvanzadas[i].CantidadDias
              this.totalpuntos += this.diaspagarweb * this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").Precio
              //  this.cantpuntosweb = Number.parseInt(this.diaspagarweb) * this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").Precio
            
          }
       
          break;

        case "IMG_ADI":  
          if(this.imagenadicional){
                //  this.diaspagarimagenadicional = this.formData.OpcionAvanzadas[i].CantidadDias
              //  this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='IMG_ADI')[0].CantidadDias=this.diaspagarimagenadicional;    
            /*if(this.anuncio.AlmacenImagen.length > 0){
              for (var i = 0; i < this.anuncio.AlmacenImagen.length; i++) {
                this.imagen = this.anuncio.AlmacenImagen[i].ImageContent
              }
            } */
            this.totalpuntos += this.diaspagarimagenadicional * this.listaTipoOpciones.find(x => x.NombreCodigo == "IMG_ADI").Precio
        
          //  this.cantpuntosimagenadicional = Number.parseInt(this.diaspagarimagenadicional) * this.listaTipoOpciones.find(x => x.NombreCodigo == "IMG_ADI").Precio
       
          }
        
          break;

        case "BAN_INF":  
          if(this.imagenbarnerinferior){
               //this.diaspagarbarner = this.anuncio.ImagenesAdicionales[i].ImageContent
          this.totalpuntos += this.diaspagarbarner * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_INF").Precio
          this.imageNameInf =  this.anuncio.Banners.find(x => x.Tipo == "Inferior").ImageName;
          this.imageMimeTypeInf = this.anuncio.Banners.find(x => x.Tipo == "Inferior").ImageMimeType;
          //this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='BAN_INF')[0].CantidadDias=this.diaspagarbarner;
          //this.anuncio.Banners.filter(x=>x.Tipo=='Inferior')[0].CantidadDias=this.diaspagarbarner;      
          //  this.cantpuntosbannerinferior = Number.parseInt(this.diaspagarbarner) * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_INF").Precio
            
          }
         
          break;

        case "BAN_SUP":
          if(this.imagenbarnersuperior){
               // this.diaspagarbarnersuperior = this.formData.ImagenesAdicionales[i].ImageContent
              // this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='BAN_SUP')[0].CantidadDias=this.diaspagarbarnersuperior;
             // this.anuncio.Banners.filter(x=>x.Tipo=='Superior escritorio')[0].CantidadDias=this.diaspagarbarnersuperior;
             // this.anuncio.Banners.filter(x=>x.Tipo=='Superior movil')[0].CantidadDias=this.diaspagarbarnersuperior;
               this.bannerMobil =this.getUrlImage(this.anuncio.Banners.find(x => x.Tipo == "Superior movil").ImageName,'banners') ;
                this.imageNameMobil = this.anuncio.Banners.find(x => x.Tipo == "Superior movil").ImageName;
                this.imageMimeTypeMobil = this.anuncio.Banners.find(x => x.Tipo == "Superior movil").ImageMimeType;
              this.totalpuntos += this.diaspagarbarnersuperior * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_SUP").Precio
          //  this.cantpuntosbannersuperior = Number.parseInt(this.diaspagarbarnersuperior) * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_SUP").Precio
            
          }
        
          break; 
        default:   
      }
    }
  }



  addEtiqueta(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    const input = event.input;
    const value = event.value;
    console.log(event.value)
    let etiquetaNew;
    let anuncioEti;
      const index = this.arrayetiqueta.findIndex(eti => eti.Nombre.toLowerCase() === value.trim().toLowerCase());
      etiquetaNew = this.arrayetiqueta.splice(index, 1)[0];
      anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, true);
     // this.etiqueta.push(etiquetaNew);
      console.log(etiquetaNew)
      console.log(anuncioEti)
    if (input) {
      input.value = '';
    } 
  }


  addMasEtiqueta(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      //this.masetiqueta.push({name:value.trim()});
      /*if (this.isConnected){
            // mode online
          let etiquetaData: Etiqueta = new Etiqueta(0, `${value.trim()}`, 0,[]);
          this.service.insertarEtiquetas(etiquetaData).then(res =>{
            console.log(res)
            this.service.getEtiquetas('Nombre','','asc',1,10).then(data=>{
              this.masetiqueta = data;
              console.log(this.masetiqueta)
            })
          })
      }/*else{
        this.sqlite.create({
          name: 'setVMas.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('INSERT INTO etiquetas VALUES(NULL,?,?,?,?)',[0,value.trim(),0,[]])
            .then(res => {
              console.log(res);
              this.toast.show('Data saved', '5000','center').subscribe(toast => {
                console.log(toast);
              });
            })
        })   
      }*/
      
        
    }
    if (input) {
      input.value = '';
    }
  }

  removeEtiqueta(fruit: Etiqueta): void {
    const index = this.etiqueta.indexOf(fruit);

    if (index >= 0) {
      this.etiqueta.splice(index, 1);
    }
    console.log(this.etiqueta)
  }

  removeMasEtiqueta(fruit: Etiqueta): void {
    const index = this.masetiqueta.indexOf(fruit);

    if (index >= 0) {
      this.masetiqueta.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let etiquetaNew;
    let anuncioEti;
    const value = event.option.value;
    console.log(event.option.value)
    const index = this.arrayetiqueta.findIndex(eti => eti.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase());
    etiquetaNew = this.arrayetiqueta.splice(index, 1)[0];
    this.etiqueta.push(etiquetaNew);
    //this.etiquetaInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  

  private _filter(value: string): Etiqueta[] {
    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      return this.arrayetiqueta.filter(fruit => fruit.Nombre.toLowerCase().includes(filterValue));
    } else {
      return this.arrayetiqueta;
    }
  }

  


  /*takeSnap(){
    this.camera.getPicture(this.cameraOptions).then((imageData)=>{
      this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
        entry.file(file => {
          console.log(file);
          this.readFile(file);
        });
      });
    }, (err) => {
      // Handle error
    });
  }*/


  /*readFile(file: any) {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      this.anuncio.ImageName = file.name
      this.anuncio.ImageMimeType = file.type
      alert("ImageName " + JSON.stringify( this.anuncio.ImageName))
      alert("ImageType " + JSON.stringify( this.anuncio.ImageMimeType))
      const formData = new FormData();
      //formData.append('name', 'Hello');
      formData.append('file', imgBlob, file.name);
    };
    this.readFiletoBase64(file)
    reader.readAsArrayBuffer(file);
  }

  readFiletoBase64(file){
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () =>{
      this.imagen = reader.result
      this.anuncio.ImageContent = this.imagen
      alert("Imagen " + JSON.stringify(this.anuncio.ImageContent))
      
    }
  }*/


  takeSnap(){
    this.camera.getPicture(this.cameraOptions).then((imageData)=>{
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.filePath.resolveNativePath(imageData).then(filePath=>{
          //this.imagenname = imageData.substr(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'))
          //this.anuncio.ImageName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
         // alert("ImageName " + JSON.stringify( imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'))))
      })
      this.imagen = base64Image;
      this.anuncio.ImageContent = imageData
      let imageN = this.makeImageName(5)
      let imageName = imageN + '.jpg'
      this.anuncio.ImageName = imageName
      
    }, (err)=>{
      console.log(err)
    })
  }

  makeImageName(length){
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLenght = characters.length
    for (var i = 0; i < length; i++){
       result +=characters.charAt(Math.floor(Math.random() * charactersLenght))
    }
    return result

  }
  
  upload(form) {
    console.log(form.tags);
    form.tags = this.tagArrayToString(form.tags);
    console.log(form.tags);
  }

  tagArrayToString(tagArray: string[]): string {
    if (Array.isArray(tagArray) && tagArray.length > 0) {
      const tags = tagArray.map((e: any) => `[${e.value}]`);
      const tagString = tags.join();
      return tagString;
    } else {
      return '';
    }
  }

  cropUpload() {
    this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
      for (let i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
           this.crop.crop(results[i], { quality: 100 })
            .then(
              newImage => {
                console.log('new image path is: ' + newImage);
                const fileTransfer: FileTransferObject = this.transfer.create();
                const uploadOpts: FileUploadOptions = {
                   fileKey: 'file',
                   fileName: newImage.substr(newImage.lastIndexOf('/') + 1)
                };
                
                fileTransfer.upload(newImage, 'assets/imgs_test', uploadOpts)
                 .then((data) => {
                   console.log(data);
                   this.respData = JSON.parse(data.response);
                   console.log(this.respData);
                   this.images = this.respData.fileUrl;
                 }, (err) => {
                   console.log(err);
                 });
              },
              error => console.error('Error cropping image', error)
            );
      }
    }, (err) => { console.log(err); });
  }
 

  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }


  async compra(){
    //this.navCtrl.navigateForward('/buypoint')
    const modal = await this.modal.create({
      component: BuypointPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  getCodigoByFrec() {
    //var codigo;
    //switch (this.optionsForm.controls.frecuencia.value) {
    //  case 'Cada 24 horas':
    //    codigo = 'AUTO_24';
    //    break;
    //  case 'Cada 6 horas':
    //    codigo = 'AUTO_6';
    //    break;
    //  case 'Cada 1 hora':
    //    codigo = 'AUTO_1';
    //    break;
    //  default:
    //    codigo = 'AUTO_TOP';
    //    break;
    //}
    return this.listaFrecAutoRenovables.find(x => x.Nombre == this.frecuencia).NombreCodigo;

  }
  
  add(){
    if (this.isConnected){
      if (this.usuario.Puntos < this.totalpuntos) {
        this.cantidadpuntos = true
        let comprarpuntos = 100 - this.usuario.Puntos
        localStorage.setItem("comprar",JSON.stringify(comprarpuntos))
        this.comprar = true
        this.presentToast('Ud. no tiene suficientes puntos, debe comprar puntos.');
        return;
      }else{
        this.etiqueta.forEach(element=>{

          let anuncioEtiqueta: Etiqueta = new Etiqueta(element.EtiquetaId,null,0,false,null)
          this.anuncio.Etiquetas.push(anuncioEtiqueta);
        })
        if (this.destacado == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'',"DESTACADO",this.cantpuntosdestacado,0,0, this.diaspagardestacado, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").TipoOpcionId));
        }else {
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='DESTACADO'), 1);
        }
        
        if (this.masetiqueta == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','ETIQUETAS',this.cantpuntosetiquetas,0,0,this.diaspagardescribe, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").TipoOpcionId));
        }else {
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='ETIQUETAS'), 1);
        }
        
        if (this.autorrenovable == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'',this.frecuencia,this.cantpuntosauto,0,0,this.diaspagarautorrenovable, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == this.getCodigoByFrec()).TipoOpcionId));
        }else {
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo==this.frecuencia), 1);
         
        }
        
        if (this.web == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','ENLACE_WEB',this.cantpuntosweb,0,0,  this.diaspagarweb, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").TipoOpcionId));
        } else {
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='ENLACE_WEB'), 1);
          if(this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='MI_WEB').length>0)
            this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='MI_WEB'), 1);
        }
        
        if (this.imagenadicional == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','IMG_ADI',this.cantpuntosimagenadicional,0,0,  this.diaspagarimagenadicional, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == "IMG_ADI").TipoOpcionId));
        }else {
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=="IMG_ADI"), 1);
        }
        
        if (this.imagenbarnerinferior == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','BAN_INF',this.cantpuntosbannerinferior,0,0,  this.diaspagarbarner, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_INF").TipoOpcionId));
          this.anuncio.Banners.push(new Banner(0, null, null, 'Inferior', 0, '',this.anuncio.ImageMimeType,this.anuncio.ImageName, new Date(), new Date(), new Date(), true, this.anuncio.AnuncioId));
          
        }else {
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='BAN_INF'), 1);
      
        }
        
        if (this.imagenbarnersuperior == true) {
          this.anuncio.OpcionesAvanzadas.push(new Opciones(0,'','BAN_SUP',this.cantpuntosbannersuperior,0,this.diaspagarbarnersuperior,  this.diaspagarbarnersuperior, null, true, this.anuncio.AnuncioId, this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_SUP").TipoOpcionId));
          this.anuncio.Banners.push(new Banner(0, '', '', 'Superior movil', 0, this.imagen, this.imageMimeTypeMobil, this.imageNameMobil, new Date(), new Date(), new Date(),true, this.anuncio.AnuncioId));

        }else{
          this.anuncio.OpcionesAvanzadas.splice(this.anuncio.OpcionesAvanzadas.findIndex(x=>x.NombreCodigo=='BAN_SUP'), 1);
        }

        if(this.anuncio.ImageContent == '' && this.anuncio.ImageMimeType =='' && this.anuncio.ImageMimeType == '' && this.anuncio.ImageName == ''){
          this.anuncio.AlmacenImagen.push(new Almacenimagen(0, this.anuncio.Categoria.ImageContent, this.anuncio.Categoria.ImageContent, this.anuncio.Categoria.ImageMimeType, this.anuncio.Categoria.ImageName, this.anuncio.AnuncioId, true));
     
        }else{
          this.anuncio.AlmacenImagen.push(new Almacenimagen(0, this.images, this.anuncio.ImageContent, this.anuncio.ImageMimeType, this.anuncio.ImageName, this.anuncio.AnuncioId, true));
        }
          
        const creation = this.datePipe.transform(new Date(),"yyyy-MM-dd")
        const modification = this.datePipe.transform(new Date(),"yyyy-MM-dd")
         let index = this.array.length + 1
        let anuncioData = new AnunciosModel(0, '', '', '', '',
        '', null, false, false, null, null, '',
        '', '', '', '', '', 0, false, '1',
        '');
        anuncioData.AnuncioId = 0
        anuncioData.Titulo = this.titulo
        //localStorage.setItem("TituloAnuncio",this.titulo)
        anuncioData.Descripcion = this.texto
        anuncioData.NombreContacto = this.nombre
        anuncioData.TelefonoContacto = this.telefono
        anuncioData.CorreoContacto = this.email
        anuncioData.Precio = this.precio
        anuncioData.IsActivo = false
        anuncioData.IsVisible = false
        anuncioData.FechaCreacion = new Date(creation) 
        anuncioData.FechaModificacion =  new Date(modification) 
        anuncioData.ImageContent = this.imagen
        anuncioData.ImageMimeType = 'image/jpeg'
        anuncioData.ImageName = this.anuncio.ImageName
        anuncioData.Url = this.url
        anuncioData.Provincia = this.provincia
        anuncioData.Municipio = this.municipio
        anuncioData.Accion = this.accion
        anuncioData.Imagen = ""
        anuncioData.Etiquetas = this.anuncio.Etiquetas
        anuncioData.OpcionesAvanzadas =  []
        anuncioData.Banners = []
        anuncioData.AlmacenImagen = []
        anuncioData.Categoria = this.anuncio.Categoria
        anuncioData.Tipo = ""
          if (this.configAvanzada){
              anuncioData.OpcionesAvanzadas =  this.anuncio.OpcionesAvanzadas
              anuncioData.Banners = this.anuncio.Banners        
          }
          anuncioData.AlmacenImagen = this.anuncio.AlmacenImagen
          if(this.currentUser == undefined || this.currentUser == null){
            let invitatedUser: Usuario = new Usuario()
            invitatedUser.Activo =	false
            invitatedUser.Anfitrion	= "0001"
            invitatedUser.Bloqueado	= false
            invitatedUser.CantReferidos =	0
            invitatedUser.Clase	= "Iniciado"
            invitatedUser.Codigo =	"0012"
            invitatedUser.Correo	= "invitado@gmail.com"
            invitatedUser.Puntos	= 56
            invitatedUser.Rol	= null
            invitatedUser.Telefono =	null
            invitatedUser.Url	 = null
            invitatedUser.UsuarioId =	43
            anuncioData.Usuario = invitatedUser

          }else{
            anuncioData.Usuario = this.currentUser
          }
          console.log(anuncioData)
          this.service.insertarAnuncio(anuncioData).then(data=>{
            console.log(data)
            this.presentToast("!!Anuncio insertado correctamente!!");
          }).catch((error)=>{
            console.log(error)
            this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
            //this.presentToast(error);
          })
      }    
      
    }else if((!this.isConnected && this.currentUser) || (this.isConnected && this.cantidadpuntos)){
      let anuncioData = new AnunciosModel(0, '', '', '', '',
        '', null, false, false, null, null, '',
        '', '', '', '', '', 0, false, '1',
        '');
        const creation = this.datePipe.transform(new Date(),"yyyy-MM-dd")
        const modification = this.datePipe.transform(new Date(),"yyyy-MM-dd")
        anuncioData.AnuncioId = 0
        anuncioData.Titulo = this.titulo
        anuncioData.Descripcion = this.texto
        anuncioData.NombreContacto = this.nombre
        anuncioData.TelefonoContacto = this.telefono
        anuncioData.CorreoContacto = this.email
        anuncioData.Precio = this.precio
        anuncioData.IsActivo = false
        anuncioData.IsVisible = false
        anuncioData.FechaCreacion = new Date(creation) 
        anuncioData.FechaModificacion =  new Date(modification) 
        anuncioData.ImageContent = this.anuncio.ImageContent
        anuncioData.ImageMimeType = 'image/jpeg'
        anuncioData.ImageName = this.anuncio.ImageName
        anuncioData.Url = this.url
        anuncioData.Provincia = this.provincia
        anuncioData.Municipio = this.municipio
        anuncioData.Accion = this.accion
        anuncioData.Imagen = ""
        anuncioData.Etiquetas = this.anuncio.Etiquetas
        anuncioData.OpcionesAvanzadas =  []
        anuncioData.Banners = []
        anuncioData.AlmacenImagen = []
        anuncioData.Categoria = this.anuncio.Categoria
        anuncioData.Tipo = ""
          if (this.configAvanzada){
              anuncioData.OpcionesAvanzadas =  this.anuncio.OpcionesAvanzadas
              anuncioData.Banners = this.anuncio.Banners        
          }
          anuncioData.AlmacenImagen = this.anuncio.AlmacenImagen
          if(this.currentUser == undefined || this.currentUser == null){
            let invitatedUser: Usuario
            invitatedUser.Activo =	false
            invitatedUser.Anfitrion	= "0001"
            invitatedUser.Bloqueado	= false
            invitatedUser.CantReferidos =	0
            invitatedUser.Clase	= "Iniciado"
            invitatedUser.Codigo =	"0012"
            invitatedUser.Correo	= "invitado@gmail.com"
            invitatedUser.Puntos	= 56
            invitatedUser.Rol	= null
            invitatedUser.Telefono =	null
            invitatedUser.Url	 = null
            invitatedUser.UsuarioId =	43
            anuncioData.Usuario = invitatedUser

          }else{
            anuncioData.Usuario = this.currentUser
          }
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO anunciosborrador VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,/)',[anuncioData.Titulo,anuncioData.Descripcion,anuncioData.NombreContacto,anuncioData.TelefonoContacto,anuncioData.CorreoContacto,anuncioData.Precio,anuncioData.IsActivo, anuncioData.IsVisible, anuncioData.FechaCreacion, anuncioData.FechaModificacion, anuncioData.ImageContent, anuncioData.ImageMimeType, anuncioData.ImageName, anuncioData.Url, anuncioData.Provincia, anuncioData.Municipio, anuncioData.ProductoNuevo, anuncioData.Accion, anuncioData.Imagen,anuncioData.Etiquetas, anuncioData.Categoria,anuncioData.Banners,anuncioData.OpcionesAvanzadas, anuncioData.IsDestacado, anuncioData.Usuario, anuncioData.AlmacenImagen])
          .then(res => {
            console.log(res);
            this.toast.show('Data saved', '5000','center').subscribe(toast => {
              console.log(toast);
            });
          })
      })   
    }
    if(this.currentUser){
      this.navCtrl.navigateForward('/virtual-office')
    }else{
      this.navCtrl.navigateForward('/home')
    }
    
  }

  onAdavance(){
    console.log("advance")
    if(this.configAvanzada === false){
      this.configAvanzada = true;
    }else if (this.configAvanzada === true){
       this.configAvanzada = false;
    }
  }

  save(){
    // guardar variables configuracion avanzada
    //this.configAvanzada = false;
    this.add()
  }
 
  cancel(){
    this.configAvanzada = false;
  }

  onExpande(){
    if (this.expande === true){
      this.expande = false;
      this.icon = 'arrow-dropdown'
    }else if(this.expande === false){
          this.expande = true
          this.icon = 'arrow-dropup'
    }

  }

  onExpande1(){
    if (this.expande1 === true){
      this.expande1 = false;
      this.icon1 = 'arrow-dropdown'
    }else if(this.expande1 === false){
          this.expande1 = true
          this.icon1 = 'arrow-dropup'
    }

  }

  onExpande2(){
    if (this.expande2 === true){
      this.expande2 = false;
      this.icon2 = 'arrow-dropdown'
    }else if(this.expande2 === false){
          this.expande2 = true
          this.icon2 = 'arrow-dropup'
    }

  }


  onExpande3(){
    if (this.expande3 === true){
      this.expande3 = false;
      this.icon3 = 'arrow-dropdown'
    }else if(this.expande3 === false){
          this.expande3 = true
          this.icon3 = 'arrow-dropup'
    }

  }

  onExpande4(){
    if (this.expande4 === true){
      this.expande4 = false;
      this.icon4 = 'arrow-dropdown'
    }else if(this.expande4 === false){
          this.expande4 = true
          this.icon4 = 'arrow-dropup'
    }

  }


  onExpande5(){
    if (this.expande5 === true){
      this.expande5 = false;
      this.icon5 = 'arrow-dropdown'
    }else if(this.expande5 === false){
          this.expande5 = true
          this.icon5 = 'arrow-dropup'
    }

  }


  onExpande6(){
    if (this.expande6 === true){
      this.expande6 = false;
      this.icon6 = 'arrow-dropdown'
    }else if(this.expande6 === false){
          this.expande6 = true
          this.icon6 = 'arrow-dropup'
    }

  }


  protected filter(keyword) {
    keyword = keyword.toLowerCase();

    return this.objects.filter(
      (object) => {
        const value = object[this.labelAttribute].toLowerCase();

        return value.includes(keyword);
      }
    );
  }


  optionsFnAccion() {
    console.log(this.accion);
    let item = this.accion;
    this.selectaccion = item;
  }

  optionsFnCategoria() {
    console.log(this.categoria);
    let item = this.categoria;
    this.selectcategoria = item;
    this.service.getEtiquetasByCategoria(this.categoria).then(res =>{
      this.arrayetiqueta = res as Etiqueta[]
      console.log(this.arrayetiqueta)
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) :  this.arrayetiqueta));
        console.log(this.filteredFruits) 
    })
    this.service.getCategoriaById(this.categoria).then(res=>{
        this.anuncio.Categoria = res as Categoria
        console.log(this.anuncio.Categoria)
    })
    
  }

  optionsFnProv() {
    console.log(this.provincia);
    let item = this.provincia;
    this.selectprovincia = item.name;
    this.arrayprovincia.forEach(element => {
      //console.log(this.provincia)
      console.log(element.nombre)
      if (element.nombre === this.provincia){
            this.arraymunicipio = element.municipio
            console.log(element.municipio)
            
      }
    });
    console.log(this.arraymunicipio)
  }


  optionsFnMun() {
    console.log(this.municipio);
    let item = this.municipio;
    this.selectmunicipio = item;
  }

  optionsFnFrecuencia() {
    console.log(this.frecuencia);
    let item = this.frecuencia;
    this.selectcategoria = item;
  }

  close(){
    if(this.currentUser){
      this.navCtrl.navigateForward('/virtual-office')
    }else{
      this.navCtrl.navigateForward('/home')
    }
  }

  

}
