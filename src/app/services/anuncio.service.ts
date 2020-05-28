import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { Etiqueta } from '../models/etiqueta.model';
import { AnunciosModel } from '../models/anuncios.model';
import { Usuario } from '../models/usuario.model';
import { Categoria } from '../models/categoria.model';
import { PointSell } from '../models/sell-points.model';
import { Purchase } from '../models/purchase.model';
import { BuscarAnunciosModel } from '../models/buscar-anuncios.model';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  anuncioId: any;
  anuncio: any;
  etiquet: any;
  pointSell: PointSell;
  purchaseData: Purchase;


  readonly rootURL;
  constructor(private http: HttpClient, private servConfiguracion: SettingsService) {
    this.rootURL = this.servConfiguracion.getRootURLApi();
  }

  /*********Api Request******** */

  getAnuncios(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios', {
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

  getAnunciosById(id) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios/' + id).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  getAnunciosRecientes(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios/Recientes', {
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

  getAnunciosPopulares(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Anuncios/Populares', {
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
      this.http.post(this.rootURL + 'Anuncios/Avanzados', buscar).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  buscarAnunciosAvanzadosCount(buscar: BuscarAnunciosModel) {
    return new Promise(resolve => {
      this.http.post(this.rootURL + 'Anuncios/AvanzadosCount', buscar).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });


  }

  getEtiquetas(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Etiquetas', {
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

  insertarEtiquetas(formData) {
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

  updateAnuncio(anuncioId, data) {
    return new Promise((resolve, reject) => {
      this.http.put(this.rootURL + 'Anuncios/' + anuncioId, data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteAnuncio(id) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.rootURL + 'Anuncios/' + id)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getBannerSuperior() {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Banners/Tipo/Superior escritorio').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getBannerInferior() {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Banners/Tipo/Inferior').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getCategoriaAll(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'Categorias', {
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
      this.http.get(this.rootURL + 'PaginasEstaticas/Correo', {
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

  getconfiguration(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'VariableConfiguracions', {
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
      this.http.get(this.rootURL + 'VariableConfiguracions/Codigo', {
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
      this.http.post(this.rootURL + 'Usuarios/SingIn', { 'username': Correo, 'password': Password })
        .subscribe(res => {
          console.log('token ' + JSON.parse(JSON.stringify(res)).token);
          localStorage.setItem('token', JSON.parse(JSON.stringify(res)).token);
          this.getCurrentUser();
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

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      this.http.get(this.rootURL + 'Usuarios/Current')
        .subscribe(res => {
          localStorage.setItem('currentuser', JSON.stringify(res));
          resolve(res as Usuario);
        }, (err) => {
          reject(err);
        });
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
  }

  register(Correo: string, Password: string, Anfitrion: string, Telefono: string) {
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
      this.http.get(this.rootURL + 'Usuarios/Codigo', {
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
      this.http.get(this.rootURL + 'Usuarios/Recuperar/', {
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
      this.http.get(this.rootURL + 'TipoOpcions', {
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
      this.http.get(this.rootURL + 'Anuncios/CountHome', {
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
      this.http.post(this.rootURL + 'pagoes', this.purchaseData).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }

  sellPoint(userId, buyer, amount) {
    this.pointSell = new PointSell(userId, buyer, amount);
    return new Promise(resolve => {
      this.http.post(this.rootURL + 'VenderPuntos', this.pointSell).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  /********************************************************************************************** */

  setAnuncioId(setAnuncioId) {
    this.anuncioId = setAnuncioId;
  }

  getAnuncioId() {
    return this.anuncioId;
  }
}
