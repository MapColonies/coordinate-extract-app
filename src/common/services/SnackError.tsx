import { FormattedMessage } from "react-intl"
// import { Box } from "@map-colonies/react-components"
// import { Icon } from "@map-colonies/react-core"
// import { LogoSVGIcon } from "../Icons/Svg/logo"

export const getSnackbarErrorMessage = (body: string) => {
  return {
    title: <b><FormattedMessage id="app.error" /></b>,
    body: body,
    dismissesOnAction: true,
    // icon: <Icon
    //   icon={{
    //     strategy: 'component',
    //     icon: (
    //       <Box className="Logo">
    //         <LogoSVGIcon color="#000" />
    //       </Box>
    //     )
    //   }}
    // />,
    leading: false,
    timeout: -1,
    actions: [
      {
        title: 'סגור'
      }
    ]
  }
}