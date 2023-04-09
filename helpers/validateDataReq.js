const isNumber = (num) => {
    if (parseInt(num, 10).toString() === num.toString()) {
        return true;
    }
    return false;
};

const validationError = {
    isNumber,
    newData: (data) => {
        const errorMsg = [];
        // heading validation
        if (!data.heading) {
            errorMsg.push('Heading is mandetory');
        } else if (data.encryptdata.heading < 3) {
            errorMsg.push('Password should be alteast 3 charecter');
        }
        // validate data
        if (!data.encryptdata) {
            errorMsg.push('encryptdata is mandetory');
        } else if (data.encryptdata.length < 5) {
            errorMsg.push('Password should be alteast 5 charecter');
        }

        if (errorMsg.length > 0) {
            return errorMsg;
        }
        return null;
    },
    updateData: (data) => {
        const errorMsg = [];
        // heading validation
        if (!data.id) {
            errorMsg.push('id is mandetory ');
        } else if (!isNumber(data.id)) {
            errorMsg.push('id should be number ');
        }
        if (!data.heading) {
            errorMsg.push('Heading is mandetory');
        } else if (data.encryptdata.heading < 3) {
            errorMsg.push('Password should be alteast 3 charecter');
        }
        // validate data
        if (!data.encryptdata) {
            errorMsg.push('encryptdata is mandetory');
        } else if (data.encryptdata.length < 5) {
            errorMsg.push('Password should be alteast 5 charecter');
        }

        if (errorMsg.length > 0) {
            return errorMsg;
        }
        return null;
    }
};

module.exports = validationError;
