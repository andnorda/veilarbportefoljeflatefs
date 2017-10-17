import * as React from 'react';
import {AlertStripeAdvarselSolid} from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {settNyAktivEnhet, settTilkoblingState} from './context-reducer';
import { AppState } from '../../reducer';
import NyContextModal from './ny-context-modal';
import EnhetContextListener, {
    EnhetConnectionState, EnhetContextEvent,
    EnhetContextEventNames
} from './enhet-context-listener';
import { hentAktivEnhet, oppdaterAktivEnhet } from './context-api';
import { velgEnhetForVeileder } from '../../ducks/enheter';
import { hentVeiledereForEnhet } from '../../ducks/veiledere';

interface StateProps {
    modalSynlig: boolean;
    feilet: boolean;
    aktivEnhet: string;
    aktivEnhetContext: string;
}

interface DispatchProps {
    doSettTilkoblingState: (state: EnhetConnectionState) => void;
    doSettNyAktivEnhet: (enhet: string) => void;
    doVelgEnhetForVeileder: (enhet: string) => void;
    doHentVeiledereForEnhet: (enhet: string) => void;
}

type EnhetContextProps = StateProps & DispatchProps;

class EnhetContext extends React.Component<EnhetContextProps> {
    contextListener: EnhetContextListener;

    constructor(props) {
        super(props);
        this.enhetContextHandler = this.enhetContextHandler.bind(this);
        this.handleEndreAktivEnhet = this.handleEndreAktivEnhet.bind(this);
        this.handleBeholdAktivEnhet = this.handleBeholdAktivEnhet.bind(this);
    }

    componentDidMount() {
        const uri = `wss://app-t4.adeo.no/modiaeventdistribution/websocket`;
        this.contextListener = new EnhetContextListener(uri, this.enhetContextHandler);
    }

    componentWillUnmount() {
        this.contextListener.close();
    }

    handleEndreAktivEnhet() {
        this.props.doVelgEnhetForVeileder(this.props.aktivEnhetContext);
        this.props.doHentVeiledereForEnhet(this.props.aktivEnhetContext);
    }

    handleBeholdAktivEnhet() {
        oppdaterAktivEnhet(this.props.aktivEnhet)
            .then(() => this.props.doSettNyAktivEnhet(this.props.aktivEnhet));
    }

    handleNyAktivEnhet() {
        hentAktivEnhet().then((nyEnhet) => {
            this.props.doSettNyAktivEnhet(nyEnhet);
        });
    }

    enhetContextHandler(event: EnhetContextEvent) {
        switch (event.type) {
            case EnhetContextEventNames.CONNECTION_STATE_CHANGED:
                this.props.doSettTilkoblingState(event.state);
                break;
            case EnhetContextEventNames.NY_AKTIV_ENHET:
                this.handleNyAktivEnhet();
                break;
        }
    }

    render() {

        const alertIkkeTilkoblet = (
            <AlertStripeAdvarselSolid>
                <FormattedMessage id="nyenhet.tilkobling.feilet" />
            </AlertStripeAdvarselSolid>
        );

        return (
            <div>
                { this.props.feilet ? alertIkkeTilkoblet : null }
                <NyContextModal
                    isOpen={this.props.modalSynlig}
                    aktivEnhet={this.props.aktivEnhet}
                    doEndreAktivEnhet={this.handleEndreAktivEnhet}
                    doBeholdAktivEnhet={this.handleBeholdAktivEnhet}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    const valgtEnhet = state.enheter.valgtEnhet.enhet;
    const valgtEnhetId = valgtEnhet ? valgtEnhet.enhetId : '';
    const valgtEnhetContext = state.nycontext.aktivEnhet;

    return {
        modalSynlig: valgtEnhetId !== valgtEnhetContext,
        feilet: state.nycontext.connected === EnhetConnectionState.FAILED,
        aktivEnhet: valgtEnhet == null ? '' : valgtEnhet.enhetId,
        aktivEnhetContext: valgtEnhetContext
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        doSettTilkoblingState: (state: EnhetConnectionState) => dispatch(settTilkoblingState(state)),
        doSettNyAktivEnhet: (enhet: string) => dispatch(settNyAktivEnhet(enhet)),
        doVelgEnhetForVeileder: (enhet: string) => dispatch(velgEnhetForVeileder(enhet)),
        doHentVeiledereForEnhet: (enhet: string) => dispatch(hentVeiledereForEnhet(enhet))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnhetContext);
