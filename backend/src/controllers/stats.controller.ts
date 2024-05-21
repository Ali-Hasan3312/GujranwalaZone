import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.middleware.js";

export const getDashboardStats = TryCatch(async(req,res,next)=>{
   
    let stats = {}
    if(myCache.has("admin-stats")){
        stats = JSON.parse(myCache.get("admin-stats") as string)
    }else{
        const today = new Date();
    }

    return res.status(200).json({
        success:true,
        stats
    })


});
export const getPieChart = TryCatch(async(req,res,next)=>{

});
export const getLineChart = TryCatch(async(req,res,next)=>{

});
export const getBartChart = TryCatch(async(req,res,next)=>{

});