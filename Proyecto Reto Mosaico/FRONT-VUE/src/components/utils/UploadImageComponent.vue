<script setup lang="ts">
import { reactive } from 'vue';
import { convertBase64 } from 'src/common';
import { QRejectedEntry } from 'quasar';

const $emit = defineEmits([
	'cancelUpdate',
	'saveConfiguration',
	'uploadImage'
]);

interface IComponentData {
	image: any;
	heightUploadImage: string;
}

const componentData: IComponentData = reactive({
	image: null,
	heightUploadImage: '68',
})

function cancelUpdate(nameObject: string): void {
	$emit('cancelUpdate', nameObject);
}

async function saveConfiguration(): Promise<void> {
	await $emit('saveConfiguration');
}

async function uploadImage(file: Blob): Promise<void> {
	const image = await convertBase64.convertImage(file);
	getImage(image);
	componentData.image = image;
	componentData.heightUploadImage = '269';
}

function getImage(image: any): void {
	$emit('uploadImage', image)
}

function onRejected(rejectedEntries: QRejectedEntry[]): void {
	convertBase64.onRejected(rejectedEntries);
}

</script>

<template>
	<q-card class="bg-grey-4" id="card-edit-logo">
		<q-card-section>
			<q-file @update:model-value="(val) => uploadImage(val)" label="Carga tu logo aqui"
				accept=".svg,.png,.jpg, image/*" max-file-size="2000000" max-total-size="2000000" bg-color="white"
				max-files="1" rounded outlined bottom-slots v-model="componentData.image" @rejected="onRejected"
				counter>
				<template v-slot:prepend>
					<q-icon name="cloud_upload" @click.stop.prevent />
				</template>
				<template v-slot:append>
					<q-icon name="close" @click.stop.prevent="componentData.image = null" class="cursor-pointer" />
				</template>
				<template v-slot:hint> Sube tu nueva logo </template>
			</q-file>
			<q-tooltip class="text-body2" anchor="top left" :transition-duration="150" self="center left"
				:offset="[5, 60]">
				Presiona el icono + para cargar imagen o arrastra una
				<br />
				Condiciones:
				<br />
				Imagen con formato: .jpg, .png. svg.
				<br />
				Tamaño maximo: 2MB
			</q-tooltip>
		</q-card-section>
		<q-card-section v-if="componentData.image" animation class="column justify-center items-center">
			<img :src="componentData.image" height="120" width="150" />
		</q-card-section>
		<q-card-actions class=" float-right">
			<q-btn color="primary" flat label="Cancelar" v-on:click="cancelUpdate('imageNavBar')" v-close-popup
				@click.stop.prevent="componentData.image = null" />
			<q-btn color="primary" flat label="Guardar" v-close-popup v-on:click="saveConfiguration()"
				@click.stop.prevent="componentData.image = null" />
		</q-card-actions>
	</q-card>
</template>
<style>

#card-edit-logo {
		width: 400px;
		border-radius: 15px;
}
</style>