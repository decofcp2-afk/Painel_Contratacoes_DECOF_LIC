# KPI de capacidade efetiva

Depende do PR de disponibilidade do App Gestão e do caminho Firestore ativo.
O painel lê `unidades/{u}/config/capacidadeDisponivel`, publicado pelo backend
interno. Sem documento, mantém a capacidade nominal existente. Falha de leitura
torna o KPI indisponível em vez de assumir equipe completa.

Teto efetivo = máximo(0, servidores cadastrados − ausentes hoje) × 10 pontos.
Carga ativa interna e outros pontos permanecem contabilizados integralmente.
O percentual é carga / teto efetivo. Pode ultrapassar 100%; apenas a barra é
limitada. Quando o teto é zero, aparece “—” e “Sem capacidade disponível”.
Ausência ativa acrescenta “Capacidade reduzida” à mensagem do KPI. Nenhuma outra
tela ou regra de prazo/processo muda. Datas seguem America/Sao_Paulo; abas abertas
reavaliam o KPI na mudança de dia, quando o navegador permite executar o timer.
Atualizações da agenda feitas durante o mesmo dia aparecem ao atualizar o painel.

Publicar o backend do App Gestão e verificar as regras por unidade antes de
publicar este frontend. O transporte legado de planilha não recebe a redução.

Testes locais: `node --test`. Incluem início/retorno, ausência total, sobrecarga,
compatibilidade sem documento e preservação da carga. Validar a interface e a
integração real em homologação: navegador de testes bloqueou localhost na sessão.
