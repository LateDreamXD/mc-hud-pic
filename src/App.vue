<script setup lang="ts">
import { defineAsyncComponent, h, reactive, watch, onMounted } from 'vue';
import { useLateWindowManager } from 'vue-late-window-manager';
import { useI18n } from 'vue-i18n';
import { parseProgress } from './utils';

const { t: $t } = useI18n();
const $lwm = useLateWindowManager();

const Popup = defineAsyncComponent(() => import('./components/Popup.vue'));

const options = reactive<Options>({
	isCreative: false,
	isHardcore: false,
	exp: {
		level: 0,
		progress: 0
	}
});

const hotbarStyle = reactive({
	width: '400px',
	height: '50px',
	left: 'calc(50% - 200px)'
});

watch(() => hotbarStyle, (newVal) => {
	hotbarStyle.left = `calc(50% - ${parseInt(newVal.width.replace('px', '')) / 2}px)`;
});

const changeImage = (target: HTMLImageElement, url?: string) => {
	if (url) {
		target.src = url;
	} else {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.click();
		input.onchange = (e) => {
			const _target = e.target as HTMLInputElement;
			if (_target.files?.[0]) {
				const reader = new FileReader();
				reader.readAsDataURL(_target.files[0]);
				reader.onload = (e) => {
					target.src = e.target?.result as string;
				}
			}
			input.remove();
		}
	}
}

const openPopup = () => {
	$lwm?.actions.openWindow('popup', {
		title: $t('popup.title'),
		content: h(Popup, { options }),
		minimizable: false,
		moveable: false,
		size: {
			width: innerWidth * 0.2,
			height: innerHeight
		},
		position: {
			x: 0,
			y: 0
		}
	});
}

onMounted(() => {
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' || e.key === 'AudioVolumeDown') {
			if($lwm?.State.windows.some(w => w.id === 'popup'))
				$lwm?.actions.closeWindow('popup');
			else
				openPopup();
		}
	});
});
</script>

<template>
	<div class="bg">
		<img src="/res/background.png" :title="$t('change_image', [$t('bg')])"
			@click="changeImage($event.target as HTMLImageElement)" />
	</div>

	<span class="crosshair">
		<img class="pixel" src="/res/hud/crosshair.png" :title="$t('change_image', [$t('crosshair')])"
			@click="changeImage($event.target as HTMLImageElement)" />
	</span>

	<span class="hand">
		<img src="/res/default_hand.png" :title="$t('change_image', [$t('hand')])"
			@click="changeImage($event.target as HTMLImageElement)" />
	</span>

	<div v-if="!options.isCreative" class="status" :style="{
		left: hotbarStyle.left,
		width: hotbarStyle.width,
		bottom: hotbarStyle.height
	}">
		<span class="armor"></span>
		<span class="hearts">
			<span class="full">
				<img class="pixel" v-for="i in 10" :key="i"
					:src="`/res/hud/heart/${options.isHardcore ? 'hardcore_full' : 'full'}.png`" />
			</span>
			<span class="container">
				<img class="pixel" v-for="i in 10" :key="i"
					:src="`/res/hud/heart/${options.isHardcore ? 'container_hardcore' : 'container'}.png`" />
			</span>
		</span>
		<span class="air"></span>
		<span class="food">
			<span class="full">
				<img class="pixel" v-for="i in 10" :key="i" src="/res/hud/food_full.png" />
			</span>
			<span class="container">
				<img class="pixel" v-for="i in 10" :key="i" src="/res/hud/food_empty.png" />
			</span>
		</span>

		<span class="exp">
			<span v-if="options.exp.level" class="level mc-font">{{ options.exp.level }}</span>
			<span class="bar">
				<img v-if="options.exp.progress" class="full pixel" :style="{
					width: parseProgress(options.exp.progress, [0, 1]) * 100 + '%'
				}" src="/res/hud/experience_bar_progress.png" />
				<img class="container pixel" src="/res/hud/experience_bar_background.png" />
			</span>
		</span>
	</div>

	<span class="hotbar" :style="hotbarStyle">
		<img class="pixel" src="/res/hud/hotbar.png" :title="$t('change_image', [$t('hotbar')])"
			@click="changeImage($event.target as HTMLImageElement)" />
	</span>
	<span class="hotbar-selection" :style="{
		...hotbarStyle,
		width: hotbarStyle.height
	}">
		<img class="pixel" src="/res/hud/hotbar_selection.png" :title="$t('change_image', [$t('hotbar_selection')])"
			@click="changeImage($event.target as HTMLImageElement)" />
	</span>

	<LateWindowManager :custom-class="{ manager: 'mc-font' }" />
</template>

<style lang="scss">
@font-face {
	font-family: MinecraftSevenv4;
	src: local('MinecraftSevenv4'),
		url('/res/Minecraft-Seven-v4.ttf') format('truetype');
}

@font-face {
	font-family: Unifont;
	src: local('Unifont'),
		url('/res/unifont-15.1.05.woff2') format('woff2');
}

html {
	&[lang="en"] {
		.mc-font {
			font-size: 10px;
		}
	}
	&[lang="zh-CN"] {
		.mc-font {
			font-size: 16px;
		}
	}
}

body {
	margin: 0;
	overflow: hidden;
}


img {
	width: 100%;
	height: 100%;
	// object-fit: cover;
	user-select: none;
	-webkit-user-drag: none;

	&.pixel {
		image-rendering: pixelated;
	}
}

span {
	display: block;
}

.mc-font {
	font-family: MinecraftSevenv4, Unifont, 宋体;
	text-rendering: optimizeLegibility;
}

#app {
	width: 100%;
	height: 100%;
}

.bg {
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: -1;

	>img {
		object-fit: cover;
	}
}

.crosshair {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 32px;
	height: 32px;
}

.hand {
	position: absolute;
	width: 300px;
	height: 300px;
	right: 12%;
	bottom: 0;
}

.status {
	position: absolute;
	margin-bottom: 4px;

	display: grid;
	grid-template-areas:
		'armor air'
		'hearts food'
		'exp exp';
	justify-content: space-between;

	.armor {
		grid-area: armor;
	}

	.air {
		grid-area: air;
	}

	.hearts {
		grid-area: hearts;
	}

	.food {
		grid-area: food;
	}

	>*:not(.exp) {
		width: 180px;
		height: 18px;
		position: relative;
		margin-bottom: 2px;

		>* {
			width: 18px;
			height: 100%;
			position: absolute;
			display: flex;
		}

		>.full {
			z-index: 1;
		}

		>.container {
			z-index: 0;
		}
	}

	.exp {
		grid-area: exp;
		width: 100%;
		height: fit-content;

		>.level {
			position: absolute;
			left: 50%;
			bottom: 4px;
			transform: translateX(-50%);
			color: #ff0;
			font-size: 16px;
			text-shadow: 2px 0 #000, 0 2px #000, -2px 0 #000, 0 -2px #000;
			// -webkit-text-stroke: 0.8px #000;
			z-index: 2;
		}

		>.bar {
			width: 100%;
			height: 11px;
			position: relative;
			>* {
				position: absolute;
				width: 100%;
				height: fit-content;
			}

			>.full {
				left: 0;
				top: 0;
				height: 100%;
				object-fit: cover;
				object-position: left center;
				z-index: 1;
			}

			>.container {
				width: 100%;
				z-index: 0;
			}
		}
	}
}

.hotbar,
.hotbar-selection {
	position: absolute;
	left: 0;
	width: 100%;
	height: 42px;

	&:is(.hotbar) {
		bottom: 0;
	}

	&:is(.hotbar-selection) {
		bottom: 2px;
	}
}
</style>