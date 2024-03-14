import mongoose from 'mongoose'

const solutionSchema = new mongoose.Schema({
  department : {
    type: String,
    required: true
  },
  problemStatementID: {
    type: Number,
    required: true
  },
    file: {
    type: String,
    required: false,
  },
  description : {
    type: String,
    required: true
  },
    createdAt: {
        type: Date,
        default: Date.now
    },
     userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }

});

export const Solution = mongoose.model('Solution', solutionSchema);