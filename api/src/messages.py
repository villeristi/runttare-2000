from enum import Enum
from typing import TypedDict, Union


# msg-types:
#   - status
#   - counter

# status:
#   - idle
#   - busy
# counter:
#   - int

# broadcast:
#   - counter
#   - status

class MsgType(str, Enum):
    status = "status"
    count = "count"


class StatusType(str, Enum):
    idle = "idle"
    busy = "busy"


class RunttaMsg(TypedDict):
    type: MsgType
    value: Union[StatusType, int]
