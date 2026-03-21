<script setup lang="ts">
import { loadCurrentLocale, supportedLocales } from '../i18n';
import { siGithub } from 'simple-icons'

const { options } = defineProps<{
	options: Options;
}>();

const checkRequired = (requireds?: string[]) => {
	if (!requireds) return true;
	const checks: boolean[] = [];
	requireds.forEach(r => {
		if (r.startsWith('!')) {
			if (!options[r.slice(1)])
				checks.push(true);
			else
				checks.push(false);
		} else {
			if (options[r])
				checks.push(false);
			else
				checks.push(true);
		}
	});
	return checks.every(c => c);
}

const items = [
	{ key: 'isCreative' },
	{ key: 'isHardcore', required: ['!isCreative'] }
];

const expItems = [
	{ key: 'level', step: 1, scope: [0], required: ['!isCreative'] },
	{ key: 'progress', step: 0.1, scope: [0, 1], required: ['!isCreative'] }
];

</script>

<template>
	<div :class="$style.settings">
		<label :class="$style['setting-item']">
			{{ $t('popup.language') }}
			<select name="language" v-model="$i18n.locale" @change="loadCurrentLocale">
				<option v-for="l in supportedLocales" :key="l" :value="l">
					{{ $t(`language.${l}`) }}
				</option>
			</select>
		</label>
		<span :class="$style.split" />
		<label :class="$style['setting-item']" v-for="s in items" :key="s.key">
			{{ $t(`popup.${s.key}`) }}
			<input :name="s.key" type="checkbox" role="switch" :disabled="!checkRequired(s.required)"
				v-model="options[s.key]" />
		</label>
		<span :class="$style.split" />
		<!-- <label>
			{{ $t('popup.status.health') }}
			<input type="number" v-model="options.status.health" />
		</label> -->
		<label :class="$style['setting-item']" v-for="e in expItems" :key="e.key">
			{{ $t(`popup.exp.${e.key}`) }}
			<input :name="e.key" type="number" :disabled="!checkRequired(e.required)" :step="e.step"
				:min="e.scope?.[0]" :max="e.scope?.[1]" :style="{ width: '5em' }"
				v-model="options.exp[e.key]" />
			</label>
		<span :class="$style.split" />
		<div :class="$style.about">
			<p>{{ $t('popup.about.line1') }}</p>
			<p>{{ $t('popup.about.line2', [new Date().getFullYear()]) }}</p>

			<a :class="$style['icon-link']" href="https://github.com/LateDreamXD/mc-hud-pic"
				target="_blank" rel="onopener" v-html="siGithub.svg" />
		</div>
	</div>
</template>

<style lang="scss" module>
.icon-link>svg {
	fill: currentColor;
	width: 1em;
	height: 1em;
}

.settings {
	padding: 8px;
	min-height: calc(100% - 32px);
}

.split {
	display: block;
	width: 100%;
	height: 1px;
	background-color: #ccc8;
	margin-block: 8px;
}

.setting-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-block: 8px;
}

.about {
	position: sticky;
	left: 0;
	top: 100%;
}
</style>