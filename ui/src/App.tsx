import React, { useState, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import classNames from 'classnames';

import Header from './components/Header';
import Footer from './components/Footer';

import './components/runtta.css';
import {ReactComponent as Fist} from './assets/fist.svg';
import {ReactComponent as HourGlass} from './assets/hourglass.svg';

const SOCKET_URL = process.env.REACT_APP_BROKER_URL || 'ws://192.168.0.104:8000/ws';

export const App = () => {
  const [error, setError] = useState<any>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [beerCount, setBeerCount] = useState<number>(0);

  const { sendJsonMessage, readyState } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log('opened'),
    onClose: (event: WebSocketEventMap['close']) => console.log('close', event),
    onError: (event: WebSocketEventMap['error']) => {
      console.log(event);
      // setError(event)
    },
    shouldReconnect: (event: WebSocketEventMap['close']) => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      console.log(JSON.parse(event.data));
      setBeerCount(beerCount+1);
    },
  });

  const handleRuntta = useCallback(() => sendJsonMessage({foo: 'bar'}), [sendJsonMessage]);
  const handleClickProcessing = useCallback(() => setProcessing(!processing), [setProcessing, processing]);

  const isReady = readyState === ReadyState.OPEN;

  return (
    <>
      <Header connected={readyState === ReadyState.OPEN} />
      <div className='flex flex-1 items-center justify-center'>
        <button className={classNames('runtta text-white', {'processing': processing, 'waiting': !isReady})}
                onClick={handleClickProcessing}
                disabled={!isReady}
        >
          {isReady ? (
            <>
              <Fist width={50} height={50} className='fill-current'/>
              <span className='mt-2'>Runtta!</span>
            </>
          ) : (
            <>
              <HourGlass width={50} height={50} className='fill-current'/>
              <span className='mt-2'>Vänta...</span>
            </>
          )}
        </button>
      </div>

      <Footer count={beerCount}/>
    </>
  );
};
