import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Paginering from './paginering';
import { settSubListeForPaginering, settListeSomSkalPagineres,
    klarerPagineringsliste } from '../ducks/veilederpaginering';
import { veilederShape } from '../proptype-shapes';

class VeilederPaginering extends Component {

    componentWillMount() {
        this.props.opprettPaginering(this.props.liste);
        this.props.settSubListe(this.props.fraIndeksForSubListe);
    }

    componentWillUnmount() {
        this.props.klarerPaginering();
    }

    render() {
        const {
            liste,
            fraIndeksForSubListe,
            sideStorrelse,
            settSubListe,
            pagineringTekstId,
            subListe,
            antallReturnert } = this.props;

        const pagineringTekstValues = liste.length > 0 ? {
            fraIndex: `${fraIndeksForSubListe + 1}`,
            tilIndex: fraIndeksForSubListe + subListe.length,
            antallTotalt: liste.length
        } : {
            fraIndex: '0',
            tilIndex: '0',
            antallTotalt: '0'
        };

        const pagineringTekst = (
            <FormattedMessage
                id={pagineringTekstId}
                values={pagineringTekstValues}
            />
        );

        return (
            <div>
                <Paginering
                    antallTotalt={liste.length}
                    fraIndex={fraIndeksForSubListe}
                    hentListe={(fra) => { settSubListe(fra); }}
                    tekst={pagineringTekst}
                    sideStorrelse={sideStorrelse}
                    antallReturnert={antallReturnert}
                />
            </div>
        );
    }
}

VeilederPaginering.propTypes = {
    liste: PT.arrayOf(veilederShape).isRequired,
    pagineringTekstId: PT.string.isRequired,
    fraIndeksForSubListe: PT.number.isRequired,
    sideStorrelse: PT.number.isRequired,
    opprettPaginering: PT.func.isRequired,
    klarerPaginering: PT.func.isRequired,
    settSubListe: PT.func.isRequired,
    subListe: PT.arrayOf(veilederShape).isRequired,
    antallReturnert: PT.number.isRequired
};

const mapStateToProps = (state) => ({
    fraIndeksForSubListe: state.veilederpaginering.fraIndeksForSubListe,
    sideStorrelse: state.veilederpaginering.sideStorrelse,
    subListe: state.veilederpaginering.subListe,
    antallReturnert: state.portefolje.data.antallReturnert
});

const mapDispatchToProps = (dispatch) => ({
    opprettPaginering: (liste) => dispatch(settListeSomSkalPagineres(liste)),
    klarerPaginering: () => dispatch(klarerPagineringsliste()),
    settSubListe: (fra) => dispatch(settSubListeForPaginering(fra))
});

export default connect(mapStateToProps, mapDispatchToProps)(VeilederPaginering);

