import React, { PropTypes as PT } from 'react';
import { Element } from 'nav-frontend-typografi';
import Dropdown from '../components/dropdown/dropdown';
import CheckboxFilterform from '../components/checkbox-filterform/checkbox-filterform';
import RadioFilterform from '../components/radio-filterform/radio-filterform';
import { filtervalgShape } from '../proptype-shapes';
import {
    alder,
    fodselsdagIMnd,
    kjonn,
    innsatsgruppe,
    formidlingsgruppe,
    servicegruppe,
    ytelse,
    rettighetsgruppe
} from './filter-konstanter';

function FiltreringFilter({ filtervalg, actions }) {
    return (
        <div className="filtrering-filter">
            <div className="row">
                <div className="col-sm-3">
                    <Element>Demografi</Element>
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
                            valg={fodselsdagIMnd}
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
                <div className="col-sm-3">
                    <Element>Situasjon</Element>
                    <Dropdown name="Innsatsgruppe">
                        <CheckboxFilterform
                            form="innsatsgruppe"
                            valg={innsatsgruppe}
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
                    <Dropdown name="Rettighetsgruppe" className="dropdown--130bredde">
                        <CheckboxFilterform
                            form="rettighetsgruppe"
                            valg={rettighetsgruppe}
                            onSubmit={actions.endreFiltervalg}
                            filtervalg={filtervalg}
                        />
                    </Dropdown>
                </div>
                <div className="col-sm-3">
                    <Element>Ytelse</Element>
                    <Dropdown name="Ytelse" className="dropdown--130bredde">
                        <RadioFilterform
                            form="ytelse"
                            valg={ytelse}
                            onSubmit={actions.endreFiltervalg}
                            filtervalg={filtervalg}
                        />
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

FiltreringFilter.defaultProps = {
    veileder: {
        veileder: {
            ident: '',
            navn: '',
            fornavn: '',
            etternavn: ''
        }
    }
};

FiltreringFilter.propTypes = {
    filtervalg: filtervalgShape.isRequired,
    actions: PT.shape({
        endreFiltervalg: PT.func
    }).isRequired
};

export default FiltreringFilter;
