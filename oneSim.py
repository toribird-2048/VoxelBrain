# oneSim.py
"""
VoxelBrain - OneSim (IntegratedBrainStudio)
ボクセル型ニューロエボリューション リアルタイム統合シミュレータ＆エディタ
"""
import sys
import matplotlib
matplotlib.use("TkAgg")
matplotlib.rcParams["font.sans-serif"] = ["Yu Gothic", "Meiryo", "MS Gothic", "DejaVu Sans"]
matplotlib.rcParams["axes.unicode_minus"] = False

from sim_config import (
    NUM_IN_PORTS,
    NUM_OUT_PORTS,
    INITIAL_ENERGY,
    METABOLIC_COST,
    GEN_COST_RATE,
    SOLAR_GAIN_RATE,
    SUN_CYCLE_PERIOD,
    SPEED_GAIN,
    ROTATE_GAIN,
)

from onesim import (
    IntegratedBrainStudio,
    SolarBrainCPU,
    HISTORY_LEN,
    load_elite_npz,
    select_npz_file,
    get_smart_npz_initial_dir,
    get_latest_evolved_elite_path,
    get_default_inout_fi,
    face_index_to_coord_in_p,
    face_index_to_coord_out_p,
    get_special_coords_np2,
    format_coord_label,
    main,
)

STEPS_PER_FRAME = 1

if __name__ == "__main__":
    main()
