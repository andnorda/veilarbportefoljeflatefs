import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {endreFiltervalg} from '../../ducks/filtrering';
import {Radio} from 'nav-frontend-skjema';
import RedigerKnapp from '../../components/knapper/rediger-knapp';
import {lagreEndringer, slettGruppe, VeiledergrupperFilter} from '../../ducks/veiledergrupper_filter';
import {AppState} from '../../reducer';
import {harGjortEndringer, veilederlisterErLik} from '../../components/modal/veiledergruppe/veileder-gruppe-utils';
import {VeilederGruppeModal} from '../../components/modal/veiledergruppe/veileder-gruppe-modal';
import {FiltervalgModell} from '../../model-interfaces';
import {useEnhetSelector} from '../../hooks/redux/use-enhet-selector';
import {visIngenEndringerToast} from '../../store/toast/actions';
import {logEvent} from '../../utils/frontend-logger';
import {finnSideNavn} from '../../middleware/metrics-middleware';
import '../../components/sidebar/sidebar.less'
import './ny_veileder-gruppe.less'
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {ListevisningType} from "../../ducks/ui/listevisning";

interface VeilederGruppeInnholdProps {
    lagretFilter: VeiledergrupperFilter[]
    filterValg?: FiltervalgModell;
    filtergruppe: string;
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function NyVeilederGruppeInnhold(props: VeilederGruppeInnholdProps) {
    const [valgtGruppe, setValgtGruppe] = useState<VeiledergrupperFilter>();
    const [visEndreGruppeModal, setVisEndreGruppeModal] = useState(false);

    const filtreringVeilederoversikt = (state: AppState) => state.filtreringVeilederoversikt.veiledere;
    const filtreringEnhetensoversikt = (state: AppState) => state.filtreringEnhetensOversikt.veiledere;
    const selector = props.filtergruppe === ListevisningType.enhetensOversikt ? filtreringEnhetensoversikt : filtreringVeilederoversikt;

    const veiledereFilter = useSelector(selector);

    useEffect(() => {
        const valgtFilter = props.lagretFilter.find(v => veilederlisterErLik(v.filterValg.veiledere, veiledereFilter));
        if (valgtFilter) {
            setValgtGruppe(valgtFilter);
        }
    }, [veiledereFilter, valgtGruppe, props.lagretFilter]);

    const outerDivRef = useRef<HTMLDivElement>(null);

    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();
    const enhet = useEnhetSelector();

    const velgGruppe = (gruppeId: string) => {
        logEvent('portefolje.metrikker.veiledergrupper.velg-gruppe',
            {}, {gruppeId: gruppeId, sideNavn: finnSideNavn()});
        const filterVerdi = finnVeilederGruppe(gruppeId);
        setValgtGruppe(filterVerdi);
        filterVerdi && dispatch(endreFiltervalg('veiledere', filterVerdi.filterValg.veiledere, props.filtergruppe));
    };

    const finnVeilederGruppe = (vg) => props.lagretFilter.find((elem) => elem.filterId === parseInt(vg));

    const submitEndringer = (gruppeNavn: string, filterValg: FiltervalgModell) => {
        if (valgtGruppe && enhet && harGjortEndringer(filterValg.veiledere, valgtGruppe.filterValg.veiledere, valgtGruppe.filterNavn, gruppeNavn)) {
            dispatch(lagreEndringer({
                filterId: valgtGruppe.filterId,
                filterNavn: gruppeNavn,
                filterValg
            }, enhet))
                .then(resp => dispatch(endreFiltervalg('veiledere', resp.data.filterValg.veiledere, props.filtergruppe)));
        } else {
            dispatch(visIngenEndringerToast());
        }
    };

    const sletteKnapp = () => {
        valgtGruppe && enhet && dispatch(slettGruppe(enhet, valgtGruppe.filterId))
        (() => dispatch(endreFiltervalg('veiledere', [], ListevisningType.enhetensOversikt)));
    };

    useEffect(() => {
        if (outerDivRef.current && isOverflown(outerDivRef.current)) {
            outerDivRef.current.style.borderTop = '1px solid #888888';
            outerDivRef.current.style.borderBottom = '1px solid #888888';
        }
    });

    return (
        <div className="ny__veileder-gruppe__valgfelt" ref={outerDivRef}>
            {props.lagretFilter.map((veilederGruppe, idx) =>
                <VeilederGruppeRad
                    key={idx}
                    veilederGruppe={veilederGruppe}
                    onClickRedigerKnapp={() => setVisEndreGruppeModal(true)}
                    hanterVelgGruppe={(e) => velgGruppe(e.target.value)}
                    veiledereFilter={veiledereFilter}
                />
            )}
            {valgtGruppe &&
            <VeilederGruppeModal
                initialVerdi={{
                    gruppeNavn: valgtGruppe.filterNavn,
                    filterValg: valgtGruppe.filterValg,
                    filterId: valgtGruppe.filterId
                }}
                isOpen={visEndreGruppeModal}
                onSubmit={submitEndringer}
                modalTittel="Rediger veiledergruppe"
                lagreKnappeTekst="Lagre endringer"
                onRequestClose={() => setVisEndreGruppeModal(false)}
                onSlett={sletteKnapp}
            />}
        </div>
    );
}

interface VeilederGruppeRad {
    hanterVelgGruppe: (e: React.ChangeEvent<HTMLInputElement>) => void;
    veilederGruppe: VeiledergrupperFilter;
    veiledereFilter: string[];
    onClickRedigerKnapp: () => void;
}

function VeilederGruppeRad({veilederGruppe, hanterVelgGruppe, onClickRedigerKnapp, veiledereFilter}: VeilederGruppeRad) {

    const lagretVeilederGruppe = veilederGruppe.filterValg.veiledere;
    const erValgt = veilederlisterErLik(lagretVeilederGruppe, veiledereFilter);

    return (
        <div className="ny__veileder-gruppe__rad">
            <Radio
                className="ny__veileder-gruppe__gruppenavn"
                key={veilederGruppe.filterId}
                name="veiledergruppe"
                label={veilederGruppe.filterNavn}
                value={veilederGruppe.filterId}
                onChange={hanterVelgGruppe}
                checked={erValgt}
            />
            <RedigerKnapp
                hidden={!erValgt}
                aria="Rediger veiledergruppe"
                onClick={onClickRedigerKnapp}
            />
        </div>
    );
}

export default NyVeilederGruppeInnhold;
