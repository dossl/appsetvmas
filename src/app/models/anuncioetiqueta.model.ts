import {AnunciosModel} from './anuncios.model';
import {Etiqueta} from './etiqueta.model';


export class AnuncioetiquetaModel {
  constructor ( public  AnuncioEtiquetaId: number,
                public  AnuncioId: number,
                public  EtiquetaId: number,
                public Anuncio: AnunciosModel,
    public etiqueta: Etiqueta,
    public IsFree: boolean) { }
}
