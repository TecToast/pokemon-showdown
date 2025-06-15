import {Pokemon} from "../../../sim";
import {ModdedDex} from "../../../sim/dex";
import {SpeciesData} from "../../../sim/dex-species";

export const Items: import('../../../sim/dex-items').ModdedItemDataTable = {
	safetygoggles: {
		inherit: true,
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] item: Safety Goggles');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] item: Safety Goggles');
				return null;
			}
		},
		shortDesc: "Holder is immune to powder and sleep moves and damage from Sandstorm or Hail.",
	},
	aguavberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -SpD Nature. Single use.",
	},
	figyberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -Atk Nature. Single use.",
	},
	iapapaberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -Def Nature. Single use.",
	},
	magoberry: {
		inherit: true,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -Spe Nature. Single use.",
	},
	wikiberry: {
		inherit: true,
		isNonstandard: null,
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 2);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
		shortDesc: "Restores 1/2 max HP at 1/4 max HP or less; confuses if -SpA Nature. Single use.",
	},
	eviolite: {
		inherit: true,
		onModifyDef(def, pokemon) {
			const result = pokemon.species.id === 'phione' ? 1 : calcEviolite(this.dex, pokemon.species);
			if (result > 0) {
				return this.chainModify(1 + 0.5 * result);
			}
		},
		onModifySpD(spd, pokemon) {
			const result = pokemon.species.id === 'phione' ? 1 : calcEviolite(this.dex, pokemon.species);
			if (result > 0) {
				return this.chainModify(1 + 0.5 * result);
			}
		},
	},
	buggem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	darkgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	dragongem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	electricgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	fairygem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	fightinggem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	firegem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	flyinggem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	ghostgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	grassgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	groundgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	icegem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	poisongem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	psychicgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	rockgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	steelgem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
	watergem: {
		inherit: true,
		isNonstandard: "Batzi",
	},
};

function calcEviolite(dex: ModdedDex, pokemon: SpeciesData): number {
	if (!pokemon.evos) return 0;
	const nextCandidates = pokemon.evos.map(mon => dex.species.get(mon));
	if (nextCandidates.length === 0) return 0;
	let highest = calcEviolite(dex, nextCandidates[0]);
	for (let i = 1; i < nextCandidates.length; i++) {
		const result = calcEviolite(dex, nextCandidates[i]);
		if (result > highest) highest = result;
	}
	return highest + 1;
}
