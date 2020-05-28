import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Categoria } from '../models/categoria.model';
import { Etiqueta } from '../models/etiqueta.model';
import { NetworkService } from './network.service';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  CATEGORIES_KEY = 'SETVMAS_CATEGORIES';
  readonly rootURL: string;
  categories: Array<Categoria>;
  lastUpdate: number;
  isConnected: boolean;

  constructor(private http: HttpClient, private network: NetworkService) {
    this.rootURL = environment.rootURL;
    network.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      this.init();
    });
  }

  async getCategorias(callback) {
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

  private async init(callback = (categories: Array<Categoria>) => { }) {
    if (!this.categories) {
      this.categories = JSON.parse(localStorage.getItem(this.CATEGORIES_KEY));
      if (!this.categories) {
        await this.loadData();
      }
    }
    callback(this.categories);
  }

  private async loadData() {
    try {
      const res = await this.getCategoriaAll('', '', 'asc', 1, 2000);
      const cats = res as Array<Categoria>;
      for (const cat of cats) {
        const tags = await this.getEtiquetasByCategoria(cat.CategoriaId);
        cat.Etiquetas = tags as Etiqueta[];
      }
      this.categories = cats;
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(this.categories));
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

  private getEtiquetasByCategoria(id) {
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
