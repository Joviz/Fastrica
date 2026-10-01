# ⚡ Fastrica — Calculadora Elétrica

**Fastrica** é uma aplicação web de calculadoras elétricas focada em eletricistas, instaladores e estudantes. Roda no navegador, sem backend, com interface escura e responsiva.

---

## ✨ Funcionalidades

### 🔵 Lei de Ohm — Seletor Circular
Roda SVG interativa com 4 setores (V, I, R, P). Ao clicar em um setor, abre um modal com todas as fórmulas possíveis para calcular aquela grandeza.

| Grandeza | Símbolo | Unidade | Fórmulas disponíveis |
|----------|---------|---------|----------------------|
| Tensão   | V       | Volts   | V = I×R · V = P/I · V = √(P×R) |
| Corrente | I       | Amperes | I = V/R · I = P/V · I = √(P/R) |
| Resistência | R    | Ohms (Ω)| R = V/I · R = V²/P · R = P/I² |
| Potência | P       | Watts   | P = V×I · P = I²×R · P = V²/R |

### 🟡 Calculadora de Fonte LED
Calcula a fonte de alimentação ideal para fitas de LED.

- **Entradas:** potência da fita (W/m), comprimento (m), tensão (V)
- **Saídas:** potência total, corrente, potência com margem de segurança (20%), fonte sugerida
- **Alerta automático:** sugere injeção dupla para fitas acima de 5 m

### 🟣 Calculadora de Bitola de Cabo (NBR 5410)
Dimensiona cabos elétricos conforme a norma brasileira.

- **Entradas:** corrente máxima (A), distância do circuito (m), tensão (V)
- **Saída:** bitola recomendada em mm², disjuntor sugerido, queda de tensão (%)
- **Barra semafórica:** verde (< 2%), amarelo (2–4%), vermelho (> 4% — fora da norma)
- **Fator de segurança:** 25% sobre a corrente informada
- **Resistividade usada:** ρ = 0,0175 Ω·mm²/m (cobre)

### 🟢 Calculadora de Potência
Calcula P = V × I em tempo real enquanto o usuário digita, com conversão automática para kW e estimativa de kWh/dia (base 8 horas).

### 🛒 Botão "O que comprar?"
Após qualquer cálculo de fonte ou bitola, o botão abre uma busca Google pré-formatada com os resultados para ajudar a encontrar o componente certo em lojas de material elétrico.

---

## 🗂 Estrutura do Projeto

```
src/
├── App.tsx                          # Componente raiz, layout principal
├── main.tsx                         # Entry point React
├── index.css                        # Estilos globais (Tailwind)
│
├── components/
│   ├── CircleSelector/
│   │   ├── CircleSelector.tsx       # Roda SVG com 4 setores interativos
│   │   └── Sector.tsx               # Setor individual animado (framer-motion)
│   │
│   ├── ModalFormula/
│   │   └── OhmModal.tsx             # Modal genérico para cálculos da Lei de Ohm
│   │
│   ├── Calculators/
│   │   ├── FonteLED.tsx             # Calculadora de fonte para fitas LED
│   │   ├── BitolaCabo.tsx           # Dimensionamento de cabo (NBR 5410)
│   │   └── Potencia.tsx             # Calculadora P = V × I em tempo real
│   │
│   ├── HelpModal.tsx                # Modal de ajuda com instruções de uso
│   │
│   └── ui/
│       ├── Button.tsx               # Botão base do design system
│       ├── Card.tsx                 # Card escuro com header e footer opcionais
│       ├── Input.tsx                # Input com label, unit badge e mensagem de erro
│       ├── Modal.tsx                # Modal base com AnimatePresence
│       ├── ResultDisplay.tsx        # Exibição de resultado com fórmula e accentColor
│       └── index.ts                 # Re-exports dos componentes ui
│
├── context/
│   └── CalculoContext.tsx           # Contexto global do último cálculo realizado
│
├── lib/
│   ├── formulas.ts                  # Funções puras da Lei de Ohm + mapa de fórmulas
│   ├── bitolas.ts                   # Tabela NBR 5410 e função calcBitola()
│   └── utils.ts                     # cn() (classnames), formatNumber(), formatWithUnit()
│
└── types/
    └── index.ts                     # Tipos globais: ModalType, GrandezaInfo, grandezaInfo map
```

---

## 🧮 Lógica de Cálculo

### Lei de Ohm — `src/lib/formulas.ts`
Funções puras sem efeitos colaterais:

```ts
calcI_fromVR(V, R)  → I = V / R
calcI_fromPV(P, V)  → I = P / V
calcI_fromPR(P, R)  → I = √(P / R)

calcV_fromIR(I, R)  → V = I × R
calcV_fromPI(P, I)  → V = P / I
calcV_fromPR(P, R)  → V = √(P × R)

calcR_fromVI(V, I)  → R = V / I
calcR_fromVP(V, P)  → R = V² / P
calcR_fromPI(P, I)  → R = P / I²

calcP_fromVI(V, I)  → P = V × I
calcP_fromIR(I, R)  → P = I² × R
calcP_fromVR(V, R)  → P = V² / R
```

### Bitola de Cabo — `src/lib/bitolas.ts`
```ts
calcBitola(corrente, distancia, tensao)
// Retorna: { bitola, corrente_ajustada, queda_tensao }
// corrente_ajustada = corrente × 1.25  (fator de segurança NBR)
// queda_tensao (%) = (2 × 0.0175 × L × I) / (A × V) × 100
```

A tabela `bitolaTable` cobre bitolas de 1,5 mm² até 120 mm² com as correntes máximas do método B1 (embutido em parede).

### Fonte LED — `src/components/Calculators/FonteLED.tsx`
```
potenciaTotal = (W/m) × comprimento
potenciaComMargem = potenciaTotal × 1.20
corrente = potenciaComMargem / tensao
fonteSugerida = próxima potência padrão acima de potenciaComMargem
               (25W → 30W → 40W → 50W → 60W → 75W → 100W → 150W → 200W → 300W → 400W → 500W)
```

---

## 🏗 Arquitetura e Padrões

### Contexto Global — `CalculoContext`
Armazena o **último cálculo realizado** (fonte ou bitola) para habilitar o botão "O que comprar?". O contexto é leve e sem persistência — reset a cada reload.

```ts
type UltimoCalculo =
  | { tipo: 'fonte'; potencia: number; corrente: number; tensao: number }
  | { tipo: 'bitola'; bitola: string; corrente: number }
  | null
```

### Validação de Formulários
Todos os formulários usam **React Hook Form** + **Zod** para validação tipada no client. Campos inválidos exibem mensagens inline via o componente `Input`.

### Animações
Todas as transições de estado usam **Framer Motion**:
- `AnimatePresence` para montagem/desmontagem de resultados e modais
- `motion.div` com `initial/animate/exit` para fade + slide suave
- Setores SVG animam `fill`, `opacity` e `scale` via `motion.g`

### Design System
Paleta fixa no código (dark navy):

| Token visual | Valor |
|---|---|
| Background principal | `#0B0F19` |
| Card background | `#141B2D` |
| Borda sutil | `#1E293B` |
| Texto principal | `#F1F5F9` |
| Texto secundário | `#475569` |
| Tensão (V) | `#22D3EE` (cyan) |
| Corrente (I) | `#F59E0B` (amber) |
| Resistência (R) | `#A78BFA` (violet) |
| Potência (P) | `#34D399` (emerald) |

---

## 🛠 Stack Técnica

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI |
| TypeScript | 6 | Tipagem |
| Vite | 8 | Build/Dev server |
| Tailwind CSS | 4 | Estilos utilitários |
| Framer Motion | 13 | Animações |
| React Hook Form | 7 | Formulários |
| Zod | 3 | Validação de schema |
| Lucide React | 1.49 | Ícones SVG |
| clsx + tailwind-merge | — | Merge condicional de classes |

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm 9+

### Instalação e dev
```bash
npm install
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`.

### Build de produção
```bash
npm run build
# Output em /dist
npm run preview  # Serve o build localmente
```

### Lint
```bash
npm run lint  # Usa oxlint
```

---

## 📐 Normas e Referências Técnicas

- **NBR 5410** — Instalações elétricas de baixa tensão (dimensionamento de cabos e disjuntores)
- **Método B1** — Condutor de cobre com isolação PVC embutido em parede ou teto
- Queda de tensão máxima permitida: **4%** para circuitos terminais (NBR 5410 item 6.2.7)
- Resistividade do cobre: **ρ = 0,0175 Ω·mm²/m**

> **Aviso:** Os resultados são estimativas para auxílio técnico. Sempre valide com um engenheiro eletricista habilitado antes de executar instalações.

---

## 📁 Arquivos de Configuração

| Arquivo | Descrição |
|---|---|
| `vite.config.ts` | Config do Vite com plugin React e alias `@/` → `src/` |
| `tsconfig.app.json` | Config TS para o código da aplicação |
| `tsconfig.node.json` | Config TS para o Vite config |
| `.oxlintrc.json` | Regras do linter oxlint |

---

## 👤 Licença

Projeto privado. Todos os direitos reservados.
