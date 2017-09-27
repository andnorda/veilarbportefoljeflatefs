import * as React from 'react';
import {
    nesteUtlopsdatoEllerNull, utledValgtAktivitetstype, utlopsdatoForAktivitetEllerNull
} from '../utils/utils';
import { ytelsevalg,
    VENTER_PA_SVAR_FRA_NAV,
    VENTER_PA_SVAR_FRA_BRUKER,
    UTLOPTE_AKTIVITETER,
    I_AVTALT_AKTIVITET } from '../filtrering/filter-konstanter';
import { filtervalgShape } from '../proptype-shapes';
import DatoKolonne from '../components/datokolonne';
import {BrukerModell, FiltervalgModell} from '../model-interfaces';
import {Kolonne} from '../ducks/ui/listevisning';
import UkeKolonne from '../components/ukekolonne';

interface EnhetDatokolonnerProps {
    bruker: BrukerModell;
    ytelse?: string;
    filtervalg: FiltervalgModell;
    valgteKolonner: Kolonne[];
}

function EnhetDatokolonner({ bruker, ytelse= '', filtervalg, valgteKolonner }: EnhetDatokolonnerProps) {
    const valgtAktivitetstype = utledValgtAktivitetstype(filtervalg.aktiviteter);

    // TODO: bør gjøres før data lagres i storen
    const utlopsDato = bruker.utlopsdato ? new Date(bruker.utlopsdato) : null;
    const venterPaSvarFraBruker = bruker.venterPaSvarFraBruker ? new Date(bruker.venterPaSvarFraBruker) : null;
    const venterPaSvarFraNAV = bruker.venterPaSvarFraNAV ? new Date(bruker.venterPaSvarFraNAV) : null;
    const nyesteUtlopteAktivitet = bruker.nyesteUtlopteAktivitet ? new Date(bruker.nyesteUtlopteAktivitet) : null;

    return (
        <span>
            <UkeKolonne
                ukerIgjen={bruker.dagputlopUke}
                minVal={2}
                skalVises={ytelse === ytelsevalg.DAGPENGER || ytelse === ytelsevalg.ORDINARE_DAGPENGER}
            />
            <UkeKolonne
                ukerIgjen={bruker.permutlopUke}
                minVal={2}
                skalVises={ytelse === ytelsevalg.DAGPENGER_MED_PERMITTERING}
            />
            <UkeKolonne
                ukerIgjen={bruker.aapmaxtidUke}
                minVal={12}
                skalVises={ytelse === ytelsevalg.AAP_MAXTID}
            />
            <DatoKolonne
                dato={utlopsDato}
                skalVises={[ytelsevalg.TILTAKSPENGER, ytelsevalg.AAP_UNNTAK, ytelsevalg.AAP].includes(ytelse) && valgteKolonner.includes(Kolonne.UTLOP_YTELSE)}
            />
            <DatoKolonne
                dato={venterPaSvarFraBruker}
                skalVises={filtervalg.brukerstatus === VENTER_PA_SVAR_FRA_BRUKER  && valgteKolonner.includes(Kolonne.VENTER_SVAR)}
            />
            <DatoKolonne
                dato={venterPaSvarFraNAV}
                skalVises={filtervalg.brukerstatus === VENTER_PA_SVAR_FRA_NAV && valgteKolonner.includes(Kolonne.VENTER_SVAR)}
            />
            <DatoKolonne
                dato={nyesteUtlopteAktivitet}
                skalVises={filtervalg.brukerstatus === UTLOPTE_AKTIVITETER && valgteKolonner.includes(Kolonne.UTLOPTE_AKTIVITETER)}
            />
            <DatoKolonne
                dato={nesteUtlopsdatoEllerNull(bruker.aktiviteter)}
                skalVises={filtervalg.brukerstatus === I_AVTALT_AKTIVITET && valgteKolonner.includes(Kolonne.AVTALT_AKTIVITET)}
            />
            <DatoKolonne
                dato={utlopsdatoForAktivitetEllerNull(bruker.aktiviteter, valgtAktivitetstype)}
                skalVises={!!valgtAktivitetstype && filtervalg.tiltakstyper.length === 0  && valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET)}
            />
        </span>
    );
}

export default EnhetDatokolonner;
