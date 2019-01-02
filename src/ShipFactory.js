import { randomMM } from './utils.js';
import { Ship } from './Ship.js';

export class ShipFactory {

    constructor (banner) {
        this.banner = banner;
        this.styles = ['standard','swift','transport','gunner','speeder'];
        this.insignias = {
            standard: 'o',
            swift: 'V',
            transport: '-',
            gunner: '*',
            speeder: 'w',
        };

        this.baselines = {
            sh: 20,
            wp: 10,
            eg: 15
        }
        this.multipliers =  {
            sh: 2,
            wp: 2,
            eg: 2
        };

        this.features = {
            shields: [
                {power: this.baselines.sh+(this.multipliers.sh*0), owned_by: ['gunner']},
                {power: this.baselines.sh+(this.multipliers.sh*1), owned_by: ['swift','speeder']},
                {power: this.baselines.sh+(this.multipliers.sh*2), owned_by: ['standard']},
                {power: this.baselines.sh+(this.multipliers.sh*3), owned_by: ['']},
                {power: this.baselines.sh+(this.multipliers.sh*4), owned_by: ['transport']}
            ],
            weapons: [
                {power: this.baselines.wp+(this.multipliers.wp*0), owned_by: ['transport']},
                {power: this.baselines.wp+(this.multipliers.wp*1), owned_by: ['speeder']},
                {power: this.baselines.wp+(this.multipliers.wp*2), owned_by: ['standard', 'swift']},
                {power: this.baselines.wp+(this.multipliers.wp*3), owned_by: []},
                {power: this.baselines.wp+(this.multipliers.wp*4), owned_by: ['gunner']}
            ],
            engines: [
                {power: this.baselines.eg+(this.multipliers.eg*0), owned_by: []},
                {power: this.baselines.eg+(this.multipliers.eg*1), owned_by: []},
                {power: this.baselines.eg+(this.multipliers.eg*2), owned_by: ['standard','transport','gunner']},
                {power: this.baselines.eg+(this.multipliers.eg*3), owned_by: ['swift']},
                {power: this.baselines.eg+(this.multipliers.eg*4), owned_by: ['speeder']}
            ]
        };

        // lookup reversed from features
        this.profiles = {
            standard: [this.features.shields[2].power,this.features.weapons[2].power,this.features.engines[2].power],
            swift: [this.features.shields[1].power,this.features.weapons[2].power,this.features.engines[3].power],
            transport: [this.features.shields[4].power,this.features.weapons[0].power,this.features.engines[2].power],
            gunner: [this.features.shields[0].power,this.features.weapons[4].power,this.features.engines[2].power],
            speeder: [this.features.shields[1].power,this.features.weapons[1].power,this.features.engines[4].power]
        }
    } // constructor

    buildShip (color,style,idx) {
        let profile = this.profiles[style];
        let insignia = this.insignias[style];
        return new Ship(color,style,insignia,profile,idx);
    }

    // adjust multipliers
    adjustMultipliers () {
        for (let key in this.multipliers) {
            this.multipliers[key] +=1;
        }
    }

    getMultipliers () {
        for (let key in this.multipliers) {
            console.log(this.multipliers[key]);
        }
    }

}