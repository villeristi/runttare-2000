import React, { useState, useEffect, useCallback } from 'react';
import {
  connect,
  Msg,
  NatsConnection,
  StringCodec,
} from "nats.ws";
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import RunttaBtn from './components/RunttaBtn';
import './components/runtta.css';

const NATS_URL = process.env.REACT_APP_BROKER_URL || 'ws://localhost:4280';

const SUBSCRIPTION = "runttare.status.>"
const SUBJECT_RUNTTA = "runttare.runtta"
const SUBJECT_STATUS = "runttare.status.status"
const SUBJECT_COUNT = "runttare.status.count"
const SUBJECT_COUNT_REQ = `${SUBJECT_COUNT}.req`

export const App = () => {
  const [nats, setNats] = useState<NatsConnection | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [beerCount, setBeerCount] = useState<number>(0);
  const isReady = nats !== null;

  const sc = StringCodec();

  useEffect(() => {
    (async () => {
      const connection = await connect({
        servers: [NATS_URL],
      })
      setNats(connection)
      console.log(`connected to NATS: ${connection.getServer()}`)
      const subscription = connection.subscribe(SUBSCRIPTION);

      (async (connection: NatsConnection | null) => {
        await connection?.request(SUBJECT_COUNT_REQ, undefined, { timeout: 1000 })
          .then((msg: Msg) => {
            setBeerCount(Number(sc.decode(msg.data)))
          })
          .catch((err: Error) => {
            console.log(`problem with request: ${err.message}`);
          });
      })(connection);

      for await (const msg of subscription) {
        const message = sc.decode(msg.data);

        console.debug(`Topic: ${msg.subject}, message: ${message}`)

        if([SUBJECT_COUNT, SUBJECT_STATUS].includes(msg.subject)){
          if (msg.subject === SUBJECT_STATUS) {
            setProcessing(message === "1")
          }

          if (msg.subject === SUBJECT_COUNT) {
            setBeerCount(Number(message));
          }
        }
      }
    })();

    return () => {
      nats?.drain();
      console.log("closed NATS connection")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlerRunttaClick = useCallback(() => {
    nats?.publish(SUBJECT_RUNTTA);
  }, [nats]);

  return (
    <>
      <Header connected={isReady} beerCount={beerCount} />
      <div className='flex flex-1 items-center justify-center'>
        <RunttaBtn ready={isReady} processing={processing} handleClick={handlerRunttaClick} />
      </div>
    </>
  );
};
