import React from 'react';
import { connect } from 'react-redux';
import Innholdslaster from '../innholdslaster/innholdslaster';
import { hentPortefoljeForEnhet, settSortering } from '../ducks/portefolje';
import Toolbar from './../components/toolbar/toolbar';
import { getSorteringsFeltFromUrl, getSorteringsRekkefolgeFromUrl, updateLastPath } from '../utils/url-utils';
import EnhetTabell from './enhetsportefolje-tabell';
import TabellOverskrift from '../components/tabell-overskrift';
import { ASCENDING, DESCENDING } from '../konstanter';
import { diagramSkalVises } from '../minoversikt/diagram/util';
import Diagram from '../minoversikt/diagram/diagram';
import VelgfilterMelding from './velg-filter-melding';
import { STATUS } from '../ducks/utils';
import { FiltervalgModell, ValgtEnhetModell } from '../model-interfaces';
import { ListevisningType } from '../ducks/ui/listevisning';
import { selectSideStorrelse } from '../components/toolbar/paginering/paginering-selector';
import { ModalEnhetSideController } from '../components/modal/modal-enhet-side-controller';

function antallFilter(filtervalg) {
    function mapAktivitetFilter(value) {
        return Object.entries(value).map(([_, verdi]) => {
            if (verdi === 'NA') return 0;
            return 1;
        }).reduce((a: number, b: number) => a + b, 0);
    }

    return Object.entries(filtervalg)
        .map(([filter, value]) => {
            if (value === true) {
                return 1;
            } else if (Array.isArray(value)) {
                return value.length;
            } else if (filter === 'aktiviteter') {
                return mapAktivitetFilter(value);
            } else if (typeof value === 'object') {
                return value ? Object.entries(value).length : 0;
            } else if (value) return 1;
            return 0;
        }).reduce((a, b) => a + b, 0);
}

interface EnhetsportefoljeVisningProps {
    valgtEnhet: ValgtEnhetModell;
    portefolje: any;
    hentPortefolje: (enhetid: string | undefined, sorteringsrekkefolge: string, sorteringsfelt: string, filtervalg: FiltervalgModell) => any;
    veiledere: any;
    doSettSortering: (sorteringsrekkefolge: string, felt: string) => void;
    sorteringsrekkefolge: string;
    sorteringsfelt: string;
    filtervalg: FiltervalgModell;
    visningsmodus: string;
    sideStorrelse: number;
}

class EnhetsportefoljeVisning extends React.Component<EnhetsportefoljeVisningProps> {
    componentWillMount() {
        const {
            valgtEnhet, hentPortefolje, filtervalg
        } = this.props;

        const sorteringsfelt = getSorteringsFeltFromUrl();
        const sorteringsrekkefolge = getSorteringsRekkefolgeFromUrl();
        this.props.doSettSortering(sorteringsrekkefolge, sorteringsfelt);

        hentPortefolje(
            valgtEnhet.enhet!.enhetId,
            sorteringsrekkefolge,
            sorteringsfelt,
            filtervalg
        );
        this.settSorteringOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this);
    }

    settSorteringOgHentPortefolje(felt) {
        const {
            sorteringsrekkefolge,
            sorteringsfelt,
            doSettSortering,
            valgtEnhet,
            hentPortefolje,
            filtervalg
        } = this.props;

        let valgtRekkefolge = '';

        if (felt !== sorteringsfelt) {
            valgtRekkefolge = ASCENDING;
        } else {
            valgtRekkefolge = sorteringsrekkefolge === ASCENDING ? DESCENDING : ASCENDING;
        }

        doSettSortering(valgtRekkefolge, felt);
        hentPortefolje(
            valgtEnhet.enhet!.enhetId,
            valgtRekkefolge,
            felt,
            filtervalg,
        );
    }

    lagToolbar = () => {
        const {
            portefolje,
            valgtEnhet,
            hentPortefolje,
            sorteringsrekkefolge,
            sorteringsfelt,
            filtervalg,
            visningsmodus,
        } = this.props;

        const {antallTotalt} = portefolje.data;

        return (
            <Toolbar
                filtergruppe={ListevisningType.enhetensOversikt}
                onPaginering={() => hentPortefolje(
                    valgtEnhet.enhet!.enhetId,
                    sorteringsrekkefolge,
                    sorteringsfelt,
                    filtervalg
                )}
                sokVeilederSkalVises
                visningsmodus={visningsmodus}
                antallTotalt={antallTotalt}
            />
        );
    };

    render() {
        const {
            portefolje,
            valgtEnhet,
            veiledere,
            filtervalg,
            visningsmodus,
        } = this.props;

        updateLastPath();

        const {antallTotalt, antallReturnert, fraIndex, brukere} = portefolje.data;
        const visDiagram = diagramSkalVises(visningsmodus, filtervalg.ytelse);

        const harFilter = antallFilter(filtervalg) !== 0;
        if (!harFilter) {
            return <VelgfilterMelding/>;
        }

        const tilordningerStatus = portefolje.tilordningerstatus !== STATUS.RELOADING ? STATUS.OK : STATUS.RELOADING;
        const antallValgt = brukere.filter((bruker) => bruker.markert).length;

        return (
            <div className="portefolje__container">
                <Innholdslaster avhengigheter={[portefolje, veiledere, {status: tilordningerStatus}]}>
                    <TabellOverskrift
                        fraIndex={fraIndex}
                        antallIVisning={antallReturnert}
                        antallValgt={antallValgt}
                        antallTotalt={antallTotalt}
                        visDiagram={visDiagram}
                    />
                    {this.lagToolbar()}
                    {
                        visDiagram ?
                            <Diagram
                                filtreringsvalg={filtervalg}
                                enhet={valgtEnhet.enhet!.enhetId}
                            />
                            :
                            <EnhetTabell
                                veiledere={veiledere.data.veilederListe}
                                settSorteringOgHentPortefolje={this.settSorteringOgHentPortefolje}
                            />
                    }
                    <ModalEnhetSideController/>
                </Innholdslaster>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    portefolje: state.portefolje,
    valgtEnhet: state.enheter.valgtEnhet,
    veiledere: state.veiledere,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    sorteringsfelt: state.portefolje.sorteringsfelt,
    filtervalg: state.filtrering,
    visningsmodus: state.paginering.visningsmodus,
    sideStorrelse: selectSideStorrelse(state),
});

const mapDispatchToProps = (dispatch) => ({
    hentPortefolje: (enhet, rekkefolge, sorteringsfelt, filtervalg) =>
        dispatch(hentPortefoljeForEnhet(enhet, rekkefolge, sorteringsfelt, filtervalg)),
    doSettSortering: (rekkefolge, felt) => dispatch(settSortering(rekkefolge, felt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnhetsportefoljeVisning);
