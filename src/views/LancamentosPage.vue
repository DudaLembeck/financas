<template>
  <ion-page>
   <AppHeader titulo="Dashboard" />
    <ion-content>
      <ion-list>
        <ion-item-sliding v-for="l in itens" :key="l.id">
          <ion-item button @click="editar(l)">
            <ion-label>
              <h2>{{ l.descricao }}</h2>
              <p>{{ l.categoria }} · {{ new Date(l.data + 'T00:00:00').toLocaleDateString('pt-BR') }}</p>
            </ion-label>
            <ion-note slot="end" :color="tabela === 'receitas' ? 'success' : 'danger'">{{ moeda(l.valor) }}</ion-note>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="confirmarExclusao(l)">Excluir</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <p v-if="!itens.length && !carregando" class="ion-text-center ion-padding">Nenhum registro ainda.</p>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="novo"><ion-icon :icon="add" /></ion-fab-button>
      </ion-fab>

      <LancamentoForm :aberto="modalAberto" :item="selecionado" :categorias="CATEGORIAS[tabela]"
        @fechar="modalAberto = false" @salvar="aoSalvar" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent, IonList, IonItem, IonItemSliding, IonItemOptions,
  IonItemOption, IonLabel, IonNote, IonFab, IonFabButton, IonIcon, alertController, toastController, onIonViewWillEnter } from '@ionic/vue';
import { add } from 'ionicons/icons';
import LancamentoForm from '@/components/LancamentoForm.vue';
import { useLancamentos } from '@/composables/useLancamentos';
import { CATEGORIAS, type Lancamento, type LancamentoInput, type Tipo } from '@/types';

const props = defineProps<{ tabela: Tipo }>();
const { itens, carregando, carregar, salvar, remover } = useLancamentos(props.tabela);

const modalAberto = ref(false);
const selecionado = ref<Lancamento | null>(null);
const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

onIonViewWillEnter(carregar);

const novo = () => { selecionado.value = null; modalAberto.value = true; };
const editar = (l: Lancamento) => { selecionado.value = l; modalAberto.value = true; };

async function aoSalvar(dados: LancamentoInput) {
  try {
    await salvar(dados, selecionado.value?.id);
    modalAberto.value = false;
  } catch (e: any) {
    (await toastController.create({ message: e.message, duration: 3000, color: 'danger' })).present();
  }
}

async function confirmarExclusao(l: Lancamento) {
  const alerta = await alertController.create({
    header: 'Excluir', message: `Excluir "${l.descricao}"?`,
    buttons: ['Cancelar', { text: 'Excluir', role: 'destructive', handler: () => remover(l.id) }],
  });
  alerta.present();
}
</script>