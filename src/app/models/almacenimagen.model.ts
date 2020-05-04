import { AnunciosModel } from "./anuncios.model";
export class Almacenimagen {
  constructor(
    public AlmacenImagenId: number,
    public Imagen: string,
    public ImageContent: string,
    public ImageMimeType: string,
    public ImageName: string,
      public AnuncioId: number,
      public IsFree: Boolean,
    //public Anuncio: AnunciosModel
  ) { }
}
