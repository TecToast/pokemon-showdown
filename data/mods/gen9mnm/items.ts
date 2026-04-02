export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	lifeorb: {
		inherit: true,
		onAfterMoveSecondarySelf: undefined,
	},
	eviolite: {
		inherit: true,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.nfe || pokemon.species.id === 'carbink') {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.nfe || pokemon.species.id === 'carbink') {
				return this.chainModify(1.5);
			}
		},
	},
	figyberry: {
		inherit: true,
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 2)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus !== 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses unless -Atk Nature. Single use.",
	},
	iapapaberry: {
		inherit: true,
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 2)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus !== 'def') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses unless -Def Nature. Single use.",
	},
	wikiberry: {
		inherit: true,
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 2)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus !== 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses unless -Sp.Atk Nature. Single use.",
	},
	aguavberry: {
		inherit: true,
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 2)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus !== 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses unless -Sp.Def Nature. Single use.",
	},
	magoberry: {
		inherit: true,
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 2)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus !== 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses unless -Spe Nature. Single use.",
	},
	brightpowder: {
		inherit: true,
		onModifyAccuracy: undefined,
		onUpdate(pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'item: Bright Powder');
				pokemon.removeVolatile('confusion');
			}
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'item: Bright Powder');
				pokemon.cureStatus();
			}
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'confusion') return null;
			if (status.id === 'yawn') {
				this.add('-immune', pokemon, '[from] item: Bright Powder');
				return null;
			}
		},
		onHit(target, source, move) {
			if (move?.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] item: Bright Powder');
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] item: Bright Powder');
			}
			return false;
		},
		shortDesc: "Holder cannot fall asleep or be confused; Rest will fail for it.",
	},
	quickclaw: {
		inherit: true,
		onFractionalPriority: undefined,
		onModifyDamage(damage, source, target, move) {
			if (move.priority > 0) {
				return this.chainModify([5324, 4096]);
			}
		},
		shortDesc: "Holder's priority attacks have 1.3x power.",
	},
	shellbell: {
		inherit: true,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.totalDamage && !pokemon.forceSwitchFlag) {
				this.heal(move.totalDamage / 6, pokemon);
			}
		},
		shortDesc: "After an attack, holder gains 1/6 of the damage in HP dealt to other Pokemon.",
	},
	hearthflamemask: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Hearthflame') && ['Grass', 'Fire'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		shortDesc: "If Ogerpon-Hearthflame: 1.2x power Grass-/Fire-attacks; Terastallize to gain Embody Aspect",
	},
	wellspringmask: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Wellspring') && ['Grass', 'Water'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		shortDesc: "If Ogerpon-Wellspring: 1.2x power Grass-/Water-attacks; Terastallize to gain Embody Aspect",
	},
	cornerstonemask: {
		inherit: true,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Cornerstone') && ['Grass', 'Rock'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		shortDesc: "If Ogerpon-Cornerstone: 1.2x power Grass-/Rock-attacks; Terastallize to gain Embody Aspect.",
	},
	sweetapple: {
		inherit: true,
		isBerry: true,
		onDamage(damage, target, source, effect) {
			if (target.species.id === 'appletun' && damage >= target.hp && effect && effect.effectType === 'Move') {
				if (target.eatItem()) {
					this.effectState.triggered = true;
					return target.hp - 1;
				}
			}
		},
		onUpdate(pokemon) {
			if (this.effectState.triggered) {
				this.effectState.triggered = false;
				this.heal(pokemon.baseMaxhp / 3);
			}
		},
		shortDesc: "If Appletun: Holder will survive an attack that would KO it with 1 HP and recovers 1/3 of max HP. Single use.",
	},
	tartapple: {
		inherit: true,
		isBerry: true,
		shortDesc: "If Flapple: If the holder misses due to accuracy, uses the same move again dealing 1.3x dmg and it cannot miss. Single use.",
	},
	syrupyapple: {
		inherit: true,
		isBerry: true,
		onDamagingHit(damage, target, source, move) {
			if (target.species.id === 'dipplin') return;
			if (!target.eatItem()) return;
			for (const opponent of target.side.foe.active) {
				this.boost({ atk: -1, def: -1, spa: -1, spd: -1, spe: -1 }, opponent, target);
			}
		},
		shortDesc: "If Dipplin: If hit by an attack; Lowers all opponents stats by 1 (not acc/eva). Single use.",
	},
	metalpowder: {
		inherit: true,
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.species.name === 'Ditto') {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.species.name === 'Ditto') {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If held by a Ditto; It's Def and SpDef. are 1.5x, even while transformed.",
	},
	quickpowder: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (pokemon.species.name === 'Ditto' && pokemon.activeMoveActions <= 1) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If held by a Ditto; It's Speed is 1.5x on the first turn out, even while transformed.",
	},
	upgrade: {
		inherit: true,
		onFoeAfterSwitchInSelf(pokemon) {
			if (pokemon.species.id !== 'porygon2') return;
			((pokemon.abilityState as any)?.onStart as (p: Pokemon) => void)?.call(this, pokemon);
		},
		shortDesc: "If Porygon2: Holder's ability re-triggers upon opponents switch in.",
	},
	electirizer: {
		inherit: true,
		onHit(target, source, move) {
			if (move.hasBounced || move.type !== 'Electric') return;
			for (const ally of [...source.allies(),
				...source.side.foe.active].filter(p => this.dex.getEffectiveness(move.type, p) == 1)) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (move.hasBounced || move.type !== 'Electric') return;
			for (const ally of [...source.allies(),
				...source.side.foe.active].filter(p => this.dex.getEffectiveness(move.type, p) == 1)) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		shortDesc: "If Electivire: This Pokemon's Electric-Type moves also hit for a second time, with halved base Power, onto every Electric weak Pokemon on the field.",
	},
	magmarizer: {
		inherit: true,
		onHit(target, source, move) {
			if (move.hasBounced || move.type !== 'Fire') return;
			for (const ally of [...source.allies(),
				...source.side.foe.active].filter(p => this.dex.getEffectiveness(move.type, p) == 1)) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (move.hasBounced || move.type !== 'Fire') return;
			for (const ally of [...source.allies(),
				...source.side.foe.active].filter(p => this.dex.getEffectiveness(move.type, p) === 1)) {
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.basePower /= 2;
				this.actions.useMove(newMove, source, { target: ally });
			}
		},
		shortDesc: "If Magmortar: This Pokemon's Fire-Type moves also hit for a second time, with halved base Power, onto every Fire weak Pokemon on the field.",
	},
	sachet: {
		inherit: true,
		onAfterSetStatusPriority: -1,
		onAfterSetStatus(status, pokemon) {
			if (pokemon.species.id !== 'aromatisse') return;
			pokemon.useItem();
		},
		onUpdate(pokemon) {
			if (pokemon.species.id !== 'aromatisse') return;
			if (pokemon.status || pokemon.volatiles['confusion']) {
				pokemon.useItem();
			}
		},
		onUse(pokemon) {
			if (pokemon.species.id !== 'aromatisse') return;
			this.add('-activate', pokemon, 'item: Sachet');
			const allies = [...pokemon.side.pokemon, ...pokemon.side.allySide?.pokemon || []];
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
					if (ally.volatiles['substitute'] && !pokemon.hasAbility('infiltrator')) continue;
				}
				ally.cureStatus();
			}
		},
		shortDesc: "If Aromatisse: If holder has a non-volatile status or is confused, casts the effect of Aromatherapy for holder's side. Single use.",
	},
	whippeddream: {
		inherit: true,
		onDamagingHit(damage, target) {
			if (target.species.id !== 'slurpuff' || !target.useItem()) return;
			target.side.addSideCondition('Wish', target, this.effect);
		},
		shortDesc: "If Slurpuff: If holder is hit by a damaging move, casts the effect of Wish for holder's side. Single use.",
	},
	chippedpot: {
		inherit: true,
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (pokemon.species.id === 'polteageist' && move.totalDamage && !pokemon.forceSwitchFlag) {
				this.heal(move.totalDamage / 3, pokemon);
			}
		},
		shortDesc: "If Polteageist: After an attack, holder gains 1/3 of the damage in HP dealt to other Pokemon.",
	},
	masterpieceteacup: {
		inherit: true,
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
			if (target.species.id === 'sinistcha' && heals.includes(effect.id)) {
				return this.chainModify([5324, 4096]);
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (source.species.id === 'sinistcha' && move?.drain) {
				return this.chainModify([4915, 4096]);
			}
		},
		shortDesc: "If Sinistcha: Draining moves deal 1.2x dmg; gains 1.3x HP from draining/Aqua Ring/Ingrain/Leech Seed/Strength Sap.",
	},
	galaricacuff: {
		inherit: true,
		onStart(pokemon) {
			pokemon.m.moveLastTurnCategory = undefined;
		},
		onModifyDamage(damage, source, target, move) {
			if (source.species.id !== 'slowbrogalar') return;
			if ((move.category === 'Physical' && source.m.moveLastTurnCategory === 'Special') ||
				(move.category === 'Special' && source.m.moveLastTurnCategory === 'Physical')) {
				return this.chainModify([5324, 4096]);
			}
		},
		shortDesc: "If Slowbro-Galar: If the holder uses a Special move after a physical one, multiply it's dmg by 1.3x and vice versa.",
	},
	galaricawreath: {
		inherit: true,
		onModifyMove(move, pokemon) {
			if (pokemon.species.id === 'slowkinggalar' && move.category === 'Physical') {
				move.category = 'Special';
				move.typeChangerBoosted = this.effect;
			}
		},
		onModifyAtk(atk, target, source, move) {
			if (move.typeChangerBoosted === this.effect) {
				return this.chainModify(1.2);
			}
		},
		shortDesc: "If Slowking-Galar: Holders physical moves become special and have their Power increased by 1.2x.",
	},
	auspiciousarmor: {
		inherit: true,
		onModifyDef(def, pokemon) {
			if (pokemon.species.id === 'armarouge' &&
				pokemon.getStat('def', true, true) < pokemon.getStat('spd', true, true)) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (pokemon.species.id === 'armarouge' &&
				pokemon.getStat('spd', true, true) <= pokemon.getStat('def', true, true)) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Armarouge: This Pokemon's lowest defense stat is multiplied by 1.5x.",
	},
	maliciousarmor: {
		inherit: true,
		onModifyDef(def, pokemon) {
			if (pokemon.species.id === 'ceruledge' &&
				pokemon.getStat('def', true, true) <= pokemon.getStat('spd', true, true)) {
				return this.chainModify(1.5);
			}
		},
		onModifySpD(spd, pokemon) {
			if (pokemon.species.id === 'ceruledge' &&
				pokemon.getStat('spd', true, true) < pokemon.getStat('def', true, true)) {
				return this.chainModify(1.5);
			}
		},
		shortDesc: "If Ceruledge: This Pokemon's lowest defense stat is multiplied by 1.5x.",
	},
	lightball: {
		inherit: true,
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			pokemon.trySetStatus('par', pokemon);
		},
		shortDesc: "If held by a Pikachu, its Attack and Sp. Atk are doubled. At the end of every turn, this item attempts to paralyze the holder.",
	},
	stick: {
		inherit: true,
		onModifyCritRatio(critRatio, user) {
			const toID = this.toID(user.baseSpecies.baseSpecies);
			if (toID === 'farfetchd' || toID === 'sirfetchd') {
				return critRatio + 2;
			}
		},
		itemUser: ["Farfetch\u2019d", "Sirfetch\u2019d"],
		shortDesc: "If held by a Farfetch’d or Sirfetch'd, its critical hit ratio is raised by 2 stages.",
	},
	ovalstone: {
		inherit: true,
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.species.id === 'chansey') {
				return this.chainModify(1.75);
			}
		},
		shortDesc: "If Chansey: Holder's Defense is 1.75x.",
	},
	kingsrock: {
		inherit: true,
		onModifyMovePriority: -1,
		onModifyMove: undefined,
		onAfterEachBoost(boost, target, source, effect) {
			this.boost({ atk: -1 }, this.sample(target.side.foe.active), target);
		},
		shortDesc: "If Politoed or Slowking: If holder has a stat stage changed: opponent's Atk. -1.\n",
	},
	dragonscale: {
		inherit: true,
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (defender.species.id !== 'kingdra') return;
			if (move.type === 'Dragon' || move.type === 'Fairy' || move.type === 'Ice') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (defender.species.id !== 'kingdra') return;
			if (move.type === 'Dragon' || move.type === 'Fairy' || move.type === 'Ice') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		shortDesc: "If Kingdra: Dragon-/Fairy-/Ice-type moves used against the holder deal damage with a halved offensive stat.",
	},
	prismscale: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (target.species.id !== 'milotic') return;
			if (effect.effectType !== 'Move') {
				return false;
			}
		},
		shortDesc: "If Milotic: The holder can only be damaged by direct attacks.",
	},
	protector: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (target.species.id !== 'rhyperior') return;
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Protector neutralize');
				return this.chainModify(0.75);
			}
		},
		shortDesc: "If Rhyperior: This Pokemon receives 3/4 damage from supereffective attacks.",
	},
	razorfang: {
		inherit: true,
		onModifyMove: undefined,
		onAfterBoost(boost, target, source, effect) {
			if (target.species.id !== 'gliscor') return;
			if (this.effect === effect) return;
			this.boost({ atk: 1 }, target, target, null, false, true);
		},
		shortDesc: "If Gliscor: After holder's stat stages are changed; Holders Atk. +1.",
	},
	reapercloth: {
		inherit: true,
		onModifyDamage(damage, source, target, move) {
			if (source.species.id !== 'dusknoir') return;
			this.chainModify(2 - (target.hp / target.maxhp));
		},
		shortDesc: "If Dusknoir: The holder's attacks deal 1% extra damage for each 1% HP lost by the target.",
	},
	metalalloy: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (target.species.id !== 'archaludon' || !['Electric', 'Steel'].includes(move.type)) return;
			this.boost({ spd: 1 });
		},
		shortDesc: "If Archaludon: The holder's Sp. Def is raised by 1 stage after it is damaged by an Electric/Steel Type move.",
	},
};

