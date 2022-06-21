import React from 'react';
import StatusIndicator from './StatusIndicator';

interface IHeader {
  connected: boolean;
}

export default function Header({connected}: IHeader) {
  return (
    <header className="flex items-center justify-center py-4 bg-cloud border-b-2 border-b-asphalt">
      <h1 className='mr-4 text-4xl font-bold tracking-tighter text-asphalt'>Runttare 2.0</h1>
      <StatusIndicator connected={connected}/>
    </header>
  );
}
