'use client'

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationMenuDemo } from '@/components/Nav';
import { DropdownMenuDemo } from '@/components/Drop';
import { Bsoal2 } from '@/components/Bread';
import { Select } from "@/components/ui/select";
import "./style.css";

import { Button } from '@/components/ui/button';

interface Transitions {
    [key: string]: string;
}

export default function Soal1() {
    const [regex, setStates] = useState<string>("0+1*");

    const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStates = event.target.value;
        setStates(newStates);
    };

    const onClickButtonGenerate = () => {

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
                        defaultValue={regex}
                        onChange={handleStateChange}
                    />
                </div>
                <div className="mt-8 px-1 py-5">
                <Button onClick={onClickButtonGenerate}>Convert to e-NFA</Button>
              </div>
            </div>
        </main>
    );
}
