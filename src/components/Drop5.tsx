
  import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  
  export function SelectFA5() {
    return (
      <div>
        <SelectTrigger>
          <SelectValue placeholder="Jenis finite automata" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nfa">NFA</SelectItem>
          <SelectItem value="e-nfa">Epsilon NFA</SelectItem>
          <SelectItem value="regex">Regular Expression</SelectItem>
          <SelectItem value="dfa">DFA</SelectItem>
        </SelectContent>
      </div>
    );
  }
  