export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	flowergift: {
		inherit: true,
		onAllyModifySpDPriority: undefined,
		onAllyModifySpD: undefined,
		onAllyModifySpe(atk, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
	},
	normalize: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([5324, 4096]);
		},
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Normal'] = true;
			}
		},
	},
	quickfeet: {
		inherit: true,
		// handled in conditions.ts
	},
	illusion: {
		inherit: true,
		onModifyAtk(atk, pokemon) {
			if (pokemon.illusion) {
				return this.chainModify([4915, 4096]);
			}
		},
		onModifySpA(spa, pokemon) {
			if (pokemon.illusion) {
				return this.chainModify([4915, 4096]);
			}
		},
	},
	regenerator: {
		inherit: true,
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 10 * 3);
		},
	},
	disguise: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (
				effect && effect.effectType === 'Move' &&
				['mimikyu', 'mimikyutotem'].includes(target.species.id) && !target.transformed
			) {
				if (["rollout", "iceball"].includes(effect.id)) {
					source.volatiles[effect.id].contactHitCount--;
				}

				this.add("-activate", target, "ability: Disguise");
				this.effectState.busted = true;
				return 0;
			}
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
			}
		},
		shortDesc: "(Mimikyu only) First hit deals 0 damage, breaks disguise.",
	},
	fullmetalbody: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				const redirectTarget = target.getAtLoc(target.lastMoveTargetLoc!);
				// if (!redirectTarget) return;
				this.damage(damage, redirectTarget, target);
				return null;
			}
		},
	},
	liquidvoice: {
		inherit: true,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Water';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
	},
	beadsofruin: {
		inherit: true,
		onAnyModifySpD(spd, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (!move.ruinedSpD?.hasAbility('Beads of Ruin')) move.ruinedSpD = abilityHolder;
			if (move.ruinedSpD !== abilityHolder) return;
			this.debug('Beads of Ruin SpD drop');
			return this.chainModify(0.75);
		},
	},
	swordofruin: {
		inherit: true,
		onAnyModifyDef(def, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (!move.ruinedDef?.hasAbility('Sword of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Sword of Ruin Def drop');
			return this.chainModify(0.75);
		},
	},
	tabletsofruin: {
		inherit: true,
		onAnyModifyAtk(atk, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (!move.ruinedAtk) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Tablets of Ruin Atk drop');
			return this.chainModify(0.75);
		},
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
	},
	hadronengine: {
		inherit: true,
		onModifySpAPriority: undefined,
		onModifySpA: undefined,
		onModifySTAB(stab, source, target, move) {
			if (!this.field.isTerrain('electricterrain')) return;
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
	},
	orichalcumpulse: {
		inherit: true,
		onModifyAtkPriority: undefined,
		onModifyAtk: undefined,
		onModifySTAB(stab, source, target, move) {
			if (!['sunnyday', 'desolateland'].includes(source.effectiveWeather())) return;
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
	},
	zerotohero: {
		inherit: true,
		onSwitchOut(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Palafin') return;
			if (pokemon.species.forme !== 'Hero') {
				pokemon.formeChange('Palafin-Hero', this.effect, true);
			} else {
				pokemon.formeChange('Palafin', this.effect, true);
			}
		},
		onSwitchIn: undefined,
	},

};
