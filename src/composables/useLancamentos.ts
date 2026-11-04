import { ref } from 'vue';

import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabase';
import type { Lancamento, LancamentoInput, Tipo } from '@/types';

export function useLancamentos(tipo: Tipo): any {
  const { user } = useAuth();
  const items = ref<Lancamento[]>([]);
  const loading = ref(false);

  async function load() {
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from(tipo)
        .select('*')
        .order('data', { ascending: false })
        .order('descricao', { ascending: true });
      if (error) throw error;
      items.value = (data ?? []).map((r) => ({ ...r, valor: Number(r.valor) })) as Lancamento[];
    } finally {
      loading.value = false;
    }
  }

  async function add(input: LancamentoInput) {
    if (!user.value) throw new Error('Usuário não autenticado');
    const { error } = await supabase.from(tipo).insert({ ...input, user_id: user.value.id });
    if (error) throw error;
    await load();
  }

  async function update(id: string, input: LancamentoInput) {
    const { error } = await supabase.from(tipo).update(input).eq('id', id);
    if (error) throw error;
    await load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from(tipo).delete().eq('id', id);
    if (error) throw error;
    await load();
  }

  return { items, loading, load, add, update, remove };
}
