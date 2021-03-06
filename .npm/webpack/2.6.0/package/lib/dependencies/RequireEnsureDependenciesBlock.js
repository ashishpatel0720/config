/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";
const AsyncDependenciesBlock = require("../AsyncDependenciesBlock");
const RequireEnsureDependency = require("./RequireEnsureDependency");

module.exports = class RequireEnsureDependenciesBlock extends AsyncDependenciesBlock {
	constructor(expr, successExpression, errorExpression, chunkName, chunkNameRange, module, loc) {
		super(chunkName, module, loc);
		this.expr = expr;
		const successBodyRange = successExpression && successExpression.body && successExpression.body.range;
		const errorBodyRange = errorExpression && errorExpression.body && errorExpression.body.range;
		this.range = null;
		if(successBodyRange) {
			if(errorBodyRange) {
				this.range = [successBodyRange[0] + 1, errorBodyRange[1] - 1];
			} else {
				this.range = [successBodyRange[0] + 1, successBodyRange[1] - 1];
			}
		}
		this.chunkNameRange = chunkNameRange;
		const dep = new RequireEnsureDependency(this);
		dep.loc = loc;
		this.addDependency(dep);
	}
};
