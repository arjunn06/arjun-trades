import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const options = [
  { value: "system", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

/** Three plain text options instead of a sun/moon switch, so "follow my device" is a first-class choice. */
const ThemeToggle = () => {
  const { theme = "system", setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Color theme" className="inline-flex items-center gap-1">
      {options.map((o) => {
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(o.value)}
            className={cn(
              "type-label px-3 py-2 transition-colors",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
