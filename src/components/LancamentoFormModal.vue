<template>
  <ion-modal :is-open="isOpen" @didDismiss="emit('close')">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ item ? 'Editar' : 'Nova' }} {{ tipo === 'receitas' ? 'receita' : 'despesa' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="emit('close')">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-input
        v-model="descricao"
        label="Descrição"
        label-placement="floating"
        fill="outline"
        :class="{ 'ion-invalid ion-touched': erros.descricao }"
        :error-text="erros.descricao"
      />
      <ion-input
        v-model="valor"
        type="number"
        inputmode="decimal"
        step="0.01"
        label="Valor (R$)"
        label-placement="floating"
        fill="outline"
        class="mt"
        :class="{ 'ion-invalid ion-touched': erros.valor }"
        :error-text="erros.valor"
      />
      <ion-select
        v-model="categoria"
        label="Categoria"
        label-placement="floating"
        fill="outline"
        interface="action-sheet"
        class="mt"
        :class="{ 'ion-invalid ion-touched': erros.categoria }"
        :error-text="erros.categoria"
      >
        <ion-select-option v-for="c in CATEGORIAS[tipo]" :key="c" :value="c">{{ c }}</ion-select-option>
      </ion-select>
      <ion-input
        v-model="data"
        type="date"
        label="Data"
        label-placement="floating"
        fill="outline"
        class="mt"
        :class="{ 'ion-invalid ion-touched': erros.data }"
        :error-text="erros.data"
      />
      <ion-button expand="block" class="mt" @click="enviar">Salvar</ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent,
  IonInput, IonSelect, IonSelectOption,
} from '@ionic/vue';
import { CATEGORIAS } from '@/types';
import type { Lancamento, LancamentoInput, Tipo } from '@/types';
import { hoje } from '@/utils/format';

const props = defineProps<{ isOpen: boolean; tipo: Tipo; item: Lancamento | null }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'save', dados: LancamentoInput): void }>();

const descricao = ref('');
const valor = ref('');
const categoria = ref('');
const data = ref(hoje());
const erros = reactive({ descricao: '', valor: '', categoria: '', data: '' });

watch(
  () => props.isOpen,
  (aberto) => {
    if (!aberto) return;
    Object.assign(erros, { descricao: '', valor: '', categoria: '', data: '' });
    descricao.value = props.item?.descricao ?? '';
    valor.value = props.item ? String(props.item.valor) : '';
    categoria.value = props.item?.categoria ?? '';
    data.value = props.item?.data ?? hoje();
  },
);

function validar(): boolean {
  const v = Number(String(valor.value).replace(',', '.'));
  erros.descricao = descricao.value.trim().length >= 3 ? '' : 'Mínimo de 3 caracteres';
  erros.valor = Number.isFinite(v) && v > 0 ? '' : 'Informe um valor maior que zero';
  erros.categoria = categoria.value ? '' : 'Selecione uma categoria';
  erros.data = /^\d{4}-\d{2}-\d{2}$/.test(data.value) ? '' : 'Informe uma data válida';
  return !erros.descricao && !erros.valor && !erros.categoria && !erros.data;
}

function enviar() {
  if (!validar()) return;
  emit('save', {
    descricao: descricao.value.trim(),
    valor: Math.round(Number(String(valor.value).replace(',', '.')) * 100) / 100,
    categoria: categoria.value,
    data: data.value,
  });
}
</script>

<style scoped>
.mt { margin-top: 16px; }
</style>
