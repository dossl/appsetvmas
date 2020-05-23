import { AnunciosModel } from "../models/anuncios.model";

export class Banner {

  constructor(
    public BannerId: number,
    public Nombre: string,
    public Url: string,
    public Tipo: string,
    public CantidadDias: number,
    public ImageContent: string,
    public ImageMimeType: string,
    public ImageName: string,
    public FechaCreacion: Date,
    public FechaUltView: Date,
    public FechaDesactivacion: Date,
    public IsActivo: boolean,
    public AnuncioId: number,
    //public Anuncio: AnunciosModel
  ) { }
}
