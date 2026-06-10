/* ===========================================================
   Dados das camadas de gestão (Etapas 2 e 3 do produto).
   Tudo fictício, para o demo. Os módulos clonam estes dados
   no localStorage na primeira visita e passam a editar a cópia.
   =========================================================== */

/* ---------- Condomínios administrados (Etapa 2) ---------- */
window.CONDOMINIOS = [
  {
    id: "COND-01",
    nome: "Edifício Coriolano",
    bairro: "Pompeia",
    endereco: "Rua Coriolano, 540 · Pompeia",
    unidades: 24,
    taxa: 980,
    sindico: "Marcos Tavares",
    unidadesDetalhe: [
      { unidade: "12", morador: "Ana Prado",        atraso: 0 },
      { unidade: "21", morador: "Carlos Menezes",   atraso: 2 },
      { unidade: "33", morador: "Beatriz Lima",     atraso: 0 },
      { unidade: "44", morador: "Rogério Salles",   atraso: 4 },
      { unidade: "52", morador: "Helena Costa",     atraso: 0 },
      { unidade: "61", morador: "Paulo Andrade",    atraso: 1 },
      { unidade: "73", morador: "Sônia Ferreira",   atraso: 0 },
      { unidade: "84", morador: "Diego Martins",    atraso: 0 }
    ]
  },
  {
    id: "COND-02",
    nome: "Residencial Tucuna",
    bairro: "Alto da Lapa",
    endereco: "Rua Tucuna, 180 · Alto da Lapa",
    unidades: 16,
    taxa: 1200,
    sindico: "Cláudia Rangel",
    unidadesDetalhe: [
      { unidade: "101", morador: "Felipe Aragão",   atraso: 0 },
      { unidade: "102", morador: "Marina Duarte",   atraso: 3 },
      { unidade: "201", morador: "Tiago Brandão",   atraso: 0 },
      { unidade: "202", morador: "Letícia Souza",   atraso: 0 },
      { unidade: "301", morador: "Otávio Pires",    atraso: 5 },
      { unidade: "302", morador: "Vera Nunes",      atraso: 0 }
    ]
  },
  {
    id: "COND-03",
    nome: "Studios Leopoldina",
    bairro: "Vila Leopoldina",
    endereco: "Rua Carlos Weber, 95 · Vila Leopoldina",
    unidades: 40,
    taxa: 650,
    sindico: "Portaria autônoma",
    unidadesDetalhe: [
      { unidade: "0703", morador: "Bruno Carvalho", atraso: 0 },
      { unidade: "0810", morador: "Camila Reis",    atraso: 1 },
      { unidade: "0905", morador: "Investidor PJ",  atraso: 2 },
      { unidade: "1102", morador: "Júlia Tavares",  atraso: 0 },
      { unidade: "1204", morador: "André Lopes",    atraso: 0 }
    ]
  }
];

/* ---------- Leads do funil de vendas (Etapa 3 · CRM) ---------- */
/* etapa: novo | contato | visita | proposta | fechado */
window.LEADS = [
  { id: "L-201", nome: "Fernanda Agoiar",  origem: "Site · WhatsApp",  imovel: "LEO-1012", interesse: "Compra", orcamento: 1900000, etapa: "novo",     perfil: "quente", nota: "Quer 3 suítes na Pompeia, decisão em 30 dias." },
  { id: "L-202", nome: "Ricardo Belmonte",  origem: "Site · Formulário", imovel: "LEO-1002", interesse: "Compra", orcamento: 2200000, etapa: "contato",  perfil: "quente", nota: "Família, busca casa com quintal no Alto da Lapa." },
  { id: "L-203", nome: "Patrícia Goulart",  origem: "Instagram",         imovel: "LEO-1003", interesse: "Locação", orcamento: 3500,    etapa: "visita",   perfil: "morno",  nota: "Studio mobiliado, visita agendada quinta 16h." },
  { id: "L-204", nome: "Eduardo Tanaka",    origem: "Indicação",         imovel: "LEO-1008", interesse: "Compra", orcamento: 3500000, etapa: "proposta", perfil: "quente", nota: "Cobertura Vila Leopoldina, proposta enviada." },
  { id: "L-205", nome: "Marcelo Vidal",     origem: "Site · WhatsApp",   imovel: "LEO-1006", interesse: "Locação", orcamento: 4500,    etapa: "contato",  perfil: "morno",  nota: "Garden Pompeia, tem pet." },
  { id: "L-206", nome: "Luana Prado",       origem: "Google",            imovel: "LEO-1004", interesse: "Compra", orcamento: 950000,  etapa: "novo",     perfil: "morno",  nota: "Apartamento na Lapa, primeira compra." },
  { id: "L-207", nome: "Joaquim Reis",      origem: "Site · Formulário", imovel: "LEO-1005", interesse: "Compra", orcamento: 2900000, etapa: "fechado",  perfil: "quente", nota: "Sobrado Alto da Lapa, escritura agendada." },
  { id: "L-208", nome: "Sem orçamento",     origem: "Site · WhatsApp",   imovel: "LEO-1012", interesse: "Compra", orcamento: 250000,  etapa: "novo",     perfil: "frio",   nota: "Orçamento muito abaixo do imóvel pedido." }
];

/* ---------- Documentos para assinatura digital (Etapa 3) ---------- */
/* status: pendente | assinado */
window.DOCUMENTOS = [
  { id: "DOC-1", tipo: "Contrato de locação",        contraparte: "Patrícia Goulart", imovel: "LEO-1003", paginas: 14, status: "pendente", valor: 3200 },
  { id: "DOC-2", tipo: "Proposta de compra",          contraparte: "Eduardo Tanaka",   imovel: "LEO-1008", paginas: 6,  status: "pendente", valor: 3450000 },
  { id: "DOC-3", tipo: "Contrato de administração",   contraparte: "Edifício Coriolano", imovel: "COND-01", paginas: 22, status: "pendente", valor: 0 },
  { id: "DOC-4", tipo: "Escritura de venda",          contraparte: "Joaquim Reis",     imovel: "LEO-1005", paginas: 31, status: "assinado", valor: 2890000 },
  { id: "DOC-5", tipo: "Termo de vistoria",           contraparte: "Marcelo Vidal",    imovel: "LEO-1006", paginas: 8,  status: "pendente", valor: 4500 }
];

/* ---------- Posições no mapa (Etapa 2) ----------
   Coordenadas relativas (0 a 100) num plano estilizado da zona oeste,
   só para o mapa interativo do demo. Chave = id do imóvel. */
window.MAPA_POS = {
  "LEO-1001": { x: 58, y: 42 }, "LEO-1002": { x: 30, y: 30 },
  "LEO-1003": { x: 78, y: 64 }, "LEO-1004": { x: 46, y: 56 },
  "LEO-1005": { x: 24, y: 38 }, "LEO-1006": { x: 62, y: 36 },
  "LEO-1007": { x: 42, y: 70 }, "LEO-1008": { x: 82, y: 54 },
  "LEO-1009": { x: 66, y: 48 }, "LEO-1010": { x: 28, y: 24 },
  "LEO-1011": { x: 86, y: 70 }, "LEO-1012": { x: 54, y: 34 }
};
