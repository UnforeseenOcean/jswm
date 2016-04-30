/*-----------------------------------------------------------------------------.
|                 /\______  /\______  ____/\______     __                      |
|                 \____   \/  \__   \/  _ \____   \ __/  \____                 |
|                  / _/  _/    \/   /   /  / _/  _// / / / / /                 |
|                 /  \   \  /\ /   /\  /  /  \   \/ /\  / / /                  |
|                 \__/\   \/RTX______\___/\__/\   \/ / /_/_/                   |
|                      \___)   \__)            \___) \/                        |
|------------------------------------------------------------------------------|
|#################################### JSWM ####################################|
`-----------------------------------------------------------------------------*/

/*jslint white,this,browser,maxlen:80*/
/*global window,jslint*/

var jswm=(function()
{
'use strict';
var _w=window;
var _d=_w.document;
var _u='px';
var _ls=_w.localStorage;

var _i=function(id){return _d.getElementById(String(id));};
var _e=function(e){return _d.createElement(String(e));};
var _t=function(v){return _d.createTextNode(String(v));};
var _r=function(e){return e.parentNode.removeChild(e);};
/*----------------------------------------------------------------------------*/
function wm(cfg) /* constructor */
  {
  cfg.fnt=wm.obj.test(cfg.fnt);
  this.cfg=
    {
    id:wm.str.test(cfg.id,wm.str.rnd(8)),
    root:wm.str.test(cfg.root), /* root id */
    m:wm.int.test(cfg.m,2), /* margin */
    b:wm.int.test(cfg.b,1), /* border */
    fnt:
      {
      f:wm.str.test(cfg.fnt.f,'monospace'),
      s:wm.nbr.test(cfg.fnt.s,8),
      h:wm.nbr.test(cfg.fnt.h,wm.nbr.test(cfg.fnt.s,8)+1),
      m:wm.int.test(cfg.fnt.m,2)
      },
    save:wm.bool.test(cfg.save,true),
    dbg:wm.bool.test(cfg.dbg)
    };
  var sav=wm.ls.get(this.cfg);
  if(!wm.obj.isempty(sav)){this.cfg=wm.obj.merge(this.cfg,sav);}
  /*--------------------------------------------------------------------------*/
  var that=this;
  var vs=function(){return;};
  vs.prototype.constructor=vs;
  vs.prototype.add=function(n,p){return wm.vs.add(that.cfg,n,p);};
  vs.prototype.get=function(n){return wm.vs.get(that.cfg,n);};
  vs.prototype.toggle=function(n){wm.vs.toggle(that.cfg,n);};
  this.vs=new vs();
  var wdw=function(){return;};
  wdw.prototype.constructor=wdw;
  wdw.prototype.add=function(p){return wm.wdw.add(that.cfg,p);};
  wdw.prototype.get=function(id){return wm.wdw.get(that.cfg,id);};
  wdw.prototype.update=function(id,dat){wm.wdw.upd(that.cfg,id,dat);};
  this.wdw=new wdw();
  /*--------------------------------------------------------------------------*/
  wm.icon();
  wm.img.init();
  wm.init(this.cfg);
  }

wm.prototype=
  {
  get:function(p){return this.cfg[p];},
  set:function(p,v){if(this.cfg[p]!==undefined){this.cfg[p]=v;return true;}},
  pi:function(n){return wm.math.pi(n);}
  };

wm.ver=
  {
  maj:0,min:1,build:14,alpha:true,beta:false,
  get:function()
    {
    var ver=this.maj+'.'+this.min+'.'+this.build;
    if(this.alpha||this.beta){ver+=(this.alpha?'\u03b1':'\u03b2');}
    return ver;
    }
  };

wm.id=function(cfg){cfg.n=wm.int.test(cfg.n)+1;return cfg.n;};

wm.dbg=function(cfg)
  {
  cfg.dbg=!wm.bool.test(cfg.dbg);
  var btn=_i('debug-'+cfg.id);
  if(wm.el.test(btn))
    {
    btn.style.backgroundPosition='-'+((cfg.dbg?4:3)*wm.img.vs.h)+_u+' 0'+_u;
    }
  if(cfg.dbg)
    {
    wm.wdw.add(cfg,{id:'dbg-'+cfg.id,txt:'debug',x:8,y:8,w:'30%',h:'50%',m:2});
    wm.lint(cfg,'dbg-'+cfg.id);
    }
  else
    {
    wm.wdw.del(cfg,'dbg-'+cfg.id);
    }
  wm.arr.test(cfg.wdw).forEach(function(v){wm.wdw.dbg(cfg,v.id);});
  };
/*----------------------------------------------------------------------------*/
wm.init=function(cfg)
  {
  cfg=wm.obj.test(cfg);
  var root=_i(cfg.root); if(!wm.el.test(root)){return false;}
  var html=wm.str.test(root.innerHTML);
  root.innerHTML='';
  /* root style */
  root.style.overflow='hidden';
  root.style.userSelect='none';
  root.style.fontFamily=cfg.fnt.f;
  root.style.fontSize=cfg.fnt.s+_u;
  root.style.lineHeight=cfg.fnt.h+_u;
  root.style.textRendering='geometricPrecision';
  root.style[wm.nav.css()+'user-select']='none';
  /* status */
  var sta=_e('div');
  sta.id='sta-'+cfg.id;
  sta.style.position='absolute';
  sta.style.height=(cfg.fnt.s+cfg.m*2)+_u;
  sta.style.backgroundColor=wm.col.format('bdr');
  sta.style.color=wm.col.format('hdr');
  sta.style.overflow='hidden';
  var btn=wm.btn('reset-'+cfg.id,'vs',2);
  btn.style.top=cfg.m+_u;
  sta.appendChild(btn);
  btn.addEventListener('mouseup',wm.ls.reset.bind(null,cfg),false);
  btn=wm.btn('debug-'+cfg.id,'vs',cfg.dbg?4:3);
  btn.style.top=cfg.m+_u;
  sta.appendChild(btn);
  btn.addEventListener('mouseup',wm.dbg.bind(null,cfg),false);
  root.appendChild(sta);
  /* screen */
  wm.vs.add(cfg,1);
  var el=_i('vs'+wm.vs.get(cfg).n+'-'+cfg.id+'-bgd');
  if(wm.el.test(el))
    {
    var ico=_e('div');
    ico.style.backgroundImage='url('+wm.img.icon.url+')';
    ico.style.width=wm.img.icon.w+_u;
    ico.style.height=wm.img.icon.h+_u;
    ico.style.float='left';
    ico.style.margin=cfg.m+_u;
    ico.style.cursor='pointer';
    el.appendChild(ico);
    ico.addEventListener('mouseup',wm.wdw.add.bind(null,cfg),false); /* BUG */
    el.innerHTML+=html;
    }
  /* init */
  wm.sta.init(cfg);
  wm.arr.test(cfg.vs).forEach(function(v){wm.vs.add(cfg,v.n,v);});
  wm.arr.test(cfg.wdw).forEach(function(v){wm.wdw.add(cfg,v);});
  cfg.dbg=!cfg.dbg; wm.dbg(cfg);
  _w.addEventListener('resize',wm.rsz.bind(null,cfg),false);
  _w.addEventListener('mousedown',wm.mse.down.bind(null,null,cfg),false);
  _w.addEventListener('mouseup',wm.mse.up.bind(null,null,cfg),false);
  _w.addEventListener('mousemove',wm.mse.move.bind(null,null,cfg),false);
  var e=wm.nav.isffx?'DOMMouseScroll':'mousewheel';
  _w.addEventListener(e,wm.mse.wheel.bind(null,null,cfg),false);
  _w.addEventListener('selectstart',function(){return false;},false);
  _w.addEventListener('dragstart',function(){return false;},false);
  //_w.addEventListener('contextmenu',function(e){e.preventDefault();},false);
  };
/*----------------------------------------------------------------------------*/
wm.sta={};

wm.sta.get=function(cfg){return wm.el.test(_i('sta-'+cfg.id));};

wm.sta.init=function(cfg)
  {
  var root=_i(cfg.root);
  var sta=wm.sta.get(cfg);
  if(wm.el.test(sta))
    {
    sta.style.width=root.offsetWidth+_u;
    wm.sta.dbg(cfg);
    }
  var btn=_i('reset-'+cfg.id);
  if(wm.el.test(btn))
    {
    btn.style.left=(root.offsetWidth-wm.img.vs.h-cfg.m)+_u;
    }
  btn=_i('debug-'+cfg.id);
  if(wm.el.test(btn))
    {
    btn.style.left=(root.offsetWidth-wm.img.vs.h*2-cfg.m*2)+_u;
    }
  };

wm.sta.dbg=function(cfg)
  {
  var sta=wm.sta.get(cfg);
  var dbg=_i(sta.id+'-dbg');
  if(wm.el.test(dbg)){_r(dbg);}
  if(!cfg.dbg){return false;}
  var root=_i(cfg.root); if(!wm.el.test(root)){return false;}
  var w=cfg.vs.length*(wm.img.vs.h+cfg.m);
  dbg=_e('div');
  dbg.id=sta.id+'-dbg';
  dbg.style.position='absolute';
  dbg.style.left=(cfg.m+w)+_u;
  dbg.style.top=cfg.m+_u;
  dbg.style.width=(root.offsetWidth-wm.img.btn.h-cfg.m*3-w)+_u;
  dbg.style.height=cfg.fnt.s+_u;
  dbg.style.whiteSpace='nowrap';
  dbg.style.textOverflow='ellipsis';
  dbg.style.overflow='hidden';
  var txt='JSWM v'+wm.ver.get()+' | id:'+cfg.id;
  txt+=' | vs:'+wm.vs.get(cfg).txt;
  txt+=' | '+root.offsetWidth+'*'+root.offsetHeight;
  var evt=wm.obj.test(cfg.evt);
  txt+=' | evt:'+(wm.str.test(evt.t)?evt.t+'_'+evt.a:'---');
  txt+=' | mp:'+wm.mse.x+'*'+wm.mse.y;
  dbg.appendChild(_t(txt));
  if(wm.el.test(sta)){sta.appendChild(dbg);}
  };
/*----------------------------------------------------------------------------*/
wm.vs={};

wm.vs.add=function(cfg,n,p)
  {
  var root=_i(cfg.root);
  cfg.vs=wm.arr.test(cfg.vs);
  n=wm.int.test(n,cfg.vs.length+1);
  p=wm.obj.test(p);
  var id='vs'+n+'-'+cfg.id;
  if(wm.el.test(_i('vs'+n+'-'+cfg.id))){wm.vs.toggle(cfg,n);return false;}
  var txt=wm.str.test(p.txt,'screen '+n);
  var vs=_e('div');
  vs.id=id;
  vs.style.position='absolute';
  vs.style.top=(cfg.fnt.s+cfg.m*2)+_u;
  vs.style.backgroundColor=wm.col.format('bgd');
  vs.style.color=wm.col.format('hdr');
  vs.style.overflow='hidden';
  /* background */
  var bgd=_e('div');
  bgd.id=id+'-bgd';
  bgd.style.position='absolute';
  vs.appendChild(bgd);
  /* name */
  var name=_e('div');
  name.id=id+'-name';
  name.style.position='absolute';
  name.style.color=wm.col.format('txt');
  name.style.textAlign='right';
  name.appendChild(_t(txt));
  vs.appendChild(name);
  /* status button */
  var x=cfg.vs.length;
  cfg.vs.forEach(function(v,i){if(v.n===n){x=i;}});
  var btn=wm.btn(id+'-btn','vs');
  btn.style.left=(cfg.m+x*(wm.img.vs.h+cfg.m))+_u;
  btn.style.top=cfg.m+_u;
  var sta=wm.sta.get(cfg);
  if(wm.el.test(sta))
    {
    sta.appendChild(btn);
    btn.addEventListener('mouseup',wm.vs.toggle.bind(null,cfg,n),false);
    }
  /* init */
  root.appendChild(vs);
  if(!cfg.vs.some(function(v){return (v.n===n);}))
    {
    cfg.vs.push({n:n,txt:txt});
    }
  wm.vs.init(cfg,n);
  wm.vs.toggle(cfg,n);
  wm.sta.dbg(cfg);
  };

wm.vs.init=function(cfg,n)
  {
  var root=_i(cfg.root);
  var id='vs'+n+'-'+cfg.id;
  var el=_i(id); if(!wm.el.test(el)){return false;}
  el.style.width=root.offsetWidth+_u;
  el.style.height=(root.offsetHeight-cfg.fnt.s-cfg.m*2)+_u;
  var bgd=_i(id+'-bgd');
  if(wm.el.test(bgd))
    {
    bgd.style.width=root.offsetWidth+_u;
    bgd.style.height=(root.offsetHeight-cfg.fnt.s-cfg.m*2)+_u;
    }
  var name=_i(id+'-name');
  if(wm.el.test(name))
    {
    name.style.top=(el.offsetHeight-cfg.fnt.s-cfg.m)+_u;
    name.style.width=(el.offsetWidth-cfg.m)+_u;
    }
  };

wm.vs.toggle=function(cfg,n)
  {
  wm.arr.test(cfg.vs).forEach(function(v)
    {
    v.toggle=(v.n===n);
    var id='vs'+v.n+'-'+cfg.id;
    var el=_i(id);
    if(wm.el.test(el)){el.style.zIndex=v.toggle?1:0;}
    var btn=_i(id+'-btn');
    if(wm.el.test(btn))
      {
      var x=v.toggle?wm.img.vs.h:0;
      btn.style.backgroundPosition='-'+x+_u+' 0'+_u;
      }
    });
  wm.ls.save(cfg);
  };

wm.vs.get=function(cfg,n)
  {
  cfg.vs=wm.arr.test(cfg.vs);
  var vs={};
  if(wm.int.test(n)===0)
    {
    cfg.vs.forEach(function(v){if(wm.bool.test(v.toggle)){vs=v;}});
    }
  else
    {
    cfg.vs.forEach(function(v){if(v.n===n){vs=v;}});
    }
  return vs;
  };

wm.vs.ins=function(cfg,n,el)
  {
  n=wm.vs.get(cfg,n).n;
  var vs=_i('vs'+n+'-'+cfg.id+'-bgd');
  if(wm.el.test(vs)){vs.appendChild(el);}
  };
/*----------------------------------------------------------------------------*/
/* TODO: add callback to config (enable refresh button) */
wm.wdw={};

wm.wdw.add=function(cfg,p)
  {
  cfg.wdw=wm.arr.test(cfg.wdw);
  p=wm.obj.test(p);
  var id=wm.str.test(p.id,false);
  if(!id){id='wdw'+wm.id(cfg)+'-'+cfg.id;}
  if(wm.el.test(_i(id))){return id;}
  var vs=wm.int.test(p.vs,wm.vs.get(cfg).n);
  var hdr=wm.bool.test(p.hdr,true);
  var txt=wm.str.test(p.txt,id);
  var m=wm.int.test(p.m);
  var z=null;
  cfg.wdw.forEach(function(v){if(v.id===id){z=v.z;}});
  z=wm.int.test(z,cfg.wdw.length+1);
  var exp=wm.bool.test(p.exp);
  /* window */
  var wdw=_e('div');
  wdw.id=id;
  wdw.style.position='absolute';
  wdw.style.backgroundColor=wm.col.format('bdr');
  wdw.style.overflow='hidden';
  wdw.style.zIndex=z;
  wdw.addEventListener('mousedown',wm.wdw.z.bind(null,cfg,id),false);
  /* header */
  if(hdr){wdw.appendChild(wm.wdw.hdr(cfg,id,txt,exp));}
  /* background */
  var bgd=_e('div');
  bgd.id=id+'-bgd';
  bgd.style.position='absolute';
  bgd.style.left=cfg.b+_u;
  bgd.style.top=(hdr?cfg.fnt.s+cfg.m*2:cfg.b)+_u;
  bgd.style.backgroundColor=wm.col.format('wdw');
  bgd.style.overflow='hidden';
  wdw.appendChild(bgd);
  /* content */
  var con=_e('div');
  con.id=id+'-con';
  con.style.position='absolute';
  con.style.backgroundColor=wm.col.format('wdw');
  con.style.color=wm.col.format('txt');
  con.style.padding=m+_u;
  bgd.appendChild(con);
  /* buttons */
  var btn=wm.btn(id+'-rsz','wdw');
  btn.style.cursor='nwse-resize';
  btn.style.zIndex=1;
  btn.addEventListener('mousedown',wm.wdw.rsz.down.bind(null,cfg,id),false);
  wdw.appendChild(btn);
  /* init */
  var o={x:p.x,y:p.y,w:p.w,h:p.h};
  if(exp)
    {
    p.x=0;
    p.y=0;
    p.w='100%';
    p.h='100%';
    }
  if(!cfg.wdw.some(function(v){return (v.id===p.id);}))
    {
    var nc={id:id,vs:vs,hdr:hdr,txt:txt,z:z,x:p.x,y:p.y,w:p.w,h:p.h,m:m};
    if(exp){nc.exp=true;nc.o=o;}
    cfg.wdw.push(nc);
    wm.ls.save(cfg);
    }
  wm.vs.ins(cfg,vs,wdw);
  wm.wdw.init(cfg,id);
  return id;
  };

wm.wdw.hdr=function(cfg,id,name,exp)
  {
  var hdr=_e('div');
  hdr.id=id+'-hdr';
  hdr.style.position='absolute';
  hdr.style.height=(cfg.fnt.s+cfg.m*2)+_u;
  hdr.style.backgroundColor=wm.col.format('bdr');
  /* title */
  var txt=_e('div');
  txt.id=id+'-txt';
  txt.style.position='absolute';
  txt.style.top=cfg.m+_u;
  txt.style.left=(cfg.m*2+wm.img.btn.h)+_u;
  txt.style.height=cfg.fnt.s+_u;
  txt.style.lineHeight=cfg.fnt.s+_u;
  txt.style.whiteSpace='nowrap';
  txt.style.textOverflow='ellipsis';
  txt.style.overflow='hidden';
  txt.style.cursor='move';
  txt.appendChild(_t(name));
  hdr.appendChild(txt);
  txt.addEventListener('mousedown',wm.wdw.mv.down.bind(null,cfg,id),false);
  /* buttons */
  var btn=wm.btn(id+'-ctx','btn');
  btn.style.top=cfg.m+_u;
  btn.style.left=cfg.m+_u;
  btn.style.cursor='context-menu';
  //btn.addEventListener('mouseup',wm.wdw.ctx.bind(null,cfg,id),false);
  hdr.appendChild(btn);
  btn=wm.btn(id+'-del','btn',1);
  btn.style.top=cfg.m+_u;
  btn.addEventListener('mouseup',wm.wdw.del.bind(null,cfg,id),false);
  hdr.appendChild(btn);
  btn=wm.btn(id+'-exp','btn',exp?3:2);
  btn.style.top=cfg.m+_u;
  btn.addEventListener('mousedown',wm.wdw.exp.down.bind(null,cfg,id),false);
  hdr.appendChild(btn);
  return hdr;
  };

wm.wdw.init=function(cfg,id)
  {
  var wdw=wm.wdw.get(cfg,id);
  var el=_i(id); if(!wm.el.test(el)){return false;}
  var x=wm.size.get(wdw,'x');
  var y=wm.size.get(wdw,'y');
  var w=wm.size.get(wdw,'w');
  var h=wm.size.get(wdw,'h');
  var pw=el.parentNode.offsetWidth;
  var ph=el.parentNode.offsetHeight;
  w=wm.math.clamp(w,wm.img.btn.h*3+cfg.m*2,pw);
  h=wm.math.clamp(h,cfg.fnt.s+cfg.m*2,ph);
  x=wm.math.clamp(x,null,pw-w);
  y=wm.math.clamp(y,null,ph-h);
  el.style.left=((x+w<pw)?x:pw-w)+_u;
  el.style.top=((y+h<ph)?y:ph-h)+_u;
  el.style.width=w+_u;
  el.style.height=h+_u;
  var bgd=_i(id+'-bgd');
  if(wm.el.test(bgd))
    {
    bgd.style.width=(w-cfg.b*2)+_u;
    bgd.style.height=(h-(wdw.hdr?cfg.fnt.s+cfg.m*2:cfg.b)-cfg.b)+_u;
    }
  var btn=_i(id+'-rsz');
  if(wm.el.test(btn))
    {
    btn.style.left=(w-cfg.b-wm.img.wdw.h)+_u;
    btn.style.top=(h-cfg.b-wm.img.wdw.h)+_u;
    }
  if(wdw.hdr)
    {
    var hdr=_i(id+'-hdr');
    if(wm.el.test(hdr)){hdr.style.width=w+_u;}
    var txt=_i(id+'-txt');
    if(wm.el.test(txt))
      {
      txt.style.width=(w-cfg.m*2-3*(wm.img.wdw.h+cfg.m))+_u;
      }
    wm.wdw.dbg(cfg,id);
    btn=_i(id+'-del');
    if(wm.el.test(btn)){btn.style.left=(w-cfg.m-wm.img.wdw.h)+_u;}
    btn=_i(id+'-exp');
    if(wm.el.test(btn)){btn.style.left=(w-(cfg.m+wm.img.wdw.h)*2)+_u;}
    }
  wm.sb.v.init(cfg,id);
  wm.sb.h.init(cfg,id);
  wdw.x=wm.size.set(wdw,x,'x');
  wdw.y=wm.size.set(wdw,y,'y');
  wdw.w=wm.size.set(wdw,w,'w');
  wdw.h=wm.size.set(wdw,h,'h');
  };

wm.wdw.dbg=function(cfg,id)
  {
  var wdw=wm.wdw.get(cfg,id); if(!wdw.hdr){return false;}
  var txt=wdw.txt;
  var el=_i(id);
  if(cfg.dbg&&wm.el.test(el))
    {
    txt+=((id!==txt)?' ('+id+')':'')+' | z:'+wdw.z;
    txt+=' | p:'+el.offsetLeft+'*'+el.offsetTop;
    txt+=' | s:'+el.offsetWidth+'*'+el.offsetHeight;
    }
  el=_i(id+'-txt');
  if(wm.el.test(el)){el.innerText=txt;}
  };

wm.wdw.mv=
  {
  down:function(cfg,id)
    {
    cfg.evt={t:'wdw',a:'mv',id:id};
    wm.wdw.z(cfg,id);
    var box=wm.wdw.box(cfg,id);
    if(!wm.el.test(box)){return false;}
    cfg.mse={x:wm.mse.x-box.offsetLeft,y:wm.mse.y-box.offsetTop};
    },
  up:function(cfg,id)
    {
    var wdw=wm.wdw.get(cfg,id);
    var box=_i('box-'+cfg.id);
    if(wm.el.test(box))
      {
      wdw.x=wm.size.set(wdw,box.offsetLeft,'x');
      wdw.y=wm.size.set(wdw,box.offsetTop,'y');
      wm.wdw.init(cfg,id);
      _r(box);
      }
    },
  move:function(cfg)
    {
    var box=_i('box-'+cfg.id);
    if(wm.el.test(box))
      {
      var pn=box.parentNode;
      var w=pn.offsetWidth-box.offsetWidth;
      var h=pn.offsetHeight-box.offsetHeight;
      var x=wm.math.clamp(wm.mse.x-cfg.mse.x,0,w);
      var y=wm.math.clamp(wm.mse.y-cfg.mse.y,0,h);
      box.style.left=x+_u;
      box.style.top=y+_u;
      }
    }
  };

wm.wdw.rsz=
  {
  down:function(cfg,id)
    {
    cfg.evt={t:'wdw',a:'rsz',id:id};
    var box=wm.wdw.box(cfg,id);
    if(!wm.el.test(box)){return false;}
    cfg.mse={x:wm.mse.x-box.offsetWidth,y:wm.mse.y-box.offsetHeight};
    },
  up:function(cfg,id)
    {
    var wdw=wm.wdw.get(cfg,id);
    var box=_i('box-'+cfg.id);
    if(wm.el.test(box))
      {
      wdw.w=wm.size.set(wdw,box.offsetWidth,'w');
      wdw.h=wm.size.set(wdw,box.offsetHeight,'h');
      wm.wdw.init(cfg,id);
      _r(box);
      }
    },
  move:function(cfg)
    {
    var box=_i('box-'+cfg.id);
    if(wm.el.test(box))
      {
      var pn=box.parentNode;
      var w=pn.offsetWidth-box.offsetLeft;
      var h=pn.offsetHeight-box.offsetTop;
      var x=wm.math.clamp(wm.mse.x-cfg.mse.x,24+wm.img.btn.h*3,w);
      var y=wm.math.clamp(wm.mse.y-cfg.mse.y,cfg.fnt.s+cfg.m*2,h);
      box.style.width=(x-cfg.b*2)+_u;
      box.style.height=(y-cfg.b*2)+_u;
      }
    }
  };

wm.wdw.exp=
  {
  down:function(cfg,id)
    {
    cfg.evt={t:'wdw',a:'exp',id:id};
    wm.wdw.box(cfg,id);
    },
  up:function(cfg,id)
    {
    var wdw=wm.wdw.get(cfg,id);
    wdw.exp=!wm.bool.test(wdw.exp);
    var btn=_i(id+'-exp');
    if(wm.el.test(btn))
      {
      btn.style.backgroundPosition='-'+((wdw.exp?3:2)*wm.img.btn.h)+_u+' 0'+_u;
      }
    if(wdw.exp)
      {
      wdw.o={x:wdw.x,y:wdw.y,w:wdw.w,h:wdw.h};
      wdw.x=0;
      wdw.y=0;
      wdw.w='100%';
      wdw.h='100%';
      }
    else
      {
      var o=wm.obj.test(wdw.o);
      wdw.x=o.x;
      wdw.y=o.y;
      wdw.w=o.w;
      wdw.h=o.h;
      delete wdw.o;
      }
    var box=_i('box-'+cfg.id);
    if(wm.el.test(box)){_r(box);}
    wm.wdw.init(cfg,id);
    }
  };

wm.wdw.del=function(cfg,id)
  {
  var wdw=wm.wdw.get(cfg,id);
  var el=_i(id);
  if(wm.el.test(el))
    {
    el.style.display='none';
    _r(el);
    var n=0;
    var z=wdw.z;
    cfg.wdw.forEach(function(v,i)
      {
      if(v.id===id){n=i;}
      if(v.z>z){v.z-=1;}
      });
    cfg.wdw.splice(n,1);
    wm.ls.save(cfg);
    }
  };

wm.wdw.get=function(cfg,id)
  {
  var wdw={};
  wm.arr.test(cfg.wdw).forEach(function(v){if(v.id===id){wdw=v;}});
  return wdw;
  };

wm.wdw.upd=function(cfg,id,dat)
  {
  var el=_i(id+'-con');
  if(wm.el.test(el))
    {
    el.innerHTML=wm.str.test(dat,'no data');
    setTimeout(function(){wm.wdw.init(cfg,id);},1);
    }
  };

wm.wdw.z=function(cfg,id)
  {
  var z=wm.int.test(wm.wdw.get(cfg,id).z,1);
  wm.arr.test(cfg.wdw).forEach(function(v)
    {
    if(v.z>z){v.z-=1;}
    if(v.id===id){v.z=cfg.wdw.length;}
    var el=_i(v.id); if(wm.el.test(el)){el.style.zIndex=v.z;}
    wm.wdw.dbg(cfg,v.id);
    });
  wm.ls.save(cfg);
  };

wm.wdw.box=function(cfg,id)
  {
  var el=_i(id); if(!wm.el.test(el)){return false;}
  var box=_i('box-'+cfg.id); if(wm.el.test(box)){_r(box);}
  box=_e('div');
  box.id='box-'+cfg.id;
  box.style.position='absolute';
  box.style.left=el.offsetLeft+_u;
  box.style.top=el.offsetTop+_u;
  box.style.width=(el.offsetWidth-cfg.b*2)+_u;
  box.style.height=(el.offsetHeight-cfg.b*2)+_u;
  box.style.borderStyle='solid';
  box.style.borderWidth=cfg.b+_u;
  box.style.borderColor=wm.col.format('sel');
  box.style.cursor='move';
  box.style.zIndex=1024;
  wm.vs.ins(cfg,null,box);
  return box;
  };
/*----------------------------------------------------------------------------*/
wm.sb={};

wm.sb.v=
  {
  upd:function(id,y)
    {
    var bar=_i(id+'-sbv');
    var btn=_i(id+'-sbv-btn');
    var up=_i(id+'-sbv-pgup');
    var dwn=_i(id+'-sbv-pgdown');
    if(wm.el.test(bar)&&wm.el.test(btn)&&wm.el.test(up)&&wm.el.test(dwn))
      {
      y=wm.math.clamp(y,0,bar.offsetHeight-btn.offsetHeight);
      btn.style.top=y+_u;
      up.style.height=y+_u;
      dwn.style.top=(y+btn.offsetHeight)+_u;
      dwn.style.height=(bar.offsetHeight-y-btn.offsetHeight)+_u;
      var con=_i(id+'-con');
      if(wm.el.test(con))
        {
        var r=con.offsetHeight/bar.offsetHeight;
        con.style.top=-wm.int.test(y*r)+_u;
        }
      }
    },
  down:function(cfg,id)
    {
    cfg.evt={t:'sb',a:'v',id:id};
    var btn=_i(id+'-sbv-btn'); if(!wm.el.test(btn)){return false;}
    cfg.mse={x:wm.mse.x-btn.offsetLeft,y:wm.mse.y-btn.offsetTop};
    },
  up:function(cfg,id)
    {
    wm.sb.v.move(cfg,id);
    },
  move:function(cfg,id)
    {
    wm.sb.v.upd(id,wm.mse.y-cfg.mse.y);
    },
  pgup:function(id)
    {
    var btn=_i(id+'-sbv-btn');
    if(!wm.el.test(btn)){return false;}
    wm.sb.v.upd(id,btn.offsetTop-btn.offsetHeight);
    },
  pgdown:function(id)
    {
    var btn=_i(id+'-sbv-btn');
    if(!wm.el.test(btn)){return false;}
    wm.sb.v.upd(id,btn.offsetTop+btn.offsetHeight);
    }
  };

wm.sb.v.init=function(cfg,id)
  {
  var bgd=_i(id+'-bgd');
  var con=_i(id+'-con');
  if(!wm.el.test(con)||!wm.el.test(bgd)){return false;}
  var bar=_i(id+'-sbv'); if(wm.el.test(bar)){_r(bar);}
  if(con.offsetHeight<=bgd.offsetHeight)
    {
    con.style.paddingRight=0+_u;
    return false;
    }
  con.style.paddingRight=(wm.img.wdw.h+cfg.b*2)+_u;
  var t=bgd.offsetHeight-cfg.b*2-wm.img.wdw.h;
  var r=t/con.offsetHeight;
  var h=wm.math.clamp(wm.int.test(t*r),1);
  var y=wm.math.clamp(wm.int.test(Math.abs(con.offsetTop)*r),0,t-h);
  bar=_e('div');
  bar.id=id+'-sbv';
  bar.style.position='absolute';
  bar.style.left=(bgd.offsetWidth-wm.img.wdw.h-cfg.b)+_u;
  bar.style.top=cfg.b+_u;
  bar.style.width=wm.img.wdw.h+_u;
  bar.style.height=t+_u;
  var btn=_e('div');
  btn.id=id+'-sbv-btn';
  btn.style.position='absolute';
  btn.style.width=wm.img.wdw.h+_u;
  btn.style.height=h+_u;
  btn.style.backgroundColor=wm.col.format('bdr');
  btn.style.cursor='ns-resize';
  btn.addEventListener('mousedown',wm.sb.v.down.bind(null,cfg,id),false);
  var up=_e('div');
  up.id=id+'-sbv-pgup';
  up.style.position='absolute';
  up.style.width=wm.img.wdw.h+_u;
  up.style.backgroundColor=wm.col.format('bgd');
  up.style.cursor='pointer';
  up.addEventListener('mousedown',wm.sb.v.pgup.bind(null,id),false);
  var dwn=_e('div');
  dwn.id=id+'-sbv-pgdown';
  dwn.style.position='absolute';
  dwn.style.top=(y+h)+_u;
  dwn.style.width=wm.img.wdw.h+_u;
  dwn.style.backgroundColor=wm.col.format('bgd');
  dwn.style.cursor='pointer';
  dwn.addEventListener('mousedown',wm.sb.v.pgdown.bind(null,id),false);
  bar.appendChild(btn);
  bar.appendChild(up);
  bar.appendChild(dwn);
  bgd.appendChild(bar);
  wm.sb.v.upd(id,y);
  };

wm.sb.h=
  {
  upd:function(id,x)
    {
    var bar=_i(id+'-sbh');
    var btn=_i(id+'-sbh-btn');
    var up=_i(id+'-sbh-pgup');
    var dwn=_i(id+'-sbh-pgdown');
    if(wm.el.test(bar)&&wm.el.test(btn)&&wm.el.test(up)&&wm.el.test(dwn))
      {
      x=wm.math.clamp(x,0,bar.offsetWidth-btn.offsetWidth);
      btn.style.left=x+_u;
      up.style.width=x+_u;
      dwn.style.left=(x+btn.offsetWidth)+_u;
      dwn.style.width=(bar.offsetWidth-x-btn.offsetWidth)+_u;
      var con=_i(id+'-con');
      if(wm.el.test(con))
        {
        var r=con.offsetWidth/bar.offsetWidth;
        con.style.left=-wm.int.test(x*r)+_u;
        }
      }
    },
  down:function(cfg,id)
    {
    cfg.evt={t:'sb',a:'h',id:id};
    var btn=_i(id+'-sbh-btn'); if(!wm.el.test(btn)){return false;}
    cfg.mse={x:wm.mse.x-btn.offsetLeft,y:wm.mse.y-btn.offsetTop};
    },
  up:function(cfg,id)
    {
    wm.sb.h.move(cfg,id);
    },
  move:function(cfg,id)
    {
    wm.sb.h.upd(id,wm.mse.x-cfg.mse.x);
    },
  pgup:function(id)
    {
    var btn=_i(id+'-sbh-btn');
    if(!wm.el.test(btn)){return false;}
    wm.sb.h.upd(id,btn.offsetLeft-btn.offsetWidth);
    },
  pgdown:function(id)
    {
    var btn=_i(id+'-sbh-btn');
    if(!wm.el.test(btn)){return false;}
    wm.sb.h.upd(id,btn.offsetLeft+btn.offsetWidth);
    }
  };

wm.sb.h.init=function(cfg,id)
  {
  var bgd=_i(id+'-bgd');
  var con=_i(id+'-con');
  if(!wm.el.test(con)||!wm.el.test(bgd)){return false;}
  var bar=_i(id+'-sbh'); if(wm.el.test(bar)){_r(bar);}
  if(con.offsetWidth<=bgd.offsetWidth)
    {
    con.style.paddingBottom=0+_u;
    return false;
    }
  con.style.paddingBottom=(wm.img.wdw.h+cfg.b*2)+_u;
  var t=bgd.offsetWidth-cfg.b*2-wm.img.wdw.h;
  var r=t/con.offsetWidth;
  var w=wm.math.clamp(wm.int.test(t*r),1);
  var x=wm.math.clamp(wm.int.test(Math.abs(con.offsetLeft)*r),0,t-w);
  bar=_e('div');
  bar.id=id+'-sbh';
  bar.style.position='absolute';
  bar.style.left=cfg.b+_u;
  bar.style.top=(bgd.offsetHeight-wm.img.wdw.h-cfg.b)+_u;
  bar.style.width=t+_u;
  bar.style.height=wm.img.wdw.h+_u;
  bar.style.backgroundColor='#0f0';
  var btn=_e('div');
  btn.id=id+'-sbh-btn';
  btn.style.position='absolute';
  btn.style.width=w+_u;
  btn.style.height=wm.img.wdw.h+_u;
  btn.style.backgroundColor=wm.col.format('bdr');
  btn.style.cursor='ew-resize';
  btn.addEventListener('mousedown',wm.sb.h.down.bind(null,cfg,id),false);
  var up=_e('div');
  up.id=id+'-sbh-pgup';
  up.style.position='absolute';
  up.style.height=wm.img.wdw.h+_u;
  up.style.backgroundColor=wm.col.format('bgd');
  up.style.cursor='pointer';
  up.addEventListener('mousedown',wm.sb.h.pgup.bind(null,id),false);
  var dwn=_e('div');
  dwn.id=id+'-sbh-pgdown';
  dwn.style.position='absolute';
  dwn.style.left=(x+w)+_u;
  dwn.style.height=wm.img.wdw.h+_u;
  dwn.style.backgroundColor=wm.col.format('bgd');
  dwn.style.cursor='pointer';
  dwn.addEventListener('mousedown',wm.sb.h.pgdown.bind(null,id),false);
  bar.appendChild(btn);
  bar.appendChild(up);
  bar.appendChild(dwn);
  bgd.appendChild(bar);
  wm.sb.h.upd(id,x);
  };
/*----------------------------------------------------------------------------*/
wm.btn=function(id,img,n)
  {
  img=wm.obj.test(wm.img[img]);
  n=wm.int.test(n);
  var el=_e('div');
  el.id=id;
  el.style.backgroundImage='url('+img.url+')';
  el.style.backgroundPosition='-'+(img.h*n)+_u+' 0'+_u;
  el.style.position='absolute';
  el.style.width=img.h+_u;
  el.style.height=img.h+_u;
  el.style.zIndex=1;
  el.style.cursor='pointer';
  return el;
  };
/*----------------------------------------------------------------------------*/
wm.size=
  {
  get:function(obj,o)
    {
    obj=wm.obj.test(obj);
    var el=_i(obj.id); if(!wm.el.test(el)){return 0;}
    o=(/^(x|y|w|h)$/).test(String(o))?o:false; if(!o){return 0;}
    if(!(/%/).test(obj[o]))
      {
      return wm.int.test(obj[o]);
      }
    else
      {
      var pn=el.parentNode;
      var v='offset'+((/x|w/).test(o)?'Width':'Height');
      return wm.int.test(pn[v]/100*wm.nbr.test(obj[o]));
      }
    },
  set:function(obj,n,o)
    {
    obj=wm.obj.test(obj);
    var el=_i(obj.id); if(!wm.el.test(el)){return 0;}
    var pn=el.parentNode;
    o=(/^(x|y|w|h)$/).test(String(o))?o:false; if(!o){return 0;}
    var v='offset'+((/x|w/).test(o)?'Width':'Height');
    if(!(/%/).test(obj[o]))
      {
      n=wm.int.test(n);
      return (n>0)?n:pn[v]+n;
      }
    else
      {
      n=wm.nbr.test(n)/pn[v]*100;
      return ((n!==wm.int.test(n))?n.toFixed(4):wm.int.test(n))+'%';
      }
    }
  };
/*----------------------------------------------------------------------------*/
wm.rsz=function(cfg)
  {
  wm.sta.init(cfg);
  wm.arr.test(cfg.vs).forEach(function(v){wm.vs.init(cfg,v.n);});
  wm.arr.test(cfg.wdw).forEach(function(v){wm.wdw.init(cfg,v.id);});
  };
/*----------------------------------------------------------------------------*/
wm.bool=
  {
  test:function(b,d)
    {
    return (typeof b==='boolean')?b:((typeof d==='boolean')?d:false);
    }
  };

wm.nbr=
  {
  parse:function(n){return Number(String(n).replace(/[^0-9\.\,\-\+]/g,''));},
  test:function(n,d){return wm.nbr.parse((n!==undefined&&n!==null)?n:d);}
  };

wm.int=
  {
  test:function(n,d){return Math.round(wm.nbr.test(n,d));}
  };

wm.str=
  {
  test:function(s,d)
    {
    return (typeof s==='string')?s:((typeof d==='string')?d:'');
    },
  rnd:function(n)
    {
    var s;var l;var str='';var i=0;
    while(i<n)
      {
      if(Math.floor(Math.random()*2))
        {
        s=48;
        l=10;
        }
      else
        {
        s=Math.floor(Math.random()*2)?65:97;
        l=26;
        }
      str+=String.fromCharCode(s+Math.floor(Math.random()*l));
      i+=1;
      }
    return str;
    }
  };

wm.arr=
  {
  test:function(a,d)
    {
    if(typeof a==='object'&&a!==null&&Array.isArray(a)){return a;}
    return (typeof d==='object'&&d!==null&&Array.isArray(d))?d:[];
    },
  isempty:function(a)
    {
    a=wm.arr.test(a);
    return (a.length===0||(a.length===1&&wm.str.test(a[0])===''));
    },
  clone:function(a)
    {
    return wm.arr.test(a).slice();
    }
  };

wm.obj=
  {
  test:function(o,d)
    {
    if(typeof o==='object'&&o!==null&&!Array.isArray(o)){return o;}
    return (typeof d==='object'&&d!==null&&!Array.isArray(d))?d:{};
    },
  isempty:function(o)
    {
    return (Object.getOwnPropertyNames(wm.obj.test(o)).length===0);
    },
  merge:function(o1,o2)
    {
    Object.getOwnPropertyNames(wm.obj.test(o2)).forEach(function(v)
      {
      //if(wm.el.test(o1[v])){return false;}
      if(o2[v]!==undefined&&o2[v]!==null){o1[v]=o2[v];}
      if(!wm.obj.isempty(o2[v])){o1[v]=wm.obj.merge(o1[v],o2[v]);}
      });
    return o1;
    },
  clone:function(o)
    {
    return JSON.parse(JSON.stringify(wm.obj.test(o)));
    }
  };

wm.fn=
  {
  test:function(f){return (typeof f==='function');}
  };

wm.el=
  {
  test:function(o,d)
    {
    if(typeof o==='string'){o=_i(o);}
    if(typeof o==='object'&&o!==null&&o.tagName!==null){return o;}
    if(typeof d==='string'){d=_i(d);}
    return (typeof d==='object'&&d!==null&&d.tagName!==null)?d:false;
    }
  };

wm.math=
  {
  clamp:function(n,min,max)
    {
    n=wm.nbr.test(n);
    min=(min!==undefined&&min!==null)?wm.nbr.test(min):n;
    max=(max!==undefined&&max!==null)?wm.nbr.test(max):n;
    return Math.max(min,Math.min(n,max));
    },
  interpolate:function(a,b,n,i)
    {
    a=wm.nbr.test(a);
    b=wm.nbr.test(b);
    return a+(b-a)/wm.nbr.test(n)*wm.nbr.test(i);
    },
  pi:function(n)
    {
    n=wm.int.test(n,256*256);
    var pi=3;
    var i=0;
    var v=4;
    while(i<n){i+=2;pi+=v/(i*(i+1)*(i+2));v=-v;}
    return pi;
    }
  };

wm.time=
  {
  get:function(){return (new Date()).getTime();}
  };

wm.nav=
  {
  ischrome:(/chrome/i).test(_w.navigator.userAgent),
  isffx:(/firefox/i).test(_w.navigator.userAgent),
  isie:(/msie/i).test(_w.navigator.userAgent),
  css:function()
    {
    if(wm.nav.ischrome){return '-webkit-';}
    if(wm.nav.isffx){return '-moz-';}
    if(wm.nav.isie){return '-ms-';}
    return '';
    }
  };
/*----------------------------------------------------------------------------*/
wm.mse={x:0,y:0};

wm.mse.fn=function(cfg)
  {
  cfg.evt=wm.obj.test(cfg.evt);
  var t=wm.str.test(cfg.evt.t);
  var a=wm.str.test(cfg.evt.a);
  if(wm.obj.isempty(wm[t])){return false;}
  if(wm.obj.isempty(wm[t][a])){return false;}
  if(wm.fn.test(wm[t][a][wm.mse.e])){wm[t][a][wm.mse.e](cfg,cfg.evt.id);}
  };

wm.mse.down=function(e,cfg)
  {
  e=e||_w.event;
  wm.mse.o={x:e.pageX,y:e.pageY};
  wm.mse.e='down';
  wm.mse.fn(cfg);
  wm.sta.dbg(cfg);
  };

wm.mse.up=function(e,cfg)
  {
  e=e||_w.event;
  wm.mse.e='up';
  wm.mse.fn(cfg);
  wm.sta.dbg(cfg);
  delete cfg.evt;
  wm.ls.save(cfg);
  };

wm.mse.move=function(e,cfg)
  {
  e=e||_w.event;
  wm.mse.x=e.pageX;
  wm.mse.y=e.pageY;
  wm.mse.e='move';
  wm.mse.fn(cfg);
  wm.sta.dbg(cfg);
  e.preventDefault();
  };

wm.mse.wheel=function(e)
  {
  e=e||_w.event;
  wm.mse.e='wheel';
  //var delta=e.wheelDelta/180;
  e.preventDefault();
  };
/*----------------------------------------------------------------------------*/
wm.ls={};

wm.ls.test=function()
  {
  if(!wm.nav.isffx&&!wm.nav.isie)
    {
    return (_w.hasOwnProperty('localStorage')&&_ls!==null);
    }
  else
    {
    return (_ls!==undefined);
    }
  };

wm.ls.get=function(cfg)
  {
  if(!wm.ls.test()||!cfg.save){return {};}
  return wm.obj.test(_w.JSON.parse(_ls.getItem(cfg.id)));
  };

wm.ls.save=function(cfg)
  {
  if(wm.ls.test()&&cfg.save){_ls.setItem(cfg.id,_w.JSON.stringify(cfg));}
  };

wm.ls.reset=function(cfg)
  {
  if(!wm.ls.test()){return false;}
  delete _w.localStorage[cfg.id];
  var root=_i(cfg.root);
  if(!wm.el.test(root)){_w.location.reload();}
  var nc=wm.obj.clone(cfg);
  String('n|evt|vs|wdw').split('|').forEach(function(v){delete nc[v];});
  while(root.firstChild){root.removeChild(root.firstChild);}
  wm.init(nc);
  };
/*----------------------------------------------------------------------------*/
wm.col={};

wm.col.list=
  {
  bdr:[0,0,0],
  bgd:[128,128,128],
  wdw:[144,144,144],
  txt:[208,208,208],
  hdr:[248,248,248],
  btn:[64,160,192],
  sel:[192,80,80]
  };

wm.col.format=function(col)
  {
  col=wm.arr.test(wm.col.list[col],[0,0,0]);
  return '#'+col.map(function(v)
    {
    return String('0'+wm.math.clamp(v,0,255).toString(16)).slice(-2);
    }).join('');
  };

wm.col.parse=function(col)
  {
  col=wm.str.test(col,'#000');
  var i=0;var c=[0,0,0];
  if(col.charAt(0)==='#'){col=col.slice(1);}
  if(col.length===3){while(i<3){c[i]=parseInt(col[i]+col[i],16);i+=1;}}
  if(col.length===6){while(i<3){c[i]=parseInt(col.substr(i*2,2),16);i+=1;}}
  return c;
  };
/*----------------------------------------------------------------------------*/
wm.img={};

wm.img.init=function()
  {
  var map=[
  '1111111111111111  6666  1       5       ',
  '1      11      1 666666 11      55      ',
  '1 6 6  11 5555 1666  666 11      55     ',
  '1  6 6 11 5555 166    66  11      55    ',
  '1 6 6  11 5555 166    66  11      55    ',
  '1  6 6 11 5555 1666  666 11      55     ',
  '1      11      1 666666 11      55      ',
  '1111111111111111  6666  1   11115   5555'];
  wm.img.gen(map,'vs');
  map=[
  '11111111 6    6 5555555555555555',
  '11111111666  66655555  55    555',
  '         666666 55555  55    555',
  '11111111  6666  55555  55    555',
  '11111111  6666  55555  55    555',
  '         666666 5      555555555',
  '11111111666  6665      555555555',
  '11111111 6    6 5555555555555555'];
  wm.img.gen(map,'btn');
  map=[
  '       0 0              ',
  '      05050             ',
  '     055050             ',
  '    0555050             ',
  '   05555050             ',
  '  055555050             ',
  ' 0555555050             ',
  '05555555 0              '];
  wm.img.gen(map,'wdw');
  };

wm.img.gen=function(map,name,force)
  {
  map=wm.arr.test(map);
  name=wm.str.test(name);
  if(!wm.bool.test(force)&&!wm.obj.isempty(wm.img[name])){return false;}
  var cvs=_e('canvas');
  cvs.width=wm.str.test(map[0]).length;
  cvs.height=map.length;
  var ctx=cvs.getContext('2d');
  //ctx.imageSmoothingEnabled=false;
  Object.getOwnPropertyNames(wm.obj.test(wm.col.list)).forEach(function(c,i)
    {
    ctx.fillStyle=wm.col.format(c);
    ctx.beginPath();
    map.forEach(function(v,y)
      {
      v.split('').forEach(function(v,x)
        {
        if(v===' '){return false;}
        if(i===wm.int.test(v)){ctx.rect(x,y,1,1);}
        });
      });
    ctx.closePath();
    ctx.fill();
    });
  wm.img[name]=
    {
    url:cvs.toDataURL(),
    w:cvs.width,
    h:cvs.height
    };
  };

wm.icon=function()
  {
  var map=[ /* 16*16 */
  '0000000000000000',
  '0501010000000060',
  '0000000000000000',
  '0111111111111110',
  '0100000000011110',
  '0101044006011110',
  '0100000000000010',
  '0102222222006010',
  '0102332332000010',
  '0102323332022010',
  '0102222225032010',
  '0100000000022010',
  '0111102222225010',
  '0111100000000010',
  '0111111111111110',
  '0000000000000000'];
  wm.img.gen(map,'icon');
  var icon=_e('link');
  icon.rel='icon';
  icon.type='image/png';
  icon.href=wm.img.icon.url;
  _d.head.appendChild(icon);
  };
/*----------------------------------------------------------------------------*/
wm.lint=function(cfg,wdw)
  {
  var xhr=new _w.XMLHttpRequest();
  xhr.open('GET',_i('code').src+'?v='+wm.str.rnd(32),true);
  xhr.setRequestHeader('Content-Type','application/javascript');
  xhr.onreadystatechange=function()
    {
    if(xhr.readyState===4&&xhr.status===200)
      {
      var lint=jslint(xhr.responseText);
      var err=wm.arr.test(lint.warnings);
      var n=err.length;
      var txt=n+' error'+((n>0)?'s':'')+' found '+((n===0)?'\\:D/':':(');
      txt+=(n>0?'<br><br>':'');
      txt+='<table cellpadding="0" cellspacing="0">';
      err.forEach(function(v)
        {
        txt+='<tr><td>[</td>';
        txt+='<td align="right">'+(v.line+1)+',&nbsp;</td>';
        txt+='<td align="right">'+v.column+']&nbsp;</td>';
        txt+='<td style="white-space:nowrap">'+v.message+'</td></tr>';
        });
      txt+='</table>';
      wm.wdw.upd(cfg,wdw,txt);
      }
    };
  xhr.send();
  };

return wm;
}());
