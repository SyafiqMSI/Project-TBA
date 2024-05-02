// src/types/react-mermaid.d.ts
declare module 'react-mermaid' {
    import { ComponentType } from 'react';

    interface MermaidProps {
        chart: string;
    }

    const Mermaid: ComponentType<MermaidProps>;
    export default Mermaid;
}
