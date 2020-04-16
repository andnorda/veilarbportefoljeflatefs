import * as React from 'react';
import { Form, } from 'formik';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import FormikTekstArea from '../../formik/formik-tekstarea';
import FormikInput from '../../formik/formik-input';
import FormikDatoVelger from '../../formik/formik-datovelger/formik-datovelger';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import './arbeidsliste.less';
import ArbeidslisteKategori from './arbeidsliste-kategori';
import { BrukerModell } from '../../../model-interfaces';
import { logEvent } from '../../../utils/frontend-logger';
import { ReactComponent as SlettIcon } from '../../ikoner/slett.svg';

interface RedigerArbeidslisteProps {
    sistEndretDato: Date;
    sistEndretAv?: string;
    laster: boolean;
    lukkModal: () => void;
    bruker: BrukerModell;
    fjernModal?: any;
}

function RedigerArbeidsliste(props: RedigerArbeidslisteProps) {

    const onClick = () => {
        logEvent('portefolje.metrikker.fjern-arbeidsliste-modal');
        props.fjernModal();
    }
    return (
        <Form>
            <div className="arbeidsliste__bruker">
                <div className="nav-input blokk-s">
                    <Undertittel>
                        {`${props.bruker.fornavn} ${props.bruker.etternavn}, ${props.bruker.fnr}`}
                    </Undertittel>
                    <FormikInput name="overskrift"/>
                    <FormikTekstArea name="kommentar"/>
                    <Undertekst className="arbeidsliste--modal-redigering">
                        {`Oppdatert ${props.sistEndretDato.toLocaleDateString()} av ${props.sistEndretAv}`}
                    </Undertekst>
                </div>
                <div className="skjemaelement dato-kategori-wrapper">
                    <FormikDatoVelger name="frist"/>
                    <ArbeidslisteKategori name="kategori" index=""/>
                </div>
            </div>
            <div className="modal-footer">
                <Hovedknapp
                    htmlType="submit"
                    className="knapp knapp--hoved"
                    onClick={() => {
                        logEvent('teamvoff.metrikker.arbeidslistekategori', {
                            kategori: props.bruker.arbeidsliste.kategori,
                            leggtil: false,
                            applikasjon: 'oversikt'
                        });
                    }}
                >
                    Lagre
                </Hovedknapp>
                <button type="button" className="knapp knapp--avbryt" onClick={props.lukkModal}>
                    Avbryt
                </button>
                <Flatknapp
                    htmlType="button"
                    onClick={onClick}
                    className="fjern--knapp"
                >
                    <SlettIcon/>
                    <span>Fjern</span>
                </Flatknapp>
            </div>
        </Form>
    );
}

export default RedigerArbeidsliste;
