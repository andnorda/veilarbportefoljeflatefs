import * as React from 'react';
import Paginering from './paginering/paginering';
import Listevisning from './listevisning/listevisning';
import { ListevisningType } from '../../ducks/ui/listevisning';
import './toolbar.less';
import { useSelector } from 'react-redux';
import LeggTilArbeidsliste from './legg-til-arbeidsliste-knapp';
import { AppState } from '../../reducer';
import ToolbarKnapp from './toolbar-knapp';
import { ReactComponent as TildelVeilederIkon } from '../ikoner/person-add-1.svg';
import { ReactComponent as SokVeilederIkon } from '../ikoner/person-view-1.svg';

interface ToolbarProps {
    filtergruppe: ListevisningType;
    onPaginering?: (fra?: number, antall?: number) => void;
    sokVeilederSkalVises?: boolean;
    visesAnnenVeiledersPortefolje?: boolean;
    children?: React.ReactNode;
    gjeldendeVeileder?: string;
    antallTotalt: number;
    id?: string;
}

function Toolbar(props: ToolbarProps) {
    const {id, filtergruppe, visesAnnenVeiledersPortefolje, antallTotalt, onPaginering} = props;
    const brukere = useSelector((state: AppState) => state.portefolje.data.brukere);
    const valgteBrukere = brukere.filter((bruker) => bruker.markert === true);
    const aktiv = valgteBrukere.length > 0;

    return (
        <section className="toolbar blokk-xs" id={id}>
            <div className="toolbar__element toolbar__venstre toolbar--skille-mellom-elementer">
                <div className="tildel-veileder-wrapper">
                    <ToolbarKnapp
                        skalVises={filtergruppe in ListevisningType}
                        aktiv={aktiv}
                        tildelveileder={true}
                        ikon={<TildelVeilederIkon className="toolbar-knapp__ikon" id="tildel-veileder-ikon"/>}
                        tittel="Tildel veileder"
                    />
                </div>
                <LeggTilArbeidsliste
                    visesAnnenVeiledersPortefolje={visesAnnenVeiledersPortefolje || false}
                />
                <div className="sok-veileder-wrapper">
                    <ToolbarKnapp
                        skalVises={props.sokVeilederSkalVises}
                        aktiv={true}
                        tildelveileder={false}
                        ikon={<SokVeilederIkon className="toolbar-knapp__ikon" id="sok-veileder-ikon"/>}
                        tittel="Søk veileder"
                    />
                </div>
            </div>
            <div className="toolbar__element toolbar__hoyre toolbar--skille-mellom-elementer">
                <Listevisning filtergruppe={filtergruppe}/>
                <Paginering
                    className="toolbar--skille-mellom-elementer"
                    onChange={onPaginering}
                    antallTotalt={antallTotalt}
                />
            </div>
        </section>
    );
}

export default Toolbar;
