import * as React from 'react';
import { MouseEvent } from 'react';
import classNames from 'classnames';
import ArbeidslisteButton from '../components/tabell/arbeidslistebutton';
import CheckBox from '../components/tabell/checkbox';
import ArbeidslisteIkon from '../components/tabell/arbeidslisteikon';
import Etiketter from '../components/tabell/etiketter';
import { BrukerModell, EtikettType, FiltervalgModell } from '../model-interfaces';
import Collapse from 'react-collapse';
import MinOversiktKolonner from './minoversikt-kolonner';
import ArbeidslistePanel from './minoversikt-arbeidslistepanel';
import { Kolonne } from '../ducks/ui/listevisning';
import Etikett from '../components/tabell/etikett';

interface MinOversiktBrukerPanelProps {
    bruker: BrukerModell;
    settMarkert: (fnr: string, markert: boolean) => void;
    enhetId: string;
    filtervalg: FiltervalgModell;
    innloggetVeileder: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    valgteKolonner: Kolonne[];
    varForrigeBruker?: boolean;
}

interface MinOversiktBrukerPanelState {
    apen: boolean;
}

class MinoversiktBrukerPanel extends React.Component<MinOversiktBrukerPanelProps, MinOversiktBrukerPanelState> {

    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
        this.handleArbeidslisteButtonClick = this.handleArbeidslisteButtonClick.bind(this);
    }

    handleArbeidslisteButtonClick(event) {
        event.preventDefault();
        this.setState({apen: !this.state.apen});
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }

    render() {
        const { bruker, enhetId, filtervalg, valgteKolonner, innloggetVeileder, settMarkert, varForrigeBruker } = this.props;
        const arbeidslisteAktiv = bruker.arbeidsliste.arbeidslisteAktiv;
        const classname  = classNames('brukerliste--border-bottom-thin ', {
            'brukerliste--forrigeBruker': varForrigeBruker,
        });

        return (
            <li className={classname}>
                <div className="brukerliste__element">
                    <div className="brukerliste__gutter-left brukerliste--min-width-minside">
                        <CheckBox bruker={bruker} settMarkert={settMarkert}/>
                        <ArbeidslisteIkon skalVises={arbeidslisteAktiv}/>
                    </div>
                    <MinOversiktKolonner
                        className="brukerliste__innhold flex flex--center"
                        bruker={bruker}
                        filtervalg={filtervalg}
                        valgteKolonner={valgteKolonner}
                        enhetId={enhetId}
                    />
                    <div className="brukerliste__gutter-right">
                        <ArbeidslisteButton
                            skalVises={arbeidslisteAktiv}
                            apen={this.state.apen}
                            onClick={this.handleArbeidslisteButtonClick}
                        />
                        <div>
                            <Etiketter bruker={bruker}/>
                            <Etikett
                                type={EtikettType.NYBRUKER}
                                skalVises={bruker.nyForVeileder}
                            >
                                Ny Bruker
                            </Etikett>
                        </div>
                    </div>
                </div>
                <Collapse isOpened={this.state.apen}>
                    <ArbeidslistePanel
                        bruker={bruker}
                        innloggetVeileder={innloggetVeileder}
                    />
                </Collapse>
            </li>
        );
    }
}

export default MinoversiktBrukerPanel;
