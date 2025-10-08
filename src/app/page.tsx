import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div>
			<Button className="bg-red-400 dark:bg-amber-300">Hello</Button>
			<DarkModeToggle />
		</div>
	);
}
