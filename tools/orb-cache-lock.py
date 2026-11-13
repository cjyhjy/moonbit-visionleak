"""Private cache lock broker. OS locks are released on EOF or process death."""
import fcntl
import json
import os
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
held = None
try:
    for line in sys.stdin:
        if len(line) > 1024:
            raise ValueError('lock request too large')
        request = json.loads(line)
        if request['op'] == 'lock':
            if held is not None or not re.fullmatch('[a-f0-9]{2}', request['shard']):
                raise ValueError('invalid lock request')
            fd = os.open(root / (request['shard'] + '.lock'), os.O_RDWR | os.O_CREAT | os.O_NOFOLLOW, 0o600)
            try:
                fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                os.close(fd)
                response = {'ok': True, 'acquired': False}
            else:
                held = fd
                response = {'ok': True, 'acquired': True}
        elif request['op'] == 'unlock' and held is not None:
            os.close(held)
            held = None
            response = {'ok': True}
        else:
            raise ValueError('invalid lock operation')
        print(json.dumps(response), flush=True)
finally:
    if held is not None:
        os.close(held)
