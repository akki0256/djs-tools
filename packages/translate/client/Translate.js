const fs = require('node:fs');

class Translate {
	constructor() {
		/**
		 * @type {Map<String,{[Lang:string]: string}>}
		 */
		this.messages = new Map();
	}

	/**
	 * @param {string} path
	 * @param {(value:fs.Dirent) => unknown} [predicate]
	 * @param {Set<String>} [pre]
	 * @returns {string[]}
	 * @private
	 */
	 GetAllPath(path, predicate, pre = new Set()) {
		if (typeof predicate !== 'function') predicate = (value) => !/^(-|_|\.)/.test(value.name);
		if (!fs.existsSync(path)) return;
		const dir = fs.readdirSync(path, { withFileTypes: true });
		dir.forEach(v => {
			if (v.isFile() && predicate(v)) return pre.add(pathModule.resolve(path, v.name));
			if (v.isDirectory() && predicate(v)) this.GetAllPath(pathModule.resolve(path, v.name), predicate, pre);
		});
		return [...pre];
	}
}