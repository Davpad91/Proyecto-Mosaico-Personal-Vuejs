<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { app, node } from 'src/interfaces';
import { validatePassword, validateEmail, validPassword } from './validations';
import VueJwtDecode from 'vue-jwt-decode';
import options from './questions';
import { AuthService, ConfigService } from 'src/services';
import { storage, notifications } from 'src/common';
import { configInitial } from 'src/boot/ConfigInitialSetup';
import { LoadingStore, ConfigurationStore } from 'src/stores';
import { useRouter } from 'vue-router';
import { QStepper } from 'quasar';
import { AxiosResponse } from 'axios';

const router = useRouter();

const configurationStore = ConfigurationStore.ConfigurationStore();
const loadingStore = LoadingStore.LoadingStore();
const validPasswordFeatures = validPassword;

interface IComponentData {
  user: node.User;
  isPwdLogin: boolean;
  isPwdRegister: boolean;
  isPwdConfirm: boolean;
  step: number;
  slide: string;
  phone: string;

};

const componentData: IComponentData = reactive({
  user: {} as node.User,
  isPwdLogin: true,
  isPwdRegister: true,
  isPwdConfirm: true,
  step: 1,
  slide: 'map',
  idCard: '',
  phone: '',
});

function validateInputs(): boolean {
  const inputsData = {
    name: componentData.user.name,
    phone: componentData.user.phone,
    email: componentData.user.email,
    password: componentData.user.password,
    answer1: componentData.user.answer1,
    answer2: componentData.user.answer2,
    answer3: componentData.user.answer3,
    answer4: componentData.user.answer4,
    question1: componentData.user.question1,
    question2: componentData.user.question2,
    question3: componentData.user.question3,
    question4: componentData.user.question4,
  }

  return Object.keys(inputsData).every((key: string) => inputsData[key as keyof typeof inputsData] != null)
}

async function startSession(tokenPair: node.SessionTokens): Promise<void> {
  const { accesstoken } = tokenPair;
  const { refreshtoken } = tokenPair;
  const payload = VueJwtDecode.decode(accesstoken);
  storage.setAccessToken(accesstoken);
  storage.setRefreshToken(refreshtoken);
  storage.setUser(payload);

  try {
    const response: AxiosResponse<node.Config> = await ConfigService.getConfig(payload.nit);
    storage.setConfig(response.data);
  } catch (err: any) {
    storage.setConfig(configInitial);
  };

  configurationStore.resetConfigurationFromStorage();
  router.push({ name: 'dashboard' });
}

async function signin(): Promise<void> {
  loadingStore.showLoading();

  try {
    const response = await AuthService.signIn(componentData.user)
    await startSession(response.data);
  } catch (err: any) {
    (document.getElementById('loginForm') as HTMLFormElement).reset();
    notifications.showErrorNotification(err.response.data.message);
  };

  loadingStore.hideLoading();
}

async function signup(): Promise<void> {
  componentData.user.idCard = Number(componentData.user.idCard);
  componentData.user.phone = Number(componentData.phone);

  if (!validateInputs()) {
    notifications.showErrorNotification('Por favor asegurese de llenar todos los campos');
    return;
  }

  loadingStore.showLoading();

  try {
    const response: any = await AuthService.signUp(componentData.user);
    await startSession(response.data);
  } catch (err: any) {
    (document.getElementById('registerForm') as HTMLFormElement).reset();
    notifications.showErrorNotification(err.response.data.message);
  };

  loadingStore.hideLoading();
};

function validatePass(password: string): boolean {
  return validatePassword(password, componentData.user);
};

function validateEmails(email: string): boolean {
  const isValidate = validateEmail(email);
  return isValidate;
};

function onReset(): void {
  componentData.user.password = '';
  componentData.user.repeatpassword = '';
  componentData.user.answer1 = '';
  componentData.user.answer2 = '';
  componentData.user.answer3 = '';
  componentData.user.answer4 = '';
  validPasswordFeatures.length = false;
  validPasswordFeatures.upper = false;
  validPasswordFeatures.number = false;
  validPasswordFeatures.symbol = false;
};

function filledInputsStep1(): string {
  return componentData.user.name && componentData.user.idCard && componentData.phone ? 'positive' : 'negative';
};

function filledInputsStep2(): string {
  return componentData.user.email && componentData.user.password ? 'positive' : 'negative';
};

function stepForward(refs: any): void {
  (refs.stepper as QStepper).next();
};

function stepBack(refs: any): void {
  (refs.stepper as QStepper).previous();
};

onMounted((): void => {
  const nextAlert: app.AppNotification | null = storage.getNextAlert();
  if (nextAlert && sessionStorage.getItem('signedInBefore')) notifications.showNotification(nextAlert);
  storage.clearStorage();
});
</script>

<template>
  <div id="q-app">
    <div class="fit">
      <div class="row items-justify fit">
        <q-carousel v-model="componentData.slide" transition-prev="jump-right" transition-next="jump-left" swipeable
          animated class="bg-body text-dark col q-mb-sm fit">
          <q-carousel-slide name="map" class="column no-wrap flex-center">
            <img src="/img/logo-arus.png" size="56px" />
            <div class="q-pa-md login-container fit column justify-around">
              <q-form id="loginForm" @submit.prevent="signin" @reset="onReset" class="q-gutter-md register-form q-mx-xl"
                autocomplete="off">
                <q-input clearable filled v-model="componentData.user.email" class="q-my-sm" type="email"
                  label="Correo electrónico" lazy-rules :rules="[
                    (val) =>
                      validateEmails(val) ||
                      'El correo electronico debe contener @, por ejemplo: example@correo.com.',
                  ]"></q-input>
                <q-input clearable v-model="componentData.user.password" filled label="Contraseña"
                  :type="componentData.isPwdLogin ? 'password' : 'text'" :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Por favor digite su contraseña',
                  ]"><template v-slot:append>
                    <q-icon :name="componentData.isPwdLogin ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="componentData.isPwdLogin = !componentData.isPwdLogin" />
                  </template></q-input>
                <div class="flex flex-center">
                  <q-btn label="Ingresar" type="submit" color="primary" size="15px"></q-btn>
                </div>
                <div class="text-info text-weight-light">
                  <q-btn-toggle size="16px" v-model="componentData.slide" flat no-caps
                    class="items-center justify-center register-button"
                    :options="[{ label: 'Registrarse', value: 'layers' }]" @click="
                      () => {
                        componentData.step = 1;
                        componentData.user.email = '';
                        componentData.user.password = '';
                        validPasswordFeatures.length = false;
                        validPasswordFeatures.number = false;
                        validPasswordFeatures.symbol = false;
                        validPasswordFeatures.upper = false;
                      }
                    " />
                </div>
              </q-form>
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="layers" class="column no-wrap items-start justify-center items-center">
            <img src="/img/logo-arus.png" size="40px" />
            <div class="fit">
              <q-form id="registerForm" @submit="signup" @reset="onReset" class="q-gutter-md register-form"
                autocomplete="off">
                <q-stepper v-model="componentData.step" ref="stepper" color="primary" animated class="no-shadow">
                  <q-step :name="1" title="Datos personales" icon="settings" :done-color="filledInputsStep1()"
                    :done="componentData.step > 1">
                    <q-input clearable filled v-model="componentData.user.name" label="Nombre completo"
                      class="q-my-sm q-pb-xs" lazy-rules :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'Por favor digite su nombre completo',
                      ]"></q-input>
                    <q-input clearable filled v-model="componentData.user.idCard" label="Número de documento"
                      class="q-my-sm q-pb-xs" mask="##########" lazy-rules maxlength="10" :rules="[
                        (val) =>
                          (val && val.length >= 8) ||
                          'Por favor digite su número de documento, minimo 6 digitos',
                      ]"></q-input>
                    <q-input clearable filled v-model="componentData.phone" label="Número de celular"
                      class="q-my-sm q-pb-xs" mask="##########" maxlength="10" lazy-rules :rules="[
                        (val) =>
                          (val && val.length > 0 && val.length <= 10) ||
                          'Por favor digite su número de celular, debe contener 10 digitos',
                      ]"></q-input>
                  </q-step>
                  <q-step :name="2" title="Datos de acceso" icon="create_new_folder" :done-color="filledInputsStep2()"
                    :done="componentData.step > 2">
                    <q-input clearable filled v-model="componentData.user.email" label="Correo electrónico"
                      class="q-my-sm q-pb-xs" lazy-rules :rules="[
                        (val) =>
                          validateEmails(val) ||
                          'El correo electronico debe contener @, por ejemplo: example@correo.com.',
                      ]"></q-input>
                    <q-input clearable v-model="componentData.user.password" id="password" filled
                      :type="componentData.isPwdRegister ? 'password' : 'text'" label="Contraseña" class="q-pb-xs"
                      lazy-rules @keyup="validatePass(componentData.user.password)" :rules="[
                        (val) =>
                          val == null ? validatePass('') : validatePass(val),
                      ]"><template v-slot:append>
                        <q-icon :name="componentData.isPwdRegister ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer" @click="componentData.isPwdRegister = !componentData.isPwdRegister" />
                      </template></q-input>
                    <div class="row items-start text-caption">
                      <div class="col flex flex-wrap">
                        <div>
                          <q-icon :name="
                            validPasswordFeatures.length
                              ? 'check_circle'
                              : 'cancel'
                          " :color="
                            validPasswordFeatures.length
                              ? 'positive'
                              : 'negative'
                          "></q-icon>
                          Debe tener minimo 8 caracteres.
                        </div>
                        <div>
                          <q-icon :name="
                            validPasswordFeatures.upper
                              ? 'check_circle'
                              : 'cancel'
                          " :color="
                            validPasswordFeatures.upper
                              ? 'positive'
                              : 'negative'
                          "></q-icon>
                          Debe tener minimo una mayuscula.
                        </div>
                      </div>
                      <div class="col flex flex-wrap">
                        <div>
                          <q-icon :name="
                            validPasswordFeatures.number
                              ? 'check_circle'
                              : 'cancel'
                          " :color="
                            validPasswordFeatures.number
                              ? 'positive'
                              : 'negative'
                          "></q-icon>
                          Debe tener minimo un numero.
                        </div>
                        <div>
                          <q-icon :name="
                            validPasswordFeatures.symbol
                              ? 'check_circle'
                              : 'cancel'
                          " :color="
                            validPasswordFeatures.symbol
                              ? 'positive'
                              : 'negative'
                          "></q-icon>
                          Debe tener un caracter especial: !@#$%^&*()-_+=
                        </div>
                      </div>
                    </div>
                    <q-input clearable filled label="Confirmar contraseña" class="q-mt-sm q-pb-xs"
                      v-model="componentData.user.repeatpassword" :rules="[
                        (val) =>
                          (val && val === componentData.user.password) ||
                          'No coinciden las passwords.',
                      ]" :type="componentData.isPwdConfirm ? 'password' : 'text'"><template v-slot:append>
                        <q-icon :name="componentData.isPwdConfirm ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer" @click="componentData.isPwdConfirm = !componentData.isPwdConfirm" />
                      </template></q-input>
                  </q-step>
                  <q-step :name="3" title="Preguntas de seguridad" icon="assignment" :done="componentData.step > 3">
                    <q-scroll-area class="q-scroll-area">
                      <q-select filled v-model="componentData.user.question1" :options="options.options1"
                        label="Pregunta #1" :rules="[
                          (val) =>
                            val != null ||
                            'Debes seleccionar una pregunta'
                        ]" />
                      <q-input clearable filled v-model="componentData.user.answer1" label="Respuesta ..."
                        class="q-mb-sm" lazy-rules :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Este campo es obligatorio',
                        ]"></q-input>
                      <q-select filled v-model="componentData.user.question2" :options="options.options2"
                        label="Pregunta #2" :rules="[
                          (val) =>
                            val != null ||
                            'Debes seleccionar una pregunta'
                        ]" />
                      <q-input clearable filled v-model="componentData.user.answer2" label="Respuesta ..."
                        class="q-mb-sm" lazy-rules :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Este campo es obligatorio',
                        ]"></q-input>
                      <q-select filled v-model="componentData.user.question3" :options="options.options3"
                        label="Pregunta #3" :rules="[
                          (val) =>
                            val != null ||
                            'Debes seleccionar una pregunta'
                        ]" />
                      <q-input clearable filled v-model="componentData.user.answer3" label="Respuesta ..."
                        class="q-mb-sm" lazy-rules :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Este campo es obligatorio',
                        ]"></q-input>
                      <q-select filled v-model="componentData.user.question4" :options="options.options4"
                        label="Pregunta #4" :rules="[
                          (val) =>
                            val != null ||
                            'Debes seleccionar una pregunta'
                        ]" />
                      <q-input clearable filled v-model="componentData.user.answer4" label="Respuesta ..."
                        class="q-mb-sm" lazy-rules :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Este campo es obligatorio',
                        ]"></q-input>
                    </q-scroll-area>
                  </q-step>
                  <template v-slot:navigation>
                    <q-stepper-navigation class="flex flex-center register-navigation-container">
                      <q-btn v-if="componentData.step < 3" label="Continuar" color="primary"
                        @click="stepForward($refs)" />
                      <q-btn v-if="componentData.step > 2" label="Registrarse" color="primary" type="submit"
                        @click="validatePass('')" goTo="1" />
                      <q-btn v-if="componentData.step > 1" label="Regresar" color="primary" class="q-ml-sm"
                        @click="stepBack($refs)" flat />
                    </q-stepper-navigation>
                    <div class="text-info text-weight-light">
                      <q-btn-toggle v-model="componentData.slide" flat no-caps
                        class="items-center justify-center text-weight-light" :options="[
                          { label: 'Ya tienes una cuenta?', value: 'map' },
                        ]" @click="
                          () => {
                            componentData.step = 1;
                            componentData.user.email = '';
                            componentData.user.password = '';
                            componentData.user.repeatpassword = '';
                            componentData.user.answer1 = '';
                            componentData.user.answer2 = '';
                            componentData.user.answer3 = '';
                            componentData.user.answer4 = '';
                          }
                        " />
                    </div>
                  </template>
                </q-stepper>
              </q-form>
            </div>
          </q-carousel-slide>
        </q-carousel>
        <q-carousel v-model="componentData.slide" transition-prev="jump-left" transition-next="jump-right" swipeable
          animated class="bg-body text-dark col gt-sm inline full-height">
          <q-carousel-slide name="layers" class="q-pa-none">
            <div class="full-height">
              <q-img class="full-height" src="/img/register.jpg">
              </q-img>
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="map" class="q-pa-none">
            <div class="full-height">
              <q-img src="/img/login.jpg" class="full-height">
              </q-img>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
  </div>
</template>

<style>
#q-app {
  min-height: 100vh !important;
  height: 100vh !important;
  min-width: 650px !important;
}

.login-form {
  text-align: center !important;
  padding: 0 80px !important;
}

.register-form {
  text-align: center !important;
}

.register-navigation-container {
  padding-bottom: 10px !important;
}

.q-scroll-area {
  height: 15rem !important;
  max-width: 100% !important;
}
</style>
