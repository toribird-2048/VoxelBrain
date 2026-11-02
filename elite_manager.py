"""
elite_manager.py: VoxelBrain エリート個体の保存・読み込み・分配マネージャー
・フォーマット Ver 2.0 (自己記述型メタデータ保持)
・重複保存コードの完全一元化
・backups/latest_best.npz の自動同期
・総ステップ数に応じた動的定期チェックポイント保存
・旧フォーマット (Ver 1.x / 旧キー) の後方互換ローダー
"""

import os
import glob
import re
import shutil
from datetime import datetime
import numpy as np


class EliteManager:
    FORMAT_VERSION = "2.0"
    LATEST_BEST_FILENAME = "latest_best.npz"

    @staticmethod
    def calculate_save_interval(total_steps: int, target_saves: int = 15) -> int:
        """総ステップ数に応じて適切な定期保存インターバル (ステップ数) を算出"""
        if total_steps <= 100:
            return 20
        # 目標保存回数 (10〜20回) に収まるようキリの良い数値に丸める
        raw_interval = max(50, total_steps // target_saves)
        # 100, 200, 500, 1000 などのキリの良い値に丸め
        if raw_interval >= 1000:
            interval = round(raw_interval / 500) * 500
        elif raw_interval >= 200:
            interval = round(raw_interval / 100) * 100
        else:
            interval = round(raw_interval / 50) * 50
        return max(50, int(interval))

    @staticmethod
    def extract_genome_dict(
        idx: int,
        score: float,
        step: int,
        config,
        gen_buf_dict: dict,
        neuromod_map_buf,
        shared_resource_params_buf: dict,
        shared_link28th_params_buf: dict,
        shared_neuromod_params_buf: dict,
        shared_inout_params_fi_buf: dict,
        shared_sig_mut_buf: dict = None,
        shared_neuromod_map_mut_buf: dict = None,
        shared_neuromod_params_mut_buf: dict = None,
        shared_iicu_mut_buf: dict = None,
        shared_rlmu_mut_buf: dict = None,
    ) -> dict:
        """指定エージェントの全遺伝子・パラメータ・メタデータを辞書として抽出"""
        idx = int(idx)
        P_cube_4 = config.P * config.P * config.P * 4
        N_cube = config.N * config.N * config.N
        INHIB_SIZE = config.inhib_stride
        NUM_IN = getattr(config, "num_in_ports", 2)
        NUM_OUT = getattr(config, "num_out_ports", 4)

        # 1. 神経基底
        sig_pre = gen_buf_dict["sig_pre_map_np2_pout"].to_numpy().view(np.float16)[idx * P_cube_4 : (idx + 1) * P_cube_4]
        sig_post = gen_buf_dict["sig_post_map_np2_pout"].to_numpy().view(np.float16)[idx * P_cube_4 : (idx + 1) * P_cube_4]
        neuromod = neuromod_map_buf.to_numpy().view(np.float16).reshape(config.m, N_cube, 4)[idx]
        inhib = gen_buf_dict["inhib_sign_map_pout"].to_numpy().view(np.uint32)[idx * INHIB_SIZE : (idx + 1) * INHIB_SIZE]

        # 2. 回路パラメータ
        res_base = shared_resource_params_buf["base_output"].to_numpy().view(np.float16)[idx]
        res_beta = shared_resource_params_buf["beta"].to_numpy().view(np.float16)[idx]
        res_refill = shared_resource_params_buf["k_refill"].to_numpy().view(np.float16)[idx]

        link_mult = shared_link28th_params_buf["multiplier"].to_numpy().view(np.int32)[idx]
        link_bias = shared_link28th_params_buf["bias"].to_numpy().view(np.int32)[idx]

        nm_rel = shared_neuromod_params_buf["neuromod_rel_matrix"].to_numpy().view(np.float16).reshape(config.m, 4, 4)[idx]
        nm_react = shared_neuromod_params_buf["neuromod_weight_reaction"].to_numpy().view(np.float16).reshape(config.m, 4, 4)[idx]
        nm_diff = shared_neuromod_params_buf["diff"].to_numpy().view(np.float16)[idx]

        in_ports = shared_inout_params_fi_buf["in_ports_fi"].to_numpy().view(np.int32).reshape(config.m, NUM_IN, 3)[idx]
        out_ports = shared_inout_params_fi_buf["out_ports_fi"].to_numpy().view(np.int32).reshape(config.m, NUM_OUT, 3)[idx]

        genome = {
            # メタ情報 (Ver 2.0 自己記述)
            "format_version": EliteManager.FORMAT_VERSION,
            "timestamp": datetime.now().isoformat(),
            "step": step,
            "score": float(score),
            "dim": int(config.dim),
            "n": int(config.N),
            "p": int(config.P),
            "num_in_ports": int(NUM_IN),
            "num_out_ports": int(NUM_OUT),
            # 神経基底
            "sig_pre": sig_pre,
            "sig_post": sig_post,
            "neuromod": neuromod,
            "inhib": inhib,
            # 回路パラメータ
            "resource_base_output": res_base,
            "resource_beta": res_beta,
            "resource_k_refill": res_refill,
            "link_multiplier": link_mult,
            "link_bias": link_bias,
            "neuromod_rel_matrix": nm_rel,
            "neuromod_weight_reaction": nm_react,
            "neuromod_diff": nm_diff,
            "in_ports_fi": in_ports,
            "out_ports_fi": out_ports,
            "light_in_fi": in_ports[0] if NUM_IN >= 1 else np.array([0, 0, 0], dtype=np.int32),
            "battery_in_fi": in_ports[1] if NUM_IN >= 2 else np.array([0, 0, 0], dtype=np.int32),
            "gen_pos_out_fi": out_ports[0] if NUM_OUT >= 1 else np.array([0, 0, 0], dtype=np.int32),
            "gen_neg_out_fi": out_ports[1] if NUM_OUT >= 2 else np.array([0, 0, 0], dtype=np.int32),
            "speed_out_fi": out_ports[2] if NUM_OUT >= 3 else np.array([0, 0, 0], dtype=np.int32),
            "rotate_out_fi": out_ports[3] if NUM_OUT >= 4 else np.array([0, 0, 0], dtype=np.int32),
        }

        # 3. メタ変異パラメータ（任意付属）
        if shared_sig_mut_buf is not None:
            genome["mut_sig_rate"] = shared_sig_mut_buf["rate"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]
            genome["mut_sig_steps"] = shared_sig_mut_buf["steps"].to_numpy().view(np.uint32)[idx]
            genome["mut_sig_max"] = shared_sig_mut_buf["max"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]
            genome["mut_sig_diff"] = shared_sig_mut_buf["diff"].to_numpy().view(np.float16)[idx]

        if shared_neuromod_map_mut_buf is not None:
            genome["mut_neuromod_map_rate"] = shared_neuromod_map_mut_buf["rate"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]
            genome["mut_neuromod_map_steps"] = shared_neuromod_map_mut_buf["steps"].to_numpy().view(np.uint32)[idx]
            genome["mut_neuromod_map_max"] = shared_neuromod_map_mut_buf["max"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]
            genome["mut_neuromod_map_diff"] = shared_neuromod_map_mut_buf["diff"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]

        if shared_neuromod_params_mut_buf is not None:
            genome["mut_neuromod_params_rate"] = shared_neuromod_params_mut_buf["rate"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]

        if shared_iicu_mut_buf is not None:
            genome["mut_iicu_rate"] = shared_iicu_mut_buf["iicu_rate"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]

        if shared_rlmu_mut_buf is not None:
            genome["mut_resource_rate"] = shared_rlmu_mut_buf["resource_rate"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]
            genome["mut_link28th_rate"] = shared_rlmu_mut_buf["link28th_rate"].to_numpy().view(np.float16).reshape(config.m, 2)[idx]
            genome["mut_mutate_rate"] = shared_rlmu_mut_buf["mutate_rate"].to_numpy().view(np.float16).reshape(config.m, 4)[idx]

        return genome

    @staticmethod
    def save_single_elite(filepath: str, genome_dict: dict, sync_latest_best: bool = False, backups_root: str = "backups"):
        """エリート個体を .npz 圧縮保存（必要に応じて backups/latest_best.npz へ同期）"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        np.savez_compressed(filepath, **genome_dict)

        if sync_latest_best:
            try:
                os.makedirs(backups_root, exist_ok=True)
                latest_path = os.path.join(backups_root, EliteManager.LATEST_BEST_FILENAME)
                shutil.copyfile(filepath, latest_path)
            except Exception as e:
                print(f"[!] latest_best.npz 同期失敗: {e}")

    @staticmethod
    def save_top_k(
        target_dir: str,
        energies: np.ndarray,
        step: int,
        config,
        gen_buf_dict: dict,
        neuromod_map_buf,
        shared_resource_params_buf: dict,
        shared_link28th_params_buf: dict,
        shared_neuromod_params_buf: dict,
        shared_inout_params_fi_buf: dict,
        k: int = 20,
        sync_latest_best: bool = True,
        backups_root: str = "backups",
        **mut_buffers,
    ) -> list[str]:
        """上位 K 体のエリート個体を保存"""
        os.makedirs(target_dir, exist_ok=True)
        k_val = min(k, len(energies))
        top_indices = np.argsort(energies)[-k_val:][::-1]
        saved_paths = []

        for rank, idx in enumerate(top_indices, start=1):
            idx = int(idx)
            score = float(energies[idx])
            filepath = os.path.join(target_dir, f"rank{rank:02d}_step{step}_energy{score:.3f}_id{idx}.npz")

            genome = EliteManager.extract_genome_dict(
                idx=idx,
                score=score,
                step=step,
                config=config,
                gen_buf_dict=gen_buf_dict,
                neuromod_map_buf=neuromod_map_buf,
                shared_resource_params_buf=shared_resource_params_buf,
                shared_link28th_params_buf=shared_link28th_params_buf,
                shared_neuromod_params_buf=shared_neuromod_params_buf,
                shared_inout_params_fi_buf=shared_inout_params_fi_buf,
                **mut_buffers,
            )

            # 1位の個体のみ latest_best.npz に同期
            sync_flag = (rank == 1 and sync_latest_best)
            EliteManager.save_single_elite(filepath, genome, sync_latest_best=sync_flag, backups_root=backups_root)
            saved_paths.append(filepath)

        return saved_paths

    @staticmethod
    def load_elite(filepath: str) -> dict:
        """エリート .npz ファイルを読み込み、バージョン互換性を解決して返す"""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"エリートファイルが見つかりません: {filepath}")

        loaded = dict(np.load(filepath))
        version = loaded.get("format_version", "1.0")

        # 旧バージョンからのフォールバック補完
        if "dim" not in loaded:
            loaded["dim"] = 2
        if "num_in_ports" not in loaded:
            loaded["num_in_ports"] = 2
        if "num_out_ports" not in loaded:
            loaded["num_out_ports"] = 4

        return loaded

    @staticmethod
    def distribute_elites_to_population(
        folder_path: str,
        config,
        gen_buf_dict: dict,
        neuromod_map_buf,
        shared_resource_params_buf: dict,
        shared_link28th_params_buf: dict,
        shared_neuromod_params_buf: dict,
        shared_inout_params_fi_buf: dict,
        def_defaults: dict,
    ) -> int:
        """フォルダ内のエリート個体を母集団全体に均等配分（Modulo分配）"""
        file_list = sorted(glob.glob(os.path.join(folder_path, "*.npz")))
        # latest_best.npz が含まれている場合は重複を避けるか活用
        file_list = [f for f in file_list if not f.endswith(EliteManager.LATEST_BEST_FILENAME)]

        if not file_list:
            # もし通常ファイルがなく latest_best.npz だけあるならそれを使う
            single_best = os.path.join(folder_path, EliteManager.LATEST_BEST_FILENAME)
            if os.path.exists(single_best):
                file_list = [single_best]
            else:
                print(f"[!] フォルダに .npz ファイルがありません: {folder_path}")
                return 0

        valid_elites = []
        for f in file_list:
            try:
                data = EliteManager.load_elite(f)
                if "sig_pre" not in data or "sig_post" not in data:
                    continue
                valid_elites.append(data)
            except Exception as e:
                print(f"[!] 読込スキップ: {os.path.basename(f)} ({e})")

        if not valid_elites:
            print(f"[!] 有効なエリート個体が見つかりませんでした: {folder_path}")
            return 0

        num_elites = len(valid_elites)
        print(f"\n[★] {num_elites} 体のエリート個体を均等配分（Modulo分配）します (母集団数={config.m})...")

        # 均等Modulo分配 (エリート主義ではなく均等分散)
        assign = np.arange(config.m) % num_elites

        # 1. 神経基底 (sig_pre, sig_post, inhib)
        sig_pre_all = np.stack([np.asarray(e["sig_pre"], dtype=np.float16).reshape(-1) for e in valid_elites])[assign].reshape(-1).astype(np.float16)
        sig_post_all = np.stack([np.asarray(e["sig_post"], dtype=np.float16).reshape(-1) for e in valid_elites])[assign].reshape(-1).astype(np.float16)
        inhib_all = np.stack([np.asarray(e["inhib"], dtype=np.uint32).reshape(-1) for e in valid_elites])[assign].reshape(-1).astype(np.uint32)

        gen_buf_dict["sig_pre_map_np2_pout"].copy_from_numpy(sig_pre_all)
        gen_buf_dict["sig_post_map_np2_pout"].copy_from_numpy(sig_post_all)
        gen_buf_dict["inhib_sign_map_pout"].copy_from_numpy(inhib_all)

        # 2. neuromod_map
        expected_n_cube = config.N * config.N * config.N
        neuromod_list = []
        for e in valid_elites:
            if "neuromod" in e:
                nm = np.asarray(e["neuromod"], dtype=np.float16).reshape(-1, 4)
                if nm.shape[0] != expected_n_cube:
                    padded = np.zeros((expected_n_cube, 4), dtype=np.float16)
                    min_n = min(nm.shape[0], expected_n_cube)
                    padded[:min_n] = nm[:min_n]
                    neuromod_list.append(padded)
                else:
                    neuromod_list.append(nm)
            else:
                neuromod_list.append(np.zeros((expected_n_cube, 4), dtype=np.float16))

        neuromod_all = np.stack(neuromod_list)[assign].reshape(-1, 4).astype(np.float16)
        neuromod_map_buf.copy_from_numpy(neuromod_all)

        # 3. 回路パラメータ
        shared_resource_params_buf["base_output"].copy_from_numpy(
            np.array([np.float16(e.get("resource_base_output", def_defaults["base_output"])) for e in valid_elites], dtype=np.float16)[assign]
        )
        shared_resource_params_buf["beta"].copy_from_numpy(
            np.array([np.float16(e.get("resource_beta", def_defaults["beta"])) for e in valid_elites], dtype=np.float16)[assign]
        )
        shared_resource_params_buf["k_refill"].copy_from_numpy(
            np.array([np.float16(e.get("resource_k_refill", def_defaults["k_refill"])) for e in valid_elites], dtype=np.float16)[assign]
        )

        shared_link28th_params_buf["multiplier"].copy_from_numpy(
            np.array([np.int32(e.get("link_multiplier", def_defaults["multiplier"])) for e in valid_elites], dtype=np.int32)[assign]
        )
        shared_link28th_params_buf["bias"].copy_from_numpy(
            np.array([np.int32(e.get("link_bias", def_defaults["bias"])) for e in valid_elites], dtype=np.int32)[assign]
        )

        # 4. neuromod_params
        shared_neuromod_params_buf["neuromod_rel_matrix"].copy_from_numpy(
            np.stack([np.asarray(e.get("neuromod_rel_matrix", def_defaults["rel_matrix"]), dtype=np.float16).reshape(4, 4) for e in valid_elites])[assign].astype(np.float16)
        )
        shared_neuromod_params_buf["neuromod_weight_reaction"].copy_from_numpy(
            np.stack([np.asarray(e.get("neuromod_weight_reaction", def_defaults["weight_reaction"]), dtype=np.float16).reshape(4, 4) for e in valid_elites])[assign].astype(np.float16)
        )
        shared_neuromod_params_buf["diff"].copy_from_numpy(
            np.array([np.float16(e.get("neuromod_diff", def_defaults["diff"])) for e in valid_elites], dtype=np.float16)[assign]
        )

        # 5. inout_ports
        num_in = getattr(config, "num_in_ports", 2)
        num_out = getattr(config, "num_out_ports", 4)
        def_in = def_defaults["in_ports_fi"]
        def_out = def_defaults["out_ports_fi"]

        in_list = []
        out_list = []
        for e in valid_elites:
            in_arr = np.copy(def_in)
            out_arr = np.copy(def_out)
            if "in_ports_fi" in e:
                loaded_in = np.asarray(e["in_ports_fi"], dtype=np.int32).reshape(-1, 3)
                n_in = min(len(loaded_in), num_in)
                in_arr[:n_in] = loaded_in[:n_in]
            else:
                if "light_in_fi" in e and num_in >= 1:
                    in_arr[0] = np.asarray(e["light_in_fi"], dtype=np.int32).reshape(3)
                if "battery_in_fi" in e and num_in >= 2:
                    in_arr[1] = np.asarray(e["battery_in_fi"], dtype=np.int32).reshape(3)

            if "out_ports_fi" in e:
                loaded_out = np.asarray(e["out_ports_fi"], dtype=np.int32).reshape(-1, 3)
                n_out = min(len(loaded_out), num_out)
                out_arr[:n_out] = loaded_out[:n_out]
            else:
                if "gen_pos_out_fi" in e and num_out >= 1:
                    out_arr[0] = np.asarray(e["gen_pos_out_fi"], dtype=np.int32).reshape(3)
                if "gen_neg_out_fi" in e and num_out >= 2:
                    out_arr[1] = np.asarray(e["gen_neg_out_fi"], dtype=np.int32).reshape(3)
                if "speed_out_fi" in e and num_out >= 3:
                    out_arr[2] = np.asarray(e["speed_out_fi"], dtype=np.int32).reshape(3)
                if "rotate_out_fi" in e and num_out >= 4:
                    out_arr[3] = np.asarray(e["rotate_out_fi"], dtype=np.int32).reshape(3)

            in_list.append(in_arr)
            out_list.append(out_arr)

        in_all = np.stack(in_list)[assign].reshape(config.m * num_in, 3).astype(np.int32)
        out_all = np.stack(out_list)[assign].reshape(config.m * num_out, 3).astype(np.int32)

        shared_inout_params_fi_buf["in_ports_fi"].copy_from_numpy(np.ascontiguousarray(in_all))
        shared_inout_params_fi_buf["out_ports_fi"].copy_from_numpy(np.ascontiguousarray(out_all))

        # 6. メタ変異パラメータ（任意付属）
        mut_buffers = def_defaults.get("mut_buffers", {})
        if "shared_sig_mut_buf" in mut_buffers and mut_buffers["shared_sig_mut_buf"] is not None:
            buf = mut_buffers["shared_sig_mut_buf"]
            def_rate = buf["rate"].to_numpy().view(np.float16).reshape(config.m, 4)[0]
            def_steps = buf["steps"].to_numpy().view(np.uint32).reshape(config.m)[0]
            def_max = buf["max"].to_numpy().view(np.float16).reshape(config.m, 4)[0]
            def_diff = buf["diff"].to_numpy().view(np.float16).reshape(config.m, 4)[0]

            buf["rate"].copy_from_numpy(np.array([np.asarray(e["mut_sig_rate"], dtype=np.float16).reshape(4) if "mut_sig_rate" in e else def_rate for e in valid_elites], dtype=np.float16)[assign])
            buf["steps"].copy_from_numpy(np.array([np.uint32(e["mut_sig_steps"]) if "mut_sig_steps" in e else def_steps for e in valid_elites], dtype=np.uint32)[assign])
            buf["max"].copy_from_numpy(np.array([np.asarray(e["mut_sig_max"], dtype=np.float16).reshape(4) if "mut_sig_max" in e else def_max for e in valid_elites], dtype=np.float16)[assign])
            buf["diff"].copy_from_numpy(np.array([np.asarray(e["mut_sig_diff"], dtype=np.float16).reshape(4) if "mut_sig_diff" in e else def_diff for e in valid_elites], dtype=np.float16)[assign])

        if "shared_neuromod_map_mut_buf" in mut_buffers and mut_buffers["shared_neuromod_map_mut_buf"] is not None:
            buf = mut_buffers["shared_neuromod_map_mut_buf"]
            def_rate = buf["rate"].to_numpy().view(np.float16).reshape(config.m, 4)[0]
            def_steps = buf["steps"].to_numpy().view(np.uint32).reshape(config.m)[0]
            def_max = buf["max"].to_numpy().view(np.float16).reshape(config.m, 4)[0]
            def_diff = buf["diff"].to_numpy().view(np.float16).reshape(config.m, 4)[0]

            buf["rate"].copy_from_numpy(np.array([np.asarray(e["mut_neuromod_map_rate"], dtype=np.float16).reshape(4) if "mut_neuromod_map_rate" in e else def_rate for e in valid_elites], dtype=np.float16)[assign])
            buf["steps"].copy_from_numpy(np.array([np.uint32(e["mut_neuromod_map_steps"]) if "mut_neuromod_map_steps" in e else def_steps for e in valid_elites], dtype=np.uint32)[assign])
            buf["max"].copy_from_numpy(np.array([np.asarray(e["mut_neuromod_map_max"], dtype=np.float16).reshape(4) if "mut_neuromod_map_max" in e else def_max for e in valid_elites], dtype=np.float16)[assign])
            buf["diff"].copy_from_numpy(np.array([np.asarray(e["mut_neuromod_map_diff"], dtype=np.float16).reshape(4) if "mut_neuromod_map_diff" in e else def_diff for e in valid_elites], dtype=np.float16)[assign])

        if "shared_neuromod_params_mut_buf" in mut_buffers and mut_buffers["shared_neuromod_params_mut_buf"] is not None:
            buf = mut_buffers["shared_neuromod_params_mut_buf"]
            def_rate = buf["rate"].to_numpy().view(np.float16).reshape(config.m, 4)[0]
            buf["rate"].copy_from_numpy(np.array([np.asarray(e["mut_neuromod_params_rate"], dtype=np.float16).reshape(4) if "mut_neuromod_params_rate" in e else def_rate for e in valid_elites], dtype=np.float16)[assign])

        if "shared_iicu_mut_buf" in mut_buffers and mut_buffers["shared_iicu_mut_buf"] is not None:
            buf = mut_buffers["shared_iicu_mut_buf"]
            def_rate = buf["iicu_rate"].to_numpy().view(np.float16).reshape(config.m, 4)[0]
            buf["iicu_rate"].copy_from_numpy(np.array([np.asarray(e["mut_iicu_rate"], dtype=np.float16).reshape(4) if "mut_iicu_rate" in e else def_rate for e in valid_elites], dtype=np.float16)[assign])

        if "shared_rlmu_mut_buf" in mut_buffers and mut_buffers["shared_rlmu_mut_buf"] is not None:
            buf = mut_buffers["shared_rlmu_mut_buf"]
            def_res = buf["resource_rate"].to_numpy().view(np.float16).reshape(config.m, 4)[0]
            def_link = buf["link28th_rate"].to_numpy().view(np.float16).reshape(config.m, 2)[0]
            def_mut = buf["mutate_rate"].to_numpy().view(np.float16).reshape(config.m, 4)[0]

            buf["resource_rate"].copy_from_numpy(np.array([np.asarray(e["mut_resource_rate"], dtype=np.float16).reshape(4) if "mut_resource_rate" in e else def_res for e in valid_elites], dtype=np.float16)[assign])
            buf["link28th_rate"].copy_from_numpy(np.array([np.asarray(e["mut_link28th_rate"], dtype=np.float16).reshape(2) if "mut_link28th_rate" in e else def_link for e in valid_elites], dtype=np.float16)[assign])
            buf["mutate_rate"].copy_from_numpy(np.array([np.asarray(e["mut_mutate_rate"], dtype=np.float16).reshape(4) if "mut_mutate_rate" in e else def_mut for e in valid_elites], dtype=np.float16)[assign])

        print(f"[+] {num_elites} 体のエリート個体を全 {config.m} 体へ均等配分完了しました！")
        return num_elites
