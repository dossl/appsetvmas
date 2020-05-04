import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ConfiguracionesService} from './configuraciones.service';
import { Etiqueta } from '../models/etiqueta.model';
import { PaginasEstaticasModel } from '../models/paginas-estaticas.model';
import { AnunciosModel } from '../models/anuncios.model';
import { Usuario } from '../models/usuario.model';
import { CategoriaEtiqueta } from '../models/categoria-etiqueta.model';
import { Categoria } from '../models/categoria.model';
import { PointSell } from '../models/sell-points.model';
import { Purchase } from '../models/purchase.model';
import { BuscarAnunciosModel } from '../models/buscar-anuncios.model';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  anuncioId: any
  estado:any
  nuevo: any;
  precio: any
  titulo: any
  nombre:any
  telefono:any
  email:any
  municipio:any
  provincia:any
  imagen:any
  etiqueta:any
  accion:any
  texto:any

  selectaccion:any
  selectprovincia:any
  selectmunicipio:any

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
  diaspagardestacado:any
  diaspagardescribe:any
  diaspagarautorrenovable:any
  diaspagarweb:any
  diaspagarimagenadicional:any
  diaspagarbarner:any
  diaspagarbarnersuperior:any

  anuncio: any
  etiquet:any
  pointSell: PointSell
  purchaseData: Purchase;


  readonly rootURL
  constructor(private http: HttpClient,
    private servConfiguracion: ConfiguracionesService) {

    this.rootURL = this.servConfiguracion.getRootURLApi();

    /*this.anuncio = [
      {
        nuevo: true,
        precio: '210.00',
        titulo: 'Laptop',
        nombre:'Osmel',
        telefono:'53235750',
        email:'osmel.santos.88@gmail.com',
        municipio:'10 de octubre',
        provincia:'La Habana',
        images:'',
        etiqueta:[{name:'fotografo'},{name:'estudio'},{name:'asesoria'}],
        accion:'vendo',
        texto: 'anuncio nuevo',
        destacado:undefined,
        masetiqueta:false,
        autorrenovable:true,
        frecuencia:'',
        web:'',
        url:'',
        webanuncio:'',
        nombreimagen:'',
        imagenadicional:'',
        imagenbarnerinferior:'',
        imagenbarnersuperior:'',
        diaspagardestacado:'',
        diaspagardescribe:'',
        diaspagarautorrenovable:'',
        diaspagarweb:'',
        diaspagarimagenadicional:'',
        diaspagarbarner:'',
        diaspagarbarnersuperior:'',

      }
    ]*/
   }

  setEtiquet(etiquet){
     this.etiquet = etiquet
  }
  getEtiquet(){
  return this.etiquet
  }

  /*********Api Request******** */ 
  
  getAnuncios(col, filter, sortDirection,  pageIndex, pageSize){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios',{
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
     
  }


  getAnunciosById(id){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios/' + id).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
     
  }

  getAnunciosRecientes(col, filter, sortDirection,  pageIndex, pageSize){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios/Recientes',{
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  getAnunciosPopulares(col, filter, sortDirection,  pageIndex, pageSize){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios/Populares',{
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  buscarAnunciosAvanzados(buscar: BuscarAnunciosModel) {
    if (buscar.PrecioMax === null || buscar.PrecioMax === undefined) {
      buscar.PrecioMax = 0;
    }
    if (buscar.PrecioMin === null || buscar.PrecioMin === undefined) {
      buscar.PrecioMin = 0;
    }
   return new Promise(resolve => {
      this.http.post(this.rootURL + 'Anuncios/Avanzados',buscar).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }
  buscarAnunciosAvanzadosCount (buscar: BuscarAnunciosModel) {
    return new Promise(resolve => {
      this.http.post(this.rootURL + 'Anuncios/AvanzadosCount',buscar).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });


  }

  getEtiquetas(col, filter, sortDirection,  pageIndex, pageSize){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Etiquetas',{
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  

  insertarEtiquetas(formData){
    return new Promise((resolve, reject) => {
      this.http.post(this.rootURL + 'Etiquetas', formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  insertarAnuncio(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.rootURL + 'Anuncios', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateAnuncio(anuncioId,data){
    return new Promise((resolve, reject) => {
      this.http.put(this.rootURL + 'Anuncios/' + anuncioId, data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  deleteAnuncio(id){
    return new Promise((resolve, reject) => {
      this.http.delete(this.rootURL + 'Anuncios/' + id)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getBannerSuperior(){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Banners/Tipo/Superior movil').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getBannerInferior(){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Banners/Tipo/Inferior').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getCategoriaAll(col, filter, sortDirection,  pageIndex, pageSize){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Categorias',{
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  

  getCategoriaEtiquetaByCategoria(id) {
    return new Promise((resolve, reject) => {
        this.http.get(this.rootURL + '/CategoriaEtiquetas' + id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }


  enviarCorreo(nombre, correo, asunto, mensaje) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'PaginasEstaticas/Correo',{
        params: new HttpParams()
          .set('nombre', nombre.toString())
          .set('correo', correo.toString())
          .set('asunto', asunto.toString())
          .set('mensaje', mensaje.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getPaginasEstaticasByid(id) {
      return new Promise((resolve, reject) => {
        this.http.get(this.rootURL + 'PaginasEstaticas/' + id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });  
  }

  getconfiguration(col, filter, sortDirection, pageIndex, pageSize){
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'VariableConfiguracions',{
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getVariableConfiguracionByCodigo(codigo) {

    return new Promise(resolve => {
      this.http.get(this.rootURL + 'VariableConfiguracions/Codigo',{
        params: new HttpParams()
          .set('codigo', codigo)
          
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getUsuarioByid(id) {

    return new Promise((resolve, reject) => {
      this.http.get(this.rootURL + 'Usuarios/' + id)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getEtiquetaById(id) {

    return new Promise((resolve, reject) => {
      this.http.get(this.rootURL + 'Etiquetas/' + id)
        .subscribe(res => {
          resolve(res as AnunciosModel);
        }, (err) => {
          reject(err);
        });
    });
  }
  
  

  /*login(Correo: string, Password: string) {

    return new Promise((resolve, reject) => {
      this.http.post(this.rootURL + 'Usuarios/SingIn', { Correo, Password })
        .subscribe(res => {
          localStorage.setItem('currentUser', JSON.stringify(res));
          console.log('token '+JSON.parse(JSON.stringify(res)).token)
          localStorage.setItem('token',JSON.parse(JSON.stringify(res)).token);
          resolve(res as Usuario);
        }, (err) => {
          reject(err);
        });
    });
  }*/


  login(Correo: string, Password: string) {

    return new Promise((resolve, reject) => {
      this.http.post(this.rootURL + 'Usuarios/SingIn', { "username":Correo, "password":Password })
        .subscribe(res => {
          console.log('token '+JSON.parse(JSON.stringify(res)).token)
          localStorage.setItem('token',JSON.parse(JSON.stringify(res)).token);
          this.getCurrentUser()
          resolve(res as Usuario);
        }, (err) => {
          reject(err);
        });
    });
  }

  getUsuarioById(id) {

    return new Promise((resolve, reject) => {
      this.http.get(this.rootURL + 'Usuarios/' + id)
        .subscribe(res => {
          resolve(res as Usuario);
        }, (err) => {
          reject(err);
        });
    });
  }

  getCurrentUser(){

    return new Promise((resolve, reject) => {
      this.http.get(this.rootURL + 'Usuarios/Current')
        .subscribe(res => {
          console.log(res)
          localStorage.setItem("currentuser", JSON.stringify(res))
          resolve(res as Usuario);
        }, (err) => {
          reject(err);
        });
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear()
  }


  register(Correo: string, Password: string, Anfitrion: string, Telefono:string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.rootURL + 'Usuarios', {
        params: new HttpParams()
          .set('Correo', Correo.toString())
          .set('Password', Password.toString())
          .set('Anfitrion', Anfitrion.toString())
          .set('Telefono', Telefono.toString())
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getUsuarioCodigo(codigo) {

    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Usuarios/Codigo',{
        params: new HttpParams()
          .set('codigo', codigo)
          
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  recuperar(correo) {
   
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Usuarios/Recuperar/',{
        params: new HttpParams()
          .set('correo', correo)
          
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
 


  getTipoOpcions(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'TipoOpcions',{
        params: new HttpParams()
          .set('col', col.toString())
          .set('filter', filter)
          .set('sortDirection', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  /*getEtiquetasByCategoria(id) {
      return new Promise((resolve, reject) => {
        this.http.get(this.rootURL + 'Categorias/Etiqueta/' + id)
          .subscribe(res => {
            resolve(res as Etiqueta);
          }, (err) => {
            reject(err);
          });
      });
  }*/

  getCategoriaById(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.rootURL + 'Categorias/' + id)
        .subscribe(res => {
          resolve(res as Categoria);
        }, (err) => {
          reject(err);
        });
    });
  }

  getEtiquetasByCategoria(id) {

    if (id === -1 || id === undefined) {
     return new Promise((resolve, reject) => {
        this.http.get(this.rootURL + 'Etiquetas/List')
          .subscribe(res => {
            resolve(res as Etiqueta);
          }, (err) => {
            reject(err);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.http.get(this.rootURL + 'Categorias/Etiqueta/' + id)
          .subscribe(res => {
            resolve(res as Etiqueta);
          }, (err) => {
            reject(err);
          });
      });
    }

  }


  getAnunciosCountV2(col, filter, sortDirection, pageIndex, pageSize, metodo) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios/CountHome',{
        params: new HttpParams()
        .set('col', col.toString())
        .set('filter', filter)
        .set('sortDirection', sortDirection)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('metodo', metodo.toString())
      }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getCategoriaEtiquetaByEtiqueta(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.rootURL + 'CategoriaEtiquetas/Etiqueta/' + id)
        .subscribe(res => {
          resolve(res as Categoria);
        }, (err) => {
          reject(err);
        });
    });
  }


  buyPoint(formaPago, monto, tarjeta, phone, userId) {
    this.purchaseData = new Purchase(formaPago, monto, tarjeta, phone, userId);
    return new Promise(resolve => {
      this.http.post(this.rootURL + 'pagoes',this.purchaseData).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }


  sellPoint(userId, buyer, amount) {
    this.pointSell = new PointSell(userId, buyer, amount);
    return new Promise(resolve => {
      this.http.post(this.rootURL + 'VenderPuntos',this.pointSell).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  public resultadoAnunciosObserver = new BehaviorSubject<AnunciosModel[]>([]);
  public ListaAnunciosObservable = this.resultadoAnunciosObserver.asObservable();
  public CantidadTotalAnunciosObserver = new BehaviorSubject<number>(0);
  public CantiadAnunciosTotalObservable = this.CantidadTotalAnunciosObserver.asObservable();
  public textoBuscarObserver = new BehaviorSubject<string>('');
  public textoBuscarObservable = this.textoBuscarObserver.asObservable();
  ListaAnuncios: AnunciosModel[];
  public updateAnuncioReciente = new BehaviorSubject<boolean>(false);
  public reciente$ = this.updateAnuncioReciente.asObservable();

  /********************************************************************************************** */
  getAnuncio(){
    return this.anuncio
  } 

  cropUpload(){}

  addAnuncio(nuevo: any,precio: any,titulo: any,nombre:any,telefono:any,email:any,municipio:any,provincia:any,images:any,etiqueta:any,accion:any,texto:any,destacado:any,masetiqueta:any,autorrenovable:any,frecuencia:any,web:any,url:any,webanuncio:any,nombreimagen:any,imagenadicional:any,imagenbarnerinferior:any,imagenbarnersuperior:any,diaspagardestacado:any,diaspagardescribe:any,diaspagarautorrenovable:any,diaspagarweb:any,diaspagarimagenadicional:any,diaspagarbarner:any,diaspagarbarnersuperior:any){
    this.anuncio.push({
      nuevo: nuevo,
      precio: precio,
      titulo: titulo,
      nombre:nombre,
      telefono:telefono,
      email:email,
      municipio:municipio,
      provincia:provincia,
      images:images,
      etiqueta:etiqueta,
      destacado:destacado,
      masetiqueta:masetiqueta,
      autorrenovable:autorrenovable,
      frecuencia:frecuencia,
      web:web,
      accion:accion,
      texto:texto,
      url:url,
      webanuncio:webanuncio,
      nombreimagen:nombreimagen,
      imagenadicional:imagenadicional,
      imagenbarnerinferior:imagenbarnerinferior,
      imagenbarnersuperior:imagenbarnersuperior,
      diaspagardestacado:diaspagardestacado,
      diaspagardescribe:diaspagardescribe,
      diaspagarautorrenovable:diaspagarautorrenovable,
      diaspagarweb:diaspagarweb,
      diaspagarimagenadicional:diaspagarimagenadicional,
      diaspagarbarner:diaspagarbarner,
      diaspagarbarnersuperior:diaspagarbarnersuperior
    })
    console.log(texto)
  }


  editAnuncio(nuevo: any,precio: any,titulo: any,nombre:any,telefono:any,email:any,municipio:any,provincia:any,images:any,etiqueta:any,accion:any,texto:any,destacado:any,masetiqueta:any,autorrenovable:any,frecuencia:any,web:any,url:any,webanuncio:any,nombreimagen:any,imagenadicional:any,imagenbarnerinferior:any,imagenbarnersuperior:any,diaspagardestacado:any,diaspagardescribe:any,diaspagarautorrenovable:any,diaspagarweb:any,diaspagarimagenadicional:any,diaspagarbarner:any,diaspagarbarnersuperior:any){
     
    this.anuncio.filter(item=>{
      item.nuevo = nuevo,
      item.precio = precio,
      item.titulo = titulo,
      item.nombre = nombre,
      item.telefono = telefono,
      item.email = email,
      item.municipio = municipio,
      item.provincia = provincia,
      item.images = images,
      item.etiqueta = etiqueta,
      item.accion = accion,
      item.texto = texto,
      item.destacado = destacado,
      item.masetiqueta = masetiqueta,
      item.autorrenovable = autorrenovable,
      item.frecuencia = frecuencia,
      item.web = web,
      item.url = url,
      item.webanuncio = webanuncio,
      item.nombreimagen = nombreimagen,
      item.imagenadicional = imagenadicional,
      item.imagenbarnerinferior = imagenbarnerinferior,
      item.imagenbarnersuperior = imagenbarnersuperior,
      item.diaspagardestacado = diaspagardestacado,
      item.diaspagardescribe = diaspagardescribe,
      item.diaspagarautorrenovable = diaspagarautorrenovable,
      item.diaspagarweb = diaspagarweb,
      item.diaspagarimagenadicional = diaspagarimagenadicional,
      item.diaspagarbarner = diaspagarbarner,
      item.diaspagarbarnersuperior = diaspagarbarnersuperior
    })
    console.log(texto)
  }

  /*deleteAnuncio(titulo){
    let index = this.anuncio.indexOf(titulo)
    this.anuncio.splice(index,1)
  }*/

  getTexto(){
    return this.texto
  }

  setTexto(texto){
    this.texto = texto
  }

  getEstado(){
    return this.estado
  }
  setEstado(estado){
    this.estado = estado
  }
  setNuevo(nuevo){
    this.nuevo = nuevo
  }
  setPrecio(precio){
    this.precio = precio
  }
  setTitulo(titulo){
    this.titulo = titulo
  }
  setNombre(nombre){
    this.nombre = nombre
  }
  setTelefono(telefono){
    this.telefono = telefono
  }

  setEmail(email){
    this.email = email
  }
  setMunicipio(municipio){
    this.municipio = municipio
  }

  setProvincia(provincia){
    this.provincia = provincia
  }

  setImages(imagen){
    this.imagen = imagen
  }

  setEtiqueta(etiqueta){
    this.etiqueta = etiqueta
  }

  setAccion(accion){
    this.accion = accion
  }

  
  setSelectaccion(selectaccion){
    this.selectaccion = selectaccion
  }
  setSelectprovincia(selectprovincia){
    this.selectprovincia = selectprovincia
  }

  setSelectmunicipio(selectmunicipio){
    this.selectmunicipio = selectmunicipio
  }

  setDestacado(destacado){
    this.destacado = destacado
  }
  
  setMasetiqueta(masetiqueta){
    this.masetiqueta = masetiqueta
  }

  setAutorrenovable(autorrenovable){
    this.autorrenovable = autorrenovable
  }

  setFrecuencia(frecuencia){
    this.frecuencia = frecuencia
  }

  setWeb(web){
    this.web = web
  }
  setUrl(url){
    this.url = url
  }
  setWebanuncio(webanuncio){
    this.webanuncio = webanuncio
  }
  setNombreimagen(nombreimagen){
    this.nombreimagen = nombreimagen
  }

  setImagenadicional(imagenadicional){
    this.imagenadicional = imagenadicional
  }
  setImagenbarnerinferior(imagenbarnerinferior){
    this.imagenbarnerinferior = imagenbarnerinferior
  }
  setImagenbarnersuperior(imagenbarnersuperior){
    this.imagenbarnersuperior = imagenbarnersuperior
  }
  setDiaspagardestacado(diaspagardestacado){
    this.diaspagardestacado = diaspagardestacado
  }
  setDiaspagardescribe(diaspagardescribe){
    this.diaspagardescribe = diaspagardescribe
  }
  setDiaspagarautorrenovable(diaspagarautorrenovable){
    this.diaspagarautorrenovable = diaspagarautorrenovable
  }
  setDiaspagarweb(diaspagarweb){
    this.diaspagarweb = diaspagarweb
  }
  setDiaspagarimagenadicional(diaspagarimagenadicional){
    this.diaspagarimagenadicional = diaspagarimagenadicional
  }
  setDiaspagarbarner(diaspagarbarner){
    this.diaspagarbarner = diaspagarbarner
  }
  setDiaspagarbarnersuperior(diaspagarbarnersuperior){
    this.diaspagarbarnersuperior = diaspagarbarnersuperior
  }


  getStates(term: string = null): Observable<string[]> {
    return Observable.create((observer) => {
      let getEtiquetaNamePromise: Promise<any>;

      getEtiquetaNamePromise = new Promise((resolve) => {
        fetch('./assets/data/etiquetas.json').then(res => res.json())
          .then(json => {
            const results = json.states;
            resolve(results);
          });
      });

      getEtiquetaNamePromise.then((data) => {
        if (term) {
          data = data.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        observer.next(data);
      });
    });
  }


  getNuevo(){
    return this.nuevo
  }
  getPrecio(){
    return this.precio
  }
  getTitulo(){
    return this.titulo
  }
  getNombre(){
    return this.nombre
  }
  getTelefono(){
    return this.telefono
  }

  getEmail(){
    return this.email
  }
  getMunicipio(){
    return this.municipio
  }

  getProvincia(){
    return this.provincia
  }

  getImages(){
    return this.imagen
  }

  getEtiqueta(){
    return this.etiqueta
  }

  getAccion(){
    return this.accion
  }

  
  getSelectaccion(){
    return this.selectaccion
  }
  getSelectprovincia(){
    return this.selectprovincia
  }

  getSelectmunicipio(){
    return this.selectmunicipio
  }

  getDestacado(){
    return this.destacado
  }
  
  getMasetiqueta(){
    return this.masetiqueta
  }

  getAutorrenovable(){
    return this.autorrenovable
  }

  getFrecuencia(){
    return this.frecuencia
  }

  getWeb(){
    return this.web
  }
  getUrl(){
    return this.url
  }
  getWebanuncio(){
    return this.webanuncio
  }
  getNombreimagen(){
    return this.nombreimagen
  }

  getImagenadicional(){
    return this.imagenadicional
  }
  getImagenbarnerinferior(){
    return this.imagenbarnerinferior
  }
  getImagenbarnersuperior(){
    return this.imagenbarnersuperior
  }
  getDiaspagardestacado(){
    return this.diaspagardestacado
  }
  getDiaspagardescribe(){
    return this.diaspagardescribe
  }
  getDiaspagarautorrenovable(){
    return this.diaspagarautorrenovable
  }
  getDiaspagarweb(){
    return this.diaspagarweb
  }
  getDiaspagarimagenadicional(){
    return this.diaspagarimagenadicional
  }
  getDiaspagarbarner(){
    return this.diaspagarbarner
  }
  getDiaspagarbarnersuperior(){
    return this.diaspagarbarnersuperior
  }

  setAnuncioId(setAnuncioId){
    this.anuncioId = setAnuncioId
  }

  getAnuncioId(){
    return this.anuncioId
  }

}
