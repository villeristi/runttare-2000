import React from 'react';

import {ReactComponent as BeerCan} from '../assets/beer.svg';

interface IFooter {
  count: number;
}

export default function Footer({count}: IFooter) {
  return (
    <footer className='flex items-center justify-center py-4 text-asphalt'>
      <span className='text-xl font-extrabold'>{count} x</span>
      <BeerCan height={50} width={50} className='fill-current'/>
    </footer>
  );
}
