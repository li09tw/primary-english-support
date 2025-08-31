import {
  GameWord,
  PatternHandler,
  PatternHandlerResult,
  patternHandlers,
} from "@/lib/game-logic";

export type { PatternHandler, PatternHandlerResult };

export const handlers = patternHandlers;

export function runPatternHandler(
  patternText: string,
  words: GameWord[]
): PatternHandlerResult | null {
  const handler = handlers[patternText as keyof typeof handlers];
  if (!handler) return null;
  return handler({ patternText, words });
}
