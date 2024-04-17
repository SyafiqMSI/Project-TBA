import { NavigationMenuDemo } from "@/components/Nav";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { Bsoal1 } from "@/components/Bread";
import { DropdownMenuDemo } from "@/components/Drop";


export default function Soal1() {
  return (
    <main>
      <header className="py-5 px-5">
        <NavigationMenuDemo />
      </header>

      <div className="mx-auto px-4 max-w-[768px] py-3 mt-1">
        <Bsoal1 />

        <div className="mt-8 space-y-4">
          <h1 className="font-bold text-3xl mt-4" style={{ fontSize: '2.3em' }}>
            NFA e-NFA to DFA
          </h1>
          <p style={{ fontSize: '1.0em' }}>
            Menerima input untuk NFA ataupun e-NFA kemudian mengubahnya menjadi DFA yang berkaitan
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="states">States</Label>
            <Input type="states" placeholder="q0,q1,..." defaultValue="q0,q1,q2" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="alphabets">Symbols</Label>
            <Input type="alphabets" placeholder="0,1,..." defaultValue="0,1" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="startState">Start State</Label>
            <Input type="startState" placeholder="q0/q1/..." defaultValue="q0" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="finalStates">Final States</Label>
            <Input type="finalStates" placeholder="q0/q1/..." defaultValue="q2" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="automataType">Jenis Finite Automata</Label>
            <DropdownMenuDemo/>
          </div>
          <div>
            <p className="text-lg font-semibold pt-4">Transitions</p>
            <p>Pisahkan setiap state menggunakan tanda koma (,) dan setiap hubungan dengan tanda titik koma (;)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tambahkan input untuk transition di sini */}
          </div>
          <div>
            <p className="text-lg font-semibold pt-4">Epsilon</p>
            <p>Pisahkan setiap state menggunakan tanda koma (,)</p>
          </div>
          <div className="gap-4 grid grid-cols-2">
            {/* Tambahkan input untuk epsilon di sini */}
          </div>
        </div>
      </div>
    </main>
  );
}
