/**
 * Yomi controller retrieves the hiragana equivalent of characters."
 */

// Commented out, real data:
// import masterList from "../models/resource.json" assert { type: "json" };

// Test data:
import masterList from "../models/tempData.json" assert { type: "json" };

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
