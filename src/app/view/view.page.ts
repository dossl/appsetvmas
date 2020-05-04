import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { PopoverController, NavParams, LoadingController,Platform, ModalController } from '@ionic/angular';
import { AnuncioService } from '../services/anuncio.service';
import { AnunciosModel } from '../models/anuncios.model';
import { DomSanitizer } from '@angular/platform-browser';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Etiqueta } from '../models/etiqueta.model';
import { CategoriaEtiqueta } from '../models/categoria-etiqueta.model';
import { element } from 'protractor';
import { AnuncioetiquetaModel } from '../models/anuncioetiqueta.model';
import { Usuario } from '../models/usuario.model';
import { TipoOpcionModel } from '../models/tipo-opcion.model';
import { NetworkService } from '../services/network.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx'


@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  slideOpts = {
    initialSlide:1,
    slidePerView:1,
    speed: 400,
    autoplay: true
    //enablekeyboardcontroll: true
  }
  usuario: Usuario
  detailAnuncio : AnunciosModel = new AnunciosModel(0,'','','','','',0,false,false,null,null,'','','','','','',0,false,'','')
  @Input() id: any;
  @Input() anuncio: AnunciosModel;
  displayImage:any
  base64:any
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  modale = false
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  etiquetaId: Etiqueta = new Etiqueta(0,'',0)

  listaTipoOpciones: TipoOpcionModel[] = [];
  arrayEtiqueta:any[] = []
  isConnected = false;

  array = [
    {AnuncioEtiquetaId:23,AnuncioId:26,EtiquetaId:16},
    {AnuncioEtiquetaId:24,AnuncioId:27,EtiquetaId:16},
    {AnuncioEtiquetaId:25,AnuncioId:28,EtiquetaId:16},
    {AnuncioEtiquetaId:26,AnuncioId:29,EtiquetaId:16},
    {AnuncioEtiquetaId:27,AnuncioId:30,EtiquetaId:16},
    {AnuncioEtiquetaId:28,AnuncioId:31,EtiquetaId:16},
    {AnuncioEtiquetaId:29,AnuncioId:32,EtiquetaId:16}
  ]

  @ViewChild('etiquetaInput', {static: false}) etiquetaInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  constructor(private modal: PopoverController,public modalCtrl: ModalController,private insomnia: Insomnia,public network: Network,private service: AnuncioService,private navParams: NavParams,private sanitizer: DomSanitizer,public loadingCtrl: LoadingController,private networkService: NetworkService,public platform: Platform, public splashscreen: SplashScreen) { }

  ngOnInit() {

    this.presentLoading();
    this.testconnetion();
    /*setTimeout(()=>{
      this.testconnetion();
    },30000)*/
    this.id = this.navParams.get('id')
    this.anuncio = this.navParams.get('anuncio')
    console.log(this.id)
    console.log(this.anuncio)
    let etiqueta:AnuncioetiquetaModel
    if(this.isConnected){  
      this.service.getTipoOpcions('', '', 'asc', 1, 5000)
              .then(res => {
                this.listaTipoOpciones = res as TipoOpcionModel[];
      });
      this.insomnia.keepAwake().then(()=>{
        console.log('success')
      })
      
    }
    
  }


  logScrollStart() {  
    console.log('logScrollStart : When Scroll Starts');  
  }  
  
  logScrolling() {  
    console.log('logScrolling : When Scrolling');  
  }  
  
  logScrollEnd() {  
    console.log('logScrollEnd : When Scroll Ends');  
  }  

  openModal(){
    this.modale = true
    document.getElementById('imgModal').style.display = "block";
  }

  closeModal() {
    this.modale = false
    document.getElementById('imgModal').style.display = "none";
  }
  


  async cancel() {
    //const modal = await this.modal.getTop()
    //modal.dismiss();
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      duration: 40000
    });
      return await loading.present();  
  }

  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
    
  }

}
