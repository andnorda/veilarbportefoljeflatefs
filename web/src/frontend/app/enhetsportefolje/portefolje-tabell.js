/* eslint-disable jsx-a11y/onclick-has-focus*/
/* eslint-disable jsx-a11y/no-static-element-interactions*/
import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { veilederShape, brukerShape } from '../proptype-shapes';
import { markerAlleBrukere } from './../ducks/portefolje';
import TomPortefoljeModal from '../modal/tom-portefolje-modal';
import { visModal, skjulModal } from '../ducks/modal';

class PortefoljeTabell extends Component {

    componentWillMount() {
        this.settSorteringOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this);
        this.visModalDersomPortefoljeErTom();
    }

    settSorteringOgHentPortefolje() {
        this.props.settSorteringForPortefolje();
    }

    visModalDersomPortefoljeErTom() {
        const { toggleVisModal, antallTotalt } = this.props;
        if (antallTotalt === 0) {
            toggleVisModal();
        }
    }

    render() {
        const { brukere, veiledere, settSomMarkertAlle, settSomMarkert, modalSkalVises, toggleSkjulModal } = this.props;

        const alleMarkert = brukere.length > 0 && brukere.every(bruker => bruker.markert);
        return (
            <div>
                <TomPortefoljeModal skjulModal={toggleSkjulModal} visModal={modalSkalVises} />
                <table className="tabell portefolje-tabell" tabIndex="0">
                <thead className="extra-head">
                    <tr>
                        <th />
                        <th>Bruker</th>
                        <th />
                        <th>Veileder</th>
                        <th />
                        <th />
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>
                            <div className="skjema__input">
                                <input
                                    className="checkboks"
                                    id="checkbox-alle-brukere"
                                    type="checkbox"
                                    checked={alleMarkert}
                                    onClick={() => settSomMarkertAlle(!alleMarkert)}
                                />
                                <label className="skjema__label" htmlFor="checkbox-alle-brukere" />
                            </div>
                        </th>
                        <th>
                            <a onClick={this.settSorteringOgHentPortefolje} role="button" className="sortering-link">
                                <FormattedMessage id="portefolje.tabell.navn" />
                            </a>
                        </th>
                        <th>
                            <FormattedMessage id="portefolje.tabell.fodselsnummer" />
                        </th>
                        <th>
                            <FormattedMessage id="portefolje.tabell.navn" />
                        </th>
                        <th>
                            <FormattedMessage id="portefolje.tabell.navident" />
                        </th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {brukere.map(bruker => <tr key={bruker.fnr}>
                        <td>
                            <div className="skjema__input">
                                <input
                                    className="checkboks"
                                    id={`checkbox-${bruker.fnr}`}
                                    type="checkbox"
                                    checked={!!bruker.markert}
                                    onClick={() => settSomMarkert(bruker.fnr, !bruker.markert)}
                                />
                                <label className="skjema__label" htmlFor={`checkbox-${bruker.fnr}`} />
                            </div>
                        </td>
                        <th>
                            <a
                                href={`https://${window.location.hostname}/veilarbpersonflatefs/${bruker.fnr}`}
                                className="til-bruker-link"
                            >
                                {`${bruker.etternavn}, ${bruker.fornavn}`}
                            </a>
                        </th>
                        <td>{bruker.fnr}</td>
                        {
                        bruker.veilederId ? <td className="veileder-td">{veiledere
                            .filter(veileder => veileder.ident === bruker.veilederId)
                            .map(veileder => veileder.navn)}</td>
                            :
                        <td className="ny-bruker-td"><span className="ny-bruker">Ny bruker</span></td>
                    }
                        <td />
                        <td>
                            {bruker.sikkerhetstiltak.length > 0 ?
                                <span className="etikett etikett--fokus">Sikkerhetstiltak</span> : null}
                            {bruker.diskresjonskode != null ?
                                <span className="etikett etikett--fokus">{`Kode ${bruker.diskresjonskode}`}</span>
                            : null}
                            {bruker.egenAnsatt === true ?
                                <span className="etikett etikett--fokus">Egen ansatt</span> : null}
                        </td>
                    </tr>)}
                </tbody>
            </table>
            </div>
        );
    }
}

PortefoljeTabell.propTypes = {
    antallTotalt: PT.number.isRequired,
    veiledere: PT.arrayOf(veilederShape).isRequired,
    brukere: PT.arrayOf(brukerShape).isRequired,
    settSorteringForPortefolje: PT.func.isRequired,
    settSomMarkert: PT.func.isRequired,
    settSomMarkertAlle: PT.func.isRequired,
    modalSkalVises: PT.bool.isRequired,
    toggleSkjulModal: PT.func.isRequired,
    toggleVisModal: PT.func.isRequired
};

const mapStateToProps = state => ({
    antallTotalt: state.portefolje.data.antallTotalt,
    modalSkalVises: state.modal.visModal
});

const mapDispatchToProps = dispatch => ({
    settSomMarkertAlle: markert => dispatch(markerAlleBrukere(markert)),
    toggleVisModal: () => dispatch(visModal()),
    toggleSkjulModal: () => dispatch(skjulModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(PortefoljeTabell);
