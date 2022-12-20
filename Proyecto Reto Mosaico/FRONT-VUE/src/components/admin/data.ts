import { QTableProps } from 'quasar';

export const usersColumns = (): QTableProps['columns'] => [
  {
    name: 'id',
    align: 'left',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nombre',
    field: 'name',
    sortable: true,
  },
  {
    name: 'idCard',
    align: 'left',
    label: 'Cédula',
    field: 'idCard',
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
    sortable: true,
  },
  {
    name: 'phone',
    align: 'left',
    label: 'Teléfono',
    field: 'phone',
    sortable: true,
  },
  {
    name: 'position',
    align: 'left',
    label: 'Cargo',
    field: 'position',
    sortable: true,
  },
];

export const rolesColumns = (): QTableProps['columns'] => [
  {
    name: 'id',
    align: 'left',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nombre',
    field: 'name',
    sortable: true,
  },
  {
    name: 'hierarchy',
    align: 'center',
    label: 'Nivel jerárquico',
    field: 'hierarchy',
    sortable: true,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Descripción',
    field: 'description',
    sortable: true,
  },
];

export const devicesColumns = (): QTableProps['columns'] => [
  {
    name: 'id',
    align: 'left',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
  {
    name: 'device_name',
    align: 'left',
    label: 'Nombre',
    field: 'device_name',
    sortable: true,
  },
  {
    name: 'os_name',
    align: 'left',
    label: 'Sistema operativo',
    field: 'os_name',
    sortable: true,
  },
  {
    name: 'brand',
    align: 'left',
    label: 'Fabricante',
    field: 'brand',
    sortable: true,
  },
  {
    name: 'model',
    align: 'left',
    label: 'Modelo',
    field: 'model',
    sortable: true,
  },
  {
    name: 'serial',
    align: 'left',
    label: 'Serial',
    field: 'serial',
    sortable: true,
  },
];

export const ratingsColumns = (): QTableProps['columns'] => [
  {
    name: 'id',
    align: 'left',
    label: 'ID',
    field: 'id',
    sortable: true,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Descripción',
    field: 'description',
    sortable: true,
  },
  {
    name: 'user',
    align: 'left',
    label: 'Usuario',
    field: 'user',
    sortable: true,
  },
  {
    name: 'grade',
    align: 'left',
    label: 'Calificación',
    field: 'grade',
    sortable: true,
  },
  {
    name: 'date',
    align: 'left',
    label: 'Fecha (Año - Mes - Día)',
    field: 'date',
    sortable: true,
  },
  {
    name: 'time',
    align: 'left',
    label: 'Hora',
    field: 'time',
    sortable: true,
  },
];
