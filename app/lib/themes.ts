export interface Theme {
    id: string;
    name: string;
    accent: string;
    accentSoft: string;
    displayFont: string;
}

export const THEMES: Record<string, Theme> = {
    default: {
        id: "default",
        name: "Boxbox Red",
        accent: "#e8002d",
        accentSoft: "rgba(232, 0, 45, 0.2)",
        displayFont: '"Courier New", monospace'
    },
    alpine: {
        id: "alpine",
        name: "Alpine A524",
        accent: "#0093cc",
        accentSoft: "rgba(0, 147, 204, 0.2)",
        displayFont: '"Courier New", monospace'
    },
    ferrari: {
        id: "ferrari",
        name: "Ferrari SF-24",
        accent: "#ef1a2d",
        accentSoft: "rgba(239, 26, 45, 0.2)",
        displayFont: '"Courier New", monospace'
    },
    mclaren: {
        id: "mclaren",
        name: "McLaren MCL38",
        accent: "#ff8000",
        accentSoft: "rgba(255, 128, 0, 0.2)",
        displayFont: '"Courier New", monospace'
    },
    mercedes: {
        id: "mercedes",
        name: "Mercedes W15",
        accent: "#27f4d2",
        accentSoft: "rgba(39, 244, 210, 0.2)",
        displayFont: '"Courier New", monospace'
    }
};

export const TYRE_COLORS: Record<string, string> = {
    SOFT: "#e8002d",
    MEDIUM: "#ffd700",
    HARD: "#f5f5f5",
    INTERMEDIATE: "#43b02a",
    WET: "#0067b9"
};
