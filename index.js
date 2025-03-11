const path = require("path")
const ytdl = require("@distube/ytdl-core");
const express = require("express")

const PORT = 3000
const app = express()

async function getHighestQualityVideoUrl(videoUrl) {
    try {
        const info = await ytdl.getInfo(videoUrl);
        
        // Filter only formats that contain both audio and video
        const formats = info.formats.filter(format => format.hasAudio && format.hasVideo);
        
        // Sort by quality (highest bitrate and resolution)
        const bestFormat = formats.sort((a, b) => {
            return (b.bitrate || 0) - (a.bitrate || 0) || (b.height || 0) - (a.height || 0);
        })[0];

        if (bestFormat) {
            console.log("Best video URL:", bestFormat.url);
            return bestFormat.url;
        } else {
            console.log("No suitable format found.");
            return ""
        }
    } catch (error) {
        console.error("Error fetching video info:", error);
        return ""
    }
}

app.get("/", (req, res)=>{
    res.sendFile(path.resolve("./index.html"))
})

app.get("/api/mp4",async(req,res)=>{
    let url = ""
    try{
    url = await getHighestQualityVideoUrl(req.query.url)
    }catch(err){}

    if(req.query.redirect="1"){
        res.redirect(url)
    }else{
        res.json({url})
    }
})

app.use((req,res)=>{
    res.redirect("/")
})

app.listen(PORT, ()=>{
    console.log(`App running on port: ${PORT}`)
})