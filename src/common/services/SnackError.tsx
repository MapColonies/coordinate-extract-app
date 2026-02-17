import { FormattedMessage } from 'react-intl';
import { ExclamationSVGIcon } from '../icons/ExclamationSVGIcon';

export const getSnackbarErrorMessage = (body: string) => {
  return {
    title: <b><FormattedMessage id="general.error" /></b>,
    body: body,
    dismissesOnAction: true,
    icon: <ExclamationSVGIcon color="var(--mdc-theme-gc-error)" />,
    leading: false,
    timeout: -1,
    actions: [
      {
        title: 'סגור'
      }
    ]
  };
};
