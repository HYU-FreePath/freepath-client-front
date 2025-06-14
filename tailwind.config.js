// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen-vh': 'calc(100 * var(--vh))',
      },
      userDrag: {
        none: 'none',
      },
      screens: {
        hm: { max: '400px' },
        hsm: { max: '360px' },
        pwa: { raw: '(display-mode: standalone)' },
      },
    },
    fontFamily: {
      fBold: ['KoddiUDOn-Bold'],
      fMedium: ['KoddiUDOn-Regular'],
      fExtrabold: ['KoddiUDOn-ExtraBold'],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        'img': {
          '-webkit-touch-callout': 'none', /* Disable callout, iOS Safari */
          '-webkit-user-select': 'none',  /* Disable selection/copy in iOS */
          '-moz-user-select': 'none',     /* Disable selection in Firefox */
          '-ms-user-select': 'none',      /* Disable selection in IE */
          'user-select': 'none',          /* Disable selection in browsers */
          '-webkit-user-drag': 'none',    /* Disable dragging in iOS */
          'user-drag': 'none',
        },
      })
    },
  ],
}