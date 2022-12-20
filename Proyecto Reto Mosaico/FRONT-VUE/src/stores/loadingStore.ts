import { defineStore, StoreDefinition } from 'pinia';
import { QSpinnerGears, Loading } from 'quasar'

export const LoadingStore: StoreDefinition = defineStore('LoadingStore', {
    actions: {
        showLoading(): void {
            Loading.show({
                spinner: QSpinnerGears,
                spinnerColor: 'black',
                messageColor: 'white',
                backgroundColor: 'black',
                message: 'Cargando...'
            })
        },
        hideLoading(): void {
            Loading.hide();
        },
    },
});
