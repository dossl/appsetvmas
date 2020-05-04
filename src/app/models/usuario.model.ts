import { ClasesUsuariosModel } from "./clases-usuarios.model";

export class Usuario {
  public UsuarioId: number;
  public Codigo: string;
  public Correo: string;
  public Password: string;
  public Rol: string;
  public Telefono: string;

  public Activo: boolean;
  public Bloqueado: boolean;
  public Puntos: number;
  

  public FechaCreacion: Date;
  public FechaUltimaEntrada: Date;
  public Anfitrion: string;

  public ClasesUsuarios: ClasesUsuariosModel;
  public CantReferidos: number;

  public Url: string;
  public FechaUltimaView : Date;
  //public Edad: number;
  //public Direccion: string;
  //public Municipio: string;
  //public Provincia: string;
  public Clase: string;
  public FechaModificacion: Date;
  public FechaDesbloqueo: Date;
  public FechaUltimoAnuncio: Date;
  //public Usuarios: Usuario[];

  //public Url: string;
  //public Edad: number;
  //public Direccion: string;
  //public Municipio: string;
  //public Provincia: string;
  //public FechaModificacion: Date;
  //public FechaDesbloqueo: Date;
  //public FechaUltimoAnuncio: Date;
  //public FechaUltimaView: Date;
  //public Usuarios: Usuario[];


  constructor(
   )
    { }
}
