"use strict";

function createReducer(initState = {}, actionHandler) {
	return (state = initState, action) => {
		if (actionHandler[action.type]) {
			return actionHandler[action.type](state, action);
		}
		return state;
	};
}

module.exports = createReducer;
