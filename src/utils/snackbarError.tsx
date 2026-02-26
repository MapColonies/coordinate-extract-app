import { FormattedMessage } from 'react-intl';
import { ExclamationSVGIcon } from '../common/icons/ExclamationSVGIcon';

export const getSnackbarErrorMessage = (body: string, isTranslate: boolean) => {
  return {
<<<<<<< HEAD
    title: <b><FormattedMessage id="general.error" /></b>,
    body: !isTranslate? body : <FormattedMessage id={body} />,
=======
    title: (
      <b>
        <FormattedMessage id="general.error" />
      </b>
    ),
    body: body,
>>>>>>> 2fe72340c3fc47d84ebd25f6ca1958421cbabf93
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
