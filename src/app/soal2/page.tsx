'use client'

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { postfix, 
         constructTree, 
         evalRegex, 
         printTransitionTable, 
         FiniteAutomataState, 
         ExpressionTree } from './regexToNFA';

export default function Soal2() {
    const [regex, setRegex] = useState<string>("(a+b)*a.b.b");

    const handleRegexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRegex = event.target.value;
        setRegex(newRegex);
    };

    const onClickButtonGenerate = () => {
        const pr = postfix(regex);
        const et = constructTree(pr);
        const fa = evalRegex(et);

        printTransitionTable(fa);
    };

    return (
        <main>
            <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
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
            </div>
        </main>
    );
}
