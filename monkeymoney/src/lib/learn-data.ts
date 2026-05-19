export type Category = "orcamento" | "poupanca" | "investimento" | "divida" | "impostos";

export type FinancialTip = {
  id: string;
  title: string;
  category: Category;
  readTime: number;
  icon: string;
  summary: string;
  content: string;
};

export const categoryLabels: Record<Category, string> = {
  orcamento: "Orçamento",
  poupanca: "Poupança",
  investimento: "Investimento",
  divida: "Dívida",
  impostos: "Impostos",
};

export const categoryColors: Record<Category, string> = {
  orcamento: "bg-blue-100 text-blue-700",
  poupanca: "bg-teal-100 text-teal-700",
  investimento: "bg-purple-100 text-purple-700",
  divida: "bg-red-100 text-red-700",
  impostos: "bg-orange-100 text-orange-700",
};

export const financialTips: FinancialTip[] = [
  {
    id: "orcamento-mensal",
    title: "Orçamento Mensal",
    category: "orcamento",
    readTime: 4,
    icon: "📊",
    summary: "Define limites claros para cada categoria e acompanha semanalmente.",
    content: `Um orçamento mensal é a base de uma vida financeira saudável. Começa por listar todas as tuas receitas e depois todas as despesas fixas.\n\nA regra dos 50/30/20 é uma excelente base: 50% para necessidades (alojamento, alimentação, transportes), 30% para desejos (lazer, entretenimento) e 20% para poupança.\n\n**Dicas práticas:**\n• Revê o orçamento toda a semana — 15 minutos são suficientes\n• Usa categorias específicas (ex: "restaurantes" em vez de "comida")\n• Inclui despesas anuais divididas por 12 (ex: seguro do carro)\n• Cria um buffer de 5-10% para imprevistos pequenos`,
  },
  {
    id: "necessidade-vs-desejo",
    title: "Necessidade vs Desejo",
    category: "orcamento",
    readTime: 3,
    icon: "🤔",
    summary: "Aprende a distinguir o essencial do supérfluo para melhores decisões.",
    content: `Uma das competências financeiras mais importantes é distinguir uma necessidade de um desejo. Uma necessidade é essencial para a tua sobrevivência: alimentação, habitação, saúde.\n\nUm desejo é tudo o resto — coisas que melhoram a tua vida mas não são estritamente necessárias: o último telemóvel, jantar fora, streaming.\n\n**A pergunta certa:** "Se não comprar isto, ficam em risco as minhas necessidades básicas?"\n\nSe a resposta for não, é um desejo. Isso não significa que não o possas comprar — significa que deves planeá-lo no orçamento.\n\n**Método HALT:** Evita compras impulsivas quando estás com Fome, Ansioso, Solitário ou Cansado.`,
  },
  {
    id: "regra-50-30-20",
    title: "Regra dos 50/30/20",
    category: "orcamento",
    readTime: 4,
    icon: "🎯",
    summary: "O método mais simples para estruturar o teu orçamento mensal.",
    content: `A regra dos 50/30/20 é uma das formas mais simples e eficazes de gerir o dinheiro.\n\n**Como funciona:**\n• **50%** — Necessidades: habitação, alimentação, transportes, saúde\n• **30%** — Desejos: lazer, restaurantes, roupa, entretenimento\n• **20%** — Poupança e dívidas: reserva de emergência, investimentos\n\n**Exemplo com 1.000€/mês:**\n• 500€ → Necessidades\n• 300€ → Desejos\n• 200€ → Poupança\n\nPodes ajustar as percentagens — por exemplo 60/20/20 se vives numa cidade cara. O mais importante é ter um sistema e ser consistente.`,
  },
  {
    id: "reserva-emergencia",
    title: "Reserva de Emergência",
    category: "poupanca",
    readTime: 5,
    icon: "🛡️",
    summary: "O teu seguro financeiro pessoal para imprevistos.",
    content: `A reserva de emergência é a peça mais fundamental de qualquer plano financeiro. É um fundo em dinheiro líquido destinado exclusivamente a cobrir despesas inesperadas: perda de emprego, despesa médica urgente, avaria do carro.\n\n**Quanto deves ter?**\n• Mínimo: 3 meses de despesas essenciais\n• Ideal: 6 meses de despesas essenciais\n• Trabalho instável/freelancer: até 12 meses\n\n**Onde guardar?** Numa conta poupança separada da conta corrente, de fácil acesso.\n\n**Como construir?** Começa com uma meta de 500-1.000€. Este valor já cobre a maioria dos imprevistos comuns. Aumenta gradualmente.\n\n⚠️ A reserva de emergência NÃO é para férias, presentes ou investimentos.`,
  },
  {
    id: "pagar-primeiro",
    title: "Paga-te a Ti Próprio Primeiro",
    category: "poupanca",
    readTime: 3,
    icon: "💰",
    summary: "O hábito mais eficaz para construir riqueza a longo prazo.",
    content: `"Paga-te a ti próprio primeiro" significa que, assim que recebes o salário, transferes automaticamente uma percentagem para poupança — ANTES de pagar qualquer outra coisa.\n\nA maioria das pessoas poupa o que sobra no final do mês. O problema? Raramente sobra alguma coisa.\n\n**Como implementar:**\n1. Define uma percentagem (começa com 10%, mesmo que seja pouco)\n2. Configura uma transferência automática para o dia seguinte ao pagamento\n3. Trata a poupança como uma despesa obrigatória\n\n**Porquê funciona?** Remove a tentação. Adaptas o teu estilo de vida ao dinheiro disponível, não ao total.\n\nMesmo 25€/mês durante 10 anos = 3.000€ + juros.`,
  },
  {
    id: "juros-compostos",
    title: "Juros Compostos",
    category: "investimento",
    readTime: 5,
    icon: "📈",
    summary: "A oitava maravilha do mundo — como o tempo multiplica o teu dinheiro.",
    content: `Os juros compostos significam que os juros ganhos também geram juros. O teu dinheiro cresce exponencialmente ao longo do tempo.\n\n**Exemplo prático a 7% ao ano:**\n• Investes 1.000€\n• Ano 10: 1.967€ (quase o dobro!)\n• Ano 20: 3.870€\n• Ano 30: 7.612€ (7,6x mais!)\n\n**A fórmula:** M = C × (1 + r)ⁿ\n• M = Montante final\n• C = Capital inicial\n• r = Taxa de juro anual\n• n = Número de anos\n\nUsa o **Simulador de Poupança** desta plataforma para ver o impacto no teu caso!\n\n**Conclusão:** Começa a poupar/investir o mais cedo possível. Mesmo pequenos valores fazem diferença enorme ao longo de décadas.`,
  },
  {
    id: "tipos-investimento",
    title: "Tipos de Investimento",
    category: "investimento",
    readTime: 6,
    icon: "💼",
    summary: "Conhece as principais opções para fazer crescer o teu dinheiro.",
    content: `Existem muitas formas de investir, cada uma com diferentes níveis de risco e retorno potencial.\n\n**Depósitos a prazo:** Risco muito baixo, retorno 1-4%. Ideal para reserva de emergência.\n\n**Obrigações (Bonds):** Risco baixo a médio, retorno 2-6%. Boa para diversificação.\n\n**Ações (Stocks):** Risco médio a alto, retorno histórico de 7-10%/ano. Ideal para objetivos +10 anos.\n\n**ETFs (Fundos de Índice):** Risco médio, acompanha o mercado global. Perfeito para iniciantes.\n\n**Imobiliário:** Risco médio, retorno variável. Requer capital significativo.\n\n**Regra de ouro:** Nunca invistas dinheiro que possas precisar nos próximos 1-2 anos. Diversifica sempre entre diferentes tipos de ativos.`,
  },
  {
    id: "etf-fundos-indice",
    title: "ETFs e Fundos de Índice",
    category: "investimento",
    readTime: 5,
    icon: "🌍",
    summary: "A forma mais simples e eficiente de investir para iniciantes.",
    content: `Um ETF (Exchange-Traded Fund) é um fundo que replica um índice de mercado, como o S&P 500 (500 maiores empresas americanas) ou o MSCI World (empresas de todo o mundo).\n\n**Vantagens dos ETFs:**\n• Diversificação automática (investes em centenas de empresas de uma vez)\n• Custos muito baixos (0,03% a 0,5%/ano)\n• Fácil de comprar e vender (como ações)\n• Historicamente superam a maioria dos gestores profissionais\n\n**ETFs populares para iniciantes:**\n• iShares Core MSCI World (IWDA) — mercado global\n• Vanguard S&P 500 (VUSA) — empresas americanas\n• iShares Core MSCI Europe — empresas europeias\n\n**Como começar?** Abre uma conta numa corretora (ex: DEGIRO, Interactive Brokers) e investe regularmente — mesmo que sejam 50€/mês.`,
  },
  {
    id: "gestao-dividas",
    title: "Gestão de Dívidas",
    category: "divida",
    readTime: 5,
    icon: "🔗",
    summary: "Estratégias comprovadas para sair das dívidas mais rapidamente.",
    content: `Ter dívidas não é necessariamente mau — uma hipoteca ou crédito estudantil podem ser investimentos no futuro. Mas dívidas de consumo com juros altos são perigosas.\n\n**Método da Avalanche** (mais eficiente matematicamente):\n1. Paga o mínimo em todas as dívidas\n2. Aplica todo o dinheiro extra na dívida com a maior taxa de juro\n3. Quando paga, avança para a próxima\n\n**Método da Bola de Neve** (mais motivante):\n1. Paga o mínimo em todas as dívidas\n2. Aplica todo o dinheiro extra na dívida com menor saldo\n3. Cada dívida paga dá motivação para continuar\n\n**Prioridade:** Dívidas acima de 10% de juro devem ser pagas antes de investires.\n\n⚠️ Nunca pagues apenas o mínimo do cartão de crédito — os juros são geralmente 15-25%.`,
  },
  {
    id: "credito-responsavel",
    title: "Crédito Responsável",
    category: "divida",
    readTime: 4,
    icon: "💳",
    summary: "Como usar o crédito a teu favor sem cair em armadilhas.",
    content: `O crédito, usado responsavelmente, pode ser uma ferramenta poderosa. Usado irresponsavelmente, pode destruir a tua saúde financeira.\n\n**Boas práticas com cartão de crédito:**\n• Paga o saldo total todos os meses (nunca só o mínimo)\n• Usa-o como forma de pagamento, não como extensão do teu orçamento\n• Aproveita os pontos/cashback como bónus, não como motivação para gastar\n• Mantém o uso abaixo de 30% do limite disponível\n\n**Antes de pedir qualquer crédito, pergunta:**\n1. Preciso mesmo disto agora?\n2. Consigo pagar a prestação sem sacrificar poupança?\n3. Qual a taxa de juro efetiva anual (TAEG)?\n\n**Sinais de alerta:** Se estás a usar crédito para pagar outras dívidas, é urgente procurar ajuda financeira.`,
  },
  {
    id: "irs-deducoes",
    title: "IRS e Deduções Fiscais",
    category: "impostos",
    readTime: 5,
    icon: "📄",
    summary: "Aprende a maximizar as tuas deduções e pagar menos IRS legalmente.",
    content: `Em Portugal, o IRS (Imposto sobre o Rendimento de Singulares) é calculado sobre os teus rendimentos anuais. Mas existem deduções que podes usar legalmente para reduzir o valor a pagar.\n\n**Principais deduções em Portugal:**\n• **Saúde:** 15% das despesas (máx. 1.000€)\n• **Educação:** 30% das despesas (máx. 800€)\n• **Habitação (arrendamento):** 15% (máx. 502€)\n• **PPR (Planos Poupança Reforma):** 20% das entregas (até 400€)\n• **Despesas gerais familiares:** 35% (máx. 250€ por pessoa)\n\n**Dicas importantes:**\n• Guarda SEMPRE os recibos e faturas com NIF\n• Verifica o Portal das Finanças em fevereiro para confirmar despesas\n• Considera um PPR — reduz o IRS E constrói poupança reforma\n• Prazo de entrega do IRS: geralmente abril-junho do ano seguinte`,
  },
  {
    id: "planeamento-reforma",
    title: "Planeamento da Reforma",
    category: "poupanca",
    readTime: 6,
    icon: "🏖️",
    summary: "Nunca é cedo demais para pensar na reforma — cada ano conta.",
    content: `A reforma pode parecer distante, mas o segredo é começar cedo. Graças aos juros compostos, cada euro poupado aos 25 anos vale muito mais do que um euro poupado aos 45.\n\n**Quanto precisas na reforma?**\nUma regra comum é a "regra dos 25x": multiplica as tuas despesas anuais desejadas por 25. Se queres gastar 20.000€/ano, precisas de 500.000€ acumulados.\n\n**Opções em Portugal:**\n• **PPR (Plano Poupança Reforma):** Benefício fiscal + poupança dedicada\n• **Segurança Social:** Contribuições obrigatórias que geram pensão\n• **Investimentos próprios:** ETFs, imobiliário, etc.\n\n**Estratégia recomendada:**\n1. Maximiza as contribuições para PPR (para benefício fiscal)\n2. Investe regularmente em ETFs globais\n3. Aumenta a taxa de poupança a cada aumento salarial\n\nComeça hoje — mesmo 50€/mês durante 40 anos a 7% = ~131.000€!`,
  },
];
