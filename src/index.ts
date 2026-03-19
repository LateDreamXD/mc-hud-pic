import { createApp } from 'vue';
import App from './App.vue';
import i18n, { loadCurrentLocale } from './i18n';
import VueLateWindowManager from 'vue-late-window-manager';
import 'vue-late-window-manager/style';

loadCurrentLocale();

const app = createApp(App);
app.use(i18n);
app.use(VueLateWindowManager);
app.mount('#app');
