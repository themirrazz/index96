//!wrt
/*
Chm96: Read CHM Files on Windows96!
*/

function ChmFile(ui8) {
  this.ui8=ui8;
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
    if(rawText.slice(i).indexOf('�����������������')==0||rawText.slice(i).indexOf("'/a~�<")==0){
      ended=true;
      if(cdr!=""){
        dirs.push(cdr);
      }
      break
    } else if(cd==1||cd==0){
      x=false
      if(cdr!=""){
        dirs.push(cdr);
      }
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
  return {
    dirs: dirs
  }
}

var path="C:/CHMData-"+(Math.random()*4992934)
var ff=await w96.FS.readstr(current.boxedEnv.args[1]);
alert("CHMData at "+path)
w96.FS.writestr(path,JSON.stringify(parseChm(ff)));
