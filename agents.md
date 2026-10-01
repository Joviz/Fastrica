# Agents.md - Fastrica Project

Este arquivo define todos os agentes que devem ser utilizados no projeto Fastrica.
Cada agente tem uma responsabilidade clara e deve ser executado na ordem definida.

---

## Ordem de Execução

1. **architect** → Agente Arquiteto
2. **ui-base** → Agente UI/Componente Base
3. **circle** → Agente Círculo Interativo
4. **modals** → Agente Sistema de Modais
5. **calculators** → Agente Calculadoras Laterais
6. **layout** → Agente Layout & Responsividade
7. **finalizer** → Agente Finalização

---

## 1. Agente Arquiteto (`architect`)

**Arquivo**: `agents/architect.md`

**Responsabilidades**:
- Criar o projeto Vite + React + TypeScript do zero
- Configurar Tailwind CSS v4 corretamente
- Criar toda a estrutura de pastas
- Definir design tokens (cores, border-radius, shadows, etc.)
- Criar arquivos base: `main.tsx`, `App.tsx`, `index.css`, `vite.config.ts`, `tsconfig.json`
- Instalar todas as dependências necessárias
- Garantir que o projeto roda com `npm run dev` sem erros

**Entregáveis**:
- Projeto Vite configurado
- Tailwind funcionando
- Estrutura de pastas completa
- Design tokens definidos

---

## 2. Agente UI/Componente Base (`ui-base`)

**Arquivo**: `agents/ui-base.md`

**Responsabilidades**:
- Criar componentes de UI reutilizáveis e bem tipados
- Componentes obrigatórios:
  - `Button`
  - `Input`
  - `Card`
  - `Modal`
  - `ResultDisplay` (para mostrar resultados)
- Seguir fielmente o estilo visual do Figma (cores, bordas, paddings, etc.)
- Usar `clsx` + `tailwind-merge` para variantes

**Entregáveis**:
- Pasta `src/components/ui/` completa
- Componentes exportados e tipados

---

## 3. Agente Círculo Interativo (`circle`)

**Arquivo**: `agents/circle.md`

**Responsabilidades**:
- Criar o componente do círculo dividido em 4 setores (V, I, R, P)
- Implementar estados de hover e selected
- Animações suaves com Framer Motion
- Ícone central de calculadora
- Emitir evento/callback quando um setor for clicado

**Entregáveis**:
- Componente `CircleSelector` funcional e visualmente fiel

---

## 4. Agente Sistema de Modais (`modals`)

**Arquivo**: `agents/modals.md`

**Responsabilidades**:
- Criar sistema de modais para as 4 grandezas
- Cada modal deve ter:
  - Título
  - Seletor de fórmula (botões/abas)
  - Inputs dinâmicos conforme a fórmula escolhida
  - Resultado em tempo real
  - Exibição da fórmula ativa
- Usar o componente Modal base criado anteriormente

**Entregáveis**:
- Modal de Tensão (V)
- Modal de Corrente (I)
- Modal de Resistência (R)
- Modal de Potência (P)
- Lógica de fórmulas em `lib/formulas.ts`

---

## 5. Agente Calculadoras Laterais (`calculators`)

**Arquivo**: `agents/calculators.md`

**Responsabilidades**:
- Criar os 3 cards de cálculo:
  1. Fonte para LED
  2. Bitola de cabo
  3. Potência
- Implementar toda a lógica de cálculo
- Criar tabela de bitolas (`lib/bitolas.ts`)
- Validação de inputs com Zod + React Hook Form

**Entregáveis**:
- Componentes `FonteLED`, `BitolaCabo` e `Potencia`
- Lógica de cálculo completa e testada

---

## 6. Agente Layout & Responsividade (`layout`)

**Arquivo**: `agents/layout.md`

**Responsabilidades**:
- Montar o layout completo (desktop e mobile)
- Posicionar o círculo e os cards corretamente
- Garantir que o design fique o mais próximo possível do Figma
- Ajustar breakpoints e espaçamentos
- Integrar o círculo com a abertura dos modais

**Entregáveis**:
- `App.tsx` final com layout completo
- Responsividade funcionando

---

## 7. Agente Finalização (`finalizer`)

**Arquivo**: `agents/finalizer.md`

**Responsabilidades**:
- Adicionar botão "O que comprar?"
- Adicionar botão de ajuda (?)
- Revisar tipagem TypeScript
- Limpar código desnecessário
- Garantir que `npm run build` funciona
- Polir animações e micro-interações
- Verificar se todos os critérios de aceite do `project_spec.md` foram atendidos

**Entregáveis**:
- Projeto final polido e pronto para uso
