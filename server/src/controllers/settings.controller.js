const {encrypt, decrypt} = require("../utils/encryption");
const User = require("../models/user.models");

async function encryptKey(req, res) {
  try {
    const { apiKey, aiModel } = req.body;
    const userId = req.user.id; 

    let newData = {};

    if(aiModel){
      newData.aiModel = aiModel;
    }

    if(apiKey && apiKey.trim() !== ''){
      newData.geminiApiKey = encrypt(apiKey.trim());
    }

    const updatedUser = await User.findByIdAndUpdate(userId, newData, {new: true});
    console.log(updatedUser);

    return res.status(200).json({ 
      message: "API Prefernces updated successfully",
      hasApiKey: !!updatedUser.geminiApiKey, 
      aiModel: updatedUser.aiModel
    });

  } catch (error) {
    console.error("Encryption error:", error);
    return res.status(500).json({ error: "Failed to update settings" });
}
}

async function getSettingsStatus(req, res){
  try {
    const user = await User.findById(req.user.id);
    
    if(!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    return res.status(200).json({
      hasApiKey: !!user.geminiApiKey,
      aiModel: user.aiModel
    });

  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ 
      message: "Failed to fetch settings status" 
    });
  }
};

module.exports = {
    encryptKey,
    getSettingsStatus
}


