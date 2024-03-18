import React from 'react';
import {Sorteringsfelt, Sorteringsrekkefolge} from '../../model-interfaces';
import {OrNothing} from '../../utils/types/types';
import {Down, Up, UpDown} from '@navikt/ds-icons';
import {Button} from '@navikt/ds-react';
import './tabell.css';

interface SorteringHeaderIkonProps {
    sortering?: OrNothing<Sorteringsfelt>;
    onClick: (sortering: string) => void;
    rekkefolge?: OrNothing<Sorteringsrekkefolge>;
    erValgt?: boolean;
    ikon: React.ReactNode;
    title: string;
    headerId: string;
    skalVises?: boolean;
    className?: string;
}

function SorteringHeaderIkon({
    sortering,
    onClick,
    rekkefolge,
    erValgt,
    skalVises,
    ikon,
    className = '',
    title,
    headerId
}: SorteringHeaderIkonProps) {
    const sorteringsrekkefolge =
        erValgt && rekkefolge !== Sorteringsrekkefolge.ikke_satt ? rekkefolge : 'ingen sortering';

    const sorteringspil = () => {
        const className = 'sorteringspil';
        if (sorteringsrekkefolge === Sorteringsrekkefolge.stigende) {
            return <Up className={className} aria-hidden />;
        } else if (sorteringsrekkefolge === Sorteringsrekkefolge.synkende) {
            return <Down className={className} aria-hidden />;
        } else {
            return <UpDown className={className} aria-hidden />;
        }
    };

    return (
        <Button
            size="small"
            variant="tertiary"
            icon={
                <>
                    {ikon}
                    {sorteringspil()}
                </>
            }
            onClick={() => onClick(sortering || Sorteringsrekkefolge.ikke_satt)}
            className={className}
            data-testid={`sorteringheader_${headerId}`}
            title={title}
            aria-label={
                erValgt && rekkefolge && rekkefolge !== Sorteringsrekkefolge.ikke_satt
                    ? headerId + ', ' + rekkefolge + ' rekkefølge'
                    : headerId + ', ingen sortering'
            }
            aria-live="polite"
        ></Button>
    );
}

export default SorteringHeaderIkon;
