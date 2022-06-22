import React from 'react';

import StatusIndicator from './StatusIndicator';
import {ReactComponent as BeerCan} from '../assets/beer.svg';

interface IHeader {
  connected: boolean;
  beerCount: number;
}

export default function Header({connected, beerCount}: IHeader) {
  return (
    <header className="flex items-center justify-between py-4 px-4 shadow-lg sticky top-0">
      <div className='flex items-center'>
        <StatusIndicator connected={connected}/>
        <h1 className='ml-2 text-xl font-bold text-asphalt'>runttare 2000</h1>
      </div>
      <div className='flex items-center'>
        <span className="count font-bold text-asphalt">{beerCount} x</span>
        <BeerCan height={20} width={20} className='fill-current'/>
      </div>
    </header>
  );
}
