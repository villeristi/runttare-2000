import React from 'react';
import classNames from 'classnames';

interface IButton {
  ready: boolean;
  processing: boolean;
  handleClick: (event: any) => void;
}

export default function RunttaBtn({ready, processing, handleClick}: IButton) {
  return (
    <div className={classNames('btn', {'active': processing}, {'ready': ready})} onClick={handleClick}>
      <div className="inner-wrapper">
        {ready ? (
          <i className="material-icons-round">{processing ? 'update' : 'add'}</i>
        ) : (
          <i className="material-icons-round">hourglass_empty</i>
        )}
      </div>
  </div>
  );
}
