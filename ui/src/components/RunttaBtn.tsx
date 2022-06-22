import React from 'react';
import classNames from 'classnames';

interface IButton {
  ready: boolean;
  processing: boolean;
  loading: boolean;
  handleClick: (event: any) => void;
}

export default function RunttaBtn({ready, processing, loading, handleClick}: IButton) {
  return (
    <div className={classNames('btn', {'active': processing || loading}, {'ready': ready})} onClick={handleClick}>
      <div className="inner-wrapper">
        {ready ? (
          <i className="material-icons-round">{processing || loading ? 'update' : 'add'}</i>
        ) : (
          <i className="material-icons-round">hourglass_empty</i>
        )}
      </div>
  </div>
  );
}
