import * as React from 'react';
import { Element } from 'nav-frontend-typografi';
import Dropdown from '../components/dropdown/dropdown';
import CheckboxFilterform from '../components/checkbox-filterform/checkbox-filterform';
import RadioFilterform from '../components/radio-filterform/radio-filterform';
import AktivitetFilterform from '../components/aktivitet-filterform/aktivitet-filterform';
import {
    aktiviteter,
    alder,
    fodselsdagIMnd,
    formidlingsgruppe,
    innsatsgruppe,
    kjonn,
    rettighetsgruppe,
    servicegruppe,
    ytelse,
    manuellBrukerStatus,
    hovedmal
} from './filter-konstanter';

import OverskriftMedHjelpeTekst from '../components/overskrift-med-hjelpetekst';

interface FiltreringFilterProps {
    filtervalg: any;
    actions: any;
    enhettiltak: any;
    intl?: any;
}

const FiltreringFilter = ({filtervalg, actions, enhettiltak }: FiltreringFilterProps) => (
    <div>
        <div className="row">
            <div className="col-sm-12 blokk-xs">
                <Element className="blokk-xxs" tag="h3">
                    Demografi
                </Element>
                <Dropdown name="Alder">
                    <CheckboxFilterform
                        form="alder"
                        valg={alder}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
                <Dropdown name="Fødselsdato">
                    <CheckboxFilterform
                        form="fodselsdagIMnd"
                        valg={fodselsdagIMnd()}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
                <Dropdown name="Kjønn">
                    <CheckboxFilterform
                        form="kjonn"
                        valg={kjonn}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
            </div>
            <div className="col-sm-12 blokk-xs">
                <Element className="blokk-xxs" tag="h3">
                    Situasjon
                </Element>
                <Dropdown name="Innsatsgruppe">
                    <CheckboxFilterform
                        form="innsatsgruppe"
                        valg={innsatsgruppe}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
                <Dropdown name="Hovedmål">
                    <CheckboxFilterform
                        form="hovedmal"
                        valg={hovedmal}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
                <Dropdown name="Formidlingsgruppe">
                    <CheckboxFilterform
                        form="formidlingsgruppe"
                        valg={formidlingsgruppe}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
                <Dropdown name="Servicegruppe">
                    <CheckboxFilterform
                        form="servicegruppe"
                        valg={servicegruppe}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
                <Dropdown name="Rettighetsgruppe">
                    <CheckboxFilterform
                        form="rettighetsgruppe"
                        valg={rettighetsgruppe}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
            </div>
            <div className="col-sm-12 blokk-xs">
                <Element className="blokk-xxs" tag="h3">
                    Ytelse
                </Element>
                <Dropdown name="Ytelse" className="dropdown--140bredde-responsive">
                    <RadioFilterform
                        form="ytelse"
                        valg={ytelse}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
            </div>
            <div className="col-sm-12 blokk-xs">
                <Element className="blokk-xxs" tag="h3">
                    Manuell bruker
                </Element>
                <Dropdown name="Manuell bruker">
                    <CheckboxFilterform
                        form="manuellBrukerStatus"
                        valg={manuellBrukerStatus}
                        onSubmit={actions.endreFiltervalg}
                        filtervalg={filtervalg}
                    />
                </Dropdown>
            </div>
            <div className="col-sm-12">
                <OverskriftMedHjelpeTekst
                    overskriftTekst="Aktivitet"
                    hjelpeTekst="Visning av aktiviteter og dato i liste gjelder kun avtalte aktiviteter bruker har med NAV."
                />
                <Dropdown name="Aktivitet" className="dropdown--140bredde-responsive">
                    <AktivitetFilterform
                        form="aktiviteter"
                        valg={aktiviteter}
                        filtervalg={filtervalg}
                        onSubmit={actions.endreFiltervalg}
                    />
                </Dropdown>
                <Dropdown
                    name="Tiltakstype"
                    disabled={!(filtervalg.aktiviteter.TILTAK === 'JA')}
                >
                    <CheckboxFilterform
                        form="tiltakstyper"
                        valg={enhettiltak}
                        filtervalg={filtervalg}
                        onSubmit={actions.endreFiltervalg}
                    />
                </Dropdown>
            </div>
        </div>
    </div>
);

export default FiltreringFilter;
