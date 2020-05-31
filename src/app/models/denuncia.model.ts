export class Denuncia {
  constructor(
    public DenunciaId: number,
    public Estado: string,
    public FechaCreacion: Date,
    public FechaModificacion: Date,
    public MotivoDenunciaId: number,
    public UsuarioId: number,
    public AnuncioId: number
  ) { }
  public Correo: string;
  public Titulo: string;
  public MotivoDenuncia: string;
}


