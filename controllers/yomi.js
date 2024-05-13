import masterList from "../models/resource.json" assert { type: "json" };

//const masterList = require('../models/resource.json')


console.log("controller here")

const getYomi = async (req, res) => {
    const character = req.params.chr;
    try{
        const yomi = await masterList[character];
        if (!yomi){
            return res.status(404).json({ error: "Character not found"});
        }
        return res.json({yomi});
    } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
} 

export default getYomi;

//module.exports = getYomi