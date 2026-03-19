type Options = Record<string, any> & {
	/** hide status or not */
	isCreative: boolean;
	/** use hardcore hearts instead of normal hearts */
	isHardcore: boolean;
	/** experience */
	exp: Record<string, any> & {
		/** experience level */
		level: number;
		/** experience progress, [0, 1] */
		progress: number;
	}
}
