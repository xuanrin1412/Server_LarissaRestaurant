const mongoose = require("mongoose")

const tableSchema = new mongoose.Schema({
    areaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'area',
        required: true
    },
    tableName: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },

}, {
    timestamps: true,
    // unique: { // Unique constraint for tableName and areaId combined
    //     fields: ['tableName', 'areaId'],
    //     message: 'Table name must be unique within the same area'
    // }
});

tableSchema.index({ tableName: 1, areaId: 1 }, { unique: true });

module.exports = mongoose.model("table", tableSchema)
