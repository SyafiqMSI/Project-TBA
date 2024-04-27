import { NavigationMenuDemo } from "@/components/Nav"
import { CardWithForm } from "@/components/Card";
import { ModeToggle } from "@/components/Theme"

export default function Home() {
  return (
    <main>
 
      <header className="py-5 px-5">
        <NavigationMenuDemo/>
      </header>

        <div className="px-10 py-10">
            <CardWithForm />
        </div>
    
    </main>
    
  );
}
