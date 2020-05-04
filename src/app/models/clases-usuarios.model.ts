export class ClasesUsuariosModel {
  constructor(public ClasesUsuariosId: number,
              public  Nombre: string,
              public  FactorBonificacionCompra: number,
              public  BonificacionPorAlcanzarla: number,
              public  BonificacionPorAnuncioDiario: number,
              public  RequisitoAntigueda: number,
              public  RequisitoCompras: number,
              public  RequisitoCantidadReferidos: number) {}
}
