'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { aplicarDisponibilidade, construirCapacidadeInterna } = require('../painel-firestore.js');
const ag = { totalPts: 20, tetoPts: 40, qtdServidores: 4 };
const agenda = { versao: 1, transicoes: [{ data: '2026-09-15', ausentes: 1 }, { data: '2026-09-20', ausentes: 2 }, { data: '2026-10-01', ausentes: 0 }] };
test('KPI mantém legado, reduz proporcionalmente e retorna após o último dia', () => {
  assert.equal(aplicarDisponibilidade(ag, null, '2026-09-15').pct, 50);
  assert.equal(aplicarDisponibilidade(ag, agenda, '2026-09-14').pct, 50);
  assert.equal(aplicarDisponibilidade(ag, agenda, '2026-09-15').pct, 67);
  assert.equal(aplicarDisponibilidade(ag, agenda, '2026-09-30').pct, 100);
  assert.equal(aplicarDisponibilidade(ag, agenda, '2026-10-01').pct, 50);
  assert.match(aplicarDisponibilidade(ag, agenda, '2026-09-15').mensagem, /Capacidade reduzida/);
});
test('Não inventa percentual quando todos estão ausentes; admite sobrecarga', () => {
  const all = { versao: 1, transicoes: [{ data: '2026-01-01', ausentes: 4 }] };
  const r = aplicarDisponibilidade(ag, all, '2026-09-01');
  assert.equal(r.pct, null); assert.equal(r.semCapacidade, true); assert.match(r.mensagem, /Sem capacidade disponível/);
  assert.equal(aplicarDisponibilidade({ ...ag, totalPts: 45 }, agenda, '2026-09-15').pct, 150);
});
test('A carga original não é apagada nem duplicada', () => {
  const r = construirCapacidadeInterna([{ servidor: 'Ana', processoId: 'P1', ativo: true, fase: 'Interna', p1: 5 }], [], [{ nome: 'Ana', outrosFixo: 2 }]);
  assert.equal(r.totalPts, 7);
  const cap = aplicarDisponibilidade(r, { versao: 1, transicoes: [{ data: '2026-01-01', ausentes: 1 }] }, '2026-09-01');
  assert.equal(cap.totalPts, 7); assert.equal(cap.tetoPts, 0);
});
test('Resumo inválido não derruba o KPI inteiro para N/D', () => {
  const legado = { versao: 1, transicoes: '[object Object],[object Object]' };
  const r = aplicarDisponibilidade(ag, legado, '2026-09-15');
  assert.equal(r.ok, true);
  assert.equal(r.pct, 50);
  assert.equal(r.disponibilidadeIndisponivel, true);
  assert.match(r.mensagem, /pendente de sincronização/);
});
