import { Router } from "express";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/requireAuth.js";
const router = Router();
const USERS = [{ id:"u1", email:"student@hawk.illinoistech.edu", password:"Password123!", name:"Hawk Student"}];
const isProd = process.env.NODE_ENV === "production";
const sign = (u)=> jwt.sign({ id:u.id, email:u.email, name:u.name }, process.env.JWT_SECRET, { expiresIn:"1h" });

router.post("/login", (req,res)=>{
  const {email,password} = req.body||{};
  const user = USERS.find(u=>u.email===email && u.password===password);
  if(!user) return res.status(401).json({error:"Invalid credentials"});
  const token = sign(user);
  res.cookie("token", token, { httpOnly:true, sameSite: isProd ? "none":"lax", secure: isProd, maxAge: 3600_000 });
  res.json({ user: { id:user.id, email:user.email, name:user.name } });
});

router.get("/me", requireAuth, (req,res)=> res.json({ user: req.user }));
router.post("/logout",(req,res)=>{ res.clearCookie("token",{ httpOnly:true, sameSite:isProd?"none":"lax", secure:isProd }); res.json({ok:true});});
export default router;
