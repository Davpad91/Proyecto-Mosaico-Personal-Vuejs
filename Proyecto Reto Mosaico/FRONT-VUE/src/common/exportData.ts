import { exportFile, QTableProps } from 'quasar';
import { notifications } from '.';

const wrapCsvValue = (
  column_label: string,
  formatFn?: (val: any, row: any) => any,
  row?: any
): string => {
  let formatted =
    formatFn !== void 0 ? formatFn(column_label, row) : column_label;

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted);

  formatted = formatted
    .split('"')
    .join('""')
    .split('\n')
    .join('\\n')
    .split('\r')
    .join('\\r');

  return `"${formatted}"`;
};

export const exportDataFromTable = (
  columns: QTableProps['columns'],
  rows: any,
  title: string
): void => {
  if (!columns) return;
  const content = columns
    .map((col: typeof columns[0]) => wrapCsvValue(col.label))
    .concat(
      rows.map((row: any) =>
        columns
          .map((col: typeof columns[0]) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n');

  const status: true | Error = exportFile(`${title}.csv`, content, 'text/csv');
  if (status !== true) {
    notifications.showErrorNotification(
      'El navegador bloqueó la descarga del archivo'
    );
  }
};
