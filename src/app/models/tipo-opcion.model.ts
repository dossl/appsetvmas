export class TipoOpcionModel {
  constructor(public TipoOpcionId: number,
              public Nombre: string,
              public NombreCodigo: string,
              public TextoLabel: string,
              public Precio: number,
              public CantidadFrecuencia: number,
              public MinimoComprar: number) {}
}
