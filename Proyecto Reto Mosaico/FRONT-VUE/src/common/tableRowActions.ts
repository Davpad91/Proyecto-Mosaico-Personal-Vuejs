export const insertElement = (
  rows: any[],
  data: any,
  ignoreKeys?: string[],
  resolveOptions?: { keyToResolve: string; handle: (value: any) => any | void }
): void => {
  let dataKeys = Object.keys(data);
  dataKeys = dataKeys.filter((element) => !ignoreKeys?.includes(element));

  const newRow: any = {};
  for (let index = 0; index < dataKeys.length; index++) {
    newRow[dataKeys[index]] = data[dataKeys[index]];
  }

  if (resolveOptions) {
    newRow[resolveOptions.keyToResolve] = resolveOptions.handle(
      newRow[resolveOptions.keyToResolve]
    );
  }

  rows.unshift(newRow);
};

export const updateRowElement = (
  rows: any[],
  id: string | number,
  data: any
): void => {
  rows.forEach((element: any) => {
    if (element.id == id) {
      for (const [key, value] of Object.entries(data)) {
        if (key != 'id') element[key] = value;
      }
    }
  });
};

export const deleteRowElement = (rows: any[], id: string | number): void => {
  rows.forEach((element: any) => {
    if (element.id == id) {
      rows.splice(rows.indexOf(element), 1);
    }
  });
};
