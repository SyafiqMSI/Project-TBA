'use client'
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from '@/components/Nav';
import { Bsoal2 } from '@/components/Bread';
import { Button } from '@/components/ui/button';
import { printTransitionTable, FiniteAutomataState, postfix, constructTree, evalRegex } from './regexToNFA';

export default function Soal1() {
    const [regex, setRegex] = useState<string>("(a+b)*a.b.b");
    const [output, setOutput] = useState<string>("");

    const handleRegexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRegex = event.target.value;
        setRegex(newRegex);
    };

    const onClickButtonGenerate = () => {
        try {
            const pr = postfix(regex);
            const et = constructTree(pr);
            const fa = evalRegex(et);
            
            // Menggunakan variabel lokal untuk menyimpan hasil cetakan
            const printedOutput = printTransitionTable(fa);
    
            // Set state output dengan hasil cetakan
            setOutput(printedOutput);
        } catch (error) {
            console.error("Error occurred while generating e-NFA:", error);
            setOutput("Error occurred while generating e-NFA.");
        }
    };

    return (
        <main>
            <header className="py-5 px-5">
                <NavigationMenuDemo />
            </header>

            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
                <Bsoal2 />
                <div className="mt-8 space-y-4">
                    <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
                        REGEX to e-NFA
                    </h1>
                    <p style={{ fontSize: '1.0em' }}>
                        Menerima input berupa regular expression dan dapat mengenerate e-NFA yang berhubungan
                    </p>
                </div>

                <div className="mt-5 space-y-2">
                    <Label htmlFor="regex" className="regex">REGEX</Label>
                    <Input
                        type="text"
                        placeholder="1*"
                        value={regex}
                        onChange={handleRegexChange}
                    />
                </div>
                <div className="mt-8 px-1 py-5">
                    <Button onClick={onClickButtonGenerate}>Convert to e-NFA</Button>
                </div>

                {output && (
                    <div className="mt-8">
                        <textarea
                            className="border border-gray-300 rounded p-2 w-full h-80"
                            value={output}
                            readOnly
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
