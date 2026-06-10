# Estratégia

> O que importa agora. Prioridades, metas, prazos.

## Fase

Pós-reunião de descoberta (04/06/2026, com Sueli e Yago). Contrato ainda
não fechado: a Sueli vai levar a proposta a parceiros na semana de 09/06
pra decidir o orçamento. Cenário escolhido por ela: **MVP / vitrine**, o
mais "pé no chão", não a plataforma completa estilo Quinto Andar.

## Prioridade principal

Em 10/06/2026 o demo evoluiu de uma vitrine única para um **produto completo
em 3 etapas dentro do mesmo app** (Vitrine | Gestão | Plataforma), com uma
barra de demonstração que liga/desliga as etapas, e **MVP funcional de cada
uma** (lógica real em localStorage). Foi criado também um **deck novo do
produto** em `saidas/apresentacao-produto/` (HTML + PDF de 12 páginas), além
do deck anterior em `saidas/apresentacao-imobiliaria/`. Próximo foco: ajustar
marca/copy e números finais quando a Sueli trouxer o retorno dos parceiros.

**Sobre o projeto da imobiliária:**
- Sueli + amiga corretora (tem o CRECI e espaço físico no Alto da Lapa)
  montando imobiliária do zero, do absoluto zero
- Três vertentes: venda/locação, administração de condomínios (cobrança de
  inadimplência = renda fixa mensal, principal interesse dela) e
  administração do próprio escritório
- Tudo ainda muito boca a boca, precisa de divulgação
- Região: Alto da Lapa, Vila Leopoldina, Pompeia, Perdizes, Lapa (perto da
  Barra Funda)
- O site é alimentado com fotos dos imóveis pra gerar contato

## Melhorias do site (saídas da reunião) — implementadas em 10/06/2026

- **Qualificação automática de leads** (feito): `site/js/leadfilter.js` faz a
  triagem por orçamento no formulário de contato e no detalhe do imóvel,
  classifica quente/morno/frio e só encaminha quem está no perfil.
- **Atendimento humanizado** (feito): reforçado no copy, sem cara de chatbot.
- Revisão de copy pra não assustar (feito) e Perdizes incluído na região.
- As vertentes de plataforma que eram "escala futura" viraram **MVP funcional
  de cada etapa** (não são mais teaser):
  - Etapa 2 · Gestão: `painel.html` (backoffice de imóveis), `condominio.html`
    (inadimplência, acordos, comunicados), `mapa.html` (mapa + calor).
  - Etapa 3 · Plataforma: `crm.html` (funil kanban), `renda.html` (Open
    Finance por CPF), `documentos.html` (assinatura gov.br simulada),
    `marketing.html` (gerador de post/legenda).
  Continuam sendo o caminho de upsell; entram por etapa conforme o negócio.

## Próximos passos definidos na reunião

- Yago entrega apresentação formal em PDF até segunda/terça (08 ou 09/06).
- Sueli levanta a situação financeira dos envolvidos e a perspectiva do
  negócio em 6, 12 e 24 meses, e manda pro Yago e Felipe.
- Sueli marca reunião com os parceiros na semana de 09/06.
- Felipe implementa no site as melhorias discutidas.

## O que pode esperar

Identidade visual da imobiliária (nome, cores, logo) — ainda no zero. O
demo usa o nome fictício "Leopoldina Imóveis". Definir depois que o projeto
avançar.
