// Type for the base log function
type LogFunction = {
    (...args: any[]): void;
    log: (...args: any[]) => void;
    group: (groupName?: string) => LogFunction;
} & StyleGetters;

// Style option parameters types
type StyleValue = string | number;
type StyleFunction = (value: StyleValue) => LogFunction;

// Interface for all style getters
interface StyleGetters {
    readonly red: LogFunction;
    readonly blue: LogFunction;
    readonly darkBlue: LogFunction;
    readonly orangeRed: LogFunction;
    readonly yellow: LogFunction;
    readonly black: LogFunction;
    readonly purple: LogFunction;
    readonly rebeccaPurple: LogFunction;
    readonly white: LogFunction;
    readonly green: LogFunction;
    readonly lightBlue: LogFunction;
    readonly orange: LogFunction;
    readonly lime: LogFunction;
    readonly limeGreen: LogFunction;
    readonly bgBlue: LogFunction;
    readonly bgRoyalBlue: LogFunction;
    readonly bgRed: LogFunction;
    readonly bgYellow: LogFunction;
    readonly bgPink: LogFunction;
    readonly bgBlack: LogFunction;
    readonly bgWhite: LogFunction;
    readonly underline: LogFunction;
    readonly bold: LogFunction;
    readonly dim: LogFunction;

    // Dynamic style getters
    readonly style: (property: string, value: StyleValue) => LogFunction;
    readonly fontSize: StyleFunction;
    readonly fontFamily: StyleFunction;
    readonly color: StyleFunction;
    readonly bgColor: StyleFunction;
    readonly borderRadius: StyleFunction;

    // Padding styles
    readonly padding: StyleFunction;
    readonly paddingInline: StyleFunction;
    readonly paddingBlock: StyleFunction;
    readonly paddingTop: StyleFunction;
    readonly paddingBottom: StyleFunction;
    readonly paddingLeft: StyleFunction;
    readonly paddingRight: StyleFunction;

    // Margin styles
    readonly margin: StyleFunction;
    readonly marginInline: StyleFunction;
    readonly marginBlock: StyleFunction;
    readonly marginTop: StyleFunction;
    readonly marginBottom: StyleFunction;
    readonly marginLeft: StyleFunction;
    readonly marginRight: StyleFunction;

    // Border styles
    readonly border: StyleFunction;
    readonly borderInline: StyleFunction;
    readonly borderBlock: StyleFunction;
    readonly borderTop: StyleFunction;
    readonly borderBottom: StyleFunction;
    readonly borderLeft: StyleFunction;
    readonly borderRight: StyleFunction;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 */
declare function getRandomInt(min: number, max: number): number;

/**
 * Capitalizes the first letter of a string
 */
declare function capitalize(str: string): string;

/**
 * Checks if a value is of a specific type
 */
declare function isOfType(value: any, type: string): boolean;

/**
 * A chainable logging utility with customizable styles
 */
declare const log: LogFunction;

/**
 * Converts a camelCase string to kebab-case
 */
declare function convertCamelToKebab(str: string): string;
