import { BREAKPOINT } from '@angular/flex-layout';

const CUSTOM_BREAKPOINTS = [{
  alias: 'gt-sm',
  mediaQuery: '(min-width: 768px)'
}];

export const CustomBreakPointsProvider = {
  provide: BREAKPOINT,
  useValue: CUSTOM_BREAKPOINTS,
  multi: true
};
