'use client'

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Bsoal2 } from '@/components/Bread';
import { NavigationMenuDemo } from '@/components/Nav';
import { postfix, constructTree, evalRegex, printTransitionTable } from './regexToNFA';

export default function Soal2() {
    const [regex, setRegex] = useState<string>("(a+b)*a.b.b");
    const [transitionTable, setTransitionTable] = useState<string>("");

    const handleRegexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRegex = event.target.value;
        setRegex(newRegex);
    };

    const onClickButtonGenerate = () => {
        try {
            const postfixed = postfix(regex);
            const expressionTree = constructTree(postfixed);
            const [startState, finalState] = evalRegex(expressionTree);
            console.log('E-NFA transition table:');
            const table = printTransitionTable([startState, finalState]);
            setTransitionTable(table);
        } catch (error) {
            console.error("Error processing regex:", error);
        }
    };
    

    return (
        <main>
            <header className="py-5 px-5">
                <NavigationMenuDemo/>
            </header>
            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
                <Bsoal2 />
                <div className="mt-8 space-y-4">
                    <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
                        REGEX to E-NFA
                    </h1>
                    <p style={{ fontSize: '1.0em' }}>
                        Menerima input berupa regular expression dan dapat mengenerate e-NFA yang berhubungan.
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
                {transitionTable && (
                    <div className="mt-8">
                        <h2 className="font-bold text-xl">E-NFA Transition Table</h2>
                        <pre>{transitionTable}</pre>
                    </div>
                )}
            </div>
        </main>
    );
}


