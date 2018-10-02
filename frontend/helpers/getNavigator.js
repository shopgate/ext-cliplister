/**
 * Navigator as a module, since it's not possible (or difficult) to mock global.navigator
 * with jest.
 * @returns {Object}
 */
export default () => navigator;
