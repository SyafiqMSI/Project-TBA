
  import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  
  export function SelectFA() {
    return (
      <div>
        <SelectTrigger>
          <SelectValue placeholder="Jenis finite automata" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nfa">NFA</SelectItem>
          <SelectItem value="e-nfa">Epsilon NFA</SelectItem>
        </SelectContent>
      </div>
    );
  }
  