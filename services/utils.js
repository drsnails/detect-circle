function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Checks if a value is of a specific type.
 *
 * @param {*} value - The value to check.
 * @param {string} type - The type to check against.
 * @returns {boolean} - Returns true if the value is of the specified type, otherwise false.
 */
function isOfType(value, type) {
    let condition = true
    if (type === 'number') {
        condition = Number.isFinite(value)
    }
    return Object.prototype.toString.call(value) === `[object ${capitalize(type)}]` && condition
}

function isOfTypeFactory(type) {
    return (value) => isOfType(value, type)
}


const isObject = isOfTypeFactory('object')
const isArray = isOfTypeFactory('array')
const isNumber = isOfTypeFactory('number')
const isString = isOfTypeFactory('string')
const isBoolean = isOfTypeFactory('boolean')




/**
 * A utility function for logging messages with customizable styles.
 *
 * @param {...any} args - The messages to be logged.
 */
const log = (() => {
    let $styleStrs = []
    let $groupName

    const $styleOptions = {
        red: () => 'color: red',
        blue: () => 'color: blue',
        darkBlue: () => 'color: darkblue',
        orangeRed: () => 'color: orangered',
        yellow: () => 'color: yellow',
        black: () => 'color: black',
        purple: () => 'color: purple',
        rebeccaPurple: () => 'color: rebeccapurple',
        white: () => 'color: white',
        green: () => 'color: green',
        lightBlue: () => 'color: lightblue',
        orange: () => 'color: orange',
        lime: () => 'color: lime',
        limeGreen: () => 'color: limegreen',
        bgBlue: () => 'background-color: blue',
        bgRoyalBlue: () => 'background-color: royalblue',
        bgRed: () => 'background-color: red',
        bgYellow: () => 'background-color: yellow',
        bgPink: () => 'background-color: hotpink',
        bgBlack: () => 'background-color: black',
        bgWhite: () => 'background-color: white',
        underline: () => 'text-decoration: underline',
        bold: () => 'font-weight: 900',
        dim: () => 'color: #ffffff8d;font-style:italic',

        //*** Dynamic styles ***
        style: (property, value) => `${property}: ${value}`,
        fontSize: (size) => `font-size: ${size}`,
        fontFamily: (family) => `font-family: ${family}`,
        color: (color) => `color: ${color}`,
        bgColor: (color) => `background-color: ${color}`,
        borderRadius: (size) => `border-radius: ${size}`,
        ...getStyleDirections('padding'),
        ...getStyleDirections('margin'),
        ...getStyleDirections('border'),
    };

    function getStyleDirections(style) {
        return {
            [style]: (value) => `${style}: ${value}`,
            [`${style}Inline`]: (value) => `${style}-inline: ${value}`,
            [`${style}Block`]: (value) => `${style}-block: ${value}`,
            [`${style}Top`]: (value) => `${style}-top: ${value}`,
            [`${style}Bottom`]: (value) => `${style}-bottom: ${value}`,
            [`${style}Left`]: (value) => `${style}-left: ${value}`,
            [`${style}Right`]: (value) => `${style}-right: ${value}`,
        }
    }


    const $logOptions = {
        group(groupName = 'group') {
            $groupName = groupName
            return _log
        },

        log(...args) {
            _log(...args)
        }
    }


    //* Private methods
    function _log(...args) {
        if ($groupName) _logGroup(...args)
        else _logCSS(...args);
        $groupName = ''
        $styleStrs = []
    }

    function _logGroup(...args) {
        console.group($groupName)
        _logCSS(...args)
        console.groupEnd()
    }

    function _logCSS(...args) {
        console.log('%c' + args.join(' '), $styleStrs.join(';'));
    }


    function _addStyleStr(style) {
        $styleStrs.push(style)
        return _log
    }

    //* _log getters/methods Configuration
    for (const styleName in $styleOptions) {
        const getStyle = $styleOptions[styleName]
        Object.defineProperty(_log, styleName, {
            get() {
                return getStyle.length
                    ? (...args) => _addStyleStr(getStyle(...args))
                    : _addStyleStr(getStyle())
            }
        })
    }

    for (const opt in $logOptions) {
        const optMethod = $logOptions[opt]
        _log[opt] = optMethod
    }

    return _log
})()


/**
 * Converts a camelCase string to kebab-case.
 *
 * @param {string} str - The camelCase string to convert.
 * @returns {string} - The converted kebab-case string.
 */
function convertCamelToKebab(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}