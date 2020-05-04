import { CategoriaEtiqueta } from './categoria-etiqueta.model';
import { Categoria } from './categoria.model';


export class Etiqueta {
  constructor(
    public EtiquetaId:number,
        public Nombre:string,
    public CantUsada?: number,
   // public CategoriaEtiqueta?: CategoriaEtiqueta[]
   public IsFree?: boolean,
    public Categorias?: Categoria[]
  ) { }
}
