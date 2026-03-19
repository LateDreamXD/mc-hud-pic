import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';

const supportedLocales = ['en', 'zh-CN'];

const i18n = createI18n({
	locale: supportedLocales.includes(navigator.language) ? navigator.language : 'en',
	legacy: false,
	missingWarn: import.meta.env.DEV,
	fallbackWarn: import.meta.env.DEV
});

const setLocale = (locale: string) => {
	if(supportedLocales.includes(locale)) {
		i18n.global.locale.value = locale;
		document.documentElement.lang = locale;
	} else throw new Error(`locale ${locale} is not supported`);
}

const loadLocale = async (locale: string) => {
	const locales = await (await fetch(`/locales/${locale}.json`)).json();
	i18n.global.setLocaleMessage(locale, locales);
	return nextTick();
}

const loadCurrentLocale = () => (
	document.documentElement.lang = i18n.global.locale.value,
	loadLocale(i18n.global.locale.value)
);

export {
	i18n as default,
	setLocale,
	supportedLocales,
	loadLocale,
	loadCurrentLocale
}
