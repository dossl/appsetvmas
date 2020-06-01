import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Usuario } from '../../models/usuario.model';
import { AnunciosModel } from '../../models/anuncios.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Categoria } from '../../models/categoria.model';
import { ProvinciasModel } from '../../models/provincias.model';
import { MunicipiosModel } from '../../models/municipios.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Etiqueta } from '../../models/etiqueta.model';
import { BuscarAnunciosModel } from '../../models/buscar-anuncios.model';
import { PopoverController, LoadingController, ToastController, NavController, Platform, AlertController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { SettingsService } from '../../services/settings.service';
import { NetworkService } from '../../services/network.service';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { AnuncioetiquetaModel } from '../../models/anuncioetiqueta.model';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Banner } from '../../models/banner.model';
import { DetailsPage } from '../details/details.page';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as _ from 'lodash';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocalDataService, StaticData } from '../../services/local-data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, AfterViewInit {

  filters: BuscarAnunciosModel = {};
  localities = [];
  categories: Array<Categoria> = [];
  tags: Array<Etiqueta>;
  actions: Array<string>;

  @ViewChild('categorySelect', { static: false }) categorySelect: IonicSelectableComponent;
  @ViewChild('municipioSelect', { static: false }) municipioSelect: IonicSelectableComponent;

  constructor(
    public service: AnuncioService,
    private servCo: SettingsService,
    public navCtrl: NavController,
    public platform: Platform,
    private localService: LocalDataService
  ) { }

  ngOnInit() {
    this.filters = this.service.filters || {};
  }

  ngAfterViewInit() {
    _.each(this.servCo.getProviciasAll(), (prov) => {
      _.each(prov.Municipios, (municipio) => {
        municipio.provincia = prov;
        this.localities.push(municipio);
      });
    });

    this.localService.getData((data: StaticData) => this.categories = data.categories);
    this.actions = this.servCo.getAccionesAnuncio();
  }

  municipioChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    if (event.value) {
      this.filters.Municipio = event.value.Nombre;
      this.filters.Provincia = event.value.provincia.Nombre;
    }
  }

  categoryChange(event: {
    component: IonicSelectableComponent,
    value: Categoria
  }) {
    this.filters.Categoria = event.value.Nombre;
    this.tags = event.value.Etiquetas;
  }

  clear() {
    this.filters = {};
    this.municipioSelect.clear();
    this.categorySelect.clear();
    this.tags = [];
    this.service.filters = this.filters;
  }
  save() {
    this.service.filters = this.filters;
    this.navCtrl.navigateForward('/home');
  }
}
