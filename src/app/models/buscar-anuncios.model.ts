import {AnuncioetiquetaModel} from '../models/anuncioetiqueta.model';


export class BuscarAnunciosModel {
  constructor () {}
  public  AnuncioId: number;
  public  Titulo: string;
  public  Descripcion: string;
  public  NombreContacto: string;
  public  TelefonoContacto: string;
  public  CorreoContacto: string;
  public  PrecioMin: number;
  public  PrecioMax: number;
  public  IsWeb: boolean;
  public  HasFoto: boolean;
  public  ProductoNuevo: boolean;
  public  Url: string;
  public  Provincia: string;
  public  Municipio: string;
  public Accion: string;
  public ListaEtiquetas: AnuncioetiquetaModel[];
  public Categoria: string;
  public EtiquetasConcat: string;
  public indexPage: number;
  public sizePage: number;

}
