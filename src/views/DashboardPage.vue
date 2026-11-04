<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button aria-label="Alternar modo escuro" @click="toggle">
            <ion-icon slot="icon-only" :icon="dark ? sunny : moon" />
          </ion-button>
          <ion-button aria-label="Sair" @click="sair">
            <ion-icon slot="icon-only" :icon="logOutOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="periodo" scrollable>
          <ion-segment-button value="tudo"><ion-label>Tudo</ion-label></ion-segment-button>
          <ion-segment-button value="mes"><ion-label>Este mês</ion-label></ion-segment-button>
          <ion-segment-button value="3m"><ion-label>3 meses</ion-label></ion-segment-button>
          <ion-segment-button value="ano"><ion-label>Este ano</ion-label></ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="recarregar">
        <ion-refresher-content />
      </ion-refresher>

      <SummaryCards :receitas="totalReceitas" :despesas="totalDespesas" />

      <ion-card>
        <ion-card-content class="ind">
          <div>
            <small>Maior categoria de gasto</small>
            <strong>{{ maiorCategoria ? `${maiorCategoria[0]} (${brl(maiorCategoria[1])})` : '—' }}</strong>
          </div>
          <div>
            <small>Quantidade de lançamentos</small>
            <strong>{{ qtdLancamentos }}</strong>
          </div>
          <div>
            <small>Despesas em relação às receitas</small>
            <strong>{{ percentual === null ? '—' : `${percentual.toFixed(1)}%` }}</strong>
            <ion-progress-bar
              v-if="percentual !== null"
              :value="Math.min(percentual, 100) / 100"
              :color="percentual > 100 ? 'danger' : percentual > 80 ? 'warning' : 'success'"
            />
          </div>
        </ion-card-content>
      </ion-card>

      <ExpensePieChart :dados="despesasPorCategoria" :dark="dark" />
      <MonthlyBarChart :receitas="receitasPorMes" :despesas="despesasPorMes" :dark="dark" />

      <ion-toast :is-open="!!msg" :message="msg" :duration="3000" color="danger" @didDismiss="msg = ''" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
  IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardContent, IonProgressBar,
  IonRefresher, IonRefresherContent, IonToast, onIonViewWillEnter,
} from '@ionic/vue';
import { logOutOutline, moon, sunny } from 'ionicons/icons';
import SummaryCards from '@/components/SummaryCards.vue';
import ExpensePieChart from '@/components/ExpensePieChart.vue';
import MonthlyBarChart from '@/components/MonthlyBarChart.vue';
import { useAuth } from '@/composables/useAuth';
import { useTheme } from '@/composables/useTheme';
import { useLancamentos } from '@/composables/useLancamentos';
import { brl, pad, toISODate } from '@/utils/format';
import type { Lancamento } from '@/types';

const router = useRouter();
const { signOut } = useAuth();
const { dark, toggle } = useTheme();
const rec = useLancamentos('receitas');
const des = useLancamentos('despesas');

type Periodo = 'tudo' | 'mes' | '3m' | 'ano';
const periodo = ref<Periodo>('tudo');
const msg = ref('');

async function carregar() {
  try {
    await Promise.all([rec.load(), des.load()]);
  } catch (e) {
    msg.value = e instanceof Error ? e.message : 'Erro ao carregar dados';
  }
}
onIonViewWillEnter(carregar);

async function recarregar(ev: CustomEvent) {
  await carregar();
  (ev.target as HTMLIonRefresherElement).complete();
}

async function sair() {
  try {
    await signOut();
    router.replace('/login');
  } catch (e) {
    msg.value = e instanceof Error ? e.message : 'Erro ao sair';
  }
}

function inicio(): string | null {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth();
  if (periodo.value === 'mes') return `${y}-${pad(m + 1)}-01`;
  if (periodo.value === '3m') return toISODate(new Date(y, m - 2, 1));
  if (periodo.value === 'ano') return `${y}-01-01`;
  return null;
}

const filtrar = (lista: Lancamento[]) => {
  const ini = inicio();
  return ini ? lista.filter((l) => l.data >= ini) : lista;
};

const receitas = computed(() => filtrar(rec.items.value));
const despesas = computed(() => filtrar(des.items.value));

const soma = (l: Lancamento[]) => l.reduce((s, x) => s + x.valor, 0);
const totalReceitas = computed(() => soma(receitas.value));
const totalDespesas = computed(() => soma(despesas.value));
const qtdLancamentos = computed(() => receitas.value.length + despesas.value.length);
const percentual = computed(() =>
  totalReceitas.value > 0 ? (totalDespesas.value / totalReceitas.value) * 100 : null,
);

function agrupar(lista: Lancamento[], chave: (l: Lancamento) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const l of lista) out[chave(l)] = (out[chave(l)] ?? 0) + l.valor;
  return out;
}

const despesasPorCategoria = computed(() => agrupar(despesas.value, (l) => l.categoria));
const receitasPorMes = computed(() => agrupar(receitas.value, (l) => l.data.slice(0, 7)));
const despesasPorMes = computed(() => agrupar(despesas.value, (l) => l.data.slice(0, 7)));

const maiorCategoria = computed(() => {
  const entradas = Object.entries(despesasPorCategoria.value);
  return entradas.length ? entradas.sort((a, b) => b[1] - a[1])[0] : null;
});
</script>

<style scoped>
.ind { display: flex; flex-direction: column; gap: 14px; }
.ind div { display: flex; flex-direction: column; gap: 4px; }
.ind small { color: var(--ion-color-medium); }
.ind strong { font-size: 1.05rem; }
</style>
