import numpy as np



# 1. 読み込み
data = np.load('backups\\edited\\rank01_step49999_energy0.994_id8458.npz')

# 読み込んだデータは辞書のように扱えます（読み取り専用配列になっている場合があります）
arrays = {key: data[key].copy() for key in data.files}

# 2. 編集（例: 特定の配列を書き換える）
arrays["sig_post"][172] = np.float16(0)
arrays["sig_post"][173] = np.float16(0)
arrays["sig_post"][174] = np.float16(0)
arrays["sig_post"][175] = np.float16(0)

# 3. 再保存
np.savez_compressed('backups\\edited\\rank01_step49999_energy0.994_id8458.npz', **arrays)