<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/login" />
        </ion-buttons>
        <ion-title>Criar conta</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="wrap">
        <ion-input
          v-model="nome"
          label="Nome"
          label-placement="floating"
          fill="outline"
          :class="{ 'ion-invalid ion-touched': erros.nome }"
          :error-text="erros.nome"
        />
        <ion-input
          v-model="email"
          type="email"
          label="E-mail"
          label-placement="floating"
          fill="outline"
          class="mt"
          :class="{ 'ion-invalid ion-touched': erros.email }"
          :error-text="erros.email"
        />
        <ion-input
          v-model="senha"
          type="password"
          label="Senha (mín. 6 caracteres)"
          label-placement="floating"
          fill="outline"
          class="mt"
          :class="{ 'ion-invalid ion-touched': erros.senha }"
          :error-text="erros.senha"
        >
          <ion-input-password-toggle slot="end" />
        </ion-input>
        <ion-input
          v-model="confirmar"
          type="password"
          label="Confirmar senha"
          label-placement="floating"
          fill="outline"
          class="mt"
          :class="{ 'ion-invalid ion-touched': erros.confirmar }"
          :error-text="erros.confirmar"
          @keyup.enter="cadastrar"
        />

        <ion-button expand="block" class="mt" :disabled="loading" @click="cadastrar">
          <ion-spinner v-if="loading" name="dots" />
          <span v-else>Cadastrar</span>
        </ion-button>
        <ion-button expand="block" fill="clear" @click="router.replace('/login')">
          Já tenho conta
        </ion-button>
      </div>
      <ion-toast
        :is-open="!!msg"
        :message="msg"
        :duration="4500"
        :color="msgOk ? 'success' : 'danger'"
        @didDismiss="msg = ''"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonInput, IonInputPasswordToggle, IonButton, IonSpinner, IonToast,
} from '@ionic/vue';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { signUp } = useAuth();

const nome = ref('');
const email = ref('');
const senha = ref('');
const confirmar = ref('');
const loading = ref(false);
const msg = ref('');
const msgOk = ref(false);
const erros = reactive({ nome: '', email: '', senha: '', confirmar: '' });

function validar(): boolean {
  erros.nome = nome.value.trim().length >= 2 ? '' : 'Informe seu nome';
  erros.email = /^\S+@\S+\.\S+$/.test(email.value.trim()) ? '' : 'Informe um e-mail válido';
  erros.senha = senha.value.length >= 6 ? '' : 'A senha deve ter ao menos 6 caracteres';
  erros.confirmar = confirmar.value === senha.value ? '' : 'As senhas não conferem';
  return !erros.nome && !erros.email && !erros.senha && !erros.confirmar;
}

async function cadastrar() {
  if (!validar()) return;
  loading.value = true;
  try {
    const logado = await signUp(nome.value.trim(), email.value.trim(), senha.value);
    if (logado) {
      router.replace('/app/dashboard');
    } else {
      msgOk.value = true;
      msg.value = 'Conta criada! Confirme o e-mail enviado para poder entrar.';
      router.replace('/login');
    }
  } catch (e) {
    msgOk.value = false;
    msg.value = e instanceof Error ? e.message : 'Erro ao cadastrar';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wrap { max-width: 420px; margin: 0 auto; padding-top: 4vh; }
.mt { margin-top: 16px; }
</style>
