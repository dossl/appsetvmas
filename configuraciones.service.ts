import { Injectable } from '@angular/core';
import {ProvinciasModel} from '../models/provincias.model';
import {MunicipiosModel} from '../models/municipios.model';




@Injectable()
export class ConfiguracionesService {
      //readonly rootURL = 'http://localhost:8100/api/'; // LOCAL OSMEL DESARROLLO
    // readonly rootURL = 'http://localhost/setvmas/api/'; // LOCAL OSMEL IIS
    //   readonly rootURL = 'https://setvmas.com/SetVMasFinal/api/'; // HOSTING
       readonly rootURL = 'https://setvmas.com/api/api/'; // HOSTING NUEVO

     cantidadPorPaginasHome = 8;

  constructor() { }
  getRootURLApi() {
    return this.rootURL;
  }

  getProviciasAll() {
    const listaProvincias: ProvinciasModel[] = [];
    const Habana = new ProvinciasModel('La Habana');
    Habana.Municipios = [new MunicipiosModel('Arroyo Naranjo'), new MunicipiosModel('Boyeros'), new MunicipiosModel('Centro Habana'),
      new MunicipiosModel('Cerro'), new MunicipiosModel('Cotorro'), new MunicipiosModel('Guanabacoa'),
      new MunicipiosModel('Diez de Octubre'), new MunicipiosModel('Habana del Este'), new MunicipiosModel('Habana Vieja'),
      new MunicipiosModel('La Lisa'), new MunicipiosModel('Marianao'), new MunicipiosModel('Playa'),
      new MunicipiosModel('Plaza de la Revolución'), new MunicipiosModel('Regla'), new MunicipiosModel('San Miguel del Padrón')];
    listaProvincias.push(Habana);

    const Pinar = new ProvinciasModel('Pinar del Río');
    Pinar.Municipios = [ new MunicipiosModel('Consolación del Sur'), new MunicipiosModel('Guane'), new MunicipiosModel('La Palma'),
      new MunicipiosModel('Los Palacios'), new MunicipiosModel('Mantua'), new MunicipiosModel('Minas de Matahambre'),
      new MunicipiosModel('Pinar del Río'), new MunicipiosModel('San Juan y Martínez'), new MunicipiosModel('San Luis'),
      new MunicipiosModel('Sandino'), new MunicipiosModel('Viñales')];
    listaProvincias.push(Pinar);


    const Isla = new ProvinciasModel('Isla de la Juventud');
    Isla.Municipios = [ ];
    listaProvincias.push(Isla);


    const Artemisa = new ProvinciasModel('Artemisa');
    Artemisa.Municipios = [new MunicipiosModel('Alquízar'), new MunicipiosModel('Artemisa'), new MunicipiosModel('Bahía Honda'),
      new MunicipiosModel('Bauta'), new MunicipiosModel('Caimito'),  new MunicipiosModel('Candelaria'), new MunicipiosModel('Guanajay'),
      new MunicipiosModel('Guira de Melena'), new MunicipiosModel('Mariel'), new MunicipiosModel('San Antonio de los Baños'),
      new MunicipiosModel('San Cristobal')];
    listaProvincias.push(Artemisa);

    const Mayabeque = new ProvinciasModel('Mayabeque');
    Mayabeque.Municipios = [ new MunicipiosModel('Batabanó'),  new MunicipiosModel('Bejucal'), new MunicipiosModel('Guines'),
      new MunicipiosModel('Jaruco'), new MunicipiosModel('Madruga'), new MunicipiosModel('Melena del Sur'),
      new MunicipiosModel('Nueva Paz'), new MunicipiosModel('Quivicán'), new MunicipiosModel('San José de las Lajas'),
      new MunicipiosModel('San Nicolás de Bari'), new MunicipiosModel('Santa Cruz del Norte')];
    listaProvincias.push(Mayabeque);

    const Matanzas = new ProvinciasModel('Matanzas');
    Matanzas.Municipios = [ new MunicipiosModel('Calimete'),  new MunicipiosModel('Cárdenas'), new MunicipiosModel('Ciénaga de Zapata'),
      new MunicipiosModel('Colón'), new MunicipiosModel('Jaguey Grande'), new MunicipiosModel('Jovellanos'), new MunicipiosModel('Limonar'),
      new MunicipiosModel('Los Arabos'), new MunicipiosModel('Martí'), new MunicipiosModel('Matanzas'),
      new MunicipiosModel('Pedro Betancourt'), new MunicipiosModel('Perico'), new MunicipiosModel('Unión de Reyes')];
    listaProvincias.push(Matanzas);

    const Villa = new ProvinciasModel('Villa Clara');
    Villa.Municipios = [  new MunicipiosModel('Caibarién'), new MunicipiosModel('Camajuaní'), new MunicipiosModel('Cifuentes'),
      new MunicipiosModel('Corralillo'), new MunicipiosModel('Encrucijada'), new MunicipiosModel('Placetas'),
      new MunicipiosModel('Quemado de Guines'),  new MunicipiosModel('Ranchuelos'), new MunicipiosModel('Remedios'),
      new MunicipiosModel('Sagua la Grande'), new MunicipiosModel('Santa Clara'), new MunicipiosModel('Santo Domingo')];
    listaProvincias.push(Villa);

    const Cienf = new ProvinciasModel('Cienfuegos');
    Cienf.Municipios = [new MunicipiosModel('Abreus'), new MunicipiosModel('Aguada de Pasajeros'), new MunicipiosModel('Cienfuegos'),
      new MunicipiosModel('Cruces'), new MunicipiosModel('Cumanayagua'), new MunicipiosModel('Palmira'), new MunicipiosModel('Rodas'),
      new MunicipiosModel('Santa Isabel de las Lajas')];
    listaProvincias.push(Cienf);

    const SSP = new ProvinciasModel('Sancti Spíritus');
    SSP.Municipios = [ new MunicipiosModel('Cabaiguan'), new MunicipiosModel('Fomento'), new MunicipiosModel('Jatibonico'),
      new MunicipiosModel('La Sierpe'), new MunicipiosModel('Sancti Spíritus'), new MunicipiosModel('Taguasco'),
      new MunicipiosModel('Trinidad'), new MunicipiosModel('Yaguajay')];
    listaProvincias.push(SSP);

    const Ciego = new ProvinciasModel('Ciego de ávila');
    Ciego.Municipios = [ new MunicipiosModel('Ciro Redondo'), new MunicipiosModel('Baraguá'), new MunicipiosModel('Bolivia'),
      new MunicipiosModel('Chambas'), new MunicipiosModel('Ciego de ávila'), new MunicipiosModel('Florencia'),
      new MunicipiosModel('Majagua'), new MunicipiosModel('Morón'), new MunicipiosModel('Primero de Enero'),
      new MunicipiosModel('Venezuela')];
    listaProvincias.push(Ciego);

    const Cama = new ProvinciasModel('Camaguey');
    Cama.Municipios = [ new MunicipiosModel('Camaguey'), new MunicipiosModel('Carlos Manuel de Céspedes'), new MunicipiosModel('Esmeralda'),
      new MunicipiosModel('Florida'), new MunicipiosModel('Guaimaro'), new MunicipiosModel('Jimaguayú'), new MunicipiosModel('Minas'),
      new MunicipiosModel('Najasa'), new MunicipiosModel('Nuevitas'), new MunicipiosModel('Santa Cruz del Sur'),
      new MunicipiosModel('Sibanic�'), new MunicipiosModel('Sierra de Cubitas'), new MunicipiosModel('Vertientes')];
    listaProvincias.push(Cama);

    const Tunas = new ProvinciasModel('Las Tunas');
    Tunas.Municipios = [ new MunicipiosModel('Amancio Rodríguez'), new MunicipiosModel('Colombia'), new MunicipiosModel('Jesús Menéndez'),
      new MunicipiosModel('Jobabo'), new MunicipiosModel('Las Tunas'), new MunicipiosModel('Majibacoa'), new MunicipiosModel('Manatí'),
      new MunicipiosModel('Puerto Padre')];
    listaProvincias.push(Tunas);

    const Holguin = new ProvinciasModel('Holguín');
    Holguin.Municipios = [ new MunicipiosModel('Antilla'), new MunicipiosModel('B�guanos'), new MunicipiosModel('Banes'),
      new MunicipiosModel('Cacocum'), new MunicipiosModel('Calixto García'), new MunicipiosModel('Cueto'),
      new MunicipiosModel('Frank País'), new MunicipiosModel('Gibara'), new MunicipiosModel('Holguín'), new MunicipiosModel('Mayarí'),
      new MunicipiosModel('Moa'), new MunicipiosModel('Rafael Freyre'), new MunicipiosModel('Sagua de Tánamo'),
      new MunicipiosModel('Urbano Noris')];
    listaProvincias.push(Holguin);

    const Granma = new ProvinciasModel('Granma');
    Granma.Municipios = [ new MunicipiosModel('Bartolom� Mas�'), new MunicipiosModel('Bayamo'), new MunicipiosModel('Buey Arriba'),
      new MunicipiosModel('Campechuela'), new MunicipiosModel('Cauto Cristo'), new MunicipiosModel('Guisa'),
      new MunicipiosModel('Jiguan�'), new MunicipiosModel('Manzanillo'), new MunicipiosModel('Media Luna'), new MunicipiosModel('Niquero'),
      new MunicipiosModel('Pil�n'), new MunicipiosModel('R�o Cauto'), new MunicipiosModel('Yara')];
    listaProvincias.push(Granma);

    const Stgo = new ProvinciasModel('Santiago de Cuba');
    Stgo.Municipios = [ new MunicipiosModel('Contramaestre'), new MunicipiosModel('Guam�'), new MunicipiosModel('Julio Antonio Mella'),
      new MunicipiosModel('Palma Soriano'), new MunicipiosModel('San Luis'), new MunicipiosModel('Santiago de Cuba'),
      new MunicipiosModel('Segundo Frente'), new MunicipiosModel('Songo la Maya'), new MunicipiosModel('Tercer Frente')];
    listaProvincias.push(Stgo);

    const Gtm = new ProvinciasModel('Guat�namo');
    Gtm.Municipios = [ new MunicipiosModel('Baracoa'), new MunicipiosModel('Caimanera'), new MunicipiosModel('El Salvador'),
      new MunicipiosModel('Guant�namo'), new MunicipiosModel('Im�as'), new MunicipiosModel('Mais�'), new MunicipiosModel('Manuel Tames'),
      new MunicipiosModel('Niceto P�rez'), new MunicipiosModel('San Antonio del Sur'), new MunicipiosModel('Yateras')];
    listaProvincias.push(Gtm);

    return listaProvincias;
  }


  getCantPorPaginasHome() {
    return this.cantidadPorPaginasHome;
  }

  getEstadosDenuncias() {
    const estados: string[] = ['En Revisi�n', 'Publicable', 'No Publicable'];
    return estados;
  }

  getEstadosPagos() {
    const estados: string[] = ['Confirmado', 'No Confirmado'];
    return estados;
  }

  getAccionesAnuncio () {
    return ['Vendo', 'Compro', 'Alquilo', 'Busco', 'Cambio', 'Regalo', 'Servicio', 'Informaci�n'];
  }
  getRoles() {
    return ['Super Administrador', 'Administrador', 'Director', 'Clasificador', 'Colaborador', 'Cliente'];
  }
  getFrecuenciaAutorenovables():any[] {
    return [{ Nombre: 'Cada 24 horas', NombreCodigo: 'AUTO_24' }, { Nombre: 'Cada 6 horas', NombreCodigo: 'AUTO_6' }, { Nombre: 'Cada 1 hora', NombreCodigo: 'AUTO_1' }, { Nombre: 'Top', NombreCodigo: 'AUTO_TOP' } ];
  }
  getFormasPago() {
    return ['Trasnferencia Bancaria', 'Trasnferencia de Saldo'];
  }
}

