<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ titulo }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="recarregar">
        <ion-refresher-content />
      </ion-refresher>

      <div class="total">
        Total: <strong>{{ brl(total) }}</strong>
        <span class="qtd">({{ items.length }} lançamentos)</span>
      </div>

      <div v-if="!loading && items.length === 0" class="vazio">
        Nenhum registro ainda. Toque no + para adicionar.
      </div>

      <ion-list v-else lines="full">
        <ion-item v-for="l in items" :key="l.id">
          <ion-label>
            <h2>{{ l.descricao }}</h2>
            <p>{{ l.categoria }} · {{ formatDate(l.data) }}</p>
          </ion-label>
          <ion-note slot="end" :color="tipo === 'receitas' ? 'success' : 'danger'" class="valor">
            {{ brl(l.valor) }}
          </ion-note>
          <ion-button slot="end" fill="clear" size="small" aria-label="Editar" @click="abrirEditar(l)">
            <ion-icon slot="icon-only" :icon="createOutline" />
          </ion-button>
          <ion-button slot="end" fill="clear" size="small" color="danger" aria-label="Excluir" @click="confirmarExcluir(l)">
            <ion-icon slot="icon-only" :icon="trashOutline" />
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button aria-label="Adicionar" @click="abrirNovo">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <LancamentoFormModal
        :is-open="modalAberto"
        :tipo="tipo"
        :item="editando"
        @close="modalAberto = false"
        @save="salvar"
      />

      <ion-toast :is-open="!!msg" :message="msg" :duration="3000" :color="msgErro ? 'danger' : 'success'" @didDismiss="msg = ''" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote,
  IonButton, IonIcon, IonFab, IonFabButton, IonRefresher, IonRefresherContent, IonToast,
  alertController, onIonViewWillEnter,
} from '@ionic/vue';
import { add, createOutline, trashOutline } from 'ionicons/icons';
import LancamentoFormModal from '@/components/LancamentoFormModal.vue';
import { useLancamentos } from '@/composables/useLancamentos';
import { brl, formatDate } from '@/utils/format';
import type { Lancamento, LancamentoInput, Tipo } from '@/types';

const props = defineProps<{ tipo: Tipo }>();

const titulo = computed(() => (props.tipo === 'receitas' ? 'Receitas' : 'Despesas'));
const { items, loading, load, add: inserir, update, remove } = useLancamentos(props.tipo);
const total = computed(() =>
  items.value.reduce((s: number, l: Lancamento) => s + l.valor, 0)
);

const modalAberto = ref(false);
const editando = ref<Lancamento | null>(null);
const msg = ref('');
const msgErro = ref(false);

function aviso(texto: string, erro = false) {
  msgErro.value = erro;
  msg.value = texto;
}

async function carregar() {
  try {
    await load();
  } catch (e) {
    aviso(e instanceof Error ? e.message : 'Erro ao carregar', true);
  }
}

onIonViewWillEnter(carregar);

async function recarregar(ev: CustomEvent) {
  await carregar();
  (ev.target as HTMLIonRefresherElement).complete();
}

function abrirNovo() {
  editando.value = null;
  modalAberto.value = true;
}

function abrirEditar(l: Lancamento) {
  editando.value = l;
  modalAberto.value = true;
}

async function salvar(dados: LancamentoInput) {
  try {
    if (editando.value) await update(editando.value.id, dados);
    else await inserir(dados);
    modalAberto.value = false;
    aviso('Salvo com sucesso');
  } catch (e) {
    aviso(e instanceof Error ? e.message : 'Erro ao salvar', true);
  }
}

async function confirmarExcluir(l: Lancamento) {
  const alert = await alertController.create({
    header: 'Excluir registro',
    message: `Deseja excluir "${l.descricao}"?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          try {
            await remove(l.id);
            aviso('Registro excluído');
          } catch (e) {
            aviso(e instanceof Error ? e.message : 'Erro ao excluir', true);
          }
        },
      },
    ],
  });
  await alert.present();
}
</script>

<style scoped>
.total { padding: 16px; font-size: 1.05rem; }
.qtd { color: var(--ion-color-medium); font-size: 0.85rem; margin-left: 6px; }
.valor { font-weight: 600; margin-right: 4px; }
.vazio { text-align: center; color: var(--ion-color-medium); padding: 48px 24px; }
</style>
