import { Request, Response } from "express"
import prisma from "../db/prisma.js"
import bcryptjs from "bcryptjs"
import { profile } from "console";

export const signup = async(req:Request,res:Response)=>{
    try{
        const { fullName, username,password,confirmPassword, gender} = req.body;
        if( !fullName || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({error : "Please fill in all required fields"});
        }
        if( !password !== !confirmPassword){
            return res.status(400).json({error : "Password don't match"});
        }
        const user = await prisma.user.findUnique({where: { username } });

        if(user){
            return res.status(400).json({ error: "Username alreadt exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        // avatar placeholder for menn og kvinner, https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = 'https://avatar.iran.liara.run/public/boy'
        const girlProfilePic = 'https://avatar.iran.liara.run/public/girl'

        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,         
            }
        });

        if(newUser){

            generateToken(newUser.id, res)

            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ error: "Invalid data" });
        }

    }catch(error: any){
        console.log("Eorr in signup controller", error.message);
        res.status(500).json({error : "Internal Server Error" });
    }
    
};
export const login = async(req:Request,res:Response)=>{}
export const logout = async(req:Request,res:Response)=>{}
