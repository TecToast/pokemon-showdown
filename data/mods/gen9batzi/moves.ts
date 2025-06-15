export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	aircutter: {
		inherit: true,
		critRatio: 1,
		accuracy: 100,
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
	airslash: {
		inherit: true,
		accuracy: 100,
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
		desc: "Each Pokemon on the user's side restores 1/3 of its maximum HP, rounded half up, and has its status condition cured.",
		shortDesc: "User and allies: healed 1/3 max HP, status cured.",
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
		onTry(source) {
			if (source.hasAbility('comatose')) return;
			if (source.status === 'slp') return false;

			if (source.hp === source.maxhp) {
				this.add('-fail', source, 'heal');
				return null;
			}
			if (source.hasAbility(['insomnia', 'vitalspirit'])) {
				this.add('-fail', source, '[from] ability: ' + source.getAbility().name, '[of] ' + source);
				return null;
			}
		},
		onHit(target, source, move) {
			if (target.hasAbility('comatose')) {
				this.heal(target.maxhp);
				return;
			}
			const result = target.setStatus('slp', source, move);
			if (!result) return result;
			target.statusState.time = 3;
			target.statusState.startTime = 3;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
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
	barrage: {
		inherit: true,
		multihit: undefined,
		basePower: 90,
		shortDesc: "Deals damage. No additional effect.",
	},
	crabhammer: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, punch: 1},
	},
	crosschop: {
		inherit: true,
		accuracy: 90,
	},
	drumbeating: {
		inherit: true,
		category: "Special",
		basePower: 90,
		flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1},
	},
	defog: {
		inherit: true,
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({evasion: -1});
			if (!target.hasAbility(['clearbody', 'whitesmoke', 'fullmetalbody'])) {
				const removeTarget = [
					'reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				const removeAll = [
					'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge',
				];
				for (const targetCondition of removeTarget) {
					if (target.side.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', '[of] ' + source);
						success = true;
					}
				}
				for (const sideCondition of removeAll) {
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', '[of] ' + source);
						success = true;
					}
				}
				this.field.clearTerrain();
			}
			return success;
		},
	},
	mountaingale: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bite: 1},
	},
	electricterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Electric Terrain');
					}
					return false;
				}
			},
			onTryAddVolatile(status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					return null;
				}
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify(1.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
	},
	grassyterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify(1.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Grassy Terrain');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
				} else {
					this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`);
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Grassy Terrain');
			},
		},
	},
	psychicterrain: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
					return;
				}
				if (target.isSemiInvulnerable() || target.isAlly(source)) return;
				if (!target.isGrounded()) {
					const baseMove = this.dex.moves.get(effect.id);
					if (baseMove.priority > 0) {
						this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
					}
					return;
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify(1.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect, '[of] ' + source);
				} else {
					this.add('-fieldstart', 'move: Psychic Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Psychic Terrain');
			},
		},
	},
	ceaselessedge: {
		inherit: true,
		basePower: 40,
	},
	electroshot: {
		inherit: true,
		basePower: 75,
	},
	electroweb: {
		inherit: true,
		accuracy: 100,
	},
	flashcannon: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, pulse: 1, bullet: 1},
	},
	focusblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1, pulse: 1},
	},
	grassyglide: {
		inherit: true,
		basePower: 70,
	},
	hammerarm: {
		inherit: true,
		accuracy: 100,
		basePower: 110,
	},
	icehammer: {
		inherit: true,
		accuracy: 100,
		basePower: 110,
	},
	icywind: {
		inherit: true,
		accuracy: 100,
	},
	meteorbeam: {
		inherit: true,
		accuracy: 100,
	},
	moonblast: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1},
	},
	populationbomb: {
		inherit: true,
		accuracy: 95,
	},
	rocktomb: {
		inherit: true,
		accuracy: 100,
	},
	shadowpunch: {
		inherit: true,
		basePower: 70,
	},
	skittersmack: {
		inherit: true,
		accuracy: 100,
	},
	steamroller: {
		inherit: true,
		basePower: 95,
	},
	supercellslam: {
		inherit: true,
		accuracy: 100,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 3, source, source, this.dex.conditions.get('Supercell Slam'));
		},
	},
	throatchop: {
		inherit: true,
		condition: {
			duration: 3,
			onStart(target) {
				this.add('-start', target, 'Throat Chop', '[silent]');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['sound']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (!move.isZ && !move.isMax && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (!move.isZ && !move.isMax && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd(target) {
				this.add('-end', target, 'Throat Chop', '[silent]');
			},
		},
	},
	thunderwave: {
		inherit: true,
	},
	triplekick: {
		inherit: true,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		multihit: 3,
		multiaccuracy: true,
	},
	willowisp: {
		inherit: true,
	},
	pyroball: {
		inherit: true,
		flags: {protect: 1, mirror: 1, defrost: 1, bullet: 1, ball: 1},
	},
	electroball: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1, ball: 1},
	},
	energyball: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1, ball: 1},
	},
	gyroball: {
		inherit: true,
		flags: {contact: 1, protect: 1, mirror: 1, metronome: 1, bullet: 1, ball: 1},
	},
	mistball: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1, ball: 1},
	},
	shadowball: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1, ball: 1},
	},
	weatherball: {
		inherit: true,
		flags: {protect: 1, mirror: 1, metronome: 1, bullet: 1, ball: 1},
	},
	chatter: {
		inherit: true,
		basePower: 75,
	},
	multiattack: {
		inherit: true,
		onModifyType(move, pokemon) {
			const name = pokemon.species.name;
			if (!name.startsWith("Silvally-")) return;
			const type = name.substring(name.indexOf("-") + 1);
			move.type = type;
		},
	}
};
