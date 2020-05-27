import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild  } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController,NavController, ToastController, Platform, LoadingController, PopoverController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { VirtualOfficePage } from '../virtual-office/virtual-office.page';
import { AnuncioService } from '../../services/anuncio.service';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ConfiguracionesService } from '../../services/configuraciones.service';
import { AnunciosModel } from '../../models/anuncios.model';
import { stringify } from '@angular/compiler/src/util';
import { Etiqueta } from '../../models/etiqueta.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { Network } from '@ionic-native/network/ngx';
import { fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { formatDate } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { AnuncioetiquetaModel } from '../../models/anuncioetiqueta.model';
import { TipoOpcionModel } from '../../models/tipo-opcion.model';
import { Opciones } from '../../models/opciones.model';
import { Categoria } from '../../models/categoria.model';
import { BuypointPage } from '../buypoint/buypoint.page';
import { DatePipe } from '@angular/common'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { element } from 'protractor';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'
import { Banner } from '../../models/banner.model';
import { Almacenimagen } from '../../models/almacenimagen.model';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-edit-announce',
  templateUrl: './edit-announce.page.html',
  styleUrls: ['./edit-announce.page.scss'],
})
export class EditAnnouncePage implements OnInit {


  private online: Observable<boolean> = null;
  private hasConnection = new BehaviorSubject(false);

  id:any
  arrayprovincia:any[]
  arraymunicipio:any
  form: FormGroup;

  nuevo: any;
  precio: any
  titulo: any
  nombre:any
  telefono:any
  email:any
  municipio:any
  provincia:any
  imagen:any
  etiqueta:Etiqueta[] = []
  accion:any
  texto:any
  arrayetiqueta:Etiqueta[] = []
  
  selectaccion:any
  selectcategoria:any
  selectprovincia:any
  selectmunicipio:any
  selectfrecuencia:any
  mimeContent = ''

  isConnected = false;

  categoria:any
  arraycategoria:Categoria[] = []
  total: number = 8;
  
  destacado:any
  masetiqueta:any
  autorrenovable:any
  frecuencia:any
  web:any
  url:any
  webanuncio:any
  nombreimagen:any
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

  cantidadpuntos = false

  banner:any
  opcionesAvanzada:any
  allFruits: Etiqueta[]

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
  update:any

  allEtiqueta: any 

  anuncio: AnunciosModel;

  //etiquetas = ['#Ropa','#Electrodomesticos','#Calzado','#Computadoras','#Moviles','#Inmovilario','#Alquileres','#transporte','#Bisuteria','#Peluqueria']
  
  public objects:any[];
  public labelAttribute:string;

  images :any = null;
  respData: any;
  platform: any;

  cameraOptions: CameraOptions = {
    quality: 100,
    targetWidth: 400,
    targetHeight: 400,
    saveToPhotoAlbum: true,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<Etiqueta[]>;

  formData: AnunciosModel;

  usuario: Usuario = new Usuario() 

  idUser:any

  totalpuntos = 0
  cantpuntosdestacado = 0
  cantpuntosetiquetas = 0
  cantpuntosauto = 0
  cantpuntosweb = 0
  cantpuntosimagenadicional = 0
  cantpuntosbannerinferior = 0
  cantpuntosbannersuperior = 0
  imagenname:any
  loadetiqueta = false
  loadImage = false

  listaTipoOpciones: TipoOpcionModel[] = [];
  listaFrecAutoRenovables: any[] = [];
  currentUser: Usuario

  maxEtiquetas: number = 0;
  maxImgFree: number = 0;
  maxImg: number = 0;

  imageMimeTypeMobil: string = '';
  imageNameMobil: string = '';
  imageMimeTypeInf: string = '';
  imageNameInf: string = '';

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
    public network: Network,
    private toast: Toast,
    private insomnia: Insomnia,
    private modal: PopoverController,
    private networkService: NetworkService,
    public splashscreen: SplashScreen,
    private datePipe: DatePipe,
    private filepath: FilePath
  ) { 
    /*this.platform.ready().then(()=>{
      this.splashscreen.hide();
    })*/
    this.objects = ['etiqueta1','etiqueta2','etiqueta3','etiqueta4','etiqueta5','etiqueta6','etiqueta7','etiqueta8','etiqueta9','etiqueta10']
   // this.arrayprovincia = this.servCo.getProviciasAll();
   // this.arraymunicipio = this.arrayprovincia[0].Municipios;
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
    console.log(this.service.getAnuncioId())
    
  }

  ngOnInit() { 
    
    
    this.testconnetion();

    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })

    if (this.isConnected){
      //Mode online
      //this.currentUser = JSON.parse(localStorage.getItem("currentuser")) 
      this.service.getUsuarioByid(this.currentUser.UsuarioId).then(res=>{
        this.usuario = res as Usuario
        console.log(this.usuario.Puntos)
      }).catch(err=>{
          console.log('La aplicación se ha detenido, vuelva a intentarlo')
      })
    this.service.getAnunciosById(this.service.getAnuncioId()).then(data=>{
      this.formData = data as AnunciosModel;
      console.log(data)
      this.id = this.formData.AnuncioId
      this.nuevo = this.formData.ProductoNuevo
      this.precio = this.formData.Precio
      this.titulo = this.formData.Titulo
      this.nombre = this.formData.NombreContacto
      this.telefono = this.formData.TelefonoContacto
      this.email = this.formData.CorreoContacto
      this.provincia = this.formData.Provincia
      this.municipio = this.formData.Municipio
      this.images = this.formData.ImageName
    //  this.categoria = this.formData.Categoria

    this.arrayprovincia.forEach(element => {
      //console.log(this.provincia)
      console.log(element.nombre)
      if (element.nombre === this.provincia){
            this.arraymunicipio = element.municipio          
      }
    });

      this.loadetiqueta = true
      this.formData.Imagen = 'data:' + this.formData.ImageMimeType + ';base64,' + this.formData.ImageContent;
      if(this.formData.Imagen){
        this.loadImage = true
      }

      this.service.getCategoriaAll('','','asc',1,5000).then(data=>{
        this.arraycategoria = data as Categoria[];
        this.arraycategoria.forEach(res=>{
          if(res.Nombre === this.formData.Categoria.Nombre){
            this.categoria = res.CategoriaId
            this.service.getEtiquetasByCategoria(this.categoria).then(res =>{
              this.arrayetiqueta = res as Etiqueta[]
              this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
              startWith(null),
              map((fruit: string | null) => fruit ? this._filter(fruit) :  this.arrayetiqueta));
            })
          }
        })
  
      }).catch((error)=>{
        console.log('Login Incorrect',error)
        this.presentToast('La aplicación se ha detenido.');
      })

      this.formData.Etiquetas.forEach(res=>{
              this.etiqueta.push(res)
      })
     
      
      
      this.accion = this.formData.Accion
      this.texto = this.formData.Descripcion
      this.url = this.formData.Url

      if (this.formData.OpcionesAvanzadas.length > 0){
        this.opcionesAvanzada = this.formData.OpcionesAvanzadas
        this.anuncio.Banners = this.formData.Banners
        this.anuncio.OpcionesAvanzadas = this.formData.OpcionesAvanzadas;
        this.anuncio.AlmacenImagen = this.formData.AlmacenImagen;
        for (var i = 0; i < this.formData.OpcionesAvanzadas.length; i++) {
          switch (this.formData.OpcionesAvanzadas[i].NombreCodigo) {
            case "DESTACADO":
                this.destacado = true
                this.diaspagardestacado = this.formData.OpcionesAvanzadas[i].CantidadDias
                this.totalpuntos += this.diaspagardestacado * this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio
                //this.cantpuntosdestacado = Number.parseInt(this.diaspagardestacado) * this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio     
              break; 
    
            case "ETIQUETAS":
             
                this.masetiqueta = true
                this.diaspagardescribe = this.formData.OpcionesAvanzadas[i].CantidadDias
                this.totalpuntos += this.diaspagardescribe * this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").Precio
               // this.cantpuntosetiquetas = Number.parseInt(this.diaspagardescribe) * this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").Precio
                
             
              break; 
    
            case "AUTO_24":
                
                  this.autorrenovable = true
                  this.diaspagarautorrenovable =  this.formData.OpcionesAvanzadas[i].CantidadDias 
                  this.frecuencia = "AUTO_24";
                  this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_24").Precio
                //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_24").Precio
               
                break; 
            case "AUTO_6": 
              
                this.autorrenovable = true
                this.diaspagarautorrenovable =  this.formData.OpcionesAvanzadas[i].CantidadDias 
                this.frecuencia = "AUTO_6";
                this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_6").Precio
              //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_6").Precio  
             break; 
            case "AUTO_1":
                this.autorrenovable = true
                this.diaspagarautorrenovable =  this.formData.OpcionesAvanzadas[i].CantidadDias 
                this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_1").Precio
                //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_1").Precio
                this.frecuencia = "AUTO_1"; 
               
             break; 
            case "AUTO_TOP":  
            
              this.autorrenovable = true
              this.diaspagarautorrenovable =  this.formData.OpcionesAvanzadas[i].CantidadDias 
              this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_TOP").Precio
            //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_TOP").Precio
           
            this.frecuencia = "AUTO_TOP";
            break; 
    
            case "ENLACE_WEB":
            
                this.web = true
                this.diaspagarweb = this.formData.OpcionesAvanzadas[i].CantidadDias
                this.totalpuntos += this.diaspagarweb * this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").Precio
              //  this.cantpuntosweb = Number.parseInt(this.diaspagarweb) * this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").Precio
             
              break;
    
            case "IMG_ADI":  
                this.imagenadicional = true
                this.diaspagarimagenadicional = this.formData.OpcionesAvanzadas[i].CantidadDias
                for (var i = 0; i < this.formData.AlmacenImagen.length; i++) {
                     this.imagen = this.formData.AlmacenImagen[i].ImageContent
                }
                this.totalpuntos += this.diaspagarimagenadicional * this.listaTipoOpciones.find(x => x.NombreCodigo == "IMG_ADI").Precio
              //  this.cantpuntosimagenadicional = Number.parseInt(this.diaspagarimagenadicional) * this.listaTipoOpciones.find(x => x.NombreCodigo == "IMG_ADI").Precio
              
              break;
    
            case "BAN_INF":  
                this.imagenbarnerinferior = true
                this.diaspagarbarner = this.formData.OpcionesAvanzadas[i].CantidadDias
                this.totalpuntos += this.diaspagarbarner * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_INF").Precio
              //  this.cantpuntosbannerinferior = Number.parseInt(this.diaspagarbarner) * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_INF").Precio
                
              break;
    
            case "BAN_SUP":
                this.imagenbarnersuperior = true
                this.diaspagarbarnersuperior = this.formData.OpcionesAvanzadas[i].CantidadDias
                this.totalpuntos += this.diaspagarbarnersuperior * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_SUP").Precio
                //  this.cantpuntosbannersuperior = Number.parseInt(this.diaspagarbarnersuperior) * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_SUP").Precio
                
              break; 
            default:   
          }
        }

       }
    })
        /*for(const i of (this.formData.ListadoEtiquetas as AnuncioetiquetaModel[])){
          this.arraycategoria = i.etiqueta;
        }*/
        /*this.service.getCategoriaAll('','','asc',1,5000).then(data=>{
          this.arraycategoria = data;
          console.log(this.categoria)
        })*/
        this.service.getTipoOpcions('', '', 'asc', 1, 5000)
        .then(res => {
          this.listaTipoOpciones = res as TipoOpcionModel[];

        });

        this.listaFrecAutoRenovables = this.servCo.getFrecuenciaAutorenovables();
        
      

    

    }else if(!this.isConnected){
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM anunciosborrador WHERE anuncioId=?',[this.service.getAnuncioId()])
          .then(res => {
            if(res.rows.length > 0) {
              this.precio = res.rows.item(0).precio
              this.titulo = res.rows.item(0).titulo
              this.nombre = res.rows.item(0).nombreContacto
              this.telefono = res.rows.item(0).telefonoContacto
              this.email = res.rows.item(0).correoContacto
              this.texto = res.rows.item(0).descripcion
              this.images = res.rows.item(0).imagen 
            }
          })
      })  
    }

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

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  addEtiqueta(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    const input = event.input;
    const value = event.value;
    let etiquetaNew;
    let anuncioEti;
      const index = this.arrayetiqueta.findIndex(eti => eti.Nombre.toLowerCase() === value.trim().toLowerCase());
      etiquetaNew = this.arrayetiqueta.splice(index, 1)[0];
      anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, true);
     // this.etiqueta.push(etiquetaNew);
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
              //mode offline
          let etiquetaData: Etiqueta = new Etiqueta(0, `${value.trim()}`, 0,[]);
          this.service.insertarEtiquetas(etiquetaData).then(res =>{
            console.log(res)
            this.service.getEtiquetas('Nombre','','asc',1,10).then(data=>{
              this.etiqueta = data;
              console.log(this.etiqueta)
            })
          })
      }else{
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
    
    const index = this.arrayetiqueta.findIndex(eti => eti.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase());
    etiquetaNew = this.arrayetiqueta.splice(index, 1)[0];
    this.etiqueta.push(etiquetaNew);

  //  this.etiquetaInput.nativeElement.value = '';
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
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.filePath.resolveNativePath(imageData).then(filePath=>{
        //this.imagenname = imageData.substr(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'))
      })
      this.imagen = base64Image;
      this.mimeContent = imageData
      this.anuncio.ImageContent = imageData
      this.loadImage = false
    }, (err)=>{
      console.log(err)
    })
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
                this.anuncio.ImageName = uploadOpts.fileName
                this.anuncio.ImageMimeType = uploadOpts.mimeType
  
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
  
  getUrlImage(name, container){
    if(name)
      return this.servCo.getRootURLApi() + container + "/" + encodeURI(name);
    else
      return "";
   }

  calcular(){

    for (var i = 0; i < this.formData.OpcionesAvanzadas.length; i++) {
      switch (this.formData.OpcionesAvanzadas[i].NombreCodigo) {
        case "DESTACADO":
          if(this.destacado){
                 //this.diaspagardestacado = this.formData.OpcionAvanzadas[i].CantidadDias
            this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='DESTACADO')[0].CantidadDias=this.diaspagardestacado;     
            this.totalpuntos += this.diaspagardestacado * this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio
          //this.cantpuntosdestacado = Number.parseInt(this.diaspagardestacado) * this.listaTipoOpciones.find(x => x.NombreCodigo == "DESTACADO").Precio     
          }
         
          break; 

        case "ETIQUETAS":
          if(this.masetiqueta){
                //this.diaspagardescribe = this.formData.OpcionAvanzadas[i].CantidadDias
              this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='ETIQUETAS')[0].CantidadDias=this.diaspagardescribe;
              this.totalpuntos += this.diaspagardescribe * this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").Precio
          // this.cantpuntosetiquetas = Number.parseInt(this.diaspagardescribe) * this.listaTipoOpciones.find(x => x.NombreCodigo == "ETIQUETAS").Precio
           
          }
        
          break; 

        case "AUTO_24":
            if(this.autorrenovable){
                 // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
              this.frecuencia = "AUTO_24";
              this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.frecuencia)[0].CantidadDias=this.diaspagarautorrenovable
              this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_24").Precio
               //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_24").Precio
            }
          
            break; 
        case "AUTO_6": 
          if(this.autorrenovable){
              // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
              this.frecuencia = "AUTO_6";
              this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.frecuencia)[0].CantidadDias=this.diaspagarautorrenovable
               this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_6").Precio
            //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_6").Precio
            
          }
          break; 
        case "AUTO_1":
          if(this.autorrenovable){
                 // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
                 this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.frecuencia)[0].CantidadDias=this.diaspagarautorrenovable
                 this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_1").Precio
              //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_1").Precio
            this.frecuencia = "AUTO_1"; 
          }
        
          break; 
        case "AUTO_TOP":  
          if(this.autorrenovable){
               // this.diaspagarautorrenovable =  this.formData.OpcionAvanzadas[i].CantidadDias 
               this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo==this.frecuencia)[0].CantidadDias=this.diaspagarautorrenovable
               this.totalpuntos += this.diaspagarautorrenovable * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_TOP").Precio
              //  this.cantpuntosauto = Number.parseInt(this.diaspagarautorrenovable) * this.listaTipoOpciones.find(x => x.NombreCodigo == "AUTO_TOP").Precio
         
          this.frecuencia = "AUTO_TOP";
         
          }
       break; 

        case "ENLACE_WEB":
          if(this.web){
               //  this.diaspagarweb = this.formData.OpcionAvanzadas[i].CantidadDias
               this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='ENLACE_WEB')[0].CantidadDias=this.diaspagarweb;
              if(this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='MI_WEB').length>0)
              {
                this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='MI_WEB')[0].CantidadDias=this.diaspagarweb;

              }
              this.totalpuntos += this.diaspagarweb * this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").Precio
              //  this.cantpuntosweb = Number.parseInt(this.diaspagarweb) * this.listaTipoOpciones.find(x => x.NombreCodigo == "ENLACE_WEB").Precio
            
          }
       
          break;

        case "IMG_ADI":  
          if(this.imagenadicional){
                //  this.diaspagarimagenadicional = this.formData.OpcionAvanzadas[i].CantidadDias
                this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='IMG_ADI')[0].CantidadDias=this.diaspagarimagenadicional;    
            if(this.anuncio.AlmacenImagen.length > 0){
              for (var i = 0; i < this.anuncio.AlmacenImagen.length; i++) {
                this.imagen = this.anuncio.AlmacenImagen[i].ImageContent
              }
          }
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
          this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='BAN_INF')[0].CantidadDias=this.diaspagarbarner;
          this.anuncio.Banners.filter(x=>x.Tipo=='Inferior')[0].CantidadDias=this.diaspagarbarner;      
          //  this.cantpuntosbannerinferior = Number.parseInt(this.diaspagarbarner) * this.listaTipoOpciones.find(x => x.NombreCodigo == "BAN_INF").Precio
            
          }
         
          break;

        case "BAN_SUP":
          if(this.imagenbarnersuperior){
               // this.diaspagarbarnersuperior = this.formData.ImagenesAdicionales[i].ImageContent
               this.anuncio.OpcionesAvanzadas.filter(x=>x.NombreCodigo=='BAN_SUP')[0].CantidadDias=this.diaspagarbarnersuperior;
              this.anuncio.Banners.filter(x=>x.Tipo=='Superior escritorio')[0].CantidadDias=this.diaspagarbarnersuperior;
              this.anuncio.Banners.filter(x=>x.Tipo=='Superior movil')[0].CantidadDias=this.diaspagarbarnersuperior;
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
          //Mode online
      if (this.usuario.Puntos < this.totalpuntos) {
        this.cantidadpuntos = true
        this.presentToast('Ud. no tiene suficientes puntos, debe comprar puntos.');
        return;
      }else {
        //this.anuncio.Banners = [];
       // this.anuncio.OpcionAvanzadas = [];
        //this.anuncio.ImagenesAdicionales = [];
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
        let anuncioData = new AnunciosModel(0, '', '', '', '',
        '', null, false, false, null, null, '',
        '', '', '', '', '', 0, false, '1',
        '');
        anuncioData.AnuncioId = this.service.getAnuncioId()
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
        anuncioData.ImageMimeType = this.anuncio.ImageMimeType
        anuncioData.ImageName = this.anuncio.ImageName
        anuncioData.Url = this.url
        anuncioData.Provincia = this.provincia
        anuncioData.Municipio = this.municipio
        anuncioData.Accion = this.accion
        anuncioData.Imagen = ""
        anuncioData.Etiquetas = this.formData.Etiquetas
        anuncioData.OpcionesAvanzadas =  []
        anuncioData.Banners = []
        anuncioData.AlmacenImagen = []
        anuncioData.Categoria = this.anuncio.Categoria
        anuncioData.Tipo = ""
          if (this.configAvanzada){
            anuncioData.OpcionesAvanzadas =  this.anuncio.OpcionesAvanzadas
            anuncioData.Banners = this.anuncio.Banners
            anuncioData.AlmacenImagen = this.anuncio.AlmacenImagen
            anuncioData.Etiquetas = this.anuncio.Etiquetas
          }
          anuncioData.Usuario = this.currentUser
        console.log(anuncioData)
        this.service.updateAnuncio(this.service.getAnuncioId(),anuncioData).then(data=>{
          console.log(data)
          this.presentToast("!!Anuncio actualizado correctamente!!");
        }).catch((error)=>{
          this.presentToast('La aplicación se ha detenido.');
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
        anuncioData.ImageContent = this.mimeContent
        anuncioData.ImageMimeType = 'image/jpeg'
        anuncioData.ImageName = this.nombreimagen
        anuncioData.Url = this.url
        anuncioData.Provincia = this.provincia
        anuncioData.Municipio = this.municipio
        anuncioData.Accion = this.accion
        anuncioData.Imagen = ""
        anuncioData.Etiquetas = this.anuncio.Etiquetas
        anuncioData.OpcionesAvanzadas =  []
        anuncioData.Banners = []
        anuncioData.AlmacenImagen = []
       // anuncioData.Categoria = this.anuncio.Categoria
          if (this.configAvanzada){
              anuncioData.OpcionesAvanzadas =  this.anuncio.OpcionesAvanzadas
              anuncioData.Banners = this.anuncio.Banners                
          }
          anuncioData.AlmacenImagen = this.anuncio.AlmacenImagen
          anuncioData.Usuario = this.currentUser
      this.sqlite.create({
        name: 'setVMas.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('UPDATE anunciosborrador SET AnuncioId=?,Titulo=?,Descripcion=?,NombreContacto=?,TelefonoContacto=?,CorreoContacto=?,Precio=?,IsActivo=?,IsVisible=?,FechaCreacion=?,FechaModificacion=?,ImageContent=?,ImageMimeType=?,ImageName=?,Url=?,Provincia=?,Municipio=?,ContadorView=?,ProductoNuevo=?,Accion=?,,Imagen=? Etiquetas=?, Categoria=?,Banner=?,OpcionAvanzadas=?, IsDestacado=?, Usuario=?, AlmacenImagen=? WHERE AnuncioId=?',[anuncioData.Titulo,anuncioData.Descripcion,anuncioData.NombreContacto,anuncioData.TelefonoContacto,anuncioData.CorreoContacto,anuncioData.Precio,anuncioData.IsActivo, anuncioData.IsVisible, anuncioData.FechaCreacion, anuncioData.FechaModificacion, anuncioData.ImageContent, anuncioData.ImageMimeType, anuncioData.ImageName, anuncioData.Url, anuncioData.Provincia, anuncioData.Municipio, anuncioData.ProductoNuevo, anuncioData.Accion, anuncioData.Imagen,anuncioData.Etiquetas, anuncioData.Categoria,anuncioData.Banners,anuncioData.OpcionesAvanzadas, anuncioData.IsDestacado, anuncioData.Usuario, anuncioData.AlmacenImagen])
          .then(res => {
            console.log(res);
            this.toast.show('Data updated', '5000','center').subscribe(toast => {
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
    this.configAvanzada = false;
  }

  async compra(){
    this.navCtrl.navigateForward('/buypoint')
    const modal = await this.modal.create({
      component: BuypointPage,
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
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
      this.loadetiqueta = false
      console.log(this.etiqueta)
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.arrayetiqueta));
    })
    this.service.getCategoriaById(this.categoria).then(res=>{
      this.anuncio.Categoria = res as Categoria
      console.log(this.anuncio.Categoria)
    })
    
    
  }

  optionsFnFrecuencia() {
    console.log(this.frecuencia);
    let item = this.frecuencia;
    this.selectcategoria = item;
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

  close(){
    if(this.currentUser){
      this.navCtrl.navigateForward('/virtual-office')
    }else{
      this.navCtrl.navigateForward('/home')
    }
  }


  

}
