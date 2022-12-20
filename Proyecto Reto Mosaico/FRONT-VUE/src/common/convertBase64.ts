import { QRejectedEntry } from 'quasar';
import { notifications } from '.';

const errorsUpload = {
  accept: 'Solo se permiten imagenes en formato .jpg, .png, .svg',
  'max-file-size': 'Solo se permiten tamaños de 2MB',
  'max-total-size': 'Solo se permiten tamaños de 2MB',
};

export const onRejected = (rejectedEntries: QRejectedEntry[]): void => {
  rejectedEntries.forEach((entry: any) => {
    const errorName: string = entry.failedPropValidation;
    Object.entries(errorsUpload).forEach(([key, value]) => {
      if (key === errorName) {
        notifications.showWarningNotification(value);
      }
    });
  });
};

export const convertImage = (
  file: Blob
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    getBase64(file)
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        notifications.showErrorNotification(
          'Ha ocurrido un erro al cargar la imagen'
        );
        reject();
      });
  });
};

const getBase64 = (file: Blob): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
