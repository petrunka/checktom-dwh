var path = require('path'),
    appDir = path.dirname(require.main.filename);
var fs = require('fs');
var im = require('imagemagick');
im.identify.path = "C:/Program Files/ImageMagick-6.8.9-Q16/identify";
im.convert.path = "C:/Program Files/ImageMagick-6.8.9-Q16/convert";
// im.identify.path = "E:/ImageMagick-6.8.9-Q8/identify";
//im.convert.path = "E:/ImageMagick-6.8.9-Q8/convert";

function getExtension(filename) {
    return filename.split('.').pop();
}
// photoUploadandResize takes an image file. Iterates on the variables of that image files such as name/path.
// and saves/overwrites the image on the server if their names are identical (for this we use the articleid) to ensure each article only has 1 image.
exports.photoUploadAndResize = function (articleId, filesObject) {
    // multipart form parse output in form of "files.image0-9"
    // takes the multipart file from the form.
    var ArtId = articleId;
    var files = filesObject;

    for (i = 0; i < 1; i++) {
        console.log("i=" + i);
        // vigtigt at differentiere mellem files[image0] og files[0],
        // den første er ikke en array, men returnere bare propertien image0 på files hvis den eksistere.
        if (typeof files["image" + i] !== 'undefined' && typeof files["image" + i].name !== 'undefined' && files["image" + i].name !== null && files["image" + i].name !== '') {
            var img = files["image" + i];
            console.log('passed the if statement');
            fs.readFile(img.path, function (err, data) {
                if (err) {
                    console.log("error" + err);
                    return false;
                } else {
                    console.log('in the readfile');
                    var imageName = img.name;
                    console.log("imagename:" + imageName);
                    var fileExtension = '' + getExtension(imageName);
                    // checks picture formats
                    if ((fileExtension == 'jpg') || (fileExtension == 'png') || (fileExtension == 'tiff') || (fileExtension == 'gif') || (fileExtension == 'bmp') || (fileExtension == 'jfif') || (fileExtension == 'svg') || (fileExtension == 'cgm')) {
                        console.log('file extensions supported');
                        /// If there's an error
                        if (!imageName) {
                            console.log("There was an error")
                            return false;
                        } else {

                            // create the paths where we want our files to go on server.
                            var newPath = "./Uploads/fullpics/" + ArtId + "." + fileExtension;
                            var thumbs = "./Uploads/thumbs/" + ArtId + "." + fileExtension;

                            /// write full file to temp folder
                            fs.writeFile(newPath, data, function (err) {
                                if (err) {
                                    console.log("fs writefile error:" + err);
                                    return false;
                                } else {
                                    // if the image is bigger than 700 resize it down to 700.
                                    im.identify(newPath, function (err, pictureInfo) {
                                        if (err) {
                                            console.log(err);
                                            return false;
                                        }
                                        console.log("picture uploaded width: " + pictureInfo.width);
                                        if (pictureInfo.width > 700) {
                                            im.resize({
                                                srcPath: newPath,
                                                dstPath: newPath,
                                                width: 700
                                            }, function (err, stdout, stderr) {
                                                if (err) {
                                                    console.log("imagemagick error: " + err);
                                                    // delete the files, if error happened. Or maybe try again before canceling.
                                                    unlink(newPath);
                                                    unlink(thumbs);
                                                    // try again, exit the function. (assuming return takes us out of the exported function)
                                                    return false;
                                                }
                                                console.log('resized image to fit within 700px');
                                            });
                                        } else {
                                            console.log('image within 700px width, no resize needed');
                                        }
                                        // write a resized file to thumbs folder
                                        im.resize({
                                            srcPath: newPath,
                                            dstPath: thumbs,
                                            width: 230
                                        }, function (err, stdout, stderr) {
                                            if (err) {
                                                console.log("imagemagick error: " + err);
                                                // delete the files, if error happened. Or maybe try again before canceling.
                                                unlink(newPath);
                                                unlink(thumbs);
                                                // try again, exit the function. (assuming return takes us out of the exported function)
                                                return false;

                                            }
                                            console.log('resized image to fit within 230px');
                                        });
                                    });
                                }
                            });

                        }
                    } else {
                        console.log('not a supported image format. jpg, png, exif, tiff, gif, bmp, png')
                    }
                }
            });
            return true;
        } else {
            console.log("undefined or nothing uploaded");
            return false;
        }


    } // "for loop" wrapper end
}
exports.getPicture = function (filename,filesize, res) {
    // show image function, not customized for specific purpose.
    file = filename;
    console.log(file);
    console.log("directory"+appDir);
    if(filesize==='fullpic'){
        var img = fs.readFileSync(appDir + "/Uploads/fullpics/" + file);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    }else if(filesize === 'thumb'){
        var img = fs.readFileSync(appDir + "/Uploads/thumbs/" + file);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    }else{
        console.log('image not here');
        res.end(400,'image does not exist on server');
    }


}

// unlink uses the filesystem to delete a file.
// Make sure we dont leave a full pic if it failed the resize for whatever reason.
function unlink(path) {
        console.log("imagemagick error: " + err);
        // delete the files, if error happened. Or maybe try again before canceling.
        fs.unlink(path, function (err) {
            if (err) {
                console.log("unlinking error.");
                console.log(err);
            }
            console.log('successfully deleted ' + path);
        });

}