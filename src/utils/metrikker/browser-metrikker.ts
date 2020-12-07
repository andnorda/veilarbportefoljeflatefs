import {logEvent} from '../frontend-logger';

const BROWSER_METRIKKER_LOG_TAG = 'portefolje.browser_metrikker';
const BROWSER_METRIKKER_LOCAL_STORAGE_KEY = 'har_logget_browser_metrikker';

function getBrowserAgent(): string {
    const userAgent = navigator.userAgent;
    const contains = (str: string): boolean => userAgent.indexOf(str) > -1;
    let agent;

    if (contains('Firefox')) {
        agent = 'firefox';
    } else if (contains('Opera') || contains('OPR')) {
        agent = 'opera';
    } else if (contains('Trident')) {
        agent = 'ie';
    } else if (contains('Edge')) {
        agent = 'edge';
    } else if (contains('Chrome')) {
        agent = 'chrome';
    } else if (contains('Safari')) {
        agent = 'safari';
    } else {
        agent = 'unknown';
    }

    return agent;
}

function getBrowserZoom(): number {
    // Denne måten å hente zoom fungerer ikke på Safari
    if (getBrowserAgent() === 'safari') {
        return -1;
    }

    return Math.round(window.devicePixelRatio * 100);
}

export const loggBrowserMetrikker = (): void => {
    const browserAgent = getBrowserAgent();
    const browserVersion = getBrowserVersion();

    logEvent(
        'portefolje.browser_bruk',
        {browser: browserAgent, version: browserVersion, zoom: getBrowserZoom()},
        {version: browserVersion}
    );

    if (window.localStorage.getItem(BROWSER_METRIKKER_LOCAL_STORAGE_KEY) == null) {
        window.localStorage.setItem(BROWSER_METRIKKER_LOCAL_STORAGE_KEY, 'true');
        logEvent(BROWSER_METRIKKER_LOG_TAG, {browser: browserAgent, version: browserVersion});
    }
};

function getBrowserVersion() {
    var ua = navigator.userAgent,
        tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (M && (tem = ua.match(/version\/([.\d]+)/i)) != null) M[2] = tem[1];
    M = M ? [M[2]] : [navigator.appVersion, '-?'];
    return M;
}
