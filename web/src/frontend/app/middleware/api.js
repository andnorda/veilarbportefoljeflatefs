import { fetchToJson } from '../ducks/utils';
import { erDev } from './../utils/utils';

const API_BASE_URL = '/veilarbportefoljeflatefs/tjenester';
const MED_CREDENTIALS = { credentials: 'same-origin' };

const VEILARBVEILEDER_URL = erDev() ? ':9590/veilarbveileder' : '/veilarbveileder';
const VEILARBPORTEFOLJE_URL = erDev() ? ':9594/veilarbportefolje' : '/veilarbportefolje';

export function hentEnheter(ident) {
    const url = `https://${window.location.hostname}${VEILARBVEILEDER_URL}/tjenester/veileder/${ident}/enheter`;
    return fetchToJson(url, MED_CREDENTIALS);
}

export function hentLedetekster() {
    return fetchToJson(`${API_BASE_URL}/tekster`, MED_CREDENTIALS);
}

export function hentPortefolje(enhet, ident, rekkefolge, fra, antall) {
    const url = `https://${window.location.hostname}${VEILARBPORTEFOLJE_URL}/tjenester/enhet/${enhet}/` +
                `portefolje?ident=${ident}&fra=${fra}&antall=${antall}&sortByLastName=${rekkefolge}`;
    return fetchToJson(url, MED_CREDENTIALS);
}

export function hentEnhetsVeiledere(enhetId) {
    const url = `https://${window.location.hostname}${VEILARBVEILEDER_URL}/tjenester/enhet/${enhetId}/veiledere`;
    return fetchToJson(url, MED_CREDENTIALS);
}
