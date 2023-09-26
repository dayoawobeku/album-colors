'use client';

import {StylesConfig} from 'react-select';

const customStyles: StylesConfig = {
  control: base => ({
    ...base,
    fontFamily: 'var(--font-manrope)',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  }),
};

export {customStyles};
