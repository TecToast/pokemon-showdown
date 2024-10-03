export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	aircutter: {
		inherit: true,
		critRatio: 1,
		onHit(target, source, move) {
			let success = false;
			const removeTarget = [
				'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			const removeAll = [
				'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
			];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Air Cutter', '[of] ' + source);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Air Cutter', '[of] ' + source);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		desc: "If this move is successful, the effects of Reflect, Light Screen, Aurora Veil, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the target's side, and the effects of Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's side. Ignores a target's substitute. If there is a terrain active and this move is successful, the terrain will be cleared.",
		shortDesc: "Clears terrain and hazards on both sides.",
	},
	ragefist: {
		inherit: true,
		basePowerCallback(pokemon) {
			return Math.min(170, 50 + 20 * pokemon.timesAttacked);
		},
	},
	lastrespects: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			return 50 + 20 * pokemon.side.totalFainted;
		},
	},
	lifedew: {
		inherit: true,
		heal: [1, 3],
		desc: "Each Pokemon on the user's side restores 1/3 of its maximum HP, rounded half up.",
		shortDesc: "Heals the user and its allies by 1/3 their max HP.",
	},
	junglehealing: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, [1, 3]));
			return pokemon.cureStatus() || success;
		},
		desc: "Each Pokemon on the user's side restores 1/3 of its maximum HP, rounded half up, and has its status condition cured.",
		shortDesc: "User and allies: healed 1/3 max HP, status cured.",
	},
	lunarblessing: {
		inherit: true,
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, [1, 3]));
			return pokemon.cureStatus() || success;
		},
		desc: "Each Pokemon on the user's side restores 1/4 of its maximum HP, rounded half up, and has its status condition cured.",
		shortDesc: "User and allies: healed 1/4 max HP, status cured.",
	},
	trickroom: {
		inherit: true,
		priority: 0,
		shortDesc: "For 5 turns, turn order is reversed.",
	},
	hiddenpower: {
		inherit: true,
		desc: "This move's type depends on the user's individual values (IVs), and can be any type but Normal.",
		shortDesc: "Varies in type based on the user's IVs.",
	},
	milkdrink: {
		inherit: true,
		pp: 10,
	},
	recover: {
		inherit: true,
		pp: 10,
	},
	rest: {
		inherit: true,
		pp: 10,
	},
	roost: {
		inherit: true,
		pp: 10,
	},
	shoreup: {
		inherit: true,
		pp: 10,
	},
	slackoff: {
		inherit: true,
		pp: 10,
	},
	softboiled: {
		inherit: true,
		pp: 10,
	},
};
