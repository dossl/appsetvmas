import {MunicipiosModel} from './municipios.model';

export class ProvinciasModel {
  constructor (
    public Nombre: string
  ) {}
 public Municipios: MunicipiosModel[];
}
