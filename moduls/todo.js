const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    username: String,
    password: String,
    name: String,
    description: String,
    status: String,
    dateline: Date
});
todoSchema.methods.done = function() {
    if (this.status === 'done') {
        return true;
    }
    return false;
}


let ToDo = mongoose.model('ToDo', todoSchema);

module.exports = ToDo;