# ADR 0001: Results Section Animation by Contract

## Status
Accepted

## Context
The previous implementation of the `Results` section had high coupling between the orchestrator (`Results.tsx`) and the individual items (`ResultCard.tsx`). The orchestrator directly manipulated the cards' internals, creating a "shallow" architecture where changing a card's layout could break the parent's animation logic.

## Decision
We will implement an **Animation Contract**. 
The `ResultCard` will be a **Deep Module** that manages its own internal structure and hover states. 
It will expose its root element to the parent for global orchestration (the "Fan-out" movement) while hiding its internal implementation.

## Consequences
- **Positive**: High **Locality**. We can change the `ResultCard` internals without touching `Results.tsx`.
- **Positive**: Increased **Leverage**. The parent gets complex behavior (professional social proof display) with a minimal interface.
- **Negative**: Requires careful management of `forwardRef` to ensure the contract is respected.
