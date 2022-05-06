//!wrt
/*
Chm96: Read CHM Files on Windows96!
*/

var specialString=`\u1101\u3243\u2727\u8818\u9989\u1234\u6374\u8423\u1524\u3b33\uabcd\u8383\uEeEE\u8133\u8ee8\u456d\u80ff\u1333\u6789\u0993`;

function ChmFile(ui8) {
  this.ui8=ui8;
}




function ui8tostr(ui8){
var len=ui8.byteLength||ui8.length;
var str="";
for(var i=0;i<len;i++){
str+=String.fromCharCode(ui8[i]);
}
return str;
}

function ui8toarr(ui8){
var len=ui8.byteLength||ui8.length;
var str=[];
for(var i=0;i<len;i++){
str.push(ui8[i]);
}
return str;
}


// utility function
// useful for parsing header and data
function strToBytes(s){
var bytes=[];
for(var i=0;i<s.length;i++){bytes.push(s.charCodeAt(i))}
return bytes
}

function joinBytes(bytes){
    var str="";
    for(var i=0;i<bytes.length;i++){
        str+=bytes[i]+":"
    }
    str=str.slice(0,str.length-1);
    return str
}

function splitBytes(bst){
    return bst.split(":");
}

async function fetchChm(ui8){
    var arr=ui8toarr(ui8);
    //alert(arr.slice(20,24));//debugging
    var byteText=joinBytes(arr);
    var headers=arr.slice(0,56); // $38 byte header;
    var dirs=byteText.indexOf(
        joinBytes(
            strToBytes("PMGL")
        )
    );
    //alert(dirs); // for debugging
    /*alert(
        arr[arr.indexOf(47,35,73,68)-1]
        +":"+
        ``.charCodeAt(0)
    ) // more debugging*/
    var prom=new Promise(function(x){x()})
    var start=arr.indexOf(1,47)+1;
    var x=true;
    var ended=false;
    var dirs=[];
    var secs={};
    var ccs={};
    var cdr=""
    //alert(arr.slice(8318,8328))//also debugging!
  for(var d=0;!ended;d++){
      await new Promise(function(x){setTimeout(function(){x()})});
    try{
    var i=start+d;var cd=arr[i];var g=String.fromCharCode(cd);
    if(isEnd(arr.slice(i))){
      ended=true;
      if(cdr!==""&&dirs.indexOf(cdr)<0){dirs.push(cdr);
      ccs[cdr]=await getContentSection(i,cdr,arr)}
      start=i+2;
      x=false;
      cdr="";
      break
    } else if(cd==1||cd==0){
      x=false
      if(cdr!==""&&dirs.indexOf(cdr)<0){dirs.push(cdr);
      ccs[cdr]=await getContentSection(i,cdr,arr)}
      cdr="";
    } else if(g=='/'){
      x=true;
      cdr+=g;
    } else if(isSysDC(g,gg)&&!x){
        x=true;cdr+=":"
    } else {
      if(x){
        cdr+=g
      }
    }
    }catch(e){ended=true;break}
  }
  ended=false
  for(var d=0;!ended;d++){
      await new Promise(function(x){setTimeout(function(){x()})});
    try{
    var i=start+d;var cd=arr[i];var g=String.fromCharCode(cd);var gg=String.fromCharCode(arr[i+1])
    if(isEnd(arr.slice(i))){
      ended=true;
      if(cdr!==""&&dirs.indexOf(cdr)<0){dirs.push(cdr);
      ccs[cdr]=await getContentSection(i,cdr,arr)}
      break
    } else if(cd==1||cd==0){
      x=false
      if(cdr!==""&&dirs.indexOf(cdr)<0){dirs.push(cdr);
      ccs[cdr]=await getContentSection(i,cdr,arr)}
      cdr="";
    } else if(g=='/'){
      x=true;
      cdr+="/";
    } else if(isSysDC(g,gg)&&!x){
        x=true;cdr+=":"
    } else {
      if(x){
        cdr+=g
      }
    }
    }catch(e){ended=true;break}
  }
  var rdl=[];
  for(var i=0;i<dirs.length;i++){
    if(dirs[i].indexOf("\n")<0){
      rdl.push(dirs[i]);
    }
  }
  return {
    dirs: rdl,
    contentSections:ccs
  }
}
function isEnd(A){
    if(!A){return true}
    if(A.length==0){return true}
    var ends=[
        [162,230,94,170,90]
    ]
    var has=[]
    for(var i=0;i<ends.length;i++){
        has=[];
        for(var a=0;a<ends[i].length;a++){
            if(A[a]==ends[i][a]){has.push(ends[i][a])}
        }
        if(has.join(":")==ends[i].join(":")){
            return true
        }
    }
    return false
}



function isSysDC(a,b){
    return (a==':'&&b==':')
}

var winlang_ID=[
    "ukl",
    "en-US",
    "en-GB",
    "fr",
    "es",
    "de",
    "jp"
];
var winlang_Lgnm=[
    "Unknown",
    "US English",
    "UK English",
    "French",
    "Spanish",
    "German",
    "Japanese"
];


function getWindowsLanguageId(n){
    /* todo */
    return 0;
}

function checkBytes(A,z){
    if(!A){return true}
    if(A.length==0){return true}
    var ends=[
        z
    ]
    var has=[]
    for(var i=0;i<ends.length;i++){
        has=[];
        for(var a=0;a<ends[i].length;a++){
            if(A[a]==ends[i][a]){has.push(ends[i][a])}
        }
        if(has.join(":")==ends[i].join(":")){
            return true
        }
    }
    return false
}

function indexOfBytes(a,b){
    if(!a){return -1}
    var magicnum=-1;
    for(var i=0;i<a.byteLength||a.length;i++) {
        if(checkBytes(a.slice(i),b)) {
            magicnum=i;
            break
        }
    }
    return magicnum
}

function lastIndexOfBytes(a,b){
    if(!a){return -1}
    var magicnum=-1;
    for(var i=0;i<a.byteLength||a.length;i++) {
        if(checkBytes(a.slice(i),b)) {
            magicnum=i;
        }
    }
    return magicnum
}

async function chmparser(ui8) {
    var arr=ui8toarr(ui8);
    var bytes=arr;
    var chmdata={
        lang:`${bytes[0x14]}${bytes[0x15]}${bytes[0x16]}${bytes[0x17]}`
    };
    var dhl=chmdata.dirHeaderLength=arr[
        indexOfBytes(
            arr,
            strToBytes("ITSP")
        )+8
    ];
    /*alert(arr[
        indexOfBytes(
            arr,
            strToBytes("ITSP")
        )+0x2c
    ])//debugging*/
    var dirlist=[];
    var files={};
    var dirstart=indexOfBytes(
        arr,
        strToBytes("ITSP")
    )+110;
    var pmgl=indexOfBytes(
        arr,
        strToBytes("PMGL")
    );
    var pmglNumI=pmgl+4;
    //alert(arr[pmglNumI])
    //alert(arr[8469])
    /*alert(
        String.fromCharCode(arr[dirstart])
    )//more debugging*/
    /*alert(arr[dirstart-1])//debug*/
    var cwd="";
    var searchingfordir=false;
    var fdnl=arr[dirstart-1];
    for(var i=0;i<arr.length;i++){
        if(i==4){
            chmdata.chmVersion=bytes[i];
        }
        if(i==dirstart) {
            searchingfordir=true;
            for(var x=0;x<fdnl;x++){
                cwd+=String.fromCharCode(arr[i+x])
            }
            i+=x;
            dirlist.push(cwd);
            files[cwd]={
                'filePath':cwd,
                'contentSection':String(arr[i]),
                'decompressedLength':String(arr[i+2]),
                'decompressedOffset':String(arr[i+1])
            }
            i+=6;
            cwd="";
        }
        if(searchingfordir&&onlyZeros(arr.slice(i,i+174))) {
            searchingfordir=false
        }
    }
    chmdata.fseList=dirlist;
    chmdata.fse=files;
    chmdata.lang=winlang_ID[getWindowsLanguageId(chmdata.lang)]
    return chmdata;
}

async function getContentSection(i,path,bytes){
    /* TODO: get a file's content section */
    //alert('::ContSec'+path+" == "+bytes[i])
    return 'content'+bytes[i];
}

function onlyZeros(bytes){
    for(var i=0;i<bytes.byteLength||bytes.length;i++){
        if(bytes[i]!==0){return false}
    }
    return true;
}


function parseChm(rawText) {
  var header=rawText.slice(0,38);// $38 byte header
  var dirs=rawText.indexOf("PMGL");
  var indx=rawText.indexOf("PMGI");
  var f=rawText.indexOf("/");
  if(f<0){return 0}
  f=f+1;
  var ended=false;
  var dirs=[];
  var cdr="";
  var ecr="���!";
  var x=true
  for(var d=0;!ended;d++){
    try{
    var i=f+d;var g=rawText[i];var cd=g.charCodeAt(0);
    if((rawText.slice(i).indexOf('�����������������')==0)||(rawText.slice(i).indexOf("'/a~�<")==0)||(rawText.slice(i).indexOf("\n"+String.fromCharCode(65533))===0)||(rawText.slice(i).indexOf("/a~")==0)){
      ended=true;
      if(cdr!==""){dirs.push(cdr);}
      break
    } else if(cd==1||cd==0){
      x=false
      if(cdr!==""){dirs.push(cdr);}
      cdr="";
    } else if(g=='/'){
      x=true;
      cdr+="/";
    } else {
      if(x){
        cdr+=g
      }
    }
    }catch(e){ended=true;break}
  }
  var rdl=[];
  for(var i=0;i<dirs.length;i++){
    if(dirs[i].indexOf("\n")<0){
      rdl.push(dirs[i]);
    }
  }
  return {
    dirs: rdl
  }
}

var path="C:/CHMData-"+(Math.random()*4992934)+".chmdata"
var ff=await w96.FS.readbin(current.boxedEnv.args[1]);
var load=w96.ui.MsgBoxSimple.idleProgress(
    "HtmChm",
    "Loading CHM..."
)
var chm=await /*fetchChm*/chmparser(ff);
load.closeDialog()
alert("CHMData at "+path)
w96.FS.writestr(path,JSON.stringify(chm));
