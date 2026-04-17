export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	furycutter: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (!pokemon.volatiles['furycutter'] || move.hit === 1) {
				pokemon.addVolatile('furycutter');
			}
			const bp = this.clampIntRange(move.basePower * pokemon.volatiles['furycutter'].multiplier, 1, 200);
			this.debug(`BP: ${bp}`);
			return bp;
		},
		accuracy: 100,
		basePower: 50,
		shortDesc: "Power doubles with each hit, up to 200.",
	},
	leechlife: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, heal: 1, metronome: 1, bite: 1 },
		shortDesc: "User recovers 50% of the damage dealt.",
	},
	pinmissile: {
		inherit: true,
		accuracy: 90,
		pp: 15,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		shortDesc: "Hits 2-5 times in one turn.",
	},
	steamroller: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			const pokemonWeight = pokemon.getWeight();
			let bp;
			if (pokemonWeight >= targetWeight * 5) {
				bp = 120;
			} else if (pokemonWeight >= targetWeight * 4) {
				bp = 100;
			} else if (pokemonWeight >= targetWeight * 3) {
				bp = 80;
			} else if (pokemonWeight >= targetWeight * 2) {
				bp = 60;
			} else {
				bp = 40;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		basePower: 0,
		pp: 10,
		shortDesc: "More power the heavier the user than the target.",
	},
	twineedle: {
		inherit: true,
		basePower: 45,
		flags: { protect: 1, mirror: 1, metronome: 1, contact: 1 },
		critRatio: 2,
		shortDesc: "Hits 2 times. Each hit has 20% chance to poison. High critical hit ratio.",
	},
	uturn: {
		inherit: true,
		basePower: 50,
		shortDesc: "User switches out after damaging the target.",
	},
	xscissor: {
		inherit: true,
		critRatio: 2,
		shortDesc: "High critical hit ratio.",
	},
	silktrap: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.boost({ spe: -2 }, source, target, this.dex.getActiveMove("Silk Trap"));
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap"));
				}
			},
		},
		shortDesc: "Protects from damaging attacks. Contact: -2 Spe.",
	},
	beatup: {
		inherit: true,
		basePowerCallback: undefined,
		multihit: [2, 5],
		accuracy: 90,
		basePower: 25,
		pp: 15,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1, contact: 1, punch: 1 },
		shortDesc: "Hits 2-5 times in one turn.",
	},
	falsesurrender: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (pokemon.hp < target.hp) {
				return this.chainModify(2);
			}
		},
		accuracy: 100,
		basePower: 70,
		shortDesc: "Power doubles if user has less remaning HP than the target.",
	},
	feintattack: {
		inherit: true,
		accuracy: 100,
		basePower: 50,
		pp: 10,
		flags: { contact: 1, mirror: 1, metronome: 1 },
		shortDesc: "Bypasses protection without breaking it; power doubles if protection is bypassed.",
	},
	honeclaws: {
		inherit: true,
		volatileStatus: 'honeclaws',
		condition: {
			duration: 4,
			onBasePowerPriority: 19,
			onBasePower(basePower, attacker, defender, move) {
				if (move.flags['slicing']) {
					this.debug('Sharpness/Hone Claws boost');
					return this.chainModify(1.5);
				}
			},
		},
		shortDesc: "Raises the user's Attack and accuracy by 1. User gains the effects of Sharpness for 3 Turns.",
	},
	knockoff: {
		inherit: true,
		basePower: 50,
		shortDesc: "1.5x damage if target holds an item. Removes item.",
	},
	payback: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			if (this.queue.willMove(target)) {
				return 50;
			}
			this.debug('BP doubled');
			return 100;
		},
		basePower: 60,
		shortDesc: "Power doubles if the user moves after the target. Includes Switching in.",
	},
	suckerpunch: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, punch: 1 },
		shortDesc: "Usually goes first. Fails if target is not attacking.",
	},
	wickedtorque: {
		inherit: true,
		volatileStatus: 'torment',
		basePower: 100,
		pp: 5,
		shortDesc: "Torments the opposing Pokemon until it switches out.",
	},
	nightdaze: {
		inherit: true,
		secondary: undefined,
		self: {
			boosts: {
				accuracy: -1,
			},
		},
		accuracy: 90,
		basePower: 110,
		pp: 5,
		shortDesc: "Lowers the user's Accuracy by 1.",
	},
	obstruct: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		shortDesc: "Protects from damaging attacks. Contact: -2 Def.",
	},
	smokescreen: {
		inherit: true,
		onHit(target, source, move) {
			let success = false;
			const removeAll = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist'];
			for (const side of this.sides) {
				for (const sideCondition of removeAll) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name, '[from] move: Smokescreen', `[of] ${source}`);
						success = true;
					}
				}
			}
			success ||= this.field.clearTerrain();
			return success;
		},
		type: "Dark",
		shortDesc: "Removes terrain/screens.",
	},
	snatch: {
		inherit: true,
		priority: 5,
		shortDesc: "User steals certain support moves to use itself.",
	},
	dragonhammer: {
		inherit: true,
		accuracy: 90,
		basePower: 100,
		pp: 10,
		shortDesc: "Lowers the user's Speed by 1.",
	},
	dragonrush: {
		inherit: true,
		accuracy: 80,
		shortDesc: "20% chance to make the target flinch.",
	},
	scaleshot: {
		inherit: true,
		pp: 15,
		shortDesc: "Hits 2-5 times. User: -1 Def, +1 Spe after last hit.",
	},
	spacialrend: {
		inherit: true,
		self: {
			volatileStatus: 'magiccoat',
		},
		shortDesc: "This Turn: This Pokemon blocks certain Status moves and bounces them back to the user.",
	},
	roaroftime: {
		inherit: true,
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'roaroftime',
				source,
				moveData: {
					id: 'roaroftime',
					name: "Roar of Time",
					accuracy: 100,
					basePower: 130,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, metronome: 1, futuremove: 1, sound: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Dragon',
				},
			});
			this.add('-start', source, 'move: Roar of Time');
			return this.NOT_FAIL;
		},
		accuracy: 100,
		basePower: 130,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1, sound: 1 },
		shortDesc: "Hits two turns after being used.",
	},
	boltbeak: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Bolt Beak damage boost');
				return move.basePower * 1.5;
			}
			this.debug('Bolt Beak NOT boosted');
			return move.basePower;
		},
		shortDesc: "Power is 1.5x if user moves before the target.",
	},
	doubleshock: {
		inherit: true,
		basePower: 130,
		shortDesc: "User's Electric type: typeless; must be Electric.",
	},
	spark: {
		inherit: true,
		basePower: 60,
		shortDesc: "30% chance to paralyze the target.",
	},
	supercellslam: {
		inherit: true,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 4, source, source, this.dex.conditions.get('Supercell Slam'));
		},
		pp: 10,
		shortDesc: "User is hurt by 25% of its max HP if it misses.",
	},
	thunderouskick: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, kick: 1 },
		type: "Electric",
		shortDesc: "100% chance to lower the target's Def by 1.",
	},
	chargebeam: {
		inherit: true,
		secondary: undefined,
		self: {
			volatileStatus: 'charge',
		},
		shortDesc: "User gains the Charge effect.",
	},
	charge: {
		inherit: true,
		condition: {
			onStart(pokemon, source, effect) {
				if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
					this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name);
				} else {
					this.add('-start', pokemon, 'Charge');
				}
			},
			onRestart(pokemon, source, effect) {
				if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
					this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name);
				} else {
					this.add('-start', pokemon, 'Charge');
				}
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.type === 'Electric' && move.id !== 'charge' && move.id !== 'chargebeam') {
					pokemon.removeVolatile('charge');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.type === 'Electric' && move.id !== 'charge' && move.id !== 'chargebeam') {
					pokemon.removeVolatile('charge');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Charge', '[silent]');
			},
		},
	},
	electrodrift: {
		inherit: true,
		recoil: [1, 4],
		shortDesc: "Deals 1.3333x damage with supereffective hits. Has 25% recoil.",
	},
	electroshot: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (['raindance', 'primordialsea'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				attacker.addVolatile('mustrecharge');
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		basePower: 120,
		shortDesc: "Raises Sp. Atk by 1, hits turn 2. Rain: no charge, but recharge after.",
	},
	paraboliccharge: {
		inherit: true,
		drain: [3, 4],
		basePower: 50,
		pp: 10,
		shortDesc: "User recovers 75% of the damage dealt.",
	},
	shockwave: {
		inherit: true,
		priority: 1,
		accuracy: 100,
		basePower: 40,
		pp: 30,
		flags: { protect: 1, mirror: 1, metronome: 1, pulse: 1 },
		shortDesc: "Usually goes first.",
	},
	wildboltstorm: {
		inherit: true,
		basePower: 120,
		shortDesc: "20% chance to paralyze foe(s). Can't miss in rain.",
	},
	flash: {
		inherit: true,
		pseudoWeather: 'flash',
		condition: {
			duration: 5,
			onFieldStart(target, source) {
				this.add('-fieldstart', 'move: Flash', `[of] ${source}`);
			},
			onFieldEnd() {
				this.add('-fieldend', 'move: Flash', '[of] ' + this.effectState.source);
			},
			onSourceModifyAccuracy(accuracy) {
				if (typeof accuracy === 'number') {
					return this.chainModify(1.2);
				}
			},
		},
		pp: 10,
		type: "Electric",
		shortDesc: "For 5 Turns, moves have 1.2x accuracy.",
	},
	covet: {
		inherit: true,
		type: "Fairy",
		shortDesc: "If the user has no item, it steals the target's.",
	},
	hyperdrill: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (pokemon.hasAbility('sheerforce')) return;
			if (pokemon.hasAbility('serenegrace') || this.randomChance(1, 2)) {
				move.type = 'Dragon';
			}
		},
		hasSheerForce: true,
		type: "Fairy",
		shortDesc: "50% chance to be treated as a Dragon-Type attack.",
	},
	magicaltorque: {
		inherit: true,
		self: {
			sideCondition: 'safeguard',
		},
		pp: 5,
		shortDesc: "For 5 turns, protects user´s party from status.",
	},
	disarmingvoice: {
		inherit: true,
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Disarming Voice', `[of] ${source}`);
				}
			}
		},
		basePower: 50,
		shortDesc: "1.5x damage if target holds an item. Removes item.",
	},
	drainingkiss: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, heal: 1, metronome: 1, bite: 1 },
		shortDesc: "User recovers 75% of the damage dealt.",
	},
	mistyexplosion: {
		inherit: true,
		basePower: 150,
		flags: { protect: 1, mirror: 1, metronome: 1, heat: 1 },
		shortDesc: "Hits adjacent Pokemon. The user faints. User on Misty Terrain: 1.5x power.",
	},
	moonblast: {
		inherit: true,
		accuracy: 85,
		basePower: 105,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		shortDesc: "30% chance to lower the target's Sp. Atk by 1.",
	},
	springtidestorm: {
		inherit: true,
		secondary: {
			chance: 20,
			status: 'psn',
		},
		onModifyMove(move, pokemon, target) {
			if (!target) return;
			if (['raindance', 'primordialsea', 'sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		basePower: 120,
		pp: 10,
		shortDesc: "20% chance to poison foe(s). Can't miss in rain or sun.",
	},
	aromaticmist: {
		inherit: true,
		boosts: {
			spa: 1,
			spd: 1,
		},
		pp: 10,
		shortDesc: "Raises an ally's Sp.Atk and Sp.Def by 1.",
	},
	flowershield: {
		inherit: true,
		onHitField(t, source, move) {
			const targets: Pokemon[] = [];
			for (const pokemon of this.getAllActive()) {
				if (
					pokemon.hasType('Grass') &&
					(!pokemon.volatiles['maxguard'] ||
						this.runEvent('TryHit', pokemon, source, move))
				) {
					// This move affects every Grass-type Pokemon in play.
					targets.push(pokemon);
				}
			}
			let success = false;
			for (const target of targets) {
				success = this.boost({ def: 1, spd: 1 }, target, source, move) || success;
			}
			return success;
		},
		shortDesc: "Raises Def and Sp.Def of all active Grass types by 1.",
	},
	geomancy: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.species.id === 'xerneasneutral') {
				attacker.formeChange('xerneas', null, true);
				return this.NOT_FAIL;
			}
			if (!attacker.species.id.startsWith('xerneas')) return null;
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		shortDesc: "If Xerneas-Neutral: Changes Form to Xerneas-Active. If Xerneas-Active: Charges, then raises SpA, SpD, Spe by 2 turn 2.",
	},
	armthrust: {
		inherit: true,
		accuracy: 90,
		basePower: 25,
		pp: 15,
		shortDesc: "Hits 2-5 times in one turn.",
	},
	axekick: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (target.hp * 2 <= target.maxhp) {
				return this.chainModify(2);
			}
		},
		accuracy: 100,
		basePower: 70,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "Power doubles if the target's HP is 50% or less.",
	},
	closecombat: {
		inherit: true,
		basePower: 110,
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
	collisioncourse: {
		inherit: true,
		recoil: [1, 4],
		shortDesc: "Deals 1.3333x damage with supereffective hits. Has 25% recoil.",
	},
	combattorque: {
		inherit: true,
		self: {
			volatileStatus: 'combattorque',
		},
		condition: {
			duration: 2,
			onBasePower(basePower, pokemon, target) {
				return this.chainModify(1.3);
			},
		},
		pp: 5,
		shortDesc: "This Pokemon´s next move has it´s power multiplied by 1.3x.",
	},
	crosschop: {
		inherit: true,
		secondary: {
			chance: 10,
			boosts: {
				def: -1,
			},
		},
		shortDesc: "10% chance to lower the target's Defense by 1. High critical hit ratio.",
	},
	doublekick: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "Hits 2 times in one turn.",
	},
	focuspunch: {
		inherit: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['focuspunch']?.lostFocus && !pokemon.hasAbility('innerfocus')) {
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return true;
			}
		},
		shortDesc: "Fails if the user takes damage before it hits.",
	},
	highjumpkick: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1, kick: 1 },
		shortDesc: "User is hurt by 50% of its max HP if it misses.",
	},
	jumpkick: {
		inherit: true,
		recoil: [1, 4],
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1, kick: 1 },
		shortDesc: "User is hurt by 25% of its max HP if it misses.",
	},
	lowkick: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "More power the heavier the target.",
	},
	lowsweep: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "100% chance to lower the target's Speed by 1.",
	},
	meteorassault: {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (!target || target.fainted) return;
			source.addVolatile('mustrecharge');
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!target || target.volatiles['meteorassault']) return;
			source.addVolatile('mustrecharge');
		},
		self: undefined,
		condition: {
			duration: 1,
		},
		basePower: 130,
		shortDesc: "Can't move next turn if target or sub is not KOed.",
	},
	rocksmash: {
		inherit: true,
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (target.hasType('Rock')) target.addVolatile('rocksmash');
			},
		},
		condition: {
			duration: 2,
			onSourceModifyDamage(damage, source, target, move) {
				return this.chainModify(2);
			},
		},
		basePower: 60,
		shortDesc: "If the target is Rock-Type, it takes 2x damage from the next attack.",
	},
	rollingkick: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "30% chance to make the target flinch.",
	},
	smellingsalts: {
		inherit: true,
		basePower: 80,
		type: "Fighting",
		shortDesc: "Power doubles if target is paralyzed, and cures it.",
	},
	strength: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			let ratio = Math.floor(pokemon.getStat('atk') / target.getStat('atk'));
			if (!isFinite(ratio)) ratio = 0;
			let bp = 40;
			if (ratio >= 2.5) bp = 120;
			else if (ratio >= 2) bp = 100;
			else if (ratio >= 1.66) bp = 80;
			else if (ratio >= 1.33) bp = 60;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		basePower: 0,
		pp: 10,
		type: "Fighting",
		shortDesc: "More power the more attack the user has than the target.",
	},
	submission: {
		inherit: true,
		accuracy: 100,
		basePower: 90,
		pp: 15,
		shortDesc: "Has 1/4 recoil.",
	},
	superpower: {
		inherit: true,
		basePower: 130,
		shortDesc: "Lowers the user's Attack and Defense by 1.",
	},
	triplearrows: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			return (2 ** (move.hit - 1)) * 10;
		},
		secondaries: undefined,
		multihit: 3,
		multiaccuracy: true,
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		accuracy: 90,
		basePower: 10,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		shortDesc: "Hits 3 times. Each hit can miss, but power rises. 50% Chance to lower target's Def by 1.",
	},
	triplekick: {
		inherit: true,
		basePower: 20,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "Hits 3 times. Each hit can miss, but power rises.",
	},
	upperhand: {
		inherit: true,
		priority: 4,
		shortDesc: "100% flinch. Fails unless target using priority.",
	},
	wakeupslap: {
		inherit: true,
		basePower: 80,
		shortDesc: "Power doubles if target is asleep, and cures it.",
	},
	vacuumwave: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, pulse: 1 },
		shortDesc: "Usually goes first.",
	},
	detect: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		shortDesc: "Prevents moves from affecting the user this turn.",
	},
	blazekick: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1, heat: 1 },
		shortDesc: "High critical hit ratio. 10% chance to burn.",
	},
	blazingtorque: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			let ratio = Math.floor(pokemon.getStat('spe') / target.getStat('spe'));
			if (!isFinite(ratio)) ratio = 0;
			let bp = 100;
			if (ratio >= 2) bp = 120;
			else if (!this.queue.willMove(target)) bp = 80;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		basePower: 100,
		pp: 5,
		flags: {
			protect: 1,
			failencore: 1,
			failmefirst: 1,
			nosleeptalk: 1,
			noassist: 1,
			failcopycat: 1,
			failmimic: 1,
			failinstruct: 1,
			nosketch: 1,
			heat: 1,
		},
		shortDesc: "If this Pokemon moves after the opponent: 80 BP, if this Pokemon is at least twice as fast as the target: 120 BP",
	},
	flamewheel: {
		inherit: true,
		priority: 1,
		basePower: 40,
		pp: 30,
		flags: { contact: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1, heat: 1 },
		shortDesc: "Usually goes first.",
	},
	pyroball: {
		inherit: true,
		flags: { protect: 1, mirror: 1, defrost: 1, bullet: 1, kick: 1, heat: 1 },
		shortDesc: "10% chance to burn the target. Thaws user.",
	},
	sacredfire: {
		inherit: true,
		basePower: 90,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1, heat: 1 },
		shortDesc: "50% chance to burn the target. Thaws user.",
	},
	armorcannon: {
		inherit: true,
		basePower: 110,
		flags: { protect: 1, mirror: 1, pulse: 1, heat: 1 },
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
	fierywrath: {
		inherit: true,
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		flags: { protect: 1, mirror: 1, heat: 1 },
		type: "Fire",
		shortDesc: "100% chance to lower the target's Atk by 1.",
	},
	flameburst: {
		inherit: true,
		onHit(target, source, move) {
			if (move.hasBounced) return;
			for (const ally of target.adjacentAllies()) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (move.hasBounced) return;
			for (const ally of target.adjacentAllies()) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1, heat: 1 },
		shortDesc: "Also deals half damage to allied Pokemon of the target.",
	},
	heatwave: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (!target) return;
			if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		basePower: 100,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1, heat: 1 },
		shortDesc: "10% chance to burn the foe(s); Can't miss in Sun.",
	},
	inferno: {
		inherit: true,
		basePower: 120,
		flags: { protect: 1, mirror: 1, metronome: 1, heat: 1 },
		shortDesc: "100% chance to burn the target.",
	},
	shelltrap: {
		inherit: true,
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('shelltrap');
		},
		onTryMove(pokemon) {
			if (!pokemon.volatiles['shelltrap']?.gotHit) {
				this.attrLastMove('[still]');
				this.add('cant', pokemon, 'Shell Trap', 'Shell Trap');
				return null;
			}
		},
		onModifyMove(move, pokemon, target) {
			if (pokemon.volatiles['shelltrap']?.gotContact) {
				move.willCrit = true;
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Shell Trap');
			},
			onHit(pokemon, source, move) {
				if (!pokemon.isAlly(source)) {
					this.effectState.gotHit = true;
					this.effectState.gotContact = this.checkMoveMakesContact(move, source, pokemon);
					const action = this.queue.willMove(pokemon);
					if (action) {
						this.queue.prioritizeAction(action);
					}
				}
			},
		},
		basePower: 110,
		flags: { protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, heat: 1 },
		shortDesc: "User must take damage by an attack before moving; Always results in a critical hit if said attack made contact.",
	},
	burningbulwark: {
		inherit: true,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		shortDesc: "Protects from damaging attacks. Contact: Burn.",
	},
	sunnyday: {
		inherit: true,
		pp: 10,
		shortDesc: "For 5 turns, intense sunlight powers Fire moves.",
	},
	willowisp: {
		inherit: true,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, heat: 1 },
		shortDesc: "Burns the target. Fire types can't miss.",
	},
	aerialace: {
		inherit: true,
		priority: 1,
		accuracy: 100,
		basePower: 40,
		pp: 30,
		shortDesc: "Usually goes first.",
	},
	beakblast: {
		inherit: true,
		shortDesc: "Burns on contact with the user before it moves.",
	},
	dragonascent: {
		inherit: true,
		basePower: 110,
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
	drillpeck: {
		inherit: true,
		critRatio: 2,
		shortDesc: "High critical hit ratio.",
	},
	fly: {
		inherit: true,
		accuracy: 100,
		basePower: 100,
		shortDesc: "Flies up on first turn, then strikes the next turn.",
	},
	skydrop: {
		inherit: true,
		basePower: 80,
		shortDesc: "User and foe fly up turn 1. Damages on turn 2.",
	},
	airslash: {
		inherit: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		shortDesc: "20% chance to make the target flinch.",
	},
	bleakwindstorm: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea', 'intensehail'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		secondary: {
			chance: 20,
			status: 'frz',
		},
		basePower: 120,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1, cold: 1 },
		shortDesc: "20% chance to frostbite foe(s). Can't miss in rain or hail.",
	},
	chatter: {
		inherit: true,
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (target && target.positiveBoosts() > 0) {
					target.addVolatile('torment');
				}
			},
		},
		basePower: 80,
		pp: 10,
		shortDesc: "100% Torment if target has a positive change to their stat stages.",
	},
	razorwind: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			attacker.addVolatile('focusenergy'); // okay or custom for 1 round?
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		basePower: 100,
		flags: { charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1, slicing: 1 },
		type: "Flying",
		shortDesc: "Raises user's critical hit ratio by 2 on turn 1. Hits turn 2.",
	},
	defog: {
		inherit: true,
		target: "all",
		onHit: undefined,
		onHitField(target, source, move) {
			let success = false;
			this.sides.flatMap(s => s.active).forEach(pokemon => {
				if (!pokemon.volatiles['substitute'] || move.infiltrates)
					success = !!this.boost({ evasion: -1 }, pokemon, source, move);
			});
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard',
				'mist', 'spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge', 'stealthcoal'];
			for (const targetCondition of removeTarget) {
				for (const side of this.sides) {
					if (side.removeSideCondition(targetCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${source}`);
						success = true;
					}
				}
			}
			this.field.clearTerrain();
			return success;
		},
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1, wind: 1 },
		shortDesc: "-1 evasion; removes hazards/terrain/screens.",
	},
	astonish: {
		inherit: true,
		priority: 4,
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || move.priority >= 0) {
				return false;
			}
		},
		basePower: 65,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		shortDesc: "100% flinch. Fails unless target using negative priority.",
	},
	lastrespects: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			return 25 + 25 * pokemon.side.totalFainted;
		},
		basePower: 25,
		shortDesc: "+25 power for each time a party member fainted. Max 5.",
	},
	ragefist: {
		inherit: true,
		basePowerCallback(pokemon) {
			return Math.min(350, 50 + 50 * pokemon.timesAttacked);
		},
		shortDesc: "+25 power for each time user was hit. Max 6 hits.",
	},
	shadowpunch: {
		inherit: true,
		basePower: 80,
		pp: 15,
		shortDesc: "This move does not check accuracy.",
	},
	bittermalice: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'frz') {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		secondary: {
			chance: 50,
			status: 'frz',
		},
		basePower: 60,
		flags: { protect: 1, mirror: 1, metronome: 1, cold: 1 },
		shortDesc: "50% frostbite. 2x power if target is already frostbiten.",
	},
	infernalparade: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'brn') {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		secondary: {
			chance: 50,
			status: 'brn',
		},
		pp: 10,
		flags: { protect: 1, mirror: 1, metronome: 1, heat: 1 },
		shortDesc: "50% burn. 2x power if target is already burned.",
	},
	moongeistbeam: {
		inherit: true,
		flags: { protect: 1, mirror: 1, cantusetwice: 1 },
		basePower: 120,
		shortDesc: "Cannot be selected the turn after it's used. Ignores the Abilities of other Pokemon.",
	},
	bulletseed: {
		inherit: true,
		accuracy: 90,
		pp: 15,
		shortDesc: "Hits 2-5 times in one turn.",
	},
	drumbeating: {
		inherit: true,
		flags: { protect: 1, mirror: 1, sound: 1 },
		shortDesc: "100% chance to lower the target's Speed by 1.",
	},
	ivycudgel: {
		inherit: true,
		critRatio: 1,
		shortDesc: "Type depends on user's form.",
	},
	needlearm: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'psn',
		},
		basePower: 90,
		pp: 10,
		shortDesc: "30% chance to poison the target.",
	},
	seedbomb: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.getVolatile('leechseed')) return move.basePower * 2;
			return move.basePower;
		},
		onHit(target) {
			target.removeVolatile('leechseed');
		},
		pp: 10,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1, heat: 1 },
		shortDesc: "Power doubles if the target has Leech Seed attached, and removes them.",
	},
	snaptrap: {
		inherit: true,
		basePower: 80,
		flags: { contact: 1, protect: 1, mirror: 1, bite: 1 },
		shortDesc: "Traps and damages the target for 4-5 turns.",
	},
	tropkick: {
		inherit: true,
		basePower: 80,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "100% chance to lower the target's Attack by 1.",
	},
	barrage: {
		inherit: true,
		accuracy: 90,
		basePower: 25,
		category: "Special",
		pp: 15,
		type: "Grass",
		shortDesc: "Hits 2-5 times in one turn.",
	},
	leaftornado: {
		inherit: true,
		secondary: {
			chance: 30,
			boosts: { spe: -1 },
		},
		accuracy: 80,
		basePower: 110,
		pp: 5,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		shortDesc: "30% Chance to lower the targets speed by 1.",
	},
	magicalleaf: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		accuracy: 100,
		basePower: 65,
		pp: 10,
		shortDesc: "Power doubles if the target has a status ailment.",
	},
	matchagotcha: {
		inherit: true,
		onEffectiveness(typeMod, target, type) {
			if (type === 'Ice') return 1;
		},
		flags: { protect: 1, mirror: 1, defrost: 1, heal: 1, metronome: 1, heat: 1 },
		shortDesc: "20% burn. Recovers 50% dmg dealt. Thaws foe(s). Super Effective on Ice.",
	},
	megadrain: {
		inherit: true,
		basePower: 60,
		shortDesc: "User recovers 50% of the damage dealt.",
	},
	syrupbomb: {
		inherit: true,
		basePower: 80,
		shortDesc: "Target's Speed is lowered by 1 stage for 3 turns.",
	},
	ingrain: {
		inherit: true,
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 7,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 8);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut(pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
		shortDesc: "Traps/grounds user; heals 1/8 max HP per turn.",
	},
	junglehealing: {
		inherit: true,
		onHit(pokemon, target, move) {
			let success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			this.add('-activate', pokemon, 'move: Aromatherapy');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== pokemon && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('sapsipper')) {
						this.add('-immune', ally, '[from] ability: Sap Sipper');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
					if (ally.volatiles['substitute'] && !move.infiltrates) continue;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		pp: 5,
		shortDesc: "User and allies: healed 1/4 max HP. Party: status cured.",
	},
	spikyshield: {
		inherit: true,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.damage(source.baseMaxhp / 8, source, target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.damage(source.baseMaxhp / 8, source, target);
				}
			},
		},
		shortDesc: "Protects from damaging attacks. Contact: loses 1/8 max HP.",
	},
	bonerush: {
		inherit: true,
		pp: 15,
		shortDesc: "Hits 2-5 times in one turn.",
	},
	bonemerang: {
		inherit: true,
		accuracy: 100,
		shortDesc: "Hits 2 times in one turn.",
	},
	dig: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (['sandstorm'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail' || type == 'glacialstorm') return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
		basePower: 100,
		pp: 15,
		shortDesc: "Digs underground turn 1, strikes turn 2; no charge in Sand.",
	},
	headlongrush: {
		inherit: true,
		basePower: 110,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		shortDesc: "Lowers the user's Defense and Sp. Def by 1.",
	},
	landswrath: {
		inherit: true,
		basePower: 110,
		shortDesc: "No additional effect. Hits adjacent foes.",
	},
	stompingtantrum: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "Power doubles if the user's last move failed.",
	},
	thousandarrows: {
		inherit: true,
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Ground') return;
			if (!target) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the target is Flying type and immune to Ground
			if (!target.runImmunity('Ground')) {
				return this.dex.getEffectiveness('Ground', target.types.filter(itm => itm !== 'Flying'));
			}
		},
		shortDesc: "Grounds adjacent foes. First hit neutral against opposing Flying-Typing.",
	},
	mudbomb: {
		inherit: true,
		secondary: undefined,
		onHit(target, source, move) {
			if (move.hasBounced) return;
			for (const ally of target.adjacentAllies()) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (move.hasBounced) return;
			for (const ally of target.adjacentAllies()) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		accuracy: 100,
		basePower: 70,
		shortDesc: "Also deals half damage to allied Pokemon of the target.",
	},
	mudslap: {
		inherit: true,
		pseudoWeather: 'mudsport',
		basePower: 40,
		pp: 20,
		shortDesc: "Casts Mud Sport.",
	},
	sandsearstorm: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea', 'sandstorm'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		thawsTarget: true,
		onEffectiveness(typeMod, target, type) {
			if (type === 'Ice') return 1;
		},
		basePower: 120,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1, heat: 1 },
		shortDesc: "20% chance to burn the foe(s). Can't miss in rain or sand. Thaws foe(s). Super effective on Ice.",
	},
	scorchingsands: {
		inherit: true,
		onEffectiveness(typeMod, target, type) {
			if (type === 'Ice') return 1;
		},
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1, heat: 1 },
		shortDesc: "30% chance to burn the target. Thaws target. Super effective on Ice.",
	},
	sandattack: {
		inherit: true,
		boosts: undefined,
		target: "self",
		onHit(target) {
			const type = 'Ground';
			if (target.hasType(type) || !target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
		pp: 20,
		shortDesc: "Changes the target's type to Ground.",
	},
	avalanche: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, cold: 1 },
		shortDesc: "Power doubles if user is damaged by the target.",
	},
	iceball: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			const iceballData = pokemon.volatiles['iceball'];
			if (iceballData?.hitCount) {
				bp *= 2 ** iceballData.contactHitCount;
			}
			if (iceballData && pokemon.status !== 'slp') {
				iceballData.hitCount++;
				iceballData.contactHitCount++;
				const curSpe = pokemon.boosts.spe;
				this.boost({ spe: 1 }, pokemon, pokemon);
				if (!iceballData.spe) iceballData.spe = 0;
				if (curSpe !== pokemon.boosts.spe) iceballData.spe--;
				if (iceballData.hitCount < 5) {
					iceballData.duration = 2;
				}
			}
			if (pokemon.volatiles['defensecurl']) {
				bp *= 2;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		condition: {
			duration: 1,
			onLockMove: 'iceball',
			onStart() {
				this.effectState.hitCount = 0;
				this.effectState.contactHitCount = 0;
			},
			onResidual(target) {
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['iceball'];
				}
			},
			onEnd(target) {
				if (this.effectState.spe)
					this.boost({ spe: this.effectState.spe }, target, target);
			},
		},
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1, bullet: 1, noparentalbond: 1, cold: 1 },
		shortDesc: "Power doubles with each hit. Repeats for 5 turns. Increases Speed by 1 stage for each consecutive hit. Resets Speed upon ending.",
	},
	iciclecrash: {
		inherit: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		flags: { protect: 1, mirror: 1, metronome: 1, cold: 1 },
		shortDesc: "20% chance to make the target flinch.",
	},
	iciclespear: {
		inherit: true,
		accuracy: 90,
		pp: 15,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1, cold: 1 },
		shortDesc: "Hits 2-5 times in one turn.",
	},
	tripleaxel: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1, cold: 1 },
		shortDesc: "Hits 3 times. Each hit can miss, but power rises.",
	},
	aurorabeam: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			const sideConditions = Object.keys(pokemon.side.sideConditions);
			if (
				sideConditions.includes('reflect') ||
				sideConditions.includes('lightscreen') ||
				sideConditions.includes('auroraveil')
			) {
				return move.basePower * 2;
			}
			return move.basePower;
		},
		pp: 10,
		flags: { protect: 1, mirror: 1, metronome: 1, cold: 1 },
		shortDesc: "Power doubles if Reflect/Light Screen/Aurora Veil are up for user's side.",
	},
	freezedry: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'frz',
		},
		pp: 10,
		flags: { protect: 1, mirror: 1, metronome: 1, cold: 1 },
		shortDesc: "30% chance to frostbite. Super effective on Water.",
	},
	freezingglare: {
		inherit: true,
		secondary: {
			chance: 100,
			boosts: { spd: -1 },
		},
		flags: { protect: 1, mirror: 1, cold: 1 },
		type: "Ice",
		shortDesc: "100% chance to lower the target's Sp. Def by 1.",
	},
	glaciate: {
		inherit: true,
		secondary: {
			chance: 50,
			status: 'frz',
		},
		target: 'normal',
		accuracy: 95,
		basePower: 90,
		pp: 5,
		flags: { protect: 1, mirror: 1, metronome: 1, cold: 1, wind: 1 },
		shortDesc: "50% chance to frostbite the target.",
	},
	bind: {
		inherit: true,
		basePower: 35,
		pp: 15,
		shortDesc: "Traps and damages the target for 4-5 turns.",
	},
	chipaway: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			if (target.hp * 2 <= target.maxhp) {
				return this.chainModify(2);
			}
		},
		pp: 10,
		shortDesc: "Power doubles if the target's HP is 50% or less.",
	},
	crushgrip: {
		inherit: true,
		basePowerCallback(pokemon, target) {
			const targetHeight = target.heightm;
			let bp = 40;
			if (targetHeight <= 0.3) {
				bp = 150;
			} else if (targetHeight <= 0.5) {
				bp = 120;
			} else if (targetHeight <= 1.0) {
				bp = 100;
			} else if (targetHeight <= 1.5) {
				bp = 80;
			} else if (targetHeight <= 2.0) {
				bp = 60;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		pp: 10,
		shortDesc: "More power the smaller the target.",
	},
	explosion: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1, heat: 1 },
		shortDesc: "Hits adjacent Pokemon. The user faints.",
	},
	furyswipes: {
		inherit: true,
		accuracy: 90,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		shortDesc: "Hits 2-5 times in one turn.",
	},
	headbutt: {
		inherit: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		shortDesc: "20% chance to make the target flinch.",
	},
	hyperfang: {
		inherit: true,
		basePower: 90,
		shortDesc: "10% chance to make the target flinch.",
	},
	megakick: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
		shortDesc: "No additional effect.",
	},
	payday: {
		inherit: true,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({ atk: 3 }, pokemon, pokemon, move);
		},
		basePower: 60,
		shortDesc: "Raises user's Attack by 3 if this KOes the target.",
	},
	present: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			const rand = this.random(4);
			if (rand === 0) {
				move.heal = [1, 4];
				move.infiltrates = true;
			} else if (rand === 1) {
				move.basePower = 60;
			} else if (rand === 2) {
				move.basePower = 100;
			} else {
				move.basePower = 140;
			}
		},
		shortDesc: "60, 100, 140 power, or heals target 1/4 max HP.",
	},
	ragingbull: {
		inherit: true,
		basePower: 100,
		shortDesc: "Destroys screens. Type depends on user's form.",
	},
	selfdestruct: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1, heat: 1 },
		shortDesc: "Hits adjacent Pokemon. The user faints.",
	},
	stomp: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1, kick: 1 },
		shortDesc: "30% chance to make the target flinch.",
	},
	tailslap: {
		inherit: true,
		accuracy: 90,
		pp: 15,
		shortDesc: "Hits 2-5 times in one turn.",
	},
	bloodmoon: {
		inherit: true,
		basePower: 120,
		shortDesc: "Cannot be selected the turn after it's used.",
	},
	eggbomb: {
		inherit: true,
		onTryHit(target, source, move) {
			if (source.isAlly(target)) {
				move.basePower = 0;
				move.infiltrates = true;
			}
		},
		onTryMove(source, target, move) {
			if (source.isAlly(target) && source.volatiles['healblock']) {
				this.attrLastMove('[still]');
				this.add('cant', source, 'move: Heal Block', move);
				return false;
			}
		},
		onHit(target, source, move) {
			if (source.isAlly(target)) {
				if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
					return this.NOT_FAIL;
				}
			}
		},
		accuracy: 100,
		category: "Special",
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1, heat: 1 },
		shortDesc: "If the target is an ally, heals 50% of its max HP.",
	},
	revelationdance: {
		inherit: true,
		basePower: 100,
		pp: 10,
		shortDesc: "Type varies based on the user's primary type.",
	},
	swift: {
		inherit: true,
		priority: 1,
		accuracy: 100,
		basePower: 40,
		pp: 30,
		shortDesc: "Usually goes first.",
	},
	acupressure: {
		inherit: true,
		onHit(target) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (target.boosts[stat] < 6 && stat !== "evasion" && stat !== "accuracy") {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
		shortDesc: "Raises a random stat of the user or an ally by 2 (not acc/eva).",
	},
	batonpass: {
		inherit: true,
		shortDesc: "User switches, passing anything but stat changes.",
	},
	doodle: {
		inherit: true,
		onHit(target, source, move) {
			Object.keys(source.volatiles).filter(v => v.startsWith("ability:")).forEach(v => {
				source.removeVolatile(v);
			});
			source.addVolatile("ability:" + target.ability);
		},
		shortDesc: "User and ally gains target's Ability in addition to their own.",
	},
	doubleteam: {
		inherit: true,
		boosts: undefined,
		volatileStatus: 'doubleteam',
		condition: {
			duration: 2,
			onInvulnerability(target, source, move) {
				if (this.effectState.duration === 1) return false;
			},
		},
		pp: 10,
		shortDesc: "Prevents damaging moves from affecting the user during the next turn.",
	},
	endure: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		shortDesc: "User survives attacks this turn with at least 1 HP.",
	},
	helpinghand: {
		inherit: true,
		priority: 6,
		flags: { bypasssub: 1, noassist: 1, failcopycat: 1, contact: 1 },
		shortDesc: "One adjacent ally's move power is 1.5x this turn.",
	},
	holdhands: {
		inherit: true,
		priority: 6,
		volatileStatus: 'holdhands',
		condition: {
			duration: 1,
			onSourceModifyDamage(damage, source, target, move) {
				this.debug('HoldHands neutralize');
				return this.chainModify(2, 3);
			},
		},
		pp: 20,
		flags: { bypasssub: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, contact: 1 },
		shortDesc: "Moves used against one adjacent ally have 0.67x Power this turn.",
	},
	maxguard: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		shortDesc: "Protects user from moves & Max Moves this turn.",
	},
	minimize: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		volatileStatus: 'minimize',
		condition: {
			duration: 1,
			onInvulnerability(target, source, move) {
				if (!move.flags["contact"]) return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (!move.flags["contact"]) return;
				this.damage(damage / 4, source, target);
				return this.chainModify(1, 4);
			},
		},
		shortDesc: "This turn, any non-contact moves used against the user will miss. Contact moves hit through this for 25% original damage, but deal an equal amount of recoil.",
	},
	protect: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		shortDesc: "Prevents moves from affecting the user this turn.",
	},
	rage: {
		inherit: true,
		target: "self",
		volatileStatus: 'rage',
		condition: {
			onDamagingHit(damage, target, source, effect) {
				this.boost({ atk: 1 });
			},
		},
		category: "Status",
		flags: { protect: 1, mirror: 1, metronome: 1 },
		shortDesc: "Raises the user's Attack by 1 if hit until switching out.",
	},
	shedtail: {
		inherit: true,
		onHit(target) {
			this.directDamage(Math.ceil(target.maxhp * 3 / 4));
		},
		onTryHit(source) {
			if (!this.canSwitch(source.side) || source.volatiles['commanded']) {
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
			if (source.volatiles['substitute']) {
				this.add('-fail', source, 'move: Shed Tail');
				return this.NOT_FAIL;
			}
			if (source.hp <= Math.ceil(source.maxhp * 3 / 4)) {
				this.add('-fail', source, 'move: Shed Tail', '[weak]');
				return this.NOT_FAIL;
			}
		},
		shortDesc: "User takes 3/4 its max HP to pass a substitute.",
	},
	crosspoison: {
		inherit: true,
		onModifyMove(move, pokemon, target) {
			if (target && ['psn', 'tox'].includes(target.status)) return 5;
		},
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		shortDesc: "Always crits if target is poisoned.",
	},
	direclaw: {
		inherit: true,
		secondary: {
			chance: 30,
			onHit(target, source) {
				const result = this.random(2);
				if (result === 0) {
					target.trySetStatus('frz', source);
				} else {
					target.trySetStatus('par', source);
				}
			},
		},
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		shortDesc: "30% chance to frostbite or paralyze target.",
	},
	gunkshot: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		shortDesc: "30% chance to poison the target.",
	},
	noxioustorque: {
		inherit: true,
		secondary: {
			chance: 100,
			volatileStatus: 'taunt',
		},
		pp: 5,
		shortDesc: "Target can´t use status moves for the next 3 turns.",
	},
	poisonjab: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, punch: 1 },
		shortDesc: "30% chance to poison the target.",
	},
	poisontail: {
		inherit: true,
		secondary: undefined,
		critRatio: 1,
		accuracy: 90,
		basePower: 100,
		pp: 10,
		shortDesc: "No additional effect.",
	},
	belch: {
		inherit: true,
		flags: {
			protect: 1,
			failmefirst: 1,
			nosleeptalk: 1,
			noassist: 1,
			failcopycat: 1,
			failmimic: 1,
			failinstruct: 1,
			sound: 1,
		},
		shortDesc: "Cannot be selected until the user eats a Berry.",
	},
	sludgebomb: {
		inherit: true,
		basePower: 80,
		shortDesc: "30% chance to poison the target.",
	},
	smog: {
		inherit: true,
		secondary: {
			chance: 100,
			status: 'psn',
		},
		accuracy: 100,
		basePower: 20,
		shortDesc: "100% chance to poison the target.",
	},
	acidarmor: {
		inherit: true,
		pp: 15,
		shortDesc: "Raises the user's Defense by 2.",
	},
	banefulbunker: {
		inherit: true,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('psn', target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('psn', target);
				}
			},
		},
		shortDesc: "Protects from damaging attacks. Contact: Poison.",
	},
	toxicthread: {
		inherit: true,
		status: 'tox',
		boosts: undefined,
		volatileStatus: 'toxicthread',
		condition: {
			onTrapPokemon(pokemon) {
				if (this.effectState.source?.isActive) pokemon.tryTrap();
			},
			onSourceModifyMove(move) {
				move.critRatio = 5;
			},
		},
		shortDesc: "Badly poisons the target and prevents it from switching out; any move used against it will result in a critical hit.",
	},
	confusion: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.volatiles['confusion']) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		basePower: 65,
		pp: 10,
		shortDesc: "Power doubles if the target is confused.",
	},
	eeriespell: {
		inherit: true,
		pp: 10,
		shortDesc: "Removes 3 PP from the target's last move.",
	},
	extrasensory: {
		inherit: true,
		overrideOffensivePokemon: 'target',
		basePower: 95,
		pp: 15,
		shortDesc: "Uses target's Sp. Attack stat in damage calculation.",
	},
	hyperspacehole: {
		inherit: true,
		onModifyMove(move, source) {
			if (!source.volatiles['hyperspacehole']) {
				move.accuracy = true;
				delete move.flags['contact'];
			}
		},
		onMoveFail(target, source) {
			if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
				source.removeVolatile('hyperspacehole');
				source.removeVolatile('twoturnmove');
				if (target === this.effectState.target) {
					this.add('-end', target, 'Hyperspace Hole', '[interrupt]');
				}
			}
		},
		onTry(source, target) {
			return !target.fainted;
		},
		onTryHit(target, source, move) {
			if (source.removeVolatile(move.id)) {
				if (target !== source.volatiles['twoturnmove'].source) return false;
			} else {
				if (target.volatiles['substitute'] || target.isAlly(source)) {
					return false;
				}
				this.add('-prepare', source, move.name, target);
				source.addVolatile('twoturnmove', target);
				return null;
			}
		},
		onHit(target, source) {
			if (target.hp) this.add('-end', target, 'Hyperspace Hole');
		},
		condition: {
			duration: 2,
			onAnyDragOut(pokemon) {
				if (pokemon === this.effectState.target || pokemon === this.effectState.source) return false;
			},
			onFoeTrapPokemonPriority: -15,
			onFoeTrapPokemon(defender) {
				if (defender !== this.effectState.source) return;
				defender.trapped = true;
			},
			onFoeBeforeMovePriority: 12,
			onFoeBeforeMove(attacker, defender, move) {
				if (attacker === this.effectState.source) {
					attacker.activeMoveActions--;
					this.debug('Hyperspace Hole nullifying.');
					return null;
				}
			},
			onRedirectTargetPriority: 99,
			onRedirectTarget(target, source, source2) {
				if (source !== this.effectState.target) return;
				if (this.effectState.source.fainted) return;
				return this.effectState.source;
			},
			onAnyInvulnerability(target, source, move) {
				if (target !== this.effectState.target && target !== this.effectState.source) {
					return;
				}
				if (source === this.effectState.target && target === this.effectState.source) {
					return;
				}
				return false;
			},
			onFaint(target) {
				if (target.volatiles['hyperspacehole'] && target.volatiles['twoturnmove'].source) {
					this.add('-end', target.volatiles['twoturnmove'].source, 'Hyperspace Hole', '[interrupt]');
				}
			},
		},
		basePower: 100,
		shortDesc: "User and foe disappear turn 1. Damages on turn 2.",
	},
	lusterpurge: {
		inherit: true,
		basePower: 85,
		pp: 10,
		shortDesc: "50% chance to lower the target's Sp. Def by 1.",
	},
	mistball: {
		inherit: true,
		basePower: 85,
		pp: 10,
		shortDesc: "50% chance to lower the target's Sp. Atk by 1.",
	},
	mysticalpower: {
		inherit: true,
		accuracy: 100,
		shortDesc: "100% chance to raise the user's Sp. Atk by 1.",
	},
	psychicnoise: {
		inherit: true,
		basePower: 65,
		shortDesc: "For 2 turns, the target is prevented from healing; This effect is reapplied, even if it was already active.",
	},
	psywave: {
		inherit: true,
		damageCallback: undefined,
		priority: 1,
		basePower: 40,
		flags: { protect: 1, mirror: 1, metronome: 1, pulse: 1 },
		shortDesc: "Usually goes first.",
	},
	synchronoise: {
		inherit: true,
		onTryImmunity(target, source) {
			if (target.hasType('Dark')) return;
			this.effectState.isImmune = !target.hasType(source.getTypes());
			return !this.effectState.isImmune;
		},
		onAfterMoveSecondary(target, source, move) {
			if (this.effectState.isImmune) {
				this.effectState.isImmune = false;
				this.add('-start', target, 'typechange', '[from] move: Synchronoise', `[of] ${source}`);
				target.setType(source.types);
			}
		},
		flags: { protect: 1, mirror: 1, metronome: 1, sound: 1 },
		shortDesc: "Hits adjacent Pokemon sharing the user's type. If target does not take damage due to not having the same type as user, change targets typing to the users typing after damage would be dealt.",
	},
	twinbeam: {
		inherit: true,
		multihit: undefined,
		priority: 1,
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move.isExternal)
				this.queue.insertChoice({
					choice: 'move',
					moveid: move.id,
					targetLoc: source.getLocOf(target),
					pokemon: source,
					priority: -1,
					externalMove: true,
				}, true);
		},
		shortDesc: "Hits 2 times in one turn; First hit usually goes first, second hit usually goes last.",
	},
	lunarblessing: {
		inherit: true,
		onHit(pokemon, target, move) {
			let success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			this.add('-activate', pokemon, 'move: Aromatherapy');
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== pokemon && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
					if (ally.volatiles['substitute'] && !move.infiltrates) continue;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		shortDesc: "User and allies: healed 1/4 max HP. Party: status cured.",
	},
	magiccoat: {
		inherit: true,
		priority: 5,
		shortDesc: "Bounces back certain non-damaging moves.",
	},
	meditate: {
		inherit: true,
		boosts: {
			atk: 1,
			spd: 1,
		},
		pp: 20,
		shortDesc: "Raises the user's Atk and Sp. Def by 1.",
	},
	rockblast: {
		inherit: true,
		pp: 15,
		shortDesc: "Hits 2-5 times in one turn.",
	},
	rockclimb: {
		inherit: true,
		secondary: {
			chance: 20,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		accuracy: 100,
		basePower: 80,
		pp: 15,
		type: "Rock",
		shortDesc: "20% chance raise the user's Def by 1.",
	},
	rockslide: {
		inherit: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		shortDesc: "20% chance to make the foe(s) flinch.",
	},
	rockwrecker: {
		inherit: true,
		onTry(target, source, move) {
			source.addVolatile('rockwrecker');
		},
		onAfterMove(target, source, move) {
			source.removeVolatile('rockwrecker');
		},
		condition: {
			onDamagingHit(damage, target, source, move) {
				if (!target.hp) {
					this.damage(target.getUndynamaxedHP(damage), source, target);
				}
			},
		},
		self: undefined,
		basePower: 120,
		shortDesc: "If this move KOs another Pokemon, user loses an equal amount of HP.",
	},
	rollout: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			const iceballData = pokemon.volatiles['rollout'];
			if (iceballData?.hitCount) {
				bp *= 2 ** iceballData.contactHitCount;
			}
			if (iceballData && pokemon.status !== 'slp') {
				iceballData.hitCount++;
				iceballData.contactHitCount++;
				const curSpe = pokemon.boosts.spe;
				this.boost({ spe: 1 }, pokemon, pokemon);
				if (!iceballData.spe) iceballData.spe = 0;
				if (curSpe !== pokemon.boosts.spe) iceballData.spe--;
				if (iceballData.hitCount < 5) {
					iceballData.duration = 2;
				}
			}
			if (pokemon.volatiles['defensecurl']) {
				bp *= 2;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		condition: {
			duration: 1,
			onLockMove: 'iceball',
			onStart() {
				this.effectState.hitCount = 0;
				this.effectState.contactHitCount = 0;
			},
			onResidual(target) {
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['rollout'];
				}
			},
			onEnd(target) {
				if (this.effectState.spe)
					this.boost({ spe: this.effectState.spe }, target, target);
			},
		},
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1, noparentalbond: 1, bullet: 1 },
		shortDesc: "Power doubles with each hit. Repeats for 5 turns. Increases Speed by 1 stage for each consecutive hit. Resets Speed upon ending.",
	},
	cut: {
		inherit: true,
		accuracy: 100,
		basePower: 75,
		pp: 15,
		type: "Steel",
		shortDesc: "No additional effect.",
	},
	gigatonhammer: {
		inherit: true,
		onEffectiveness(typeMod, target, type) {
			if (type === 'Steel') return 1;
		},
		shortDesc: "Cannot be selected the turn after it's used. Super effective on Steel.",
	},
	ironhead: {
		inherit: true,
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		shortDesc: "20% chance to make target flinch.",
	},
	irontail: {
		inherit: true,
		secondary: undefined,
		accuracy: 90,
		pp: 10,
		shortDesc: "No additional effect.",
	},
	smartstrike: {
		inherit: true,
		accuracy: 100,
		shortDesc: "Power doubles if the target's HP is 50% or less.",
	},
	sunsteelstrike: {
		inherit: true,
		flags: { contact: 1, protect: 1, mirror: 1, cantusetwice: 1 },
		basePower: 120,
		shortDesc: "Cannot be selected the turn after it's used. Ignores the Abilities of other Pokemon.",
	},
	flashcannon: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, pulse: 1, bullet: 1 },
		shortDesc: "10% chance to lower the target's Sp. Def by 1.",
	},
	magnetbomb: {
		inherit: true,
		target: 'normal',
		smartTarget: true,
		multihit: [2, 5],
		basePower: 25,
		category: "Special",
		shortDesc: "Hits 2-5 times in one turn. Doubles: Tries to alternate hits between each foe, starting with the target; no accuracy check.",
	},
	mirrorshot: {
		inherit: true,
		overrideOffensiveStat: 'spd',
		secondary: undefined,
		accuracy: 100,
		basePower: 80,
		shortDesc: "Uses user's Sp.Def stat as Sp.Atk in damage calculation.",
	},
	strangesteam: {
		inherit: true,
		self: {
			sideCondition: 'luckychant',
		},
		accuracy: 100,
		basePower: 80,
		flags: { protect: 1, mirror: 1, wind: 1 },
		type: "Steel",
		shortDesc: "For 5 turns, shields user's party from critical hits.",
	},
	autotomize: {
		inherit: true,
		onHit(pokemon) {
			if (pokemon.weighthg > 1) {
				pokemon.weighthg = Math.max(1, Math.floor(pokemon.weighthg / 2));
				this.add('-start', pokemon, 'Autotomize');
			}
		},
		shortDesc: "Raises the user's Speed by 2; user's weight is halved.",
	},
	kingsshield: {
		inherit: true,
		priority: 5,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
		shortDesc: "Protects from damaging attacks. Contact: -1 Atk.",
	},
	shelter: {
		inherit: true,
		boosts: undefined,
		onHit(target, source, move) {
			if (target.hasType('steel')) {
				target.addVolatile('shelter');
			} else {
				target.addType('steel');
			}
		},
		condition: {
			onDragOutPriority: 1,
			onDragOut(pokemon) {
				this.add('-activate', pokemon, 'move: Shelter');
				return null;
			},
		},
		shortDesc: "User cannot be forced to switch out if Steel; else adds Steel to the user's type(s).",
	},
	aquatail: {
		inherit: true,
		basePower: 100,
		shortDesc: "No additional effect.",
	},
	crabhammer: {
		inherit: true,
		basePower: 110,
		shortDesc: "High critical hit ratio.",
	},
	dive: {
		inherit: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			if (attacker.hasAbility('gulpmissile') && attacker.species.name === 'Cramorant' && !attacker.transformed) {
				const forme = attacker.hp <= attacker.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				attacker.formeChange(forme, move);
			}
			this.add('-prepare', attacker, move.name);
			if (['raindance', 'primordialsea'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail' || type === 'glacialstorm') return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
		basePower: 100,
		pp: 15,
		shortDesc: "Dives underwater turn 1, strikes turn 2; no charge in Rain.",
	},
	fishiousrend: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Fishious Rend damage boost');
				return move.basePower * 1.5;
			}
			this.debug('Fishious Rend NOT boosted');
			return move.basePower;
		},
		shortDesc: "Power is 1.5x if user moves before the target.",
	},
	spikecannon: {
		inherit: true,
		accuracy: 90,
		basePower: 25,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		type: "Water",
		shortDesc: "Hits 2-5 times in one turn.",
	},
	brine: {
		inherit: true,
		basePower: 70,
		shortDesc: "Power doubles if the target's HP is 50% or less.",
	},
	chillingwater: {
		inherit: true,
		flags: { protect: 1, mirror: 1, cold: 1 },
		shortDesc: "100% chance to lower the target's Attack by 1",
	},
	muddywater: {
		inherit: true,
		secondType: 'Ground',
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Ground', type);
		},
		accuracy: 95,
		secondary: undefined,
		shortDesc: "Combines Ground in its type effectiveness.",
	},
	flyingpress: {
		inherit: true,
		secondType: 'Flying',
	},
	octazooka: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'tox',
		},
		accuracy: 90,
		basePower: 85,
		shortDesc: "30% chance to badly poison the target.",
	},
	scald: {
		inherit: true,
		onEffectiveness(typeMod, target, type) {
			if (type === 'Ice') return 1;
		},
		basePower: 70,
		pp: 10,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1, heat: 1 },
		shortDesc: "30% chance to burn the target. Thaws target. Super effective on Ice.",
	},
	snipeshot: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (!("hit" in effect)) return;
			if (target.getMoveHitData(effect).crit) {
				this.debug('SnipeShot boost');
				return this.chainModify(1.5);
			}
		},
		basePower: 60,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		shortDesc: "High critical hit ratio, critical damage is multiplied by 1.5x. Cannot be redirected.",
	},
	sparklingaria: {
		inherit: true,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'brn') {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		basePower: 80,
		shortDesc: "Power doubles if target is burned, and cures it.",
	},
	steameruption: {
		inherit: true,
		onEffectiveness(typeMod, target, type) {
			if (type === 'Ice') return 1;
		},
		flags: { protect: 1, mirror: 1, defrost: 1, heat: 1 },
		shortDesc: "30% chance to burn the target. Thaws target. Super effective on Ice.",
	},
	watergun: {
		inherit: true,
		pseudoWeather: 'watersport',
		pp: 20,
		shortDesc: "Casts Water Sport.",
	},
	aquaring: {
		inherit: true,
		volatileStatus: undefined,
		sideCondition: 'aquaring',
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 8);
			},
		},
		shortDesc: "For 5 Turns, allies recover 1/8 max HP per turn.",
	},
	lifedew: {
		inherit: true,
		heal: [1, 3],
		shortDesc: "Heals the user and its allies by 1/3 their max HP.",
	},
	raindance: {
		inherit: true,
		pp: 10,
		shortDesc: "For 5 turns, heavy rain powers Water moves.",
	},
	ember: {
		inherit: true,
		basePower: 20,
		pp: 20,
		flags: { protect: 1, mirror: 1, metronome: 1, heat: 1 },
		secondary: {
			chance: 100,
			status: 'brn',
		},
		shortDesc: "100% chance to burn the target.",
	},
	powdersnow: {
		inherit: true,
		basePower: 20,
		pp: 20,
		flags: { protect: 1, mirror: 1, metronome: 1, cold: 1, powder: 1 },
		secondary: {
			chance: 100,
			status: 'frz',
		},
		shortDesc: "100% chance to frostbite the target.",
	},
	incinerate: {
		inherit: true,
		flags: { protect: 1, mirror: 1, metronome: 1, heat: 1 },
		onHit(target, source, move) {
			const otherHazards = ['spikes', 'toxicspikes', 'stickyweb', 'gmaxsteelsurge', 'stealthcoal'];
			const side = target.side;
			const hadStealthRock = side.removeSideCondition('stealthrock');
			for (const hazard of otherHazards) {
				if (side.removeSideCondition(hazard)) {
					this.add('-sideend', side, this.dex.conditions.get(hazard).name, '[from] move: Incinerate', `[of] ${source}`);
				}
			}
			if (hadStealthRock) {
				this.add('-sideend', side, 'Stealth Rock', '[from] move: Incinerate', `[of] ${source}`);
				side.addSideCondition('stealthcoal');
			}
		},
		shortDesc: "Removes target's side hazards, if Stealth Rock is removed, sets Stealth Coal.",
	},
	relicsong: {
		inherit: true,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.willChangeForme) {
				const meloettaForme = pokemon.species.id === 'meloettapirouette' ? '' : '-Pirouette';
				pokemon.formeChange('Meloetta' + meloettaForme, this.effect, false, '0', '[msg]');
			}
		},
	},
	snowscape: {
		inherit: true,
		weather: 'hail',
	},
	chillyreception: {
		inherit: true,
		weather: 'hail',
	},
	spitup: {
		inherit: true,
		onAfterMove(pokemon) {
			if (!pokemon.hasAbility("gluttony")) {
				pokemon.removeVolatile('stockpile');
				return;
			}
			const data = pokemon.volatiles['stockpile'];
			if (!data) return;
			data.layers -= 1;
			if (data.layers < 1) {
				pokemon.removeVolatile('stockpile');
			} else {
				if (this.effectState.layers < 1) return;
				this.effectState.layers--;
				this.add('-start', pokemon, 'stockpile' + this.effectState.layers);
				const curDef = pokemon.boosts.def;
				const curSpD = pokemon.boosts.spd;
				this.boost({ def: -1, spd: -1 }, pokemon, pokemon);
				if (curDef !== pokemon.boosts.def) this.effectState.def++;
				if (curSpD !== pokemon.boosts.spd) this.effectState.spd++;
			}
		},
	},
	swallow: {
		inherit: true,
		onAfterMove(pokemon) {
			if (!pokemon.hasAbility("gluttony")) {
				pokemon.removeVolatile('stockpile');
				return;
			}
			const data = pokemon.volatiles['stockpile'];
			if (!data) return;
			data.layers -= 1;
			if (data.layers < 1) {
				pokemon.removeVolatile('stockpile');
			} else {
				if (this.effectState.layers < 1) return;
				this.effectState.layers--;
				this.add('-start', pokemon, 'stockpile' + this.effectState.layers);
				const curDef = pokemon.boosts.def;
				const curSpD = pokemon.boosts.spd;
				this.boost({ def: -1, spd: -1 }, pokemon, pokemon);
				if (curDef !== pokemon.boosts.def) this.effectState.def++;
				if (curSpD !== pokemon.boosts.spd) this.effectState.spd++;
			}
		},
	},
	stockpile: {
		inherit: true,
		volatileStatus: 'stockpile',
		condition: {
			noCopy: true,
			onStart(target) {
				this.effectState.layers = 1;
				this.effectState.def = 0;
				this.effectState.spd = 0;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onRestart(target) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const curDef = target.boosts.def;
				const curSpD = target.boosts.spd;
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onEnd(target) {
				if (this.effectState.def || this.effectState.spd) {
					const boosts: SparseBoostsTable = {};
					if (this.effectState.def) boosts.def = this.effectState.def;
					if (this.effectState.spd) boosts.spd = this.effectState.spd;
					this.boost(boosts, target, target);
				}
				this.add('-end', target, 'Stockpile');
				if (this.effectState.def !== this.effectState.layers * -1 || this.effectState.spd !== this.effectState.layers * -1) {
					this.hint("In Gen 7, Stockpile keeps track of how many times it successfully altered each stat individually.");
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Tough",
	},
	wish: {
		inherit: true,
		condition: {
			onStart(pokemon, source) {
				this.effectState.hp = source.maxhp / 2;
				this.effectState.startingTurn = this.getOverflowedTurnCount();
				this.effectState.rounds = source.hasAbility('stall') ? 1 : 0;
				if (this.effectState.startingTurn === 255) {
					this.hint(`In Gen 8+, Wish will never resolve when used on the ${this.turn}th turn.`);
				}
			},
			onResidualOrder: 4,
			onResidual(target: Pokemon) {
				if (this.getOverflowedTurnCount() - this.effectState.rounds <= this.effectState.startingTurn) return;
				target.side.removeSlotCondition(this.getAtSlot(this.effectState.sourceSlot), 'wish');
			},
			onEnd(target) {
				if (target && !target.fainted) {
					const damage = this.heal(this.effectState.hp, target, target);
					if (damage) {
						this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + this.effectState.source.name);
					}
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Cute",
	},
	rest: {
		inherit: true,
		onTry(source) {
			if (source.status === 'slp' || source.hasAbility('comatose') || source.hasAbility('fullmetalbody') || source.hasItem('brightpowder')) return false;
			if (source.hp === source.maxhp) {
				this.add('-fail', source, 'heal');
				return null;
			}
			// insomnia and vital spirit checks are separate so that the message is accurate in multi-ability mods
			if (source.hasAbility('insomnia')) {
				this.add('-fail', source, '[from] ability: Insomnia', `[of] ${source}`);
				return null;
			}
			if (source.hasAbility('vitalspirit')) {
				this.add('-fail', source, '[from] ability: Vital Spirit', `[of] ${source}`);
				return null;
			}
		},
	},
	craftyshield: {
		inherit: true,
		onTry: undefined,
	},
	matblock: {
		inherit: true,
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Mat Block only works on your first turn out.");
				return false;
			}
		},
	},
	quickguard: {
		inherit: true,
		onPrepareHit(pokemon) {
			return this.runEvent('StallMove', pokemon);
		},
	},
	wideguard: {
		inherit: true,
		onTry: undefined,
	},
	stealthrock: {
		inherit: true,
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots') ||
					pokemon.hasAbility('solidfooting') ||
					(this.format.id.includes('mnm') && (pokemon.hasAbility('shielddust')))) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				let factor;
				if (typeMod <= 0) {
					factor = (2 ** typeMod) / 8;
				} else if (typeMod === 1) {
					factor = 1 / 6;
				} else {
					factor = 1 / 4;
				}
				this.damage(pokemon.maxhp * factor);
			},
		},
	},
	substitute: {
		inherit: true,
		condition: {
			onStart(target, source, effect) {
				if (effect?.id === 'shedtail') {
					this.add('-start', target, 'Substitute', '[from] move: Shed Tail');
				} else {
					this.add('-start', target, 'Substitute');
				}
				this.effectState.hp = Math.floor(target.maxhp / 4);
				if (target.volatiles['partiallytrapped']) {
					this.add('-end', target, target.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
					delete target.volatiles['partiallytrapped'];
				}
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub'] || move.infiltrates) {
					return;
				}
				let damage = this.actions.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp as number;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					if (move.ohko) this.add('-ohko');
					target.addVolatile('meteorassault');
					target.removeVolatile('substitute');
				} else {
					this.add('-activate', target, 'move: Substitute', '[damage]');
				}
				if (move.recoil || move.id === 'chloroblast') {
					this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.singleEvent('AfterSubDamage', move, null, target, source, move, damage);
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return this.HIT_SUBSTITUTE;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
	},
	healblock: {
		inherit: true,
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (effect?.name === "Psychic Noise") {
					return 2;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
					return 7;
				}
				return 5;
			},
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Heal Block');
				source.moveThisTurnResult = true;
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['heal']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 20,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal(damage, target, source, effect) {
				if (effect && (effect.id === 'zpower' || (effect as Move).isZ)) return damage;
				if (source && target !== source && target.hp !== target.maxhp && effect.name === "Pollen Puff") {
					this.attrLastMove('[still]');
					// FIXME: Wrong error message, correct one not supported yet
					this.add('cant', source, 'move: Heal Block', effect);
					return null;
				}
				return false;
			},
			onRestart(target, source, effect) {
				if (effect?.name === 'Psychic Noise') {
					this.effectState.duration = 2;
					return;
				}
				this.add('-fail', target, 'move: Heal Block'); // Succeeds to supress downstream messages
				if (!source.moveThisTurnResult) {
					source.moveThisTurnResult = false;
				}
			},
		},
	},
	blizzard: {
		inherit: true,
		onModifyMove(move) {
			if (this.field.isWeather(['hail', 'snowscape', 'glacialstorm'])) move.accuracy = true;
		},
	},
	auroraveil: {
		inherit: true,
		onTry() {
			return this.field.isWeather(['hail', 'snowscape', 'glacialstorm']);
		},
	},
	moonlight: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
			case 'glacialstorm':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	morningsun: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
			case 'glacialstorm':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	solarbeam: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowscape', 'glacialstorm'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	solarblade: {
		inherit: true,
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowscape'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
	},
	synthesis: {
		inherit: true,
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
			case 'glacialstorm':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
	},
	weatherball: {
		inherit: true,
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snowscape':
			case 'glacialstorm':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'snowscape':
			case 'glacialstorm':
				move.basePower *= 2;
				break;
			}
			this.debug(`BP: ${move.basePower}`);
		},
	},
};
