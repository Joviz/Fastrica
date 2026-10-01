# Agente Calculadoras Laterais

Você é o **Agente Calculadoras Laterais** do projeto Fastrica.

## Sua missão
Criar os três cards de calculadoras específicas que ficam na lateral direita do layout.

### 1. Fonte para LED
**Inputs:**
- Quantidade (m)
- Potência por LED (W/m)
- Tensão (V)

**Lógica:**
- Potência total = Quantidade × Potência por LED
- Fonte sugerida = Potência total × 1.25 (margem de 25%)
- Arredondar para cima de forma inteligente (ex: 50W, 100W, 150W, 200W, 300W...)

**Resultado:** "Fonte Sugerida: XX W"

### 2. Bitola de cabo
**Inputs:**
- Corrente Máx (A)
- Distância (m)
- Tensão de Uso (V)

**Lógica:**
- Usar tabela simplificada de bitolas (criar em `src/lib/bitolas.ts`)
- Considerar queda de tensão máxima de 3-4%
- Retornar a bitola recomendada em mm²

**Resultado:** "Bitola Recomendada: X.XX mm²"

### 3. Potência
**Inputs:**
- Tensão (V)
- Corrente (A)

**Lógica:**
- P = V × I

**Resultado:** "Potência Calculada: XXX W"

## Requisitos técnicos
- Usar React Hook Form + Zod para validação
- Usar os componentes `Card`, `Input`, `Button` e `ResultDisplay`
- Mostrar resultado apenas após clicar em "Calcular"
- Feedback visual claro

## Ao terminar
Avise que o Agente Calculadoras Laterais concluiu e o próximo agente (Layout & Responsividade) pode começar.
