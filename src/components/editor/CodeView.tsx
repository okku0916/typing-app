import type { CharacterState } from "@/features/typing/engine";

interface CodeViewProps {
  chars: CharacterState[];
  cursorIndex: number;
}

export function CodeView({ chars, cursorIndex }: CodeViewProps) {
  return (
    <pre className="typing-scrollbar overflow-x-auto rounded-lg border border-line bg-[#11141b] p-4 text-sm leading-7 text-foreground code-font sm:text-base">
      <code>
        {chars.map((char, index) => {
          const isCursor = index === cursorIndex;

          if (char.expected === "\n") {
            return (
              <span
                key={`nl-${index}`}
                className={isCursor ? "rounded-sm bg-accent/35" : undefined}
              >
                {"\n"}
              </span>
            );
          }

          let className = "text-foreground/90";

          if (char.isCorrect) {
            className = "text-success";
          }

          if (char.isMistake) {
            className = "text-danger bg-danger/15";
          }

          if (isCursor) {
            className += " rounded-sm bg-accent/25";
          }

          const displayValue = char.expected === " " ? "\u00A0" : char.expected;

          return (
            <span key={`${char.expected}-${index}`} className={className}>
              {displayValue}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
