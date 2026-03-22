<script setup lang="ts">
import { computed, defineAsyncComponent, h, reactive, onMounted } from 'vue';
import { useLateWindowManager } from 'vue-late-window-manager';
import { useI18n } from 'vue-i18n';
import { parseProgress, parsePoint } from './utils';

const { t: $t } = useI18n();
const $lwm = useLateWindowManager();

const Popup = defineAsyncComponent(() => import('./components/Popup.vue'));

const options = reactive<Options>({
	isCreative: false,
	isHardcore: false,
	exp: {
		level: 0,
		progress: 0
	},
	status: {
		armor: {
			show: false,
			current: 0,
			max: 20
		},
		health: {
			show: true,
			current: 20,
			max: 20
		},
		food: {
			show: true,
			current: 20,
			max: 20
		},
		air: {
			show: false,
			current: 20,
			max: 20
		}
	}
});

const status = reactive({
	armor: computed(() => parsePoint(options.status.armor.current)),
	health: computed(() => parsePoint(options.status.health.current)),
	food: computed(() => parsePoint(options.status.food.current)),
	air: computed(() => parsePoint(options.status.air.current)),
});

const hotbarStyle = reactive({
	width: '400px',
	height: '50px',
	// left: 'calc(50% - 200px)'
});

const isTouchable = computed(() => 'ontouchend' in document.documentElement);

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

	<div v-if="isTouchable" class="visual-keys">
		<button style="left: 8px; top: 8px;" @click="openPopup">Esc</button>
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
		left: `calc(50% - ${parseInt(hotbarStyle.width.replace('px', '')) / 2}px)`,
		width: hotbarStyle.width,
		bottom: hotbarStyle.height
	}">
		<span v-if="options.status.armor.show" class="armor">
			<span class="full">
				<img v-if="status.armor.full" class="pixel" v-for="i in status.armor.full" :key="i"
					src="/res/hud/armor_full.png" />
				<img v-if="status.armor.half" class="pixel" v-for="i in status.armor.half" :key="i"
					src="/res/hud/armor_half.png" />
			</span>
			<span class="container">
				<img class="pixel" v-for="i in options.status.armor.max / 2" :key="i"
					src="/res/hud/armor_empty.png" />
			</span>
		</span>
		<span v-if="options.status.health.show" class="hearts">
			<span class="full">
				<img v-if="status.health.full" class="pixel" v-for="i in status.health.full" :key="i"
					:src="`/res/hud/heart/${options.isHardcore ? 'hardcore_full' : 'full'}.png`" />
				<img v-if="status.health.half" class="pixel" v-for="i in status.health.half" :key="i"
					:src="`/res/hud/heart/${options.isHardcore ? 'hardcore_half' : 'half'}.png`" />
			</span>
			<span class="container">
				<img class="pixel" v-for="i in options.status.health.max / 2" :key="i"
					:src="`/res/hud/heart/${options.isHardcore ? 'container_hardcore' : 'container'}.png`" />
			</span>
		</span>
		<span v-if="options.status.air.show" class="air">
			<span class="full">
				<img v-if="status.air.full" class="pixel" v-for="i in status.air.full" :key="i"
					src="/res/hud/air.png" />
				<img v-if="status.air.half" class="pixel" v-for="i in status.air.half" :key="i"
					src="/res/hud/air_bursting.png" />
			</span>
			<span v-if="false" class="container">
				<img class="pixel" v-for="i in options.status.air.max / 2" :key="i"
					src="/res/hud/air_empty.png" />
			</span>
		</span>
		<span v-if="options.status.food.show" class="food">
			<span class="full">
				<img v-if="status.food.full" class="pixel" v-for="i in status.food.full" :key="i"
					src="/res/hud/food_full.png" />
				<img v-if="status.food.half" class="pixel" v-for="i in status.food.half" :key="i"
					src="/res/hud/food_half.png" />
			</span>
			<span class="container">
				<img class="pixel" v-for="i in options.status.food.max / 2" :key="i"
					src="/res/hud/food_empty.png" />
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

	<span class="hotbar" :style="{
		...hotbarStyle,
		left: `calc(50% - ${parseInt(hotbarStyle.width.replace('px', '')) / 2}px)`,
	}">
		<img class="pixel" src="/res/hud/hotbar.png" :title="$t('change_image', [$t('hotbar')])"
			@click="changeImage($event.target as HTMLImageElement)" />
	</span>
	<span class="hotbar-selection" :style="{
		...hotbarStyle,
		width: hotbarStyle.height,
		left: `calc(50% - ${parseInt(hotbarStyle.width.replace('px', '')) / 2}px)`,
	}">
		<img class="pixel" src="/res/hud/hotbar_selection.png" :title="$t('change_image', [$t('hotbar_selection')])"
			@click="changeImage($event.target as HTMLImageElement)" />
	</span>

	<LateWindowManager :custom-class="{ manager: 'mc-font' }" />
</template>
