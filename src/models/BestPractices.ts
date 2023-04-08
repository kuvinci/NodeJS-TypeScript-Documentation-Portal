import { Schema, model, Document, ObjectId } from 'mongoose';

interface BestPractice extends Document {
    title: string;
    type_dahboard?: string;
    type_wp?: string;
    type_php?: string;
    type_css?: string;
    content: string;
    userID: ObjectId;
}

const bestPracticeSchema = new Schema<BestPractice>({
    title: {
        type: String,
        required: true
    },
    type_dahboard: {
        type: String,
    },
    type_wp: {
        type: String,
    },
    type_php: {
        type: String,
    },
    type_css: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default model<BestPractice>('Best Practice', bestPracticeSchema);