// tableDFAminimasi.tsx
import React from 'react';

interface TableDFAProps {
    states: string[];
    alphabets: string[];
    startState: string;
    finalStates: string[];
    transitions: { [key: string]: string };
}

const TableDFAMinimasi: React.FC<TableDFAProps> = ({ states, alphabets, startState, finalStates, transitions }) => {
    return (
        <div>
            <h2>DFA Setelah Minimasi (belum bener table dfa minimize nya) (mau tak perbaiki supaya state yang sama terhapus jadi 1 state aja)</h2>
            <table>
                <thead>
                    <tr>
                        <th>States</th>
                        {alphabets.map((alphabet, index) => (
                            <th key={index}>{alphabet}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {states.map((state, index) => (
                        <tr key={index}>
                            <td>{state}</td>
                            {alphabets.map((alphabet, idx) => (
                                <td key={idx}>{transitions[`${state},${alphabet}`]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <p>Start State: {startState}</p>
                <p>Final States: {finalStates.join(', ')}</p>
            </div>
        </div>
    );
};

export default TableDFAMinimasi;