export interface User {
  id: number;
  name?: string;
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  nombre_completo?: string;
  curp?: string;
  avatar?: string;
  email: string;

  roles: string[];
  permissions: string[];
}
