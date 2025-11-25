import useBaseUrl from "@docusaurus/useBaseUrl";

export const acceptableMisnamedMaps: Record<string, string> = {
};
export const mapDraftNameToGameNameMapping: Record<string, string> = {
    "Acaray": "TSDC Acaray",
    "Aftermath": "TSDC Aftermath",
    "Border Dispute": "TSDC Border Dispute",
    "Brood War": "TSDC Brood War",
    "Eredo-Iya": "TSDC Eredo-Iya",
    "Hamburger": "TSDC Hamburger",
    "Kirby's world": "TSDC Kirby's World",
    "Lagoon": "TSDC Lagoon",
    "Meltdown": "TSDC Meltdown",
    "Sand Trap": "TSDC Sand_Trap",
    "Wellsprings": "TSDC Wellsprings",
};

export const GameNameMappingToDisplayName: Record<string, string> = Object.fromEntries(Object.values(mapDraftNameToGameNameMapping).map(gameName => [gameName, mapNameToDisplay(gameName)]));

export const BracketNameToImage = {
    Champions: '/img/brackets/Champion.webp',
    Monks: '/img/brackets/Monk.webp',
    Mangonels: '/img/brackets/Mangonel.webp',
    Knights: '/img/brackets/Knight.webp',
    Crossbows: '/img/brackets/Crossbowman.webp',
    Militia: '/img/brackets/Militia.webp',
};

export const bracketColors: { [bracket in keyof typeof BracketNameToImage]: string } = {
    Champions: "#1f77b4",
    Monks: "#ff7f0e",
    Mangonels: "#2ca02c",
    Knights: "#d62728",
    Crossbows: "#9467bd",
    Militia: "#8c564b",
    // "Group G": "#e377c2",
    // "Group H": "#7f7f7f",
    // "Other": "#bcbd22",
};

export const winnerStages: string[] = ['Group', 'Quarter Final', 'Semi Final', 'Final'];
export const loserStages: string[] = ["LB Quarter Final", "LB Semi Final", "LB Final"];

export const allCivs = [
    "Britons",
    "Byzantines",
    "Celts",
    "Chinese",
    "Franks",
    "Goths",
    "Japanese",
    "Mongols",
    "Persians",
    "Saracens",
    "Teutons",
    "Turks",
    "Vikings",
    "Aztecs",
    "Huns",
    "Koreans",
    "Mayans",
    "Spanish",
    "Italians",
    "Incas",
    "Magyars",
    "Slavs",
    "Berbers",
    "Ethiopians",
    "Malians",
    "Portuguese",
    "Burmese",
    "Khmer",
    "Malay",
    "Vietnamese",
    "Bulgarians",
    "Cumans",
    "Lithuanians",
    "Tatars",
    "Burgundians",
    "Sicilians",
    "Bohemians",
    "Poles",
    "Bengalis",
    "Dravidians",
    "Gurjaras",
    "Hindustanis",
    "Romans",
    "Armenians",
    "Georgians",
    "Khitans",
    "Jurchens",
    "Shu",
    "Wei",
    "Wu"
];

function mapNameToDisplay(gameName: string) {
    if (!gameName.startsWith("TSDC ")) {
        return undefined;
    }
    const sanitizedName = gameName.replace("TSDC ", "").replace("_", " ");
    if (!(Object.keys(mapDraftNameToGameNameMapping).find(name => name.toLowerCase() == sanitizedName.toLowerCase()))) {
        return undefined;
    }
    return sanitizedName;
}
export function mapDraftNameToDisplay(draftName: string) {
    return mapNameToDisplay(mapDraftNameToGameNameMapping[draftName] ?? draftName) ?? draftName;
}

export function mapGameNameToDisplay(gameName: string) {
    const correctedName = acceptableMisnamedMaps[gameName] ?? gameName;
    const mapName = mapNameToDisplay(correctedName);
    if (!mapName) {
        console.log("Unknown Map:", correctedName);
        return correctedName;
    }
    return mapName;

}

export function getBracketImage(bracket: string) {
    if (!(bracket in BracketNameToImage)) {
        return undefined;
    }
    return useBaseUrl(BracketNameToImage[bracket]);
}

export const tournamentMaps = Object.values(GameNameMappingToDisplayName);
