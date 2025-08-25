// export interface ChainCustody {
//   id: number;
//   numero_unico_caso: string;
//   folio: string;
//   intervencion_lugar: string;
//   intervencion_hora_fecha: Date;
//   motivo_registro: string;
//   created_at: Date;
//   updated_at: Date;
// }

export interface ChainCustody {
  id: string;
  numero_unico_caso: string;
  folio: string;
  intervencion_lugar: string;
  intervencion_hora_fecha: string;
  motivo_registro: string;
  created_at: string;
  updated_at: string;
}
