import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Categoria } from '../models/categoria.model';
import { Etiqueta } from '../models/etiqueta.model';
import { NetworkService } from './network.service';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';
import { MotivoDenuncia } from '../models/motivo-denuncia.model';
import { AnuncioService } from './anuncio.service';
import { VariableConfiguracion } from '../models/variable-configuracion.model';

export class StaticData {
  public categories: Array<Categoria>;
  public reportReasons: Array<MotivoDenuncia>;
  public configurations?: any;
}

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  CATEGORIES_KEY = 'SETVMAS_CATEGORIES';
  readonly rootURL: string;
  data: StaticData;
  lastUpdate: number;
  isConnected: boolean;

  constructor(private http: HttpClient, private network: NetworkService, private service: AnuncioService) {
    this.rootURL = environment.rootURL;
    network.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      this.init();
    });
  }

  async getData(callback) {
    this.init(callback);
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

  private async init(callback = (data: StaticData) => { }) {
    if (!this.data) {
      this.data = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY));
      if (!this.data) {
        await this.loadData();
      }
    }
    console.log(this.data);
    callback(this.data);
  }

  private async loadData() {
    try {
      const res = await this.getCategoriaAll('', '', 'asc', 1, 2000);
      const categories = res as Array<Categoria>;
      // for (const cat of categories) {
      //   const tags = await this.getEtiquetasByCategoria(cat.CategoriaId);
      //   cat.Etiquetas = tags as Etiqueta[];
      // }

      const reportReasons = await this.getReportReasonsAll('Nombre', '', 'asc', 1, 2000) as Array<MotivoDenuncia>;
      const configurations = await this.loadConfigVars();
      this.data = {
        categories,
        reportReasons,
        configurations
      };
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.log(err);
    }
  }

  private getCategoriaAll(col, filter, sortDirection, pageIndex, pageSize) {
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

  private getReportReasonsAll(col, filter, sortDirection, pageIndex, pageSize) {
    return new Promise(resolve => {
      this.http.get(this.rootURL + 'MotivoDenuncias', {
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

  getEtiquetasByCategoria(id) {
    return this.http.get<Array<Etiqueta>>(this.rootURL + 'Categorias/Etiqueta/' + id).toPromise();
  }

  private async loadConfigVars() {
    const config = {};
    const generals = await this.service.getconfiguration('', '', 'asc', 1, 100) || [];

    for (const g of generals) {
      config[g.NombreCodigo] = g.Valor;
    }

    return config;
  }


}
