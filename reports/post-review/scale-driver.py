"""Run the existing unchanged scale benchmark and also retain phase accounting."""
import importlib.util,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('scale_measurement',ROOT/'tools/scale-benchmark.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
original=module.run_case
def record_phases(data,out,extra,max_images,log):
    row=original(data,out,extra,max_images,log)
    report=json.loads((out/'report.json').read_text())
    row['phases']=report['phases'];row['deterministicInputComplete']=report['coverage']['deterministicInputComplete']
    return row
module.run_case=record_phases
module.main()
