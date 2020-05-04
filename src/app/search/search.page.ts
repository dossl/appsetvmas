import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Usuario } from '../models/usuario.model';
import { AnunciosModel } from '../models/anuncios.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { ProvinciasModel } from '../models/provincias.model';
import { MunicipiosModel } from '../models/municipios.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Etiqueta } from '../models/etiqueta.model';
import { BuscarAnunciosModel } from '../models/buscar-anuncios.model';
import { PopoverController, LoadingController, ToastController, NavController,Platform, AlertController } from '@ionic/angular';
import { AnuncioService } from '../services/anuncio.service';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { NetworkService } from '../services/network.service';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { AnuncioetiquetaModel } from '../models/anuncioetiqueta.model';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Banner } from '../models/banner.model';
import { DetailsPage } from '../details/details.page';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @Input('mostrarSiempreResultados') mostrarResultados: boolean;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  currentUser: Usuario;

  fecha: string;
  ListaAnuncios: AnunciosModel[];
  txtBuscar: string;
  txtBuscarAvan: string;
  // *****************AutoCompletar Categorias*******************************************************************
  ListaCategoriaFiltradas: Observable<Categoria[]>;
  ListaCategoria: Categoria[] = [];
  inputCat = new FormControl();
  // ************************************************************************************************************
  // *****************AutoCompletar Accion*******************************************************************
  ListaAccionFiltradas: Observable<string[]>;
  ListaAcciones: string[];
  inputAcc = new FormControl();
  // ************************************************************************************************************

  // *****************AutoCompletar Provincia*******************************************************************
  ListaProvFiltradas: Observable<ProvinciasModel[]>;
  ListaProv: ProvinciasModel[];
  inputProv = new FormControl();
  // ************************************************************************************************************

  // *****************AutoCompletar Municipio*******************************************************************
  ListaMunFiltradas: Observable<MunicipiosModel[]>;
  ListaMun: MunicipiosModel[];
  inputMun = new FormControl();
  // ************************************************************************************************************



  // ********Chip List*******************
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputEtq = new FormControl();
  ListaEtiFilter: Observable<Etiqueta[]>;
  ListaEti: Etiqueta[] = [];
  ListaEtiFuente: Etiqueta[];
  isConnected:any

  barnerSuperior: Banner[];
  barnerInferior: Banner[];
  buscarprofunda:any
  bocina = false;
  nameUser:any


  @ViewChild('etiquInp', { static: false }) etiquInp: ElementRef<HTMLInputElement>;
  @ViewChild('auto2', { static: false }) matAutocomplete2: MatAutocomplete;
  @ViewChild('auto3', { static: false }) matAutocomplete3: MatAutocomplete;
  @ViewChild('auto4', { static: false }) matAutocomplete4: MatAutocomplete;
  // ********Chip List*******************

  dataSource;
  filtroReciente = true;
  filtroMasVisto = false;
  filtroAva = false;
  totalPaginas = this.servCo.getCantPorPaginasHome();
  pagActual = 1;
  cantPorPagina = this.servCo.getCantPorPaginasHome();
  aplicarfiltros = true;
  buscarAnuncio: BuscarAnunciosModel = new BuscarAnunciosModel();
  cantColumnas = 4;
  mostrarMasCamposBusq = true;
  private loadingAnuncio = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingAnuncio.asObservable();
  
  constructor(private modal: PopoverController,
    private service: AnuncioService, 
    private servCo: ConfiguracionesService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public network: Network,
    public navCtrl: NavController,
    private insomnia: Insomnia,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    public platform: Platform, public splashscreen: SplashScreen,
    private networkService: NetworkService) { 

      /*this.platform.ready().then(()=>{
        this.splashscreen.hide();
     })*/
    }

  ngOnInit() {
    this.testconnetion()
    this.insomnia.keepAwake().then(()=>{
      console.log('success')
    })
    if(this.isConnected){
      this.loadingAnuncio.next(true);
      /*if (window.innerWidth <= 130 && window.innerWidth > 106) {
        this.cantColumnas = 3;
      } else if (window.innerWidth <= 106 && window.innerWidth > 628) {
        this.cantColumnas = 2;
      } else if (window.innerWidth <= 628) {
        this.cantColumnas = 1;
      } else {
        this.cantColumnas = 4;
      }*/
      this.txtBuscar = '';
      this.txtBuscarAvan = '';
  
      this.buscarAnuncio.ListaEtiquetas = [];
      this.service.updateAnuncioReciente.next(true);
      this.service.updateAnuncioReciente.subscribe(res => {
  
        this.ListaAnuncios = null;
        this.filtroReciente = true;
        this.pagActual = 1;
        this.filtroMasVisto = false;
        this.filtroAva = false;
   
          this.service.getAnunciosRecientes('FechaCreacion', '', 'asc', 1, this.cantPorPagina)
            .then((res) => {
              this.ListaAnuncios = res as AnunciosModel[];
              this.loadingAnuncio.next(false);
              for (const i of (this.ListaAnuncios as AnunciosModel[])) {
                if (i.ImageContent !== undefined && i.ImageContent !== null) {
                  i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
                } else {
                  i.Imagen = i.Categoria.ImageName;
                }
              }
            },
              () => this.loadingAnuncio.next(true));
      });
  
      this.service.getCategoriaAll('', '', 'asc', 1, 5000).then(res => this.ListaCategoria = res as Categoria[]);
      this.service.getEtiquetasByCategoria(-1).then(res => this.ListaEtiFuente = res as Etiqueta[]);
      this.ListaAcciones = this.servCo.getAccionesAnuncio();
      this.service.getAnunciosCountV2('', '', 'asc', 1, 5000, 'r').
        then(res => this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina));
      this.ListaProv = this.servCo.getProviciasAll();
      this.ListaMun = this.ListaProv[0].Municipios;
      this.ListaCategoriaFiltradas = this.inputCat.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterCategorias(value))
        );
      this.ListaAccionFiltradas = this.inputAcc.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterAcciones(value))
        );
      // ********Chip List*******************
      this.ListaEtiFilter = this.inputEtq.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filterEtiqueta(fruit) : this.ListaEtiFuente));
      // ********Chip List*******************
      this.ListaProvFiltradas = this.inputProv.valueChanges
        .pipe(
          startWith(''),
          map((value) => this._filterProvincias(value))
        );
      this.ListaMunFiltradas = this.inputMun.valueChanges
        .pipe(
          startWith(''),
          map((value) => this._filterMunicipios(value)
          )
        );
  
      this.filtroReciente = true;
      this.filtroMasVisto = false;
      this.filtroAva = false;
      this.loadBanner()
    }else if(!this.isConnected){
      setTimeout(()=>{
            this.testconnetion();
      },5000)
    }
  }


  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: ' <strong>¿Seguro que desea salir de su usuario en Setvmas?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.navCtrl.navigateForward('/home')
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.logout()
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter(){
    this.testconnetion()
    if(!this.isConnected){
      this.testconnetion();
    }
    this.service.getCurrentUser().then(res=>{
      this.currentUser = res as Usuario
      if(this.currentUser){
       let index = this.currentUser.Correo.indexOf("@");
       if(index !== -1){
          this.nameUser = this.currentUser.Correo.substr(0,index);
       }
       console.log(this.currentUser)
     }
   })
  }


  logout(){
    this.service.logout()
  }

  

  loadBanner(){
    if (this.isConnected){
      this.service.getBannerSuperior().then(data=>{
        this.barnerSuperior = data as Banner[];
        console.log(this.barnerSuperior)
      }).catch((error)=>{
        this.presentToast(error);
      })
      this.service.getBannerInferior().then(data=>{
        this.barnerInferior = data as Banner[];
        console.log(this.barnerInferior)
      }).catch((error)=>{
        this.presentToast('La aplicación se ha detenido, vuelva a intentarlo');
      })
    }
    
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    return await toast.present();
  }

  async details(id){
    const modal = await this.modal.create({
      component: DetailsPage,
      componentProps:{"id": id},
      animated: true,
      backdropDismiss: false
    });
    return await modal.present();
  }


  sendShare(titulo?,id?){
    let url = 'https://setvmas.com/sitio/#/detalles-anuncio/'+id
    this.socialSharing.share(titulo, titulo, null, url);
  }
  
  miWeb(url){
      const option: InAppBrowserOptions= {
        zoom: 'no',
        hardwareback: 'no'
      }
      let browser = this.iab.create(url,'_self',option)
    browser.show()
  }

  async presentLoading1(){
    const loading = await this.loadingCtrl.create({
      message: '',
      duration: 2000
    });
    return await loading.present();
  }
  


  private _filterCategorias(value: string): Categoria[] {
    const filterValue = value.toLowerCase();
    return this.ListaCategoria.filter(option => option.Nombre.toLowerCase().includes(filterValue));
  }
  private _filterProvincias(value: string): ProvinciasModel[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      return this.ListaProv.filter(f => f.Nombre.toLowerCase().includes(filterValue));
    } else {
      return this.ListaProv;
    }

  }
  private _filterMunicipios(value: string): MunicipiosModel[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      return this.ListaMun.filter(f => f.Nombre.toLowerCase().includes(filterValue));
    } else {
      return this.ListaMun;
    }

  }
  private _filterAcciones(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.ListaAcciones.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterEtiqueta(value: string): Etiqueta[] {

    if (value !== null && value !== undefined && value.length !== undefined) {
      const filterValue = value.toLowerCase();
      return this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase().includes(filterValue));
    } else {
      return this.ListaEtiFuente;
    }

  }

  addEti(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let etiquetaNew;
    let anuncioEti;

    // Add our fruit
    if ((value || '').trim() && this.ListaEti.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase() === value.trim().toLowerCase()).length > 0) {

      const index = this.ListaEtiFuente.findIndex(eti => eti.Nombre.toLowerCase() === value.trim().toLowerCase());
      etiquetaNew = this.ListaEtiFuente.splice(index, 1)[0];
      anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, true);
      this.buscarAnuncio.ListaEtiquetas.push(anuncioEti);
      this.ListaEti.push(etiquetaNew);

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.inputEtq.setValue(null);
  }


  removeEti(fruit, indx): void {
    this.ListaEtiFuente.push(this.ListaEti.splice(indx, 1)[0]);
  }

  selectedEti(event: MatAutocompleteSelectedEvent): void {


    const value = event.option.value;

    let etiquetaNew;
    let anuncioEti;

    // Add our fruit
    if (this.ListaEti.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length === 0
      && this.ListaEtiFuente.filter(fruit => fruit.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase()).length > 0) {

      const index = this.ListaEtiFuente.findIndex(eti => eti.Nombre.toLowerCase() === value.Nombre.trim().toLowerCase());
      etiquetaNew = this.ListaEtiFuente.splice(index, 1)[0];
      anuncioEti = new AnuncioetiquetaModel(0, 0, 0, null, etiquetaNew, true);
      this.buscarAnuncio.ListaEtiquetas.push(anuncioEti);
      this.ListaEti.push(etiquetaNew);

    }



    this.etiquInp.nativeElement.value = '';
    this.inputEtq.setValue(null);


  }


  selectedCategoria(event: MatOptionSelectionChange): void {

    const cate = this.ListaCategoria.filter(fruit => fruit.Nombre === event.source.value)[0];
    this.service.getEtiquetasByCategoria(cate.CategoriaId).then(res => this.ListaEtiFuente = res as Etiqueta[]);
    this.matAutocomplete2.options.reset([]);
    this._filterEtiqueta('');

  }

  inputProvinciaChange(event): void {
    const listTemp = this.ListaProv.filter(fruit => fruit.Nombre.includes(event));
    if (listTemp.length > 0) {
      this.ListaMun = listTemp[0].Municipios;
      this.buscarAnuncio.Provincia = event;
      if (this.ListaMun.length > 0) {
        this.buscarAnuncio.Municipio = this.ListaMun[0].Nombre;
        this.inputMun.setValue(this.buscarAnuncio.Municipio);
      }
    }

  }

  clickNuevo() {
    this.ListaAnuncios = null;
    this.filtroReciente = true;
    this.pagActual = 1;
    this.filtroMasVisto = false;
    this.filtroAva = false;
    this.loadingAnuncio.next(true);
    this.service.getAnunciosCountV2('', this.txtBuscar, 'asc', 1, 5000, 'r')
      .then(res => this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina));
    this.service.getAnunciosRecientes('', this.txtBuscar, 'asc', 1, this.cantPorPagina).then(res => {
      this.ListaAnuncios = res as AnunciosModel[];

      this.loadingAnuncio.next(false);
      for (const i of (this.ListaAnuncios as AnunciosModel[])) {
        if (i.ImageContent !== undefined && i.ImageContent !== null) {
          i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
        } else {
          i.Imagen = i.Categoria.ImageName;
        }

      }

    });
  }

  buscarTexto() {
    if (this.txtBuscar !== '') {
      this.mostrarResultados = true;
      if (this.filtroReciente) {
        this.clickNuevo();
      } else {
        this.clickPopulares();
      }
    }
  }

  buscarTextoEnter(event) {
    if (this.txtBuscar !== '' && event.keyCode === 13) {
      this.mostrarResultados = true;
      if (this.filtroReciente) {
        this.clickNuevo();
      } else {
        this.clickPopulares();
      }
    }
  }

  clickPopulares() {
    this.loadingAnuncio.next(true);
    this.ListaAnuncios = null;
    this.pagActual = 1;
    this.filtroReciente = false;
    this.filtroMasVisto = true;
    this.filtroAva = false;
    this.service.getAnunciosCountV2('', this.txtBuscar, 'asc', 1, 5000, 'p')
      .then(res => this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina));
    this.service.getAnunciosPopulares('', this.txtBuscar, 'asc', 1, this.cantPorPagina)
      .then(res => {
        this.ListaAnuncios = res as AnunciosModel[];
        this.loadingAnuncio.next(false);
        for (const i of (this.ListaAnuncios as AnunciosModel[])) {
          if (i.ImageContent !== undefined && i.ImageContent !== null) {
            i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
          } else {
            i.Imagen = i.Categoria.ImageName;
          }

        }

      });
  }


  clickCategorias() {
    this.filtroReciente = false;
    this.filtroMasVisto = false;
    this.filtroAva = true;
  }

  clickNext() {
    this.presentLoading1();
    this.loadingAnuncio.next(true);
    this.ListaAnuncios = null;
    if (this.pagActual < this.totalPaginas) {
      this.pagActual = this.pagActual + 1;

      if (this.filtroReciente) {
        this.service.getAnunciosRecientes('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];
          this.loadingAnuncio.next(false);
          for (const i of (this.ListaAnuncios as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }
        });

      } else
        if (this.filtroMasVisto) {
          this.service.getAnunciosPopulares('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina).then(res => {
            this.ListaAnuncios = res as AnunciosModel[];
            this.loadingAnuncio.next(false);
            for (const i of (this.ListaAnuncios as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              } else {
                i.Imagen = i.Categoria.ImageName;
              }

            }

          });
        } else {
          this.buscarAnuncio.indexPage = this.pagActual;
          this.buscarAnuncio.sizePage = this.cantPorPagina;
          this.service.buscarAnunciosAvanzados(this.buscarAnuncio).then(res => {
            this.ListaAnuncios = res as AnunciosModel[];

            this.loadingAnuncio.next(false);
            for (const i of (this.ListaAnuncios as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              } else {
                i.Imagen = i.Categoria.ImageName;
              }

            }

          });
        }

    }
    this.loadingCtrl.dismiss()

  }
  clickAnterior() {
    this.presentLoading1();
    this.loadingAnuncio.next(true);
    this.ListaAnuncios = null;
    if (this.pagActual > 1) {
      this.pagActual = this.pagActual - 1;
      if (this.filtroReciente) {
        this.service.getAnunciosRecientes('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina)
          .then(res => {
            this.ListaAnuncios = res as AnunciosModel[];
            this.loadingAnuncio.next(false);
            for (const i of (this.ListaAnuncios as AnunciosModel[])) {
              if (i.ImageContent !== undefined && i.ImageContent !== null) {
                i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
              } else {
                i.Imagen = i.Categoria.ImageName;
              }

            }

          });
      } else if (this.filtroMasVisto) {
        this.service.getAnunciosPopulares('', this.txtBuscar, 'asc', this.pagActual, this.cantPorPagina).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];
          this.loadingAnuncio.next(false);
          for (const i of (this.ListaAnuncios as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }

        });
      } else {
        this.buscarAnuncio.indexPage = this.pagActual;
        this.buscarAnuncio.sizePage = this.cantPorPagina;
        this.service.buscarAnunciosAvanzados(this.buscarAnuncio).then(res => {
          this.ListaAnuncios = res as AnunciosModel[];
          this.loadingAnuncio.next(false);
          for (const i of (this.ListaAnuncios as AnunciosModel[])) {
            if (i.ImageContent !== undefined && i.ImageContent !== null) {
              i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
            } else {
              i.Imagen = i.Categoria.ImageName;
            }

          }

        });
      }
    }
    this.loadingCtrl.dismiss()

  }

  prepararFiltros() {
    this.aplicarfiltros = !this.aplicarfiltros;
  }
  mostrarMasCampos() {
    this.mostrarMasCamposBusq = !this.mostrarMasCamposBusq;
  }


  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
  }

  buscarAnunciosFiltros() {
    this.mostrarResultados = true;
    this.txtBuscar = '';
    this.loadingAnuncio.next(true);
    this.ListaAnuncios = null;
    this.buscarAnuncio.indexPage = 1;
    this.buscarAnuncio.sizePage = this.cantPorPagina;
    this.pagActual = 1;
    this.filtroReciente = false;
    this.filtroMasVisto = false;
    this.filtroAva = true;
    this.aplicarfiltros = false;
    this.presentLoading1();
    this.service.buscarAnunciosAvanzadosCount(this.buscarAnuncio).then(res => {
      this.totalPaginas = Math.ceil((res as number) / this.cantPorPagina);
      console.log(this.totalPaginas)
    });


    this.service.buscarAnunciosAvanzados(this.buscarAnuncio).then(res => {
      this.ListaAnuncios = res as AnunciosModel[];
      console.log(this.ListaAnuncios)
      this.loadingAnuncio.next(false);
      for (const i of (this.ListaAnuncios as AnunciosModel[])) {
        if (i.ImageContent !== undefined && i.ImageContent !== null) {
          i.Imagen = 'data:' + i.ImageMimeType + ';base64,' + i.ImageContent;
        } else {
          i.Imagen = i.Categoria.ImageName;
        }

      }
       this.loadingCtrl.dismiss()
    });
  }

  close(){
    this.navCtrl.navigateForward('/home')
  }

  inicio(){
    this.navCtrl.navigateForward('/home')
  }
  
  oficina(){
    this.navCtrl.navigateForward('/virtual-office')
  }
  
  search(){
    this.aplicarfiltros = true;
    this.mostrarResultados = false;
    this.buscarAnuncio = new BuscarAnunciosModel()
  }
  ayuda(){
    this.navCtrl.navigateForward('/help')
  }
  
  contacto(){
    this.navCtrl.navigateForward('/contact')
  }

  onNotificate(){
    if(this.bocina === false){
      this.bocina = true;
    }else if (this.bocina === true){
       this.bocina = false;
       this.onAnnounce();
    }
    console.log(this.bocina)
  }

  async onAnnounce(){
    console.log("Announce")
    this.navCtrl.navigateForward('/add-announce')
  }


}
