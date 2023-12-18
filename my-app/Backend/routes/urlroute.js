const express=require("express");
const urlschema=require("../models/urlschema");
const fetchUser = require("../middleware/fetchUser");
const router=express.Router();
const shortid=require("shortid")

router.post("/createurl",fetchUser,async(req,res)=>{
 const body = req.body;
  // if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();
  await urlschema.create({
    user:req.user.id,
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
  return res.json({ id: shortID });
})

router.get("/analytics/:shortId", async(req, res)=>{
  const shortId = req.params.shortId;
  const result = await urlschema.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
});

router.get("/userlinks", fetchUser, async (req, res) => {
  try {
    const userLinks = await urlschema.find({ user: req.user.id });

    // Calculate total clicks for each link
    const linksWithClicks = await Promise.all(
      userLinks.map(async (link) => {
        const totalClicks = link.visitHistory.length;
        return { ...link.toObject(), totalClicks };
      })
    );

    return res.json(linksWithClicks);
  } catch (error) {
    console.error('Error fetching user links:', error);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
});

module.exports=router;