const buble = require('rollup-plugin-buble');

module.exports = function (config) {
	config.set({
		basePath: '',
		files: [
			'src/*.js'
		],
		preprocessors: {
			'src/*.js': ['rollup']
		},
		frameworks: ['mocha', 'chai'],
		rollupPreprocessor: {
			plugins: [
				buble()
			],
			format: 'iife',
			moduleName: 'tests'
		},
		client: {
			mocha: {
				reporter: 'html',
				ui: 'bdd',
			}
		},
		colors: true,
		reporters: ['mocha'],
		browsers: ['Chrome']
	});
};