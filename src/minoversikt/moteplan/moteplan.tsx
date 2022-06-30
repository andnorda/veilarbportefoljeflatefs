import * as React from 'react';
import {useRef, useState} from 'react';
import {Alert, Button, Popover} from '@navikt/ds-react';

import './moteplan.less';
import {hentMoteplan} from '../../middleware/api';
import MoteTabell from './motetabell';
import {Calender} from '@navikt/ds-icons';
import SeFlereMoterKnapp from './seFlereMoterKnapp';

export interface MoteData {
    dato: string;
    deltaker: Deltaker;
    avtaltMedNav: boolean;
}

export interface Deltaker {
    fornavn: string;
    etternavn: string;
    fnr: string;
}

interface MoteplanProps {
    veileder: string;
    enhet: string;
}

function Moteplan({veileder, enhet}: MoteplanProps) {
    const [maxAntallDager, setMaxAntallDager] = useState<number>(5);
    const [erOpen, setErOpen] = useState<boolean>(false);
    const [moter, setMoter] = useState<MoteData[] | null>(null);
    const [fetchError, setFetchError] = useState(false);
    const buttonRef = useRef(null);

    const dager: Date[] = hentMoteplanDager(moter);

    const fetchMoteData = () => {
        if (!erOpen) {
            hentMoteplan(veileder, enhet)
                .then(data => setMoter(data))
                .catch(error => setFetchError(true));
        }
        setErOpen(!erOpen);
    };

    return (
        <>
            <Button className="moteplan_knapp" ref={buttonRef} variant="tertiary" onClick={() => fetchMoteData()}>
                <Calender title="møteplan" />
                Møteplan
            </Button>
            <Popover
                className="moteplan_popover"
                open={erOpen}
                onClose={() => setErOpen(false)}
                anchorEl={buttonRef.current}
                placement="left-start"
            >
                <Popover.Content className="moteplan_content">
                    {fetchError ? (
                        <Alert variant="error" size="small">
                            Kunne ikke hente møteplan.
                        </Alert>
                    ) : moter?.length === 0 ? (
                        <Alert variant="success" size="small">
                            Ingen møter
                        </Alert>
                    ) : (
                        dager
                            .slice(0, maxAntallDager)
                            .map((dag, key) => <MoteTabell dato={dag} moter={moter} enhetId={enhet} key={key} />)
                    )}
                    <SeFlereMoterKnapp
                        className={'seFlereMoterKnapp'}
                        antalDager={dager.length}
                        maxAntallDager={maxAntallDager}
                        setMaxAntall={setMaxAntallDager}
                    />
                </Popover.Content>
            </Popover>
        </>
    );
}

function hentMoteplanDager(moter: MoteData[] | null): Date[] {
    if (moter === null) {
        return [new Date()];
    }
    return [...new Set(moter.map(mote => new Date(mote.dato).setHours(0, 0, 0, 0)))].sort().map(dato => new Date(dato));
}

export default Moteplan;
