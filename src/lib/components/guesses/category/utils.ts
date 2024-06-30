
function toHoursAndMinutes(totalMinutes: number) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return { hours, minutes };
}

const formatMapper = {
	runtime: (value: number) => {
		const { hours, minutes } = toHoursAndMinutes(value);
		return `${hours}h ${minutes}m`;
	}
};
export function formatNumberCategoryValue({
	name,
	value
}: {
	name: string;
	value: number;
}): string {
	if (!(name in formatMapper)) return String(value);
	return formatMapper[name as keyof typeof formatMapper](value);
}
