const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const uglify = require('rollup-plugin-uglify');
const filesize = require('rollup-plugin-filesize');
const replace = require('rollup-plugin-replace');
const nodeResolve = require('rollup-plugin-node-resolve');
const p = require('path');
const pack = require('./package.json');

function withNodeResolve(arr, resolveConfig) {
	const newArray = Array.from(arr);
	const index = newArray.findIndex(plugin => plugin.name === 'buble');

	newArray.splice(index + 1, 0, nodeResolve(resolveConfig));
	return newArray
}

let plugins = [
	buble({
		objectAssign: 'Object.assign'
	})
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(
		uglify({
			warnings: false,
			compress: {
				screw_ie8: true,
				dead_code: true,
				unused: true,
				drop_debugger: true,
				booleans: true
			},
			mangle: {
				screw_ie8: true
			}
		})
	);
	plugins.push(
		replace({
			VERSION: pack.version,
			'process.env.NODE_ENV': JSON.stringify('production')
		})
	)
} else {
	plugins.push(
		replace({
			VERSION: pack.version,
		})
	)
}

plugins.push(filesize());

function createBundle(path) {
	const copyright =
		'/*!\n' +
		' * fragment-node v' + pack.version + '\n' +
		' * (c) ' + new Date().getFullYear() + ' ' + pack.author.name + '\n' +
		' * Released under the ' + pack.license + ' License.\n' +
		' */';
	const entry = p.resolve('src/index.js');
	const dest  = p.resolve(`dist/fragment-node.${ process.env.NODE_ENV === 'production' ? 'min.js' : 'js' }`);

	const bundleConfig = {
		dest,
		format: 'umd',
		moduleName: 'FragmentNode',
		globals: {
			moduleGlobal: 'FragmentNode'
		},
		banner: copyright,
		sourceMap: false
	};

	// Skip bundling dependencies of each package
	plugins = withNodeResolve(plugins, {
		module: true,
		jsnext: true,
		main: true
	});

	return rollup({ entry, plugins }).then(({ write }) => write(bundleConfig)).catch(err => {
		console.log(err)
	});
}

createBundle();