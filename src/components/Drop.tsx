import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  
  export function DropdownMenuDemo() {
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
  