import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

interface BestPractice {
    ID: ObjectId;
}

interface BestPractices {
    IDs: BestPractice[];
}

export interface IUser extends Document {
    email: string;
    username: string;
    name?: string;
    password: string;
    resetToken?: string;
    resetTokenExp?: Date;
    bestPractices: BestPractices;
    addBP(bestPractice: BestPractice): Promise<IUser>;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
    bestPractices: {
        IDs: [
            {
                ID: {
                    type: Schema.Types.ObjectId,
                    ref: 'Best Practice',
                },
            },
        ],
    },
});

userSchema.methods.addBP = function (bestPractice: BestPractice): Promise<IUser> {
    const IDs = [...this.bestPractices.IDs];
    IDs.push(bestPractice.ID);

    this.bestPractices = { IDs };
    return this.save();
};

export default model<IUser>('User', userSchema);
