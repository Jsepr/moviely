import type { NumberCategory } from "$lib/types/guess";

export function getNumberAnswerCategory<TName extends string>({
	name,
	todaysValue,
	guessedValue,
  closeDiff
}: {
	name: TName;
	todaysValue: number;
	guessedValue: number;
  closeDiff: number;
}): NumberCategory<TName> {
	const runtimeCorrect = guessedValue === todaysValue;
	const runtimeDiff = guessedValue - todaysValue;

	return {
		name: name,
		value: guessedValue,
		correct: runtimeCorrect,
		proximity: runtimeCorrect ? undefined : Math.abs(runtimeDiff) < closeDiff ? 'close' : 'far',
		hint: runtimeCorrect ? undefined : runtimeDiff > 0 ? 'below' : 'above'
	};
}
