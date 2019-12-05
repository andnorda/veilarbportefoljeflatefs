export enum ToastActionType {
    VIS_LAGRE_ENDRINGER_TOAST = 'veiledergrupper_endre/OK',
    VIS_LAGRE_NYTT_FILTER_TOAST = 'veiledergrupper_ny/OK',
    FJERN_LAGRE_ENDRINGER_TOAST = 'FJERN_LAGRE_ENDRINGER_TOAST',
    VIS_SLETTE_GRUPPE_TOAST = 'veiledergrupper_slette/OK',
    FJERN_SLETTE_GRUPPE_TOAST = 'FJERN_SLETTE_GRUPPE_TOAST'
}

export interface ToastAction {
    type: ToastActionType;
}

export const toastAction = (type: ToastActionType): ToastAction => ({
    type
});

export const visLagreEndringerToast = (): ToastAction =>
    toastAction(ToastActionType.VIS_LAGRE_ENDRINGER_TOAST);

export const fjernLagreEndringerToast = (): ToastAction =>
    toastAction(ToastActionType.FJERN_LAGRE_ENDRINGER_TOAST);

export const visSletteGruppeToast = (): ToastAction =>
    toastAction(ToastActionType.VIS_SLETTE_GRUPPE_TOAST);

export const fjernSletteGruppeToast = (): ToastAction =>
    toastAction(ToastActionType.FJERN_SLETTE_GRUPPE_TOAST);
