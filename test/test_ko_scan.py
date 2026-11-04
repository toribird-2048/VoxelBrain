import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from oneSim import OneSim
import time

sim = OneSim(dim=2, agent_data="backups/checkpoint_20261101_224358/best_step60_energy0.839_id16323.npz")
print("Starting KO scan (64 cells x 1000 innersteps)...")
t0 = time.perf_counter()
res = sim.scan_ko_all(total_inner_steps=1000)
t1 = time.perf_counter()
print(f"KO scan finished in {t1 - t0:.2f}s!")
print(f"Base energy: {res['base_energy']:.4f}")
print("Top 5 critical neurons:")
for r in res["rankings"][:5]:
    print(f"Rank {r['rank']}: cell({r['x']},{r['y']},{r['z']}) -> drop: {r['drop']:+.4f} (E={r['ko_energy']:.4f})")
