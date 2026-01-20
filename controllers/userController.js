import e from 'express';
import User from '../models/user.js';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function createUser(req, res) {

    //hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const user = new User(
        {
            firstName : req.body.firstName,
            email : req.body.email,
            lastName : req.body.lastName,
            password : hashedPassword,
        }
    )

    user.save().then(
        ()=>{
            res.status(201).json(
                {
                    message : "user created successfully",
                }
            )
        }
    ).catch (
        ()=>{
            res.status(500).json(
                {
                    message : "user creation failed"
                }
            )
        }
    )
}

export function loginUser(req, res){

    User.findOne(
        {
            email : req.body.email
        }
    ).then (
        (user)=>{

            if(user == null){
                res.status(404).json({
                    message : "user is given email  not found"
                })
            }
            else {

                const isPasswordValid = bcrypt.compareSync(req.body.password, user.password)

                if(isPasswordValid){

                    const token = jwt.sign({
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        image : user.image,
                        isEmailVerified : user.isEmailVerified
                    },
                     process.env.JWT_SECRET
                );


                    res.status(200).json({
                        message : "user logged in successfully",
                        token : token,
                        role : user.role,
                    })
                    
                }
                else{
                    res.status(404).json({
                        message : "invalid password"
                    })
                }
            }

        }
    ).catch(
        ()=>{
        res.status(500).json(
            {
                message : "internal server err"
            }
        )
        }
    )
}

export function isAdmin(req){

    if(req.user == null) {
        return false
    }
    if(req.user.role == "admin") {
        return true
    }
    else {
        return false
    }

}