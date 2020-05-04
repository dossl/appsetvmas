import { CategoriaEtiqueta } from './categoria-etiqueta.model';
import { Etiqueta } from './etiqueta.model';

export class Categoria {
  constructor(public CategoriaId: number,
    public Nombre: string,
   // public Imagen: string,
    public ImageContent: any,
    public ImageMimeType: string,
    public ImageName: string,
    public CantAutoRenovables: number,
  //  public CategoriaEtiqueta: CategoriaEtiqueta []
  ) {
  }
  public Etiquetas: Etiqueta[];
}
