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
	},
	status: Record<string, {
		show: boolean;
		current: number;
		max: number;
	}> & {
		/** armor */
		armor: {
			/** show armor or not */
			show: boolean;
			/** current armor */
			current: number;
			/** max armor */
			max: number;
		},
		/** health */
		health: {
			/** show health or not */
			show: boolean;
			/** current health */
			current: number;
			/** max health */
			max: number;
		},
		/** hunger */
		food: {
			/** show hunger or not */
			show: boolean;
			/** current hunger */
			current: number;
			/** max hunger */
			max: number;
		},
		/** air */
		air: {
			/** show air or not */
			show: boolean;
			/** current air */
			current: number;
			/** max air */
			max: number;
		}
	}
}
