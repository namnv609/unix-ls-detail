const exec = require("child_process").exec;
const WordTable = require("word-table");
const permissionOctal = {
  "r": 4,
  "w": 2,
  "x": 1,
  "-": 0
};
const permissionFlag = {
  "d": "Directory",
  "l": "Symbolic links",
  "c": "Character file",
  "-": "File",
};

exec("ls -alh", function(err, stdout, stderr) {
  if (!err) {
    var fileList = stdout.split("\n").slice(1, -1);
    fileExtractor(fileList);
  } else {
    console.log(stderr);
  }
});

function fileExtractor(fileList) {
  var wordTable         = new WordTable();
  var tableHeaders      = ["Name", "Type", "Octal", "Links", "Owner", "Group", "Size", "Modified"];
  var tableBodies       = [];

  for (var fileIdx in fileList) {
    fileInfo = fileList[fileIdx].replace(/\s+/g, " ").split(" ");
    tableBodies[fileIdx] = [];

    var filePermission    = fileInfo.splice(0, 1).toString();
    var numberOfLinks     = fileInfo.splice(0, 1);
    var fileOwner         = fileInfo.splice(0, 1);
    var fileGroup         = fileInfo.splice(0, 1);
    var fileSize          = fileInfo.splice(0, 1);
    var fileLastModified  = fileInfo.splice(0, 3);
    var permissionOctal   = filePermissionOctalCalc(filePermission);
    var fileFlag          = permissionFlag[filePermission.split("")[0]];

    tableBodies[fileIdx].push(
      fileInfo.join(" "), fileFlag, permissionOctal.join(""), numberOfLinks.toString(),
      fileOwner.toString(), fileGroup.toString(), fileSize.toString(), fileLastModified.join(" ")
    );
  }

  wordTable.setHeader(tableHeaders);
  wordTable.setBody(tableBodies);

  console.log(wordTable.string());
}

function filePermissionOctalCalc(filePermission) {
  filePermission          = filePermission.split("");
  var filePermissionOctal = [];
  var permissionFlag      = filePermission.splice(0, 1).toString();

  for (var i = 0; i < 3; i++) {
    var permission = filePermission.splice(0, 3);
    var octalPermission = 0;

    for (idx in permission) {
      octalPermission += permissionOctal[permission[idx]];
    }

    filePermissionOctal.push(octalPermission);
  }

  return filePermissionOctal;
}
