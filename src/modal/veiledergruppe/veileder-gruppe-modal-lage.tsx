import ModalWrapper, { ModalProps } from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';
import { FiltervalgModell } from '../../model-interfaces';
import { Input } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducer';
import { ReactComponent as FjernIkon } from './fjern-sirkel-ikon.svg';
import { LagretFilter } from '../../ducks/lagret-filter';
import { initialState } from '../../ducks/filtrering';
import SokVeiledere from '../../components/sok-veiledere/sok-veiledere';
import SletteVeiledergruppeModal from '../../modal/veiledergruppe/slett-gruppe-modal';

interface VeilederGruppeModalProps {
    lagretFilter?: LagretFilter;
    setSletteVeilederGruppeModal: (b: boolean) => void;
}

function VeilederGruppeModalLage(props: VeilederGruppeModalProps & Omit<ModalProps, 'contentLabel' | 'children'>) {

    const [filterValg, setFilterValg] = useState<FiltervalgModell>(initialState);
    const [gruppeNavn, setGruppeNavn] = useState<string>('');
    // @ts-ignore
    const [sletteVeiledergruppeModal, setSletteVeiledergruppeModal, setVisSlettVeiledergruppeModal] = useState(false);

    const fjernVeiledereFraListen = (prevState: FiltervalgModell, veilederTarget: string) => prevState.veiledere
        ? {...prevState, veiledere: prevState.veiledere.filter(v => v !== veilederTarget)}
        : {...prevState, veiledere: []};

    const hanterChange = (event) => {
        const veilederTarget = event.target.value;
        event.target.checked
            ? setFilterValg(prevState => {
                if (prevState.veiledere) {
                    return ({...prevState, veiledere: [...prevState.veiledere, veilederTarget]});
                } else {
                    return ({...prevState, veiledere: [veilederTarget]});
                }
            })
            : setFilterValg(prevState => fjernVeiledereFraListen(prevState, veilederTarget));
    };

    useEffect(() => {
        setFilterValg(props.lagretFilter ? props.lagretFilter.filterValg : initialState);
        setGruppeNavn(props.lagretFilter ? props.lagretFilter.filterNavn : '');
    }, [props.lagretFilter]);

    const modalTittel = props.lagretFilter ? 'Rediger veiledergruppe' : 'Ny veiledergruppe';

    const lukkModal = () => {
        props.onRequestClose();
        props.lagretFilter ? setFilterValg(props.lagretFilter.filterValg) : setFilterValg(initialState);
    };

    function slettVeiledergruppeOgLukkModaler() {
        setSletteVeiledergruppeModal(false);
        // @ts-ignore
        setVisSlettVeiledergruppeModal(false);
    }

    const slettModal = () => {
        setSletteVeiledergruppeModal(true);
    };

    return (
        <ModalWrapper
            isOpen={props.isOpen}
            contentLabel="Ny veiledergruppe"
            onRequestClose={lukkModal}
            portalClassName="veiledergruppe-modal"
        >
            <div className="veiledergruppe-modal__form">
                <Innholdstittel tag="h1" className="blokk-xs">
                    {modalTittel}
                </Innholdstittel>
                <div className="veiledergruppe-modal__content">
                    <Input
                        label="Gruppenavn:"
                        value={gruppeNavn}
                        bredde="L"
                        onChange={e => setGruppeNavn(e.target.value)}
                    />

                    <div className="veiledergruppe-modal__sokefilter">
                        <SokVeiledere
                            erValgt={(ident) => filterValg.veiledere ? filterValg.veiledere.includes(ident) : false}
                            hanterChange={event => hanterChange(event)}
                        />
                    </div>
                    <p id="veiledergruppe-modal__valgteveileder__label">Valgte veiledere:</p>
                    <ValgtVeilederGruppeListe
                        valgteVeileder={filterValg.veiledere || []}
                        fjernValgtVeileder={(veilederTarget) =>
                            setFilterValg(prevState => fjernVeiledereFraListen(prevState, veilederTarget))
                        }
                    />
                </div>
                <div className="veiledergruppe-modal__knappegruppe">
                    <Hovedknapp className="veiledergruppe-modal__knappegruppe__lagre"
                                htmlType="submit">
                        Lagre endringene
                    </Hovedknapp>
                    <Flatknapp className="veiledergruppe-modal__knappegruppe__avbryt"
                               onClick={lukkModal}>
                        Avbryt
                    </Flatknapp>
                    <Flatknapp className="veiledergruppe-modal__knappegruppe__slett"
                               onClick={slettModal}
                    >
                        Slett gruppe
                    </Flatknapp>
                </div>
            </div>
            <SletteVeiledergruppeModal
                isOpen={sletteVeiledergruppeModal}
                onRequestClose={() => setSletteVeiledergruppeModal(false)}
                onSubmit={slettVeiledergruppeOgLukkModaler}
            />
        </ModalWrapper>

    );
}

interface ValgtVeilederGruppeListeProps {
    valgteVeileder: string[],
    fjernValgtVeileder: (veilederId: string) => void;
}

function ValgtVeilederGruppeListe(props: ValgtVeilederGruppeListeProps) {
    const veilederePaEnheten = useSelector((state: AppState) => state.veiledere.data.veilederListe);

    const veiledere = veilederePaEnheten
        .filter(veilederPaEnhet =>
            props.valgteVeileder.includes(veilederPaEnhet.ident))
        .sort((veileder1, veiledere2) => veileder1.etternavn.localeCompare(veiledere2.etternavn));

    const splitArrayITo = [veiledere.slice(0, Math.ceil(veiledere.length / 2)), veiledere.slice(Math.ceil(veiledere.length / 2), veiledere.length)];
    return (
        <div className="veiledergruppe-modal__valgteveileder">
            {
                splitArrayITo.map(listeMedVeileder =>
                    <div>
                        {listeMedVeileder.map(veileder => {
                            return (
                                <div className="veiledergruppe-modal__valgteveileder__elem">
                                    <span>{`${veileder.etternavn}, ${veileder.fornavn}`}</span>
                                    <Flatknapp
                                        className="fjern--knapp"
                                        htmlType="button"
                                        onClick={() => props.fjernValgtVeileder(veileder.ident)}
                                    >
                                        <FjernIkon/>
                                    </Flatknapp>
                                </div>
                            );
                        })}
                    </div>
                )
            }
        </div>
    );
}

export default VeilederGruppeModalLage;




