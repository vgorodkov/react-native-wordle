import { moderateScale } from 'utils/metrics';

export const FONT_SIZES = {
  //<600
  smallScreen: {
    headingLarge: 28,
    headingMedium: moderateScale(24, 0.3),
    headingSmall: moderateScale(20, 0.3),
    subHeading: moderateScale(18, 0.3),
    bodyText: moderateScale(16, 0.3),
    smallText: 14,
  },
};

export const FONTS = {
  regular: 'JetBrainsMono-Regular',
  medium: 'JetBrainsMono-Medium',
  bold: 'JetBrainsMono-Bold',
};
