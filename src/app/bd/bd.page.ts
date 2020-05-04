import { Component, OnInit } from '@angular/core';
import { AnuncioService } from '../services/anuncio.service';
import { ToastController, PopoverController, LoadingController } from '@ionic/angular';
import { Categoria } from '../models/categoria.model';
import { Etiqueta } from '../models/etiqueta.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { NetworkService } from '../services/network.service';
import { Banner } from '../models/banner.model';
import { VariableConfiguracion } from '../models/variable-configuracion.model';
import { AnunciosModel } from '../models/anuncios.model';
import { element } from 'protractor';

@Component({
  selector: 'app-bd',
  templateUrl: './bd.page.html',
  styleUrls: ['./bd.page.scss'],
})
export class BdPage implements OnInit {

  arraycategoria:Categoria[]
  arrayEtiqueta:Etiqueta[]
  barnerSuperior: Banner[]
  barnerInferior: Banner[]
  configuration: VariableConfiguracion[]
  recientes: AnunciosModel[]
  populares: AnunciosModel[]
  anuncios: AnunciosModel[]
  isConnected = false;
  constructor(public toastCtrl: ToastController,private service: AnuncioService,private sqlite: SQLite, private toast: Toast,private networkService: NetworkService,private modal: PopoverController,public loadingCtrl: LoadingController) { }

  ngOnInit() {

    this.service.getCategoriaAll('','','asc',1,5000).then(data=>{
      this.arraycategoria = data as Categoria[]
      console.log(this.arraycategoria)
    }).catch((error)=>{
      console.log('Error fetch',error)
      this.presentToast(error);
    })

   this.service.getEtiquetas('Nombre','','asc',1,5000).then(data=>{
      this.arrayEtiqueta = data as Etiqueta[]
    }).catch((error)=>{
      console.log('Error',error)
      this.presentToast(error);
    })

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
      this.presentToast(error);
    })

    /*this.service.getconfiguration().then(data=>{
      this.configuration = data as VariableConfiguracion[]
    })*/

    this.service.getAnunciosRecientes('', '', 'asc', 1, 8).then(data=>{
      this.recientes = data as AnunciosModel[];
      console.log(this.recientes)
    }).catch((error)=>{
      this.presentToast(error);
    })


    this.service.getAnunciosPopulares('', '', 'asc', 1, 8).then(data=>{
      this.populares = data as AnunciosModel[];
      console.log(this.populares)
    }).catch((error)=>{
      this.presentToast(error);
    })

    this.service.getAnuncios('', '', 'asc', 1, 8).then(data=>{
         this.anuncios = data as AnunciosModel[]
    })

    if(!this.isConnected){
      setTimeout(()=>{
             this.testconnetion();
      },15000)
    }
  }


  async presentToast(text) {
    const toast = await this.toastCtrl.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  downloadBD(){
    this.presentLoading();
    this.sqlite.create({
      name: 'setVMas.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS Categoria(CategoriaId INTEGER PRIMARY KEY, Nombre TEXT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, CantAutoRenovables INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.arraycategoria.forEach(element=>{
        db.executeSql('INSERT INTO Categoria VALUES(NULL,?,?,?,?,?,?,?/)',[element.Nombre,element.ImageContent,element.ImageMimeType,element.ImageName,element.CantAutoRenovables])
        .then(res => {
          console.log(res);
          this.toast.show('Categoria descargadas', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })
      
      db.executeSql('CREATE TABLE IF NOT EXISTS Etiqueta(EtiquetaId INTEGER PRIMARY KEY, Nombre TEXT, CantUsada TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.arrayEtiqueta.forEach(element=>{
        db.executeSql('INSERT INTO Etiqueta VALUES(NULL,?,?/)',[element.Nombre,element.CantUsada])
        .then(res => {
          console.log(res);
          this.toast.show('Etiquetas descargadas', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        }) 
      })
      
      db.executeSql('CREATE TABLE IF NOT EXISTS Banner(BannerId INTEGER PRIMARY KEY, Nombre TEXT, Url TEXT, Tipo TEXT, CantidadDias INT, ImageContent TEXT, ImageMimeType TEXT, ImageName TEXT, FechaCreacion TEXT,FechaUltView TEXT, FechaDesactivacion TEXT, IsActivo INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.barnerSuperior.forEach(element=>{
        db.executeSql('INSERT INTO Banner VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?/)',[element.Nombre,element.Url,element.Tipo,element.CantidadDias,element.ImageContent,element.ImageMimeType,element.ImageName, element.FechaCreacion,element.FechaUltView, element.FechaDesactivacion, element.IsActivo])
        .then(res => {
          console.log(res);
          this.toast.show('Banners Superior descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })  
      })
      this.barnerInferior.forEach(element=>{
        db.executeSql('INSERT INTO Banner VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?,?/)',[element.Nombre,element.Url,element.Tipo,element.CantidadDias,element.ImageContent,element.ImageMimeType,element.ImageName, element.FechaCreacion,element.FechaUltView, element.FechaDesactivacion, element.IsActivo])
        .then(res => {
          console.log(res);
          this.toast.show('Banners Inferior descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })
    
      db.executeSql('CREATE TABLE IF NOT EXISTS VariableConfiguracion(VariableConfiguracionId INTEGER PRIMARY KEY, Nombre TEXT, Valor TEXT, Tipo TEXT, NombreCodigo INT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.configuration.forEach(element=>{
        db.executeSql('INSERT INTO VariableConfiguracion VALUES(NULL,?,?,?,?/)',[element.Nombre,element.Valor,element.Tipo,element.NombreCodigo])
        .then(res => {
          console.log(res);
          this.toast.show('Variable Configuracion descargado', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })

      db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosRecientes(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.recientes.forEach(element=>{
        db.executeSql('INSERT INTO AnunciosRecientes VALUES(NULL,?,?,?,?,?,?/)',[element.Titulo,element.Descripcion,element.NombreContacto,element.TelefonoContacto,element.CorreoContacto,element.Precio,element.IsActivo, element.IsVisible, element.FechaCreacion, element.FechaModificacion, element.ImageContent, element.ImageMimeType, element.ImageName, element.Url, element.Provincia, element.Municipio, element.ProductoNuevo, element.Accion, element.Imagen])
        .then(res => {
          console.log(res);
          this.toast.show('Anuncios Recientes descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })
      

      db.executeSql('CREATE TABLE IF NOT EXISTS AnunciosPopulares(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.populares.forEach(element=>{
        db.executeSql('INSERT INTO AnunciosPopulares VALUES(NULL,?,?,?,?,?,?/)',[element.Titulo,element.Descripcion,element.NombreContacto,element.TelefonoContacto,element.CorreoContacto,element.Precio,element.IsActivo, element.IsVisible, element.FechaCreacion, element.FechaModificacion, element.ImageContent, element.ImageMimeType, element.ImageName, element.Url, element.Provincia, element.Municipio, element.ProductoNuevo, element.Accion, element.Imagen])
        .then(res => {
          console.log(res);
          this.toast.show('Anuncios Populares descargados', '5000','center').subscribe(toast => {
            console.log(toast);
          });
        })
      })


    db.executeSql('CREATE TABLE IF NOT EXISTS Anuncios(AnuncioId INTEGER PRIMARY KEY, Titulo TEXT, Descripcion TEXT, NombreContacto TEXT, TelefonoContacto TEXT, CorreoContacto TEXT, Precio INT, IsActivo INT, IsVisible INT,FechaCreacion TEXT, FechaModificacion TEXT, ImageContent TEXT,ImageMimeType TEXT, ImageName TEXT, Url TEXT, Provincia TEXT, Municipio TEXT, ContadorView INT, ProductoNuevo INT, Accion TEXT, Imagen TEXT)', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
      this.anuncios.forEach(element=>{
        db.executeSql('INSERT INTO Anuncios VALUES(NULL,?,?,?,?,?,?/)',[element.Titulo,element.Descripcion,element.NombreContacto,element.TelefonoContacto,element.CorreoContacto,element.Precio,element.IsActivo, element.IsVisible, element.FechaCreacion, element.FechaModificacion, element.ImageContent, element.ImageMimeType, element.ImageName, element.Url, element.Provincia, element.Municipio, element.ProductoNuevo, element.Accion, element.Imagen])
        .then(res => {
          console.log(res);
          this.toast.show('Anuncios descargados', '5000','center').subscribe(toast => {
            console.log(toast);
            this.loadingCtrl.dismiss();
          });
        })
      })
    })
         
  }
  
  testconnetion(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
          console.log('Por favor enciende tu conexión a Internet');
          this.presentToast('Por favor enciende tu conexión a Internet');
      }else{
        this.downloadBD()
      }
    });
  }

  async presentLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Descargando Bd...',
      duration: 2000
    });
    return await loading.present();
  }


}
