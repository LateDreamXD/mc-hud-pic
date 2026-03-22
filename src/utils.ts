export async function copyPic() {
	const { domToBlob } = await import('modern-screenshot');
	const blob = await domToBlob(document.querySelector('#app')!);
	await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
}

export async function savePic(options?: import('modern-screenshot').Options) {
	const { domToPng } = await import('modern-screenshot');
	const png = await domToPng(document.querySelector('#app')!, options);
	const a = document.createElement('a');
	a.href = png;
	a.download = `mc-hud-pic_${new Date().toISOString().split('.')[0].replace(/T|:/g, '_')}.png`;
	a.click();
	a.remove();
	return png;
}

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
