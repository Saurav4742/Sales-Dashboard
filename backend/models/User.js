import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please add a name"]
    },
    email:{
        type:String,
        required:[true,"Please add an email"],
        unique:[true,"email already registered"],
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
        minLength:[6,"password must be atleast 6 characters long"],
    },
    photo:{
        type:String,
        required:[true, "Please add a photo"],
        default:"https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
    },
    phone:{
        type:String,
    },
    bio:{
        type:String,
        maxLength:[250,"Bio must not be more than 250 characters"],
        default:"bio"
    }
},{
    timestamps:true
});

userSchema.pre('save',async function (next){
    if(!this.isModified("password")) return next();

    // hashing the password whenever it is modified before saving to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password,salt);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model("User",userSchema);

export default User;