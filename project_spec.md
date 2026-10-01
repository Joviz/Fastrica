# Project Spec - Fastrica (Calculadora Elétrica)

## Visão Geral
Fastrica é uma calculadora elétrica moderna e visual, focada em profissionais e entusiastas de elétrica. O design é dark mode, clean e interativo, com um círculo central representando as grandezas da Lei de Ohm (V, I, R, P) e cards de calculadoras específicas na lateral.

## Objetivos
- Interface 100% fiel ao design do Figma fornecido
- Cálculos precisos e didáticos (mostrar a fórmula usada)
- Experiência fluida no desktop e mobile
- Código limpo, tipado e fácil de manter

## Stack Obrigatória
- **Build Tool**: Vite
- **Framework**: React 18/19 + TypeScript
- **Estilização**: Tailwind CSS v4
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Formulários**: React Hook Form + Zod
- **Utilitários**: clsx + tailwind-merge

## Design System (baseado no Figma)
- **Background principal**: `#0B0F19` ou similar (quase preto azulado)
- **Cards**: `#141B2D` / `#1A233A`
- **Acentos**: Ciano / Teal (ex: `#22D3EE`, `#2DD4BF`)
- **Texto principal**: branco / cinza claro
- **Bordas**: arredondadas (rounded-2xl / rounded-xl)
- **Sombras**: sutis com glow leve nos elementos interativos

## Funcionalidades Principais

### 1. Círculo Interativo (Hero)
- Dividido em 4 setores: V (Tensão), I (Corrente), R (Resistência), P (Potência)
- Centro com ícone de calculadora
- Ao clicar em um setor → abre modal específico daquela grandeza

### 2. Modais da Lei de Ohm
Cada modal deve permitir escolher a fórmula e calcular:
- **Corrente (I)**: I = V/R | I = P/V | I = √(P/R)
- **Tensão (V)**: V = I×R | V = P/I | V = √(P×R)
- **Resistência (R)**: R = V/I | R = V²/P | R = P/I²
- **Potência (P)**: P = V×I | P = I²×R | P = V²/R

### 3. Cards Laterais
1. **Fonte para LED**
   - Inputs: Quantidade (m), Potência por LED (W/m), Tensão (V)
   - Resultado: Fonte Sugerida (com margem de segurança de 20-30%)

2. **Bitola de cabo**
   - Inputs: Corrente Máx (A), Distância (m), Tensão de Uso (V)
   - Resultado: Bitola Recomendada (mm²) usando tabela simplificada NBR 5410

3. **Potência**
   - Inputs: Tensão (V), Corrente (A)
   - Resultado: Potência Calculada (W)

### 4. Extras
- Botão "O que comprar?"
- Botão de ajuda (?)
- Responsividade completa (mobile first ou desktop first com breakpoints bons)

## Estrutura de Pastas Esperada
```
src/
├── components/
│   ├── ui/                 # Button, Input, Card, Modal, etc.
│   ├── CircleSelector/
│   ├── Calculators/
│   │   ├── FonteLED.tsx
│   │   ├── BitolaCabo.tsx
│   │   └── Potencia.tsx
│   └── ModalFormula/
├── lib/
│   ├── formulas.ts
│   ├── bitolas.ts
│   └── utils.ts
├── hooks/
├── types/
└── App.tsx
```

## Critérios de Aceite
- Visual idêntico (ou extremamente próximo) às imagens do Figma
- Todos os cálculos funcionando corretamente
- Animações suaves no círculo e modais
- Código 100% tipado
- Build de produção sem erros
- Funciona bem em desktop e mobile
