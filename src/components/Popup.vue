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

const statusItems = [
	{ key: 'armor', icon: 'armor_full', step: 1, required: ['!isCreative'] },
	{ key: 'health', icon: 'heart/preview', step: 1, required: ['!isCreative'] },
	{ key: 'food', icon: 'food_preview', step: 1, required: ['!isCreative'] },
	{ key: 'air', icon: 'air', step: 1, required: ['!isCreative'] }
];

</script>

<template>
	<div class="settings">
		<label class="setting-item">
			{{ $t('popup.language') }}
			<select name="language" v-model="$i18n.locale" @change="loadCurrentLocale">
				<option v-for="l in supportedLocales" :key="l" :value="l">
					{{ $t(`language.${l}`) }}
				</option>
			</select>
		</label>

		<span class="split" />

		<label class="setting-item" v-for="i in items" :key="i.key">
			{{ $t(`popup.${i.key}`) }}
			<input :name="i.key" type="checkbox" role="switch" :disabled="!checkRequired(i.required)"
				v-model="options[i.key]" />
		</label>

		<span class="split" />

		<label class="setting-item" v-for="e in expItems" :key="e.key">
			{{ $t(`popup.exp.${e.key}`) }}
			<input :name="e.key" type="number" :disabled="!checkRequired(e.required)" :step="e.step"
				:min="e.scope?.[0]" :max="e.scope?.[1]" :style="{ width: '5em' }"
				v-model="options.exp[e.key]" />
		</label>

		<span class="split" />

		<table class="setting-table">
			<thead>
				<tr>
					<th>{{ $t('popup.status.name') }}</th>
					<th>{{ $t('popup.status.show') }}</th>
					<th>{{ $t('popup.status.value') }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="s in statusItems" :key="s.key">
					<td>
						<img class="icon" :src="`/res/hud/${s.icon}.png`"
							:title="$t(`popup.status.${s.key}`)" />
						{{ $t(`popup.status.${s.key}`) }}
					</td>
					<td>
						<input :name="`${s.key}-show`" type="checkbox" role="switch"
							:disabled="!checkRequired(s.required)" v-model="options.status[s.key].show" />
					</td>
					<td>
						<input :name="`${s.key}-current`" type="number"
							:disabled="!checkRequired(s.required)"
							:step="s.step" :min="0" :style="{ width: '5em' }"
							v-model="options.status[s.key].current" />
					</td>
				</tr>
			</tbody>
		</table>

		<div class="about">
			<p>{{ $t('popup.about.line1') }}</p>
			<p>{{ $t('popup.about.line2', [new Date().getFullYear()]) }}</p>

			<a class="icon-link" href="https://github.com/LateDreamXD/mc-hud-pic"
				target="_blank" rel="onopener" v-html="siGithub.svg" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.icon {
	width: 1rem;
	height: 1rem;
	image-rendering: pixelated;
	-webkit-user-drag: none;
}

.icon-link>:deep(svg) {
	fill: currentColor;
	width: 1rem;
	height: 1rem;
}

.settings {
	padding: 8px;
	min-height: calc(100% - 32px);
	@media (prefers-color-scheme: light) {
		color: #000;
	}
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

.setting-table {
	width: 100%;
	border-collapse: collapse;
	th {
		padding: 4px 8px;
	}
	td {
		padding: 4px 8px;
		text-align: center;
	}
}

.about {
	position: sticky;
	left: 0;
	top: 100%;
}
</style>