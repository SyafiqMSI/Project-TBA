'use client'
// Import React dan fungsi useState dari 'react'
import React, { useState } from 'react';

// Impor komponen Input, Label, dan Button dari direktori komponen UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';

// Impor fungsi dan kelas yang diperlukan dari regexToNFA.ts
import { postfix, constructTree, evalRegex, printTransitionTable, FiniteAutomataState, ExpressionTree } from './regexToNFA';

// Definisikan komponen Soal1 sebagai sebuah fungsi
export default function Soal1() {
    // Definisikan state untuk regex dengan useState
    const [regex, setRegex] = useState<string>("(a+b)*a.b.b");

    // Definisikan fungsi event handler untuk perubahan input regex
    const handleRegexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRegex = event.target.value;
        setRegex(newRegex);
    };

    // Definisikan fungsi event handler untuk tombol Generate
    const onClickButtonGenerate = () => {
        // Konversi regex ke e-NFA
        const pr = postfix(regex);
        const et = constructTree(pr);
        const fa = evalRegex(et);

        // Print atau gunakan hasil e-NFA
        printTransitionTable(fa);
    };

    // Kembalikan JSX yang akan dirender oleh komponen Soal1
    return (
        <main>
            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
                {/* Tampilkan label dan input untuk regex */}
                <div className="mt-5 space-y-2">
                    <Label htmlFor="regex" className="regex">REGEX</Label>
                    <Input
                        type="text"
                        placeholder="1*"
                        value={regex}
                        onChange={handleRegexChange}
                    />
                </div>
                {/* Tampilkan tombol untuk mengonversi regex */}
                <div className="mt-8 px-1 py-5">
                    <Button onClick={onClickButtonGenerate}>Convert to e-NFA</Button>
                </div>
            </div>
        </main>
    );
}
