const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const urlschema = require("./models/urlschema")
connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json()); 
//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/url', require('./routes/urlroute'));
app.get('/', (req, res) => {
  res.send('Hello Ambikesh!')
})

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await urlschema.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    const createdDate = new Date(entry.createdAt);
    const timeDifference = new Date() - createdDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    console.log(hoursDifference);
    if(hoursDifference>=48){
        res.send("link is expired")
    }else{
    res.redirect(entry.redirectURL);
    }
  });

app.listen(port, () => { 
  console.log(`Your app listening on port ${port}`)
})