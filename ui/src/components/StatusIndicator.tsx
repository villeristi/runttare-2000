import React from 'react';
import classnames from 'classnames';

interface IStatusIndicator {
  connected: boolean;
}

export default function StatusIndicator({ connected }: IStatusIndicator) {
  return (
    <div className="flex items-center">
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={
          classnames('fill-current h-6', {'text-greeny': connected, 'text-reddy': !connected})
        }>
        <circle cx="50" cy="50" r="50"/>
      </svg>
    </div>
  );
}
