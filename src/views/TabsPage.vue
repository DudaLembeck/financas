<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="dashboard" href="/app/dashboard">
          <ion-icon :icon="pieChart" />
          <ion-label>Dashboard</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="receitas" href="/app/receitas">
          <ion-icon :icon="trendingUp" />
          <ion-label>Receitas</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="despesas" href="/app/despesas">
          <ion-icon :icon="trendingDown" />
          <ion-label>Despesas</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
import { pieChart, trendingUp, trendingDown } from 'ionicons/icons';
</script>
