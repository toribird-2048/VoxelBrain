# onesim/ko_scanner.py
import tkinter as tk
from tkinter import messagebox
import numpy as np

from onesim.sim_cpu import SolarBrainCPU
from onesim.coords import get_special_coords_np2, format_coord_label


class KoScannerMixin:
    """ノックアウト（KO）およびシナプス実験切断・全探索スキャン Mixin"""

    def _on_scan_tree_select(self, event):
        sel = self.tree_scan.selection()
        if not sel:
            return
        item_id = sel[0]
        if self._scan_mode == "synapse" and item_id in self._scan_item_synapses:
            _, _, pre_coord, post_coord = self._scan_item_synapses[item_id]
            self.wire_src = pre_coord
            n_s, _ = format_coord_label(*pre_coord, self.N)
            self.lbl_wire_src.config(text=f"起点(Pre): {n_s}")
            self.sel_z, self.sel_y, self.sel_x = post_coord
            self._refresh_all_views()
        elif item_id in self._scan_item_coords:
            self.sel_z, self.sel_y, self.sel_x = self._scan_item_coords[item_id]
            self._refresh_all_views()

    def _on_scan_tree_double_click(self, event):
        self.action_toggle_scan_selected_item()

    def action_toggle_scan_selected_item(self):
        sel = self.tree_scan.selection()
        if not sel:
            return
        item_id = sel[0]
        if self._scan_mode == "synapse" and item_id in self._scan_item_synapses:
            post_idx, k, pre_coord, post_coord = self._scan_item_synapses[item_id]
            is_cut = self.brain.set_synapse_slot_cut(post_idx, k)
            if self.auto_reset_on_edit.get():
                self.brain.reset()
            vals = list(self.tree_scan.item(item_id, "values"))
            if len(vals) >= 6:
                base_role = vals[5].replace("[切断中] ", "")
                vals[5] = f"[切断中] {base_role}" if is_cut else base_role
                self.tree_scan.item(item_id, values=vals)
            self._refresh_all_views()
        elif item_id in self._scan_item_coords:
            self.sel_z, self.sel_y, self.sel_x = self._scan_item_coords[item_id]
            self.action_toggle_selected_ko()

    def action_toggle_selected_synapse(self):
        """選択セル・シナプス配線タブの一覧で選択されているシナプス結合を切断/復元 (sig不変)"""
        sel = self.tree_synapses.selection()
        if not sel:
            return
        item_id = sel[0]
        if item_id not in self._syn_tree_items:
            return
        post_idx, k, partner_coord = self._syn_tree_items[item_id]
        self.brain.set_synapse_slot_cut(post_idx, k)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()
        for new_id, (p_i, slot_k, _) in self._syn_tree_items.items():
            if p_i == post_idx and slot_k == k:
                self.tree_synapses.selection_set(new_id)
                self.tree_synapses.see(new_id)
                break

    def action_jump_to_synapse_partner(self):
        """シナプス一覧で選択中の相手セルへ選択フォーカスを移動する"""
        sel = self.tree_synapses.selection()
        if not sel:
            return
        item_id = sel[0]
        if item_id in self._syn_tree_items:
            _, _, partner_coord = self._syn_tree_items[item_id]
            self.sel_z, self.sel_y, self.sel_x = partner_coord
            self._refresh_all_views()

    def action_toggle_all_incoming_synapses(self):
        """現在選択中の内部セルへの全入力シナプス (Pre ➔ 此) を一括切断/復元 (sig不変)"""
        post_idx = self.brain._coord_p_to_internal_idx(self.sel_z, self.sel_y, self.sel_x)
        if post_idx is None:
            messagebox.showinfo("外周セル", "外周膜セルにはシナプス入力スロットがありません。")
            return
        active_ks = [
            k for k in range(28)
            if float(self.brain.initial_weights[post_idx, k]) > 0.01 or self.brain.synapse_ko_mask[post_idx, k]
        ]
        if not active_ks:
            active_ks = list(range(28))
        any_uncut = any(not self.brain.synapse_ko_mask[post_idx, k] for k in active_ks)
        for k in active_ks:
            self.brain.set_synapse_slot_cut(post_idx, k, cut=any_uncut)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_toggle_all_outgoing_synapses(self):
        """現在選択中のセルからの全出力シナプス (此 ➔ Post) を一括切断/復元 (sig不変)"""
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x
        slots = []
        for post_idx in range(self.TOTAL_N):
            for k in range(28):
                if int(conn_z[post_idx, k]) == z and int(conn_y[post_idx, k]) == y and int(conn_x[post_idx, k]) == x:
                    if float(self.brain.initial_weights[post_idx, k]) > 0.01 or self.brain.synapse_ko_mask[post_idx, k]:
                        slots.append((post_idx, k))
        if not slots:
            return
        any_uncut = any(not self.brain.synapse_ko_mask[p_idx, k] for p_idx, k in slots)
        for p_idx, k in slots:
            self.brain.set_synapse_slot_cut(p_idx, k, cut=any_uncut)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_cut_wire_unidirectional(self):
        """起点(Pre) ➔ 現在セル(Post) の単方向シナプス結合のみを実験切断/復元 (sig不変)"""
        if self.wire_src is None:
            messagebox.showinfo("2セル間結合切断", "先に起点(Pre)セルを選択して「現在セルを起点(Pre)に指定 [W]」を押してください。")
            return
        post_coord = (self.sel_z, self.sel_y, self.sel_x)
        slots = self.brain.find_synapse_slots_between(self.wire_src, post_coord, active_only=False)
        if not slots:
            n_pre, _ = format_coord_label(*self.wire_src, self.N)
            n_post, _ = format_coord_label(*post_coord, self.N)
            messagebox.showinfo(
                "結合なし",
                f"{n_pre} ➔ {n_post} の方向にはシナプス結合スロットが存在しません。\n（近傍27セルまたは28番目遠隔リンクのみ結合可能です）",
            )
            return
        any_uncut = any(not self.brain.synapse_ko_mask[p_idx, k] for p_idx, k in slots)
        for p_idx, k in slots:
            self.brain.set_synapse_slot_cut(p_idx, k, cut=any_uncut)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_cut_wire_bidirectional(self):
        """起点(Pre) ⟷ 現在セル(Post) の双方向シナプス結合を実験切断/復元 (sig不変)"""
        if self.wire_src is None:
            messagebox.showinfo("2セル間結合切断", "先に起点(Pre)セルを選択して「現在セルを起点(Pre)に指定 [W]」を押してください。")
            return
        self._toggle_synapse_with_selected_cell(self.wire_src)
        self._refresh_all_views()

    def action_clear_all_synapse_cuts(self):
        """すべてのシナプス実験切断を解除し、元の重みに復元する"""
        self.brain.synapse_ko_mask.fill(False)
        self.brain.weights = self.brain.initial_weights.copy()
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def _on_ko_checkbox_toggle(self):
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        self.brain.knockout_np2[z, y, x] = bool(self.cell_ko_var.get())
        if self.brain.knockout_np2[z, y, x]:
            self.brain.outputs_np2[z, y, x] = np.float16(0.0)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_toggle_selected_ko(self):
        z, y, x = self.sel_z, self.sel_y, self.sel_x
        self.brain.knockout_np2[z, y, x] = not self.brain.knockout_np2[z, y, x]
        if self.brain.knockout_np2[z, y, x]:
            self.brain.outputs_np2[z, y, x] = np.float16(0.0)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_ko_current_z_slice(self):
        z = self.sel_z
        if np.all(self.brain.knockout_np2[z]):
            self.brain.knockout_np2[z, :, :] = False
        else:
            self.brain.knockout_np2[z, :, :] = True
            self.brain.outputs_np2[z, :, :] = np.float16(0.0)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_clear_all_ko(self):
        self.brain.knockout_np2.fill(False)
        if self.auto_reset_on_edit.get():
            self.brain.reset()
        self._refresh_all_views()

    def action_bake_ko_to_genes(self):
        """現在ノックアウト(KO)されているセルの sig_pre / sig_post を 0 に書き換えて遺伝子自体に反映する"""
        ko_mask = self.brain.knockout_np2
        count = int(np.count_nonzero(ko_mask))
        if count == 0:
            messagebox.showinfo("KO確定", "現在ノックアウトされているセルはありません。")
            return
        if messagebox.askyesno(
            "ノックアウトを遺伝子に確定",
            f"現在ノックアウト中の {count} セルの sig_pre / sig_post をすべて 0.0 に書き換えますか？\n"
            f"（確定後は .npz として保存してもそのセルの結合が完全に消去されます）",
        ):
            self.sig_pre[ko_mask] = np.float16(0.0)
            self.sig_post[ko_mask] = np.float16(0.0)
            self.brain.knockout_np2.fill(False)
            self._sync_genes_to_brain(force_reset=True)
            self._refresh_all_views()

    def action_run_knockout_scan(self):
        """各セルを1つずつ単独ノックアウトした際の1000step後エネルギー変化を自動スキャン"""
        self._scan_mode = "cell"
        self.tree_scan.heading("n_coord", text="内部座標 (x, y, z) [0..N-1]")
        self.tree_scan.heading("p_coord", text="外周込 P[z, y, x] [0..N+1]")
        self.tree_scan.heading("ko_e", text="KO後E")
        self.tree_scan.heading("role", text="役割 / 状態")

        neuromod_flat, inhib_flat = self._get_flat_arrays_for_sim()
        tester = SolarBrainCPU(
            self.sig_pre.copy(),
            self.sig_post.copy(),
            neuromod_flat,
            inhib_flat,
            self.sim_params,
            self.spec,
        )
        tester.step(
            inner_steps=1000,
                        record_history=False,
        )
        base_energy = tester.energy

        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        target_coords = list(special_map.keys()) + [
            (iz + 1, iy + 1, ix + 1)
            for iz in range(self.N)
            for iy in range(self.N)
            for ix in range(self.N)
            if (iz + 1, iy + 1, ix + 1) not in special_map
        ]

        results = []
        for coord in target_coords:
            tester.knockout_np2.fill(False)
            tester.knockout_np2[coord] = True
            tester.reset()
            tester.step(
                inner_steps=1000,
                                record_history=False,
            )
            ko_e = tester.energy
            drop = base_energy - ko_e
            results.append((drop, ko_e, coord))

        results.sort(key=lambda x: (round(x[0], 6), round(abs(x[0]), 6)), reverse=True)

        self.lbl_scan_base.config(
            text=f"✅ セルKOスキャン完了！ 基準E: {base_energy:.4f} ｜ 行クリックでセル選択・ダブルクリックでセルKO切替"
        )

        for item in self.tree_scan.get_children():
            self.tree_scan.delete(item)
        self._scan_item_coords.clear()
        self._scan_item_synapses.clear()

        for rank, (drop, ko_e, coord) in enumerate(results, start=1):
            z, y, x = coord
            n_str, p_str = format_coord_label(z, y, x, self.N)
            role = special_map.get(coord, "内部ニューロン")
            if self.brain.knockout_np2[z, y, x]:
                role = f"[KO中] {role}"
            delta_e = ko_e - base_energy
            item_id = self.tree_scan.insert(
                "",
                tk.END,
                values=(
                    f"{rank}位",
                    n_str,
                    p_str,
                    f"{ko_e:.4f}",
                    f"{delta_e:+.4f}",
                    role,
                ),
            )
            self._scan_item_coords[item_id] = (z, y, x)

    def action_run_synapse_knockout_scan(self):
        """有効な各シナプス結合を1本ずつ単独切断した際の重要度を自動スキャン"""
        self._scan_mode = "synapse"
        self.tree_scan.heading("n_coord", text="結合 Pre(入力元) ➔ Post(出力先)")
        self.tree_scan.heading("p_coord", text="P座標 Pre ➔ Post")
        self.tree_scan.heading("ko_e", text="切断後E")
        self.tree_scan.heading("role", text="重み w / 役割 / 状態")

        neuromod_flat, inhib_flat = self._get_flat_arrays_for_sim()
        tester = SolarBrainCPU(
            self.sig_pre.copy(),
            self.sig_post.copy(),
            neuromod_flat,
            inhib_flat,
            self.sim_params,
            self.spec,
        )
        tester.step(
            inner_steps=1000,
                        record_history=False,
        )
        base_energy = tester.energy

        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x

        active_synapses = []
        for post_idx in range(self.TOTAL_N):
            for k in range(28):
                w0 = float(tester.initial_weights[post_idx, k])
                if w0 > 0.01:
                    sz, sy, sx = int(conn_z[post_idx, k]), int(conn_y[post_idx, k]), int(conn_x[post_idx, k])
                    is_pre_valid = ((1 <= sz <= self.N) and (1 <= sy <= self.N) and (1 <= sx <= self.N)) or ((sz, sy, sx) in special_map)
                    if is_pre_valid:
                        active_synapses.append((post_idx, k, w0))

        results = []
        for post_idx, k, w0 in active_synapses:
            tester.synapse_ko_mask.fill(False)
            tester.synapse_ko_mask[post_idx, k] = True
            tester.reset()
            tester.step(
                inner_steps=1000,
                                record_history=False,
            )
            ko_e = tester.energy
            drop = base_energy - ko_e
            results.append((drop, ko_e, post_idx, k, w0))

        results.sort(key=lambda x: (round(x[0], 6), round(abs(x[0]), 6)), reverse=True)

        self.lbl_scan_base.config(
            text=f"✅ シナプス単独切断スキャン完了 ({len(results)}本)！ 基準E: {base_energy:.4f} ｜ ダブルクリックでその結合を実験切断/復元(sig不変)"
        )

        for item in self.tree_scan.get_children():
            self.tree_scan.delete(item)
        self._scan_item_coords.clear()
        self._scan_item_synapses.clear()

        special_map = get_special_coords_np2(self.dim, getattr(self, "sim_params", None))
        conn_z, conn_y, conn_x = self.brain.conn_z, self.brain.conn_y, self.brain.conn_x

        for rank, (drop, ko_e, post_idx, k, w0) in enumerate(results, start=1):
            pz = ((post_idx >> (self.dim * 2)) & (self.N - 1)) + 1
            py = ((post_idx >> self.dim) & (self.N - 1)) + 1
            px = ((post_idx >> 0) & (self.N - 1)) + 1
            sz, sy, sx = int(conn_z[post_idx, k]), int(conn_y[post_idx, k]), int(conn_x[post_idx, k])

            pre_n, _ = format_coord_label(sz, sy, sx, self.N)
            post_n, _ = format_coord_label(pz, py, px, self.N)
            p_pair = f"P[{sz},{sy},{sx}]➔P[{pz},{py},{px}]"

            role_parts = [f"w={w0:.2f}"]
            if k == 27:
                role_parts.append("[28th]")
            sp_pre = special_map.get((sz, sy, sx), "")
            sp_post = special_map.get((pz, py, px), "")
            if sp_pre:
                role_parts.append(sp_pre)
            if sp_post:
                role_parts.append(f"➔{sp_post}")
            if self.brain.synapse_ko_mask[post_idx, k]:
                role_parts.insert(0, "[切断中]")

            delta_e = ko_e - base_energy
            item_id = self.tree_scan.insert(
                "",
                tk.END,
                values=(
                    f"{rank}位",
                    f"{pre_n} ➔ {post_n}",
                    p_pair,
                    f"{ko_e:.4f}",
                    f"{delta_e:+.4f}",
                    " ".join(role_parts),
                ),
            )
            self._scan_item_synapses[item_id] = (post_idx, k, (sz, sy, sx), (pz, py, px))

