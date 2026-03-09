/**
 * @typedef {Object} ToolConfig
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {string} [icon]
 * @property {boolean} [comingSoon]
 * @property {import("react").ComponentType<any>} component
 * @property {(input: unknown, options?: Record<string, unknown>) => unknown | Promise<unknown>} [run]
 */

/**
 * @typedef {Object} ToolCategoryConfig
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {string} path
 * @property {string} icon
 */
