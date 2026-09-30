const HomeModel= require('../models/homeModel');
// Controller function to get home page content                 
const getHomeContent=(req,res)=>{
    HomeModel.getHomeContent((error,result)=>{
    if(error){
        return res.status(500).json({
            success:false,message :"database query failed",error:error.message
        });
    
    }
    res.status(200).json({
        success:true,
        data:result[0]|| {}
    });
    });
};
// Controller function to get featured products for the home page
const getFeaturedProducts=(req,res)=>{
    HomeModel.getFeaturedProducts((error,result)=>{
    if(error){
        return res.status(500).json({
            success:false,message:"database query failed",error:error.message
        });
    }
    res.status(200).json({
        success:true,
        data:result
    });
    });
};
module.exports={getHomeContent,getFeaturedProducts};