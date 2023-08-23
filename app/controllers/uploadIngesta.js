const multer = require('multer')
const path = require('path')
const fs = require('fs')

//const ffmpeg = require('ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
var id = 0; 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        id = '15';
        const path = `uploads/videos/${id}`
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    } 
})
 
const upload = multer({ storage: storage })

exports.upload = upload.single('fileIngesta')

exports.uploadFile = (req, res) => {

    //Videos
    var pathVideoInfo =  req.file.destination;
    var fileInfo = path.parse(req.file.filename);
    var videoPath = pathVideoInfo + "/" + fileInfo.name + '.mp4';
    var outVideoPath =  pathVideoInfo + "/compress_" + fileInfo.name + '.mp4';
   
    //Thumbnails
    
    var thumbnailPath = `uploads/thumbnails/${id}`
    fs.mkdirSync(thumbnailPath, { recursive: true })

    ffmpeg(videoPath)
    .on('end', function() {
      console.log('INGESTA ON: Screenshots successfully');
    })
    .on('error', function(err) {
      console.error(err);
    })
    .screenshots({
      count: 10,
      filename: "ingesta_%i.png",
      folder: thumbnailPath
    });
    const width = 640;
    const height = 480;
    const bitrate = '800k';
    
    ffmpeg(videoPath)
      .size(`${width}x${height}`)
      .videoBitrate(bitrate)
      .save(outVideoPath)
      .on('end', () => {
        console.log('INGESTA ON: Video resolution and file size have been changed successfully');
      })
      .on('error', (err) => {
        console.log('Error: ' + err.message);
      });
    
  
    res.send({ IngestaON: 'Archivo recibido con éxito: '+new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '')+'' })
}