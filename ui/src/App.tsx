import React, { useState, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import useAxios from 'axios-hooks'

import Header from './components/Header';
import RunttaBtn from './components/RunttaBtn';

import './components/runtta.css';

const SOCKET_URL = process.env.REACT_APP_BROKER_URL || 'ws://192.168.0.126:8000/ws';
const API_URL = 'http://192.168.0.126:8000/runtta';

interface RunttaMsg {
  type: 'status' | 'count';
  value: 'idle' | 'busy' | number;
}

export const App = () => {
  // const [error, setError] = useState<any>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [beerCount, setBeerCount] = useState<number>(0);

  const [
    { loading: runttaLoading, error: apiError },
    executePut
  ] = useAxios(
    {
      url: API_URL,
      method: 'PUT'
    },
    { manual: true }
  )

  const { readyState } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log('opened'),
    onClose: (event: WebSocketEventMap['close']) => console.log('close', event),
    onError: (event: WebSocketEventMap['error']) => {
      console.error('error', event);
      // setError(event)
    },
    shouldReconnect: (event: WebSocketEventMap['close']) => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      const {type, value}: RunttaMsg = JSON.parse(event.data);

      if(type === 'status') {
        return setProcessing(value === 'busy');
      }

      if(type === 'count') {
        return setBeerCount(Number(value));
      }
    },
  });

  const handleRuntta = useCallback(() => executePut(), [executePut]);

  const isReady = readyState === ReadyState.OPEN;

  return (
    <>
      <Header connected={readyState === ReadyState.OPEN} beerCount={beerCount} />
      <div className='flex flex-1 items-center justify-center'>
        <RunttaBtn ready={isReady} processing={processing} loading={runttaLoading} handleClick={handleRuntta} />
      </div>
    </>
  );
};
