import type { UserConfig } from 'vite';
import vue from 'unplugin-vue/vite';

export default <UserConfig>{
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{ name: 'vue-bundle', test: /node_modules\/vue$/ },
						{ name: 'i18n', test: /src\/i18n/ },
						{ name: 'utils', test: /src\/utils/ }
					]
				}
			}
		}
	},
	plugins: [vue()]
};