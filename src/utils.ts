export function parseProgress(v: number, s?: [number, number]): number {
	if(s) return Math.max(Math.min(v, s[1]), s[0]);
	else return v;
}
