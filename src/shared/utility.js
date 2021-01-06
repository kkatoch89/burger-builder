// Refactoring
export const updateObject = (oldObj, updatedProps) => {
	return {
		...oldObj,
		...updatedProps,
	};
};

export const checkValidity = (value, rules) => {
	let isValid = true;

	if (rules.required) {
		// value.trim() removes white space in the beginning and end
		isValid = value.trim() !== '' && isValid; // && isValid is to check if isValid was already true
	}

	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid;
	}

	if (rules.maxLength) {
		isValid = value.length <= rules.maxLength && isValid;
	}

	return isValid;
};
