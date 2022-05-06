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

function fetchChm(ui8){
    var arr=ui8toarr(ui8);
    var byteText=joinBytes(arr);
    var headers=arr.slice(0,38); // $38 byte header;
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
    var start=arr.indexOf(1,47)+1;
    var x=true;
    var ended=false;
    var dirs=[];
    var cdr=""
    //alert(arr.slice(8318,8328))//also debugging!
  for(var d=0;!ended;d++){
    try{
    var i=start+d;var cd=arr[i];var g=String.fromCharCode(cd);
    if(isEnd(arr.slice(i))){
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

function isEnd(A){
    var ends=[
        [162,230,94]
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

var path="C:/CHMData-"+(Math.random()*4992934)
var ff=await w96.FS.readbin(current.boxedEnv.args[1]);
var chm=fetchChm(ff);
alert("CHMData at "+path)
w96.FS.writestr(path,JSON.stringify(chm));
