export enum StatusType {
  Idle = 'idle',
  Busy = 'busy'
}

export enum MsgType {
  Status = 'status',
  Count = 'count'
}

export interface RunttaMsg {
  type: MsgType;
  value: StatusType | number;
}

/**
 * Construct statutMessage
 * @param busy
 * @returns
 */
export function statusMsg(busy: boolean): RunttaMsg {
  return {
    type: MsgType.Status,
    value: busy ? StatusType.Busy : StatusType.Idle
  }
}

/**
 * Construct countMessage
 * @param count
 * @returns
 */
 export function countMsg(count: number): RunttaMsg {
  return {
    type: MsgType.Count,
    value: count,
  }
}
