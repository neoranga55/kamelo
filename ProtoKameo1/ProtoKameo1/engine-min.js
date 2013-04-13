
﻿
EngineClass=Class.extend({player0:null,entities:[],factory:{},_deferredKill:[],sprites_loaded:0,flyes_alive:0,max_flyes_alive:15,last_fly_created:0,total_fly_counter:0,cheer_up_goal:4,scrore_frames:0,instructions_canvas:null,bar_canvas:null,setup:function(){this.instructions_canvas=document.createElement("canvas");this.instructions_canvas.width=canvas.width;this.instructions_canvas.height=canvas.height;var instructions_context=this.instructions_canvas.getContext('2d');instructions_context.font='bold 70pt '+game_font;instructions_context.fillStyle='rgba(0, 155, 0, 1)';instructions_context.textAlign='center';instructions_context.fillText('Move with ← left and right →',canvas.width/2,(canvas.height/2)-120);instructions_context.fillStyle='rgba(255, 155, 0, 1)';instructions_context.fillText('Mouse click to catch flies',canvas.width/2,(canvas.height/2));instructions_context.fillStyle='rgba(255, 0, 0, 1)';instructions_context.fillText('Prevent Kame from starving',canvas.width/2,(canvas.height/2)+120);instructions_context.fillStyle='rgba(200, 0, 0, 1)';instructions_context.font='bold 15pt '+game_font;instructions_context.fillText('Made with Love By Sebastian Lobato Genco & Jose Carlos Tapiador Carretero',canvas.width/2,(canvas.height/2)+420);this.bar_canvas=document.createElement("canvas");var ctx=this.bar_canvas.getContext("2d");ctx.fillStyle="#EE0000";ctx.fillRect(0,0,100,20);sound_atmos.play('atmos');sound_atmos_active=true;gInput.setup();this.player0=gEngine.spawnEntity("Player",250,680);this.player0.spritename='kami-walk-00';},spawnEntity:function(typename,x,y){var entityClass=gEngine.factory[typename];var ent=new(entityClass)(x,y);gEngine.entities.push(ent);return ent;},endGame:function(){end=true;game_music.fadeOut(0.0,5000,null);sound_atmos.fadeOut(0.0,5000,null);kami_death.fadeOut(0.0,5000,null);},activateMusic:function(){sound_atmos.fadeOut(0.0,4000,function(){sound_atmos_active=false;});game_music.stop();game_music.fadeIn(0.6,0,function(){game_music_active=true;});},activateAtmosMusic:function(){game_music.fadeOut(0.0,4000,function(){game_music_active=false;});sound_atmos.stop();sound_atmos.fadeIn(0.1,2000,function(){sound_atmos_active=true;});},updateBackground:function(){sun_angle+=0.001;},drawBackground:function(){if(this.sprites_loaded==1){this.sprites_loaded=2;var tree_context=document.getElementById('TreeCanvas').getContext('2d');drawSprite('tree.png',1100,420,0,tree_context);}
dynamic_background_context.clearRect(0,0,dynamic_background_canvas.width,dynamic_background_canvas.height);drawSprite('sol.png',1420,170,sun_angle,dynamic_background_context);if(this.scrore_frames>0){dynamic_background_context.font='bold 500pt '+game_font;var points_color=Math.round(this.player0.points*255/end_of_game_points);dynamic_background_context.fillStyle='rgba('+points_color+',0,'+(255-points_color)+',1)';dynamic_background_context.textAlign='center';dynamic_background_context.fillText(this.player0.points,canvas.width/2,canvas.height/2+200);this.scrore_frames=(this.scrore_frames+1)%(FPS+2);if(victory){this.scrore_frames=(FPS+1);}}},update:function(){if((introFrame>=introSeconds*FPS)&&play_game_intro){play_game_intro=false;}
if((this.flyes_alive<this.max_flyes_alive)&&!play_game_intro){var flyID=Math.floor(Math.random()*3);var seconds=(new Date()).getTime()/1000;if((flyID>0)&&(seconds-this.last_fly_created>2)){var new_pos={x:Math.floor(Math.random()*1600),y:Math.floor(Math.random()*700)};var entFly=gEngine.spawnEntity("Fly",new_pos.x,new_pos.y);entFly.spritename='fly-00'+flyID;entFly.count_id=++this.total_fly_counter;entFly.speed=Math.floor(Math.random()*500)+50;entFly.zindex+=Math.floor(Math.random()*20);if(new_pos.x%11==0){entFly.evil=true;}
this.last_fly_created=seconds;this.flyes_alive++;launchBubbleSound();launchFlySound();}}
for(var i=0;i<gEngine.entities.length;i++){var ent=gEngine.entities[i];if(!ent._killed){ent.update();}else{gEngine._deferredKill.push(ent);if(ent.id=="Fly"){this.flyes_alive--;}}}
gEngine.updatePhysics();for(var j=0;j<gEngine._deferredKill.length;j++){gEngine.entities.erase(gEngine._deferredKill[j]);}
gEngine._deferredKill=[];},updatePhysics:function(){if(typeof gPhysicsEngine!=='undefined'){gPhysicsEngine.update();}
for(var i=0;i<gEngine.entities.length;i++){var ent=gEngine.entities[i];if(ent.physBody){if(ent.id=="Fly"){ent.pos=ent.physBody.GetPosition();if((ent.angle!='undetermined')&&(ent.angle!=null)){ent.angle=ent.physBody.GetAngle();}}else if(ent.id=="Player"){ent.physBody.SetPosition(new Vec2(ent.pos.x,ent.pos.y));}}
if((ent.id=="Fly")&&(!this.player0.miss_in_da_face)&&!victory&&(this.player0.tongue_frame==max_tongue_frames-1)&&!this.player0.dead){if(ent.updateCatch(this.player0.tong_fire_pos.x,this.player0.tong_fire_pos.y)){if(ent.evil){launchBurpSound();console.log("Ate a posioned fly!!!");if(this.player0.health>190){this.player0.health-=100;}else if(this.player0.health>130){this.player0.health-=50;}else{this.player0.health=80;}
this.player0.special_color={red:-15,green:-15,blue:-220};}else{launchDrySlapSound();this.player0.points++;if(cheating){this.player0.points+=end_of_game_points;}
this.player0.volatile_points++;if(this.player0.health<255){this.player0.health+=30;if((this.player0.special_color.red!=0)&&(this.player0.health>160)){this.player0.special_color={red:0,green:0,blue:0};}}
console.log("Points:"+this.player0.points);if((this.player0.points>=this.cheer_up_goal)||(this.player0.points>=end_of_game_points)){launchSound('cheer');this.cheer_up_goal+=Math.round(this.cheer_up_goal*0.4);this.scrore_frames=1;if(this.player0.points>=end_of_game_points){victory=true;createFirework();}}}}}}},draw:function(){context.clearRect(0,0,canvas.width,canvas.height);player_context.clearRect(0,0,canvas.width,canvas.height);var fudgeVariance=128;var zIndex_array=[];var entities_bucketed_by_zIndex={};gEngine.entities.forEach(function(entity){if(entity.pos.x<=canvas.width+(entity.size.width/2)&&entity.pos.x>=-(entity.size.width/2)&&entity.pos.y>=-(entity.size.height/2)&&entity.pos.y<=canvas.height+(entity.size.height/2)){if(!entities_bucketed_by_zIndex[entity.zindex]){entities_bucketed_by_zIndex[entity.zindex]=[];}
entities_bucketed_by_zIndex[entity.zindex].push(entity);if(!zIndex_array[entity.zindex]){zIndex_array[entity.zindex]=entity.zindex;}}});zIndex_array.forEach(function(zindex){entities_bucketed_by_zIndex[zindex].forEach(function(entity){entity.draw();});});if(victory||end){context.fillStyle="rgba(0, 0, 0, 0.4)";context.fillRect(0,0,canvas.width,canvas.height);}},});var animateBackground=function(){setTimeout(function(){if(!end){gEngine.updateBackground();gEngine.drawBackground();}
requestAnimationFrame(animateBackground);},1000/(FPS/2));};var animate=function(){setTimeout(function(){if(!end){if(background_loaded){gEngine.update();gEngine.draw();if(play_game_intro){introFrame++;drawLoadingScreen();}}}else{dynamic_background_context.font='bold 220pt '+game_font;dynamic_background_context.fillStyle='rgba(0, 50, 255, 1)';dynamic_background_context.textAlign='center';dynamic_background_context.fillText('The End',canvas.width/2,canvas.height/2);}
requestAnimationFrame(animate);},1000/FPS);};var drawLoadingScreen=function(){var external_r=20000-(introFrame*introFrame*2);var grd=player_context.createRadialGradient(1420,170,200-introFrame,1420,170,external_r);var opacity=1.05-(introFrame/(introSeconds*FPS));grd.addColorStop(1,'transparent');grd.addColorStop(0,'rgba(250,250,120,'+opacity+')');player_context.fillStyle=grd;player_context.fillRect(0,0,canvas.width,canvas.height);if(introFrame<=FPS*4){player_context.drawImage(gEngine.instructions_canvas,0,0,canvas.width,canvas.height,0,0,canvas.width,canvas.height);if(!background_loaded){for(var i=0;i<loading_bars;i++){player_context.drawImage(gEngine.bar_canvas,0,0,100,20,canvas.width/2-300+(200*i),(canvas.height/2)+300,100,20);}}}
if(!background_loaded){window.setTimeout(function(){if(!background_loaded){loading_bars++;drawLoadingScreen();}},500);}};var getSprite=function(spritename){for(var sheetName in gSpriteSheets){var sheet=gSpriteSheets[sheetName];var sprite=sheet.getStats(spritename);if(sprite===null){continue;}
return sprite;}
return null;};var drawSprite=function(spritename,posX,posY,angle,draw_context){for(var sheetName in gSpriteSheets){var sheet=gSpriteSheets[sheetName];var sprite=sheet.getStats(spritename);if(sprite===null){continue;}
__drawSpriteInternal(sprite,sheet,posX,posY,angle,draw_context);return;}};var __drawSpriteInternal=function(spt,sheet,posX,posY,angle,draw_context){if(spt===null||sheet===null){return;}
var hlf={x:spt.cx,y:spt.cy};if((typeof draw_context==='undefined')||(draw_context==null)){draw_context=context;}
if((typeof flipped==='undefined')||(flipped==null)){flipped=false;}
if((typeof angle!=='undefined')&&(angle!=null)){draw_context.translate(posX,posY);draw_context.rotate(angle);if(spt.canvasCache!=null){draw_context.drawImage(spt.canvasCache,0,0,spt.w,spt.h,hlf.x,hlf.y,spt.w,spt.h);}else{draw_context.drawImage(sheet.img,spt.x,spt.y,spt.w,spt.h,hlf.x,hlf.y,spt.w,spt.h);}
draw_context.rotate(-angle);draw_context.translate(-posX,-posY);}else{if(spt.canvasCache!=null){draw_context.drawImage(spt.canvasCache,0,0,spt.w,spt.h,posX+hlf.x,posY+hlf.y,spt.w,spt.h);}else{draw_context.drawImage(sheet.img,spt.x,spt.y,spt.w,spt.h,posX+hlf.x,posY+hlf.y,spt.w,spt.h);}}};var gEngine=new EngineClass();console.log("Engine loaded!");