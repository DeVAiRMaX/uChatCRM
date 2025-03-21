export class Company {
    name: string = '';
    branche: string = '';
    standort: string = '';
    telefon: string = '';
    email: string = '';
    stats: CompanyStats = {
        kontakte: 0,
        projekte: 0,
        aktivitaeten: 0
    };

    toJson() {
        return {
            name: this.name,
            branche: this.branche,
            standort: this.standort,
            telefon: this.telefon,
            email: this.email,
            stats: this.stats
        };
    }
}

interface CompanyStats {
    kontakte: number;
    projekte: number;
    aktivitaeten: number;
}
