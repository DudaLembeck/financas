<template>
  <ion-modal :is-open="aberto" @didDismiss="$emit('fechar')">
    <ion-header>
      <ion-toolbar>

      <ion-title>{{ item ? 'Editar' : 'Novo' }} lançamento</ion-title>

      <ion-buttons slot="end"><ion-button @click="$emit('fechar')">Cancelar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

    <ion-content class="ion-padding">

      <ion-input v-model="form.descricao" label="Descrição" label-placement="floating" fill="outline"
        :class="{ 'ion-invalid ion-touched': tocado && erros.descricao }" :error-text="erros.descricao" />

      <ion-input v-model.number="form.valor" type="number" inputmode="decimal" label="Valor (R$)" label-placement="floating"
        fill="outline" class="ion-margin-top" :class="{ 'ion-invalid ion-touched': tocado && erros.valor }" :error-text="erros.valor" />

      <ion-select v-model="form.categoria" label="Categoria" label-placement="floating" fill="outline" class="ion-margin-top">

        <ion-select-option v-for="c in categorias" :key="c" :value="c">{{ c }}</ion-select-option>

      </ion-select>

      <ion-input v-model="form.data" type="date" label="Data" label-placement="stacked" fill="outline" class="ion-margin-top" />

      <ion-button expand="block" class="ion-margin-top" @click="enviar">Salvar</ion-button>
      
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonSelect, IonSelectOption } from '@ionic/vue';
import type { Lancamento, LancamentoInput } from '@/types';

const props = defineProps<{ aberto: boolean; item?: Lancamento | null; categorias: string[] }>();
const emit = defineEmits<{ (e: 'fechar'): void; (e: 'salvar', dados: LancamentoInput): void }>();

const hoje = () => new Date().toISOString().slice(0, 10);
const form = reactive<LancamentoInput>({ descricao: '', valor: 0, categoria: '', data: hoje() });
const tocado = ref(false);

watch(() => props.aberto, (abriu) => {
  if (!abriu) return;
  tocado.value = false;
  Object.assign(form, props.item
    ? { descricao: props.item.descricao, valor: props.item.valor, categoria: props.item.categoria, data: props.item.data }
    : { descricao: '', valor: 0, categoria: '', data: hoje() });
});

const erros = computed(() => ({
  descricao: form.descricao.trim().length < 3 ? 'Informe ao menos 3 caracteres' : '',
  valor: !(form.valor > 0) ? 'O valor deve ser maior que zero' : '',
  categoria: form.categoria ? '' : 'Escolha uma categoria',
  data: form.data ? '' : 'Informe a data',
}));

function enviar() {
  tocado.value = true;
  if (Object.values(erros.value).some(Boolean)) return;
  emit('salvar', { ...form, descricao: form.descricao.trim() });
}
</script>