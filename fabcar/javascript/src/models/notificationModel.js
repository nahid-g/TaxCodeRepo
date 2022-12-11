const mongoose = require("mongoose");

notificationScema = new mongoose.Schema({
    companyName: {
        type: String,
        require: true,
    },
    
    modelName: {
        type: String,
        required: true,
    },


    unitNumber: {
        type: String,
        required: true,
    },
    costPerUnit: {
        type: String,
        required: true,
    },
    prevModelName: {
        type: String,
        required: true,
    },

    
    prevUnitNumber: {
        type: String,
        required: true,
    },
    prevCostPerUnit: {
        type: String,
        required: true,
    },

    reason: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    }

});

const Notification = mongoose.model("Notification", notificationScema);

module.exports = Notification;
