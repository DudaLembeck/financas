import { supabase } from '@/lib/supabase';
import type { Lancamento, LancamentoInput, Tipo } from '@/types';

export async function listar(tabela: Tipo): Promise<Lancamento[]> {
  const { data, error } = await supabase.from(tabela).select('*').order('data', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((l) => ({ ...l, valor: Number(l.valor) }));
}
export async function inserir(tabela: Tipo, dados: LancamentoInput): Promise<void>{
  const { error } = await supabase.from(tabela).insert(dados);
  if (error) throw error;
}
export async function atualizar(tabela: Tipo, id: string, dados: LancamentoInput): Promise<void> {
  const { error } = await supabase.from(tabela).update(dados).eq('id', id);
  if (error) throw error;
}
export async function excluir(tabela: Tipo, id: string): Promise<void> {
  const { error } = await supabase.from(tabela).delete().eq('id', id);
  if (error) throw error;
}