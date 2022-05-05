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
var ff=ui8tostr(await w96.FS.readbin(current.boxedEnv.args[1]));
alert("CHMData at "+path)
w96.FS.writestr(path,JSON.stringify(parseChm(ff)));
