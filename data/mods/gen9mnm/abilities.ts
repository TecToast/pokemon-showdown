export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	snowwarning: {
		inherit: true,
		onStart(source) {
			this.field.setWeather('hail');
		},
	},
	chlorophyll: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Sun is active, this Pokemon's Speed is multiplied by 1.5x.",
	},
	swiftswim: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Rain is active, this Pokemon's Speed is multiplied by 1.5x.",
	},
	sandrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Sandstorm is active, this Pokemon's Speed is multiplied by 1.5x; immunity to Sandstorm.",
	},
	slushrush: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Snow is active, this Pokemon's Speed is multiplied by 1.5x.",
	},
	sandveil: {
		inherit: true,
		onModifyAccuracyPriority: undefined,
		onModifyAccuracy: undefined,
		onModifyDefPriority: 3,
		onModifyDef(atk, pokemon, source) {
			if (this.field.isWeather('sandstorm') && !source.hasItem('safetygoggles')) {
				return this.chainModify(1.25);
			}
		},
		shortDesc: "If Sandstorm is active, this Pokemon's Defense is 1.25x; immunity to Sandstorm.",
	},
	snowcloak: {
		inherit: true,
		onModifyAccuracyPriority: undefined,
		onModifyAccuracy: undefined,
		onModifySpDPriority: 3,
		onModifySpD(spd, pokemon, source) {
			if (this.field.isWeather(['hail', 'snowscape']) && !source.hasItem('safetygoggles')) {
				return this.chainModify(1.25);
			}
		},
		shortDesc: "If Snow is active, this Pokemon's Sp.Def is 1.25x.",
	},
	arenatrap: { // unchanged, ggfs an First Impression orientieren?
		inherit: true,
		onFoeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (source && source.activeMoveActions > 0) return;
			if (!pokemon.isAdjacent(this.effectState.target)) return;
			if (pokemon.isGrounded()) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (source.activeMoveActions > 0) return;
			if (pokemon.isGrounded(!pokemon.knownType)) { // Negate immunity if the type is unknown
				pokemon.maybeTrapped = true;
			}
		},
		shortDesc: "Prevents opposing Pokemon from choosing to switch out unless they are airborne. First turn out only.",
	},

	shadowtag: { // unchanged, selbes wie bei arenatrap
		inherit: true,
		onFoeTrapPokemon(pokemon, source) {
			if (pokemon.hasAbility('shadowtag')) return;
			if (!pokemon.isAdjacent(this.effectState.target)) return;
			if (source && source.activeMoveActions > 1) return;
			pokemon.tryTrap(true);
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (source && source.activeMoveActions > 1) return;
			if (!pokemon.hasAbility('shadowtag')) {
				pokemon.maybeTrapped = true;
			}
		},
		shortDesc: "Prevents foes from choosing to switch unless they also have this Ability. First turn out only.",
	},
	runaway: {
		inherit: true,
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
		shortDesc: "This Pokemon can not be made unable to switch out.",
	},
	battlearmor: {
		inherit: true,
		onModifySecondaries(secondaries) {
			this.debug('Battle Armor prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		shortDesc: "This Pokemon cannot be struck by a critical hit, also it is not affected by the secondary effect of another Pokemon's attack.",
	},
	shellarmor: {
		inherit: true,
		onModifySecondaries(secondaries) {
			this.debug('Shell Armor prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		shortDesc: "This Pokemon cannot be struck by a critical hit, also it is not affected by the secondary effect of another Pokemon's attack.",
	},
	poisontouch: {
		inherit: true,
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
			if (target.hasAbility('shielddust') ||
				target.hasItem('covertcloak') ||
				target.hasAbility('battlearmor') ||
				target.hasAbility('shellarmor')) return;
			if (this.checkMoveMakesContact(move, target, source)) {
				if (this.randomChance(3, 10)) {
					target.trySetStatus('psn', source);
				}
			}
		},
	},
	toxicchain: {
		inherit: true,
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Toxic Chain's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak') || target.hasAbility('battlearmor') ||
				target.hasAbility('shellarmor')) return;

			if (this.randomChance(3, 10)) {
				target.trySetStatus('tox', source);
			}
		},
	},
	anticipation: { // unchanged, kombi aus first impression und filter?
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0 && target.activeMoveActions <= 1) {
				this.debug('Anticipation neutralize');
				return this.chainModify(0.5);
			}
		},
		shortDesc: "On switch-in, this Pokemon shudders if any foe has a supereffective move. First Turn out; Takes 50% damage from super effective hits.",
	},
	forewarn: { // unchanged
		inherit: true,
		onStart(pokemon) {
			let warnMoves: (Move | Pokemon)[][] = [];
			let warnBp = 1;
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 150;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (bp === 1) bp = 80;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, target]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, target]);
					}
				}
			}
			if (!warnMoves.length) return;
			const [warnMoveName, warnTarget] = this.sample(warnMoves);
			this.add('-activate', pokemon, 'ability: Forewarn', warnMoveName, `[of] ${warnTarget}`);
			this.effectState.selectedMove = warnMoveName;
			this.effectState.selectedTarget = warnTarget;
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.name === this.effectState.selectedMove && source === this.effectState.selectedTarget) {
				this.debug('forewarn neutralize');
				return this.chainModify(0.5);
			}
		},
		shortDesc: "On switch-in, this Pokemon is alerted to the foes' move with the highest power, also it takes 50% damage from said move.",
	},
	lightmetal: {
		inherit: true,
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(0.75);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd) {
			return this.chainModify(0.75);
		},
		onModifySpePriority: 6,
		onModifySpe(spe) {
			return this.chainModify(1.5);
		},
		shortDesc: "This Pokemon's weight is halved, also its Def/Sp.Def is multiplied by 0.75x and Speed is multiplied by 1.5x.",
	},
	heavymetal: {
		inherit: true,
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(1.25);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd) {
			return this.chainModify(1.25);
		},
		onModifySpePriority: 6,
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		shortDesc: "This Pokemon's weight is doubled, also its Def/Sp.Def is multiplied by 1.25x and Speed is multiplied by 0.5x.",
	},
	corrosion: { // idk ob das so reicht, das ist freezedry, sonst noch scrappy für immunity ignore
		// Implemented in sim/pokemon.js:Pokemon#setStatus
		inherit: true,
		onFoeEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Poison') return;
			if (type === 'Steel') return 1;
		},
		onModifyMove(move, pokemon, target) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		shortDesc: "This Pokemon's poison type moves can hit a Pokemon regardless of their steel-typing, and are super effective on Steel.",
	},
	cutecharm: {
		inherit: true,
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Cute Charm', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spa: -1 }, target, pokemon, null, true);
				}
			}
		},
		onDamagingHit: undefined,
		shortDesc: "On switch-in, this Pokemon lowers the Sp.Atk. of opponents by 1 stage.",
	},
	damp: { // dmgreduction von recoilmoves von punkrock maybe?
		onAnyDamage(damage, source, target, effect) {
			if (['explosion', 'mindblown', 'mistyexplosion', 'selfdestruct', 'aftermath', 'recoil'].includes(effect.id)) {
				this.debug('damp neutralize');
				return this.chainModify(0.5);
			}
		},
		flags: { breakable: 1 },
		name: "Damp",
		rating: 0.5,
		num: 6,
		shortDesc: "Explosion/Misty Explosion/Self-Destruct/Aftermath and Recoil moves deal 0.5x damage while active.",
	},
	gluttony: { // stockpile consumption effect? genuinely no idea
		inherit: true,
		onStart(pokemon) {
			pokemon.abilityState.gluttony = true;
		},
		onDamage(item, pokemon) {
			pokemon.abilityState.gluttony = true;
		},
		shortDesc: "This Pokemon eats Berries at 1/2 max HP or less; Also it consumes only one layer of Stockpile per use of Spit Up/Swallow.",
	},
	heatproof: { // bitte nochmal bzgl move.flags checken, thanks
		inherit: true,
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.flags['heat']) {
				this.debug('Heatproof Atk weaken');
				return this.chainModify(0.33);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.flags['heat']) {
				this.debug('Heatproof SpA weaken');
				return this.chainModify(0.33);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 3;
			}
		},
		shortDesc: "Heat damage against this Pokemon is dealt with 1/3 offensive stat; 1/3 burn damage.",
	},
	honeygather: { // von leftovers kopiert, passt das so? ja
		inherit: true,
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		shortDesc: "At the end of every turn, this Pokemon restores 1/16 of its max HP.",
	},
	illuminate: { // unverändert reinkopiert, legit keine ahnung
		inherit: true,
		onStart(source) {
			this.field.addPseudoWeather('flash');
		},
		onTryBoost: undefined,
		onModifyMove: undefined,
		shortDesc: "On switch-in, this Pokemon summons Flash.",
	},
	innerfocus: {
		inherit: true,
		onModifyMove(move) {
			if (move.id === 'focusblast') {
				move.accuracy = true;
			}
		},
		onFoeInvulnerability() {
			return true;
		},
		shortDesc: "This Pokemon cannot be made to flinch, also its Focus Blast cannot miss and its Focus Punch cannot be interupted; Immune to Intimidate.",
	},
	keeneye: {
		inherit: true,
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
			}
		},
		shortDesc: "This Pokemon ignores the target's defensive stat increases.",
	},
	moody: {
		inherit: true,
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			let stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in pokemon.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 1;

			stats = [];
			let statMinus: BoostID;
			for (statMinus in pokemon.boosts) {
				if (statMinus === 'accuracy' || statMinus === 'evasion') continue;
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost, pokemon, pokemon);
		},
		shortDesc: "Boosts a random stat (not acc/eva) +1 and another stat -1 every turn.",
	},
	pickpocket: {
		inherit: true,
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-enditem', target, yourItem, '[silent]', '[from] move: Thief', `[of] ${source}`);
			this.add('-item', source, yourItem, '[from] move: Thief', `[of] ${target}`);
		},
		shortDesc: "If this Pokemon has no item and contact is made between it and an opponent, it steals their item.",
	},
	pickup: { // hab jetzt einfach den Hinweis auf adjacent entfernt
		inherit: true,
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.item) return;
			const pickupTargets = this.getAllActive().filter(target => (
				target.lastItem && target.usedItemThisTurn
			));
			if (!pickupTargets.length) return;
			const randomTarget = this.sample(pickupTargets);
			const item = randomTarget.lastItem;
			randomTarget.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] ability: Pickup');
			pokemon.setItem(item);
		},
		shortDesc: "If this Pokemon has no item, it finds one used by another Pokemon this turn.",
	},
	regenerator: {
		inherit: true,
		onBeforeSwitchOutPriority: 5,
		onBeforeSwitchOut(pokemon) {
			this.heal(pokemon.baseMaxhp / 3, pokemon);
		},
		onSwitchOut: undefined,
		shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, upon queuing a switch.",
	},
	rivalry: {
		inherit: true,
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.3);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.8);
				}
			}
		},
		shortDesc: "This Pokemon's attacks do 1.3x on same gender targets; 0.8x on opposite gender.",
	},
	stakeout: {
		inherit: true,
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(1.5);
			}
		},
		shortDesc: "This Pokemon's offensive stat is 1.5x against a target that switched in this turn.",
	},
	stench: { // red card mit contact halt
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && source.hp && target.hp && move && move.category !== 'Status' &&
				this.checkMoveMakesContact(move, source, target)) {
				if (!source.isActive || !this.canSwitch(source.side) || source.forceSwitchFlag || target.forceSwitchFlag) {
					return;
				}
				if (this.runEvent('DragOut', source, target, move)) {
					source.forceSwitchFlag = true;
				}
			}
		},
		shortDesc: "Pokemon making contact with this Pokemon are forced to switch to a random ally.",
	},
	superluck: { // crits weakenen muss noch rein
		inherit: true,
		onModifyCritRatio(critRatio) {
			return critRatio + 2;
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Super Luck nerf');
				return this.chainModify(5, 6);
			}
		},
		shortDesc: "This Pokemon's critical hit ratio is raised by 2 stages, but it's critical hits only deal 1.25x dmg.",
	},
	sweetveil: { // an sich wie immunity, nur der ally muss halt mit aufwachen
		inherit: true,
		onAllySetStatus(status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onStart(pokemon) {
			for (const ally of pokemon.alliesAndSelf()) {
				if (ally.status === 'slp') {
					this.add('-activate', pokemon, 'ability: Sweet Veil');
					ally.cureStatus();
				}
				ally.removeVolatile('yawn');
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Sweet Veil');
				pokemon.cureStatus();
			}
			pokemon.removeVolatile('yawn');
		},
		onAnySwitchIn() {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		shortDesc: "This Pokemon and its allies cannot fall asleep; Gaining this Ability while sleeping or having a sleeping ally cures it.",
	},
	synchronize: {
		inherit: true,
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp') return;
			this.add('-activate', target, 'ability: Synchronize');
			// Hack to make status-prevention abilities think Synchronize is a status move
			// and show messages when activating against it.
			source.trySetStatus(status, target, { status: status.id, id: 'synchronize' } as Effect);
		},
		shortDesc: "If another Pokemon burns/frostbites/poisons/paralyzes this Pokemon, it also gets that status.",
	},
	tangledfeet: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (pokemon.volatiles['confusion']) {
				return this.chainModify(2);
			}
		},
		shortDesc: "This Pokemon's Speed is doubled as long as it is confused.",
	},
	thickfat: {
		inherit: true,
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.flags['heat'] || move.flags['cold']) {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.flags['heat'] || move.flags['cold']) {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		shortDesc: "Temperature-based moves against this Pokemon deal damage with a halved offensive stat.",
	},
	turboblaze: {
		inherit: true,
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		onAnyModifyAtk(atk, source, target, move) {
			if (move.type === 'Fire') {
				return this.chainModify(1.2);
			}
		},
		onAnyModifySpA(atk, source, target, move) {
			if (move.type === 'Fire') {
				return this.chainModify(1.2);
			}
		},
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon. Fire Type attacks deal 1.2x dmg while this Pokemon is on the field.",
	},
	teravolt: {
		inherit: true,
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Teravolt');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		onAnyModifyAtk(atk, source, target, move) {
			if (move.type === 'Electric') {
				return this.chainModify(1.2);
			}
		},
		onAnyModifySpA(atk, source, target, move) {
			if (move.type === 'Electric') {
				return this.chainModify(1.2);
			}
		},
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon. Electric Type attacks deal 1.2x dmg while this Pokemon is on the field.",
	},
	protosynthesis: { // ich weiß nicht, ob es einen 'this.effectState.worstStat' gibt, aber ohne den ist das Spaghetti
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			// Protosynthesis is not affected by Utility Umbrella
			if (this.field.isWeather('sunnyday')) {
				pokemon.addVolatile('protosynthesis');
			} else if (!pokemon.volatiles['protosynthesis']?.fromBooster && !this.field.isWeather('sunnyday')) {
				pokemon.removeVolatile('protosynthesis');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['protosynthesis'];
			this.add('-end', pokemon, 'Protosynthesis', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Protosynthesis', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Protosynthesis');
				}
				this.effectState.bestStat = pokemon.getWorstStat(false, true);
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis atk boost');
				return this.chainModify(1.5);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis def boost');
				return this.chainModify(1.5);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spa boost');
				return this.chainModify(1.5);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spd boost');
				return this.chainModify(1.5);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Protosynthesis');
			},
		},
		flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Protosynthesis",
		rating: 3,
		num: 281,
		shortDesc: "This Pokemon's lowest stat is multiplied by 1.5x if Sunny Day or Booster Energy is active.",
	},
	quarkdrive: {
		inherit: true,
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				pokemon.addVolatile('quarkdrive');
			} else if (!pokemon.volatiles['quarkdrive']?.fromBooster) {
				pokemon.removeVolatile('quarkdrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['quarkdrive'];
			this.add('-end', pokemon, 'Quark Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Quark Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Quark Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spe boost');
				return this.chainModify([5325, 4096]);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Quark Drive');
			},
		},
		shortDesc: "This Pokemon's highest stat is multiplied by 1.3x if Electric Terrain or Booster Energy is active.",
	},
	plus: { // effektiv tut es ja das von daher mach ich das mal so
		inherit: true,
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('minus')) {
					return this.chainModify(2.25);
				}
			}
		},
		shortDesc: "If an active ally has the Minus Ability, both Pokemon's Sp.Atk is 1.5x.",
	},
	minus: {
		inherit: true,
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility('plus')) {
					return this.chainModify(2.25);
				}
			}
		},
		shortDesc: "If an active ally has the Plus Ability, both Pokemon's Sp.Atk is 1.5x.",
	},
	screencleaner: {
		inherit: true,
		onStart(pokemon) {
			let activated = false;
			for (const sideCondition of ['reflect', 'lightscreen', 'auroraveil']) {
				for (const side of [pokemon.side, ...pokemon.side.foeSidesWithConditions()]) {
					if (side.getSideCondition(sideCondition)) {
						if (!activated) {
							this.add('-activate', pokemon, 'ability: Screen Cleaner');
							activated = true;
						}
						side.removeSideCondition(sideCondition);
					}
				}
			}
			const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			for (const sideCondition of removeAll) {
				for (const side of this.sides)
					if (side.removeSideCondition(sideCondition)) {
						if (!activated) {
							this.add('-activate', pokemon, 'ability: Screen Cleaner');
							activated = true;
						}
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${pokemon}`);
					}
			}
			if (this.field.terrain !== '') {
				if (!activated) {
					this.add('-activate', pokemon, 'ability: Screen Cleaner');
					activated = true;
				}
				this.field.clearTerrain();
			}
		},
		shortDesc: "On switch-in, this Pokemon removes Entry-Hazards, Terrains and Screens of both sides.",
	},
	stall: {
		inherit: true,
		onFractionalPriority: undefined,
		shortDesc: "This Pokemon's Future Sight, Doom Desire, Roar of Time and Wish are delayed by one more Turn.",
	},
	flowerveil: { // idk ob target !== this funktioniert
		inherit: true,
		onAllyTryBoost(boost, target, source, effect) {
			if (!target.hasType('Grass') && target !== source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if ((target === source || target.hasType('Grass')) && source && target !== source && effect && effect.id !== 'yawn') {
				this.debug('interrupting setStatus with Flower Veil');
				if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		onAllyTryAddVolatile(status, target, source) {
			if ((target === source || target.hasType('Grass')) && status.id === 'yawn') {
				this.debug('Flower Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		shortDesc: "This Pokemon and ally Grass types can't have stats lowered or status inflicted by other Pokemon.",
	},
	guarddog: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.boost({ atk: 1, def: 1, spa: 1, spd: 1, spe: 1 }, target, target, null, false, true);
			}
		},
		shortDesc: "Immune to Intimidate. Intimidated: +1 all stats (not acc/eva). Cannot be forced to switch out.",
	},
	hugepower: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify(2);
			}
		},
		shortDesc: "This Pokemon's offensive stat is doubled, if it is using a contact move.",
	},
	toxicdebris: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!move.flags['contact']) return;
			const side = source.isAlly(target) ? source.side.foe : source.side;
			const toxicSpikes = side.sideConditions['toxicspikes'];
			if (!toxicSpikes || toxicSpikes.layers < 2) {
				this.add('-activate', target, 'ability: Toxic Debris');
				side.addSideCondition('toxicspikes', target);
			}
		},
		shortDesc: "If this Pokemon is hit by a contact move, Toxic Spikes are set on the opposing side.",
	},
	whitesmoke: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "unboost", "[from] ability: White Smoke", `[of] ${target}`);
			}
		},
		shortDesc: "Prevents lowering of this Pokemon's stat stages.",
	},
	beadsofruin: {
		inherit: true,
		onAnyModifySpD(spd, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Beads of Ruin')) return;
			if (!move.ruinedSpD?.hasAbility('Beads of Ruin')) move.ruinedSpD = abilityHolder;
			if (move.ruinedSpD !== abilityHolder) return;
			this.debug('Beads of Ruin SpD drop');
			return this.chainModify(0.8);
		},
		shortDesc: "Active Pokemon without this Ability have their Sp. Def multiplied by 0.8x.",
	},

	swordofruin: {
		inherit: true,
		onAnyModifyDef(def, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Sword of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Sword of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Sword of Ruin Def drop');
			return this.chainModify(0.8);
		},
		shortDesc: "Active Pokemon without this Ability have their Defense multiplied by 0.8x.",
	},

	tabletsofruin: {
		inherit: true,
		onAnyModifyAtk(atk, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Tablets of Ruin')) return;
			if (!move.ruinedAtk) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Tablets of Ruin Atk drop');
			return this.chainModify(0.8);
		},
		shortDesc: "Active Pokemon without this Ability have their Attack multiplied by 0.8x.",
	},

	vesselofruin: {
		inherit: true,
		onAnyModifySpA(spa, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Vessel of Ruin')) return;
			if (!move.ruinedSpA) move.ruinedSpA = abilityHolder;
			if (move.ruinedSpA !== abilityHolder) return;
			this.debug('Vessel of Ruin SpA drop');
			return this.chainModify(0.75);
		},
		shortDesc: "Active Pokemon without this Ability have their Sp. Atk multiplied by 0.8x.",
	},
	fullmetalbody: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		onTryAddVolatile(status, pokemon, source) {
			if (source === pokemon && status.id === 'confusion') return null;
		},
		onTryBoost(boost, target, source, effect) {
			if (target !== source) return;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
				}
			}
		},
		shortDesc: "Prevents recoil and other self inflicted negative move effects; Rest will fail for it.",
	},
	shadowshield: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (!move.damage && !move.damageCallback && target.getMoveHitData(move).typeMod > 0) {
				if (move.category === 'Physical') {
					this.boost({ def: 2 });
				}
				if (move.category === 'Special') {
					this.boost({ spd: 2 });
				}
			}
		},
		shortDesc: "If hit by a super effective move; +2 Def if the move was physical, +2 Sp.Def if special.",
	},
	mimicry: {
		inherit: true,
		onSwitchInPriority: -1,
		onStart(pokemon) {
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			let additionalType;
			switch (this.field.terrain) {
			case 'electricterrain':
				additionalType = 'Electric';
				break;
			case 'grassyterrain':
				additionalType = 'Grass';
				break;
			case 'mistyterrain':
				additionalType = 'Fairy';
				break;
			case 'psychicterrain':
				additionalType = 'Psychic';
				break;
			default:
				additionalType = '';
			}
			if (additionalType) {
				pokemon.addType(additionalType);
				this.add('-start', pokemon, 'typeadd', additionalType, '[from] ability: Mimicry');
			} else {
				pokemon.addedType = '';
				this.add('-end', pokemon, 'typeadd');
			}
		},
		shortDesc: "The Typing of an active Terrain is added to this Pokemon's Types. Type reverts when Terrain ends.",
	},
	surgesurfer: {
		inherit: true,
		onModifySpe(spe) {
			if (this.field.terrain !== '') {
				return this.chainModify(2);
			}
		},
		shortDesc: "If any Terrain is active, this Pokemon's Speed is doubled.",
	},
	battlebond: {
		inherit: true,
		onSourceAfterFaint(length, target, source, effect) {
			if (source.bondTriggered) return;
			if (effect?.effectType !== 'Move') {
				return;
			}
			if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.add('-activate', source, 'ability: Battle Bond');
				source.formeChange('Greninja-Ash', this.effect, true);
				source.formeRegression = true;
				source.bondTriggered = true;
			}
		},
		shortDesc: "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 20 power, hits 3x.",
	},
	colorchange: {
		inherit: true,
		onAfterMoveSecondary(target, source, move) {
			if (!target.hp) return;
			const type = move.type;
			if (
				target.isActive && move.effectType === 'Move' && move.category !== 'Status' &&
				type !== '???' && !target.hasType(type)
			) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');
				this.effectState.triggered = true;
				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
		onModifySTAB(stab, source, target, move) {
			if (!this.effectState.triggered) return;
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		shortDesc: "This Pokemon's type changes to the type of a move it's hit by, unless it has the type; Also it's STAB for that Type is 2 instead of 1.5.",
	},
	costar: { // hab power of alchemy und grim neigh zusammengeschmissen, hier auch schon auf Tags geachtet
		inherit: true,
		onAnyFaintPriority: 1,
		onStart: undefined,
		onAnyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			if (this.effectState.target.setAbility(ability)) {
				this.add('-ability', this.effectState.target, ability, '[from] ability: Costar', `[of] ${target}`);
			}
		},
		shortDesc: "This ability is replaced by the Ability of the first Pokémon to faint while this Pokemon is on the field.",
	},
	curiousmedicine: {
		inherit: true,
		onStart() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
		shortDesc: "On switch-in, Pokemon on the field have their stat stages reset to 0.",
	},
	fairyaura: {
		inherit: true,
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon) || pokemon.species.id !== 'xerneasactive') return;
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' ||
				move.type !== 'Fairy' || this.effectState.target.species.id !== 'xerneasactive') return;
			if (!move.auraBooster?.hasAbility('Fairy Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		shortDesc: "If Xerneas-Active: Fairy-type moves used by any Pokemon has 1.33x power. ",
	},
	flowergift: { // debug text nicht angepasst
		inherit: true,
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (!pokemon.hp) return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '0', '[msg]');
				}
			} else {
				if (pokemon.species.id === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim', this.effect, false, '0', '[msg]');
				}
			}
		},
		onAllyModifyAtk: undefined,
		onAllyModifySpD: undefined,
		onAllyModifySpAPriority: 3,
		onAllyModifySpA(spa, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpe(spa, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0 && !['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				this.debug('Flower Gift neutralize');
				return this.chainModify(0.75);
			}
		},
		shortDesc: "If Sun is active, Change form to Cherrim-Sunshine; Also, it and allies' Sp. Attack and Speed are 1.5x. If out of Sun; This Pokemon receives 3/4 damage from supereffective attacks.",
	},
	forecast: {
		inherit: true,
		onSwitchInPriority: -2,
		onStart(pokemon) {
			if (pokemon.hasItem('heatrock')) {
				this.field.setWeather('sunnyday');
			} else if (pokemon.hasItem('damprock')) {
				this.field.setWeather('raindance');
			} else if (pokemon.hasItem('icyrock')) {
				this.field.setWeather('hail');
			}
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;
			let forme = null;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				if (pokemon.species.id !== 'castformsunny') forme = 'Castform-Sunny';
				break;
			case 'raindance':
			case 'primordialsea':
				if (pokemon.species.id !== 'castformrainy') forme = 'Castform-Rainy';
				break;
			case 'hail':
			case 'snowscape':
				if (pokemon.species.id !== 'castformsnowy') forme = 'Castform-Snowy';
				break;
			default:
				if (pokemon.species.id !== 'castform') forme = 'Castform';
				break;
			}
			if (pokemon.isActive && forme) {
				pokemon.formeChange(forme, this.effect, false, '0', '[msg]');
			}
		},
		shortDesc: "Summons weather based on held weather rock, then changes type to match current weather condition, except Sandstorm.",
	},
	galewings: {
		inherit: true,
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying' && pokemon.hp > pokemon.maxhp / 2) return priority + 1;
		},
		shortDesc: "If this Pokemon is above 50%, its Flying-type moves have their priority increased by 1.",
	},
	grasspelt: {
		inherit: true,
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			if (this.field.isTerrain('grassyterrain') && move.category === 'Physical' && target.hp) {
				this.heal(damage / 2, target, target);
			}
		},
		shortDesc: "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 1.5, also it recovers 50% of physical damage taken immediatly after taking said damage.",
	},
	liquidvoice: {
		inherit: true,
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Water';
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['sound']) return this.chainModify([4915, 4096]);
		},
		shortDesc: "This Pokemon's sound-based moves become Water type and have 1.2x power.",
	},

	magmaarmor: {
		inherit: true,
		onModifyTypePriority: -2,
		onFoeModifyType(move, target, source) {
			if (!source.hasAbility('magmaarmor')) return;
			if (['Water', 'Ground', 'Rock'].includes(move.type)) {
				move.type = 'Fire';
				this.debug(move.name + "'s type changed to Fire");
			}
		},
		onUpdate: undefined,
		onImmunity: undefined,
		shortDesc: "Water-, Ground- and Rock-type moves against this Pokemon deal Damage as if they were Fire-type.",
	},
	mindseye: {
		inherit: true,
		onModifyTypePriority: -2,
		onModifyType(move, target) {
			if (target.hasType('Ghost') && move.type === 'Normal') {
				move.type = 'Ghost';
				this.debug(move.name + "'s type changed to Ghost");
			}
		},
		shortDesc: "Normal-type moves used against a Ghost-type Pokemon deal damage as if they were Ghost-type moves.",
	},
	myceliummight: {
		inherit: true,
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
				move.ignoreImmunity = true;
			}
		},
		shortDesc: "This Pokemon's Status moves go last in their priority bracket but targets cannot be immune to their effects.",
	},
	normalize: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify(1.5);
		},
		shortDesc: "This Pokemon's moves are changed to be Normal type and have 1.5x power.",
	},
	purepower: { // auch sowas hast du bestimmt schon gemacht flo
		inherit: true,
		onModifyMove(move) {
			if (move.category === 'Special') {
				move.category = 'Physical';
				move.typeChangerBoosted = this.effect;
			}
		},
		onModifyAtk(atk, target, source, move) {
			if (move.typeChangerBoosted === this.effect) {
				return this.chainModify(2);
			}
		},
		shortDesc: "This Pokemon's Special moves become Physical; Attack is doubled when using a move which is usually special.",
	},
	slowstart: {
		inherit: true,
		condition: {
			duration: 5,
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onResidual(pokemon) {
				if (!pokemon.activeTurns) {
					this.effectState.duration! += 1;
				}
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				const modifier = 1 - (this.effectState.duration! / 10);
				return this.chainModify(modifier);
			},
			onModifySpe(spe, pokemon) {
				const modifier = 1 - (this.effectState.duration! / 10);
				return this.chainModify(modifier);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
		flags: {},
		name: "Slow Start",
		rating: -1,
		num: 112,
		shortDesc: "On switch-in, this Pokemon's Attack and Speed are halved, regains 10% of original stats each turn until 5th turn out.",
	},
	thermalexchange: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['heat'] || move.type === 'Fire') {
				this.boost({ atk: 1 });
			}
		},
		shortDesc: "This Pokemon's Attack is raised by 1 when damaged by Heat-based moves; can't be burned.",
	},
	transistor: {
		inherit: true,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify(1.5);
			}
		},
		shortDesc: "This Pokemon's offensive stat is multiplied by 1.5 while using an Electric-type attack.",
	},
	unseenfist: {
		inherit: true,
		onModifyMove(move) {
			if (move.flags['punch']) delete move.flags['protect'];
		},
		shortDesc: "This Pokemon's punching moves ignore the target's protection, except Max Guard.",
	},
	victorystar: {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			return this.chainModify(1.2 - (pokemon.side.foe.totalFainted / 10));
		},
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.2 - (pokemon.side.foe.totalFainted / 10));
		},
		shortDesc: "Moves used by this Pokemon and it's allies deal 1.2x damage, but deal 0.1x less damage for each opposing fainted Pokemon; Also their accuracy is 1.1x.",
	},
	watercompaction: {
		inherit: true,
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Water Compaction Atk weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				this.debug('Water Compaction SpA weaken');
				return this.chainModify(0.5);
			}
		},
		shortDesc: "Water-type moves against this Pokemon deal damage with a halved offensive stat; +2 Def after it is damaged by a Water-type move.",
	},
	receiver: {
		inherit: true,
		onStart(pokemon) {
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target.item) {
				this.add('-item', target, target.getItem().name, '[from] ability: Receiver', `[of] ${pokemon}`);
				pokemon.addVolatile('item:' + target.item);
			}
		},
		onEnd(pokemon) {
			Object.keys(pokemon.volatiles).filter(v => v.startsWith("item:")).forEach(v => {
				pokemon.removeVolatile(v);
			});
		},
		shortDesc: "This Pokemon frisks and uses their opponent's item in addition to their own.",
	},
	neutralizinggas: {
		inherit: true,
		onSwitchIn(pokemon) {
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			for (const target of this.getAllActive()) {
				if (target.hasItem('Ability Shield')) {
					this.add('-block', target, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) {
					continue;
				}
				if (target.ability === 'receiver') {
					this.singleEvent('End', this.dex.abilities.get('Receiver'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (strongWeathers.includes(target.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
				}
			}
		},
	},
	primordialsea: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'glacialstorm'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	desolateland: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'glacialstorm'];
			if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	deltastream: {
		inherit: true,
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream', 'glacialstorm'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
	},
	rockhead: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil' || effect.id === 'lifeorb') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		shortDesc: 'This Pokemon does not take recoil damage besides Struggle/crash damage.',
	},
	reckless: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage || move.id === 'rockwrecker') {
				this.debug('Reckless boost');
				return this.chainModify([4915, 4096]);
			}
		},
	}
};
