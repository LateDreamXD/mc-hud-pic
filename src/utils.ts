export function parseProgress(v: number, s?: [number, number]): number {
	if(s) return Math.max(Math.min(v, s[1]), s[0]);
	else return v;
}

export function parsePoint(v: number, min?: number) {
	const r = {
		full: Math.trunc(v / 2),
		half: v % 2
	};
	if(min) return {
		full: Math.max(r.full, min),
		half: Math.max(r.half, min % 2)
	}; else return r;
}
