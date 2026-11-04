import { ref } from 'vue';

const KEY = 'tema-escuro';
const dark = ref(false);

function apply(value: boolean) {
  dark.value = value;
  document.documentElement.classList.toggle('ion-palette-dark', value);
}

export function initTheme() {
  const saved = localStorage.getItem(KEY);
  const prefers = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  apply(saved === null ? prefers : saved === '1');
}

export function useTheme() {
  function toggle() {
    apply(!dark.value);
    localStorage.setItem(KEY, dark.value ? '1' : '0');
  }
  return { dark, toggle };
}
