import { FormattedMessage } from 'react-intl';
import { ExclamationSVGIcon } from '../common/icons/ExclamationSVGIcon';

export const getSnackbarErrorMessage = (body: string, isTranslate: boolean) => {
  return {
    title: <b><FormattedMessage id="general.error" /></b>,
    body: !isTranslate? body : <FormattedMessage id={body} />,
    dismissesOnAction: true,
    icon: <ExclamationSVGIcon color="var(--mdc-theme-gc-error)" />,
    leading: false,
    timeout: -1,
    actions: [
      {
        title: 'סגור',
      },
    ],
  };
};
