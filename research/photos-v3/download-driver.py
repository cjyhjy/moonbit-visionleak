"""Run the frozen downloader with conservative pacing and Retry-After backoff only."""
import importlib.util, pathlib, time, urllib.error
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('frozen_source_downloader',ROOT/'tools/prepare-photos-v3.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
original=module.get
def polite_get(url,limit=16*1024*1024):
    for attempt in range(5):
        time.sleep(5)
        try:return original(url,limit)
        except urllib.error.HTTPError as error:
            if error.code!=429:raise
            delay=error.headers.get('Retry-After','60')
            try:delay=max(60,int(delay))
            except ValueError:delay=60
            print('Wikimedia rate limit; honoring backoff:',delay,'seconds',flush=True)
            while delay>0:
                step=min(60,delay);time.sleep(step);delay-=step
    raise RuntimeError('Download still rate-limited after five paced attempts')
module.get=polite_get
module.download()
