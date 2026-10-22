(function(){
'use strict';
var URL_BASE='https://zedwounhjhfiuystjfhr.supabase.co', KEY='sb_publishable_f6tVXoTs5YKs5guQWe16Jg_hPMoDjGo', db, user, items=[];
var $=function(id){return document.getElementById(id)};
function msg(id,t,bad){var e=$(id);if(e){e.textContent=t||'';e.className='portal-msg'+(bad?' portal-error':t?' portal-success':'')}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function url(s){try{var u=new URL(s);return /^https?:$/.test(u.protocol)?u.href:''}catch(e){return ''}}
function link(t,s){var u=url(s);return u?'<a target="_blank" rel="noopener noreferrer" href="'+esc(u)+'">'+t+'</a>':''}
var labels={planning:'Planning',in_progress:'In progress',review:'In review',ready:'Ready',live:'Live',paused:'Paused'};
function card(p,editable){var h='<article class="portal-project" data-id="'+esc(p.id)+'"><div class="portal-project-head"><div><h3>'+esc(p.name)+'</h3><p class="portal-muted">'+esc(p.description||'No milestone details yet.')+'</p></div><span class="portal-pill">'+esc(labels[p.status]||p.status)+'</span></div><div class="portal-links">'+link('Open preview ↗',p.preview_url)+link('Open live website ↗',p.live_url)+'</div>';
if(editable)h+='<div class="portal-divider"></div><label class="portal-label">Status</label><select class="portal-select" data-status>'+Object.keys(labels).map(function(s){return '<option value="'+s+'"'+(p.status===s?' selected':'')+'>'+labels[s]+'</option>'}).join('')+'</select><label class="portal-label">Milestone / description</label><textarea class="portal-area" data-desc>'+esc(p.description||'')+'</textarea><label class="portal-label">Preview URL</label><input class="portal-input" data-preview value="'+esc(p.preview_url||'')+'"><label class="portal-label">Live URL</label><input class="portal-input" data-live value="'+esc(p.live_url||'')+'"><div class="portal-actions"><button type="button" class="portal-btn" data-save>Save updates</button></div><p class="portal-msg" data-msg role="status"></p>';
return h+'</article>'}
function show(session){user=session&&session.user||null;$('portal-auth').hidden=!!user;$('portal-client').hidden=!user;if(user){$('portal-user-id').textContent=user.id;$('portal-account').textContent=user.email||'';$('portal-greeting').textContent='Hello'+(user.user_metadata&&user.user_metadata.full_name?' '+user.user_metadata.full_name:'')+'.'}}
async function load(){
var meta=user.user_metadata||{}, name=meta.full_name||'', biz=meta.business_name||'';
// Staff and client records are independent: one login may have both roles.
var p=await db.from('client_profiles').select('full_name,business_name').eq('user_id',user.id).maybeSingle();
if(p.error)throw p.error;
name=p.data&&p.data.full_name||name;
biz=p.data&&p.data.business_name||biz;
if(!p.data){
var up=await db.from('client_profiles').upsert({user_id:user.id,full_name:name||null,business_name:biz||null},{onConflict:'user_id'});
if(up.error)throw up.error;
}
$('portal-greeting').textContent='Hello'+(name?' '+name:'')+'.';
if(biz)$('portal-account').textContent=user.email+' · '+biz;
// The client view is always limited to assigned projects, even for staff accounts.
var m=await db.from('client_project_members').select('project_id').eq('user_id',user.id);
if(m.error)throw m.error;
var ids=m.data.map(function(x){return x.project_id});
if(!ids.length)items=[];
else{var c=await db.from('client_projects').select('*').in('id',ids).order('updated_at',{ascending:false});if(c.error)throw c.error;items=c.data}
$('portal-project-list').innerHTML=items.length?items.map(function(x){return card(x,false)}).join(''):'<div class="portal-empty">No project has been assigned yet. Your project will appear here once Revanta links it to your account.</div>';

}
function err(e){var s=e&&e.message||'Something went wrong.';if(/invalid login credentials/i.test(s))return 'Email or password is incorrect.';if(/email not confirmed/i.test(s))return 'Email confirmation is still enabled in Supabase. The portal owner needs to disable Confirm email for this testing phase.';if(/user already registered|already been registered|email.*already.*(exist|register)|duplicate/i.test(s))return 'An account with this email already exists. Please sign in instead.';return s}
var signupMode=false;
function setMode(signup){signupMode=!!signup;$('portal-signin-form').hidden=signupMode;$('portal-signup-section').hidden=!signupMode;$('portal-auth-title').textContent=signupMode?'Create your client account':'Sign in';$('portal-auth-copy').textContent=signupMode?'Create an account to get started. Your projects remain private until Revanta assigns them.':'Sign in with your email ID and password to view your Revanta projects.';$('portal-auth-toggle-copy').textContent=signupMode?'Already have an account?':'Don’t have an account yet?';$('portal-auth-toggle').textContent=signupMode?'Sign in':'Create account';msg('portal-signin-message','',false);msg('portal-signup-message','',false);$('portal-name').disabled=!signupMode;$('portal-business').disabled=!signupMode;$('portal-signup-email').disabled=!signupMode;$('portal-signup-password').disabled=!signupMode;$('portal-name').required=signupMode;$('portal-business').required=signupMode;$('portal-signup-email').required=signupMode;$('portal-signup-password').required=signupMode}
function bindAuthToggle(){var b=$('portal-auth-toggle');if(!b||b.dataset.authToggleBound==='true')return;b.dataset.authToggleBound='true';b.addEventListener('click',function(e){e.preventDefault();var section=$('portal-signup-section');setMode(!!(section&&section.hidden))})}
function init(){if(!window.supabase){msg('portal-signin-message','Portal library did not load. Refresh and try again.',true);return}db=window.supabase.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
$('portal-signup-form').onsubmit=async function(e){e.preventDefault();var b=$('portal-signup-submit');b.disabled=true;msg('portal-signup-message','Creating account…',false);try{var res=await db.auth.signUp({email:$('portal-signup-email').value.trim().toLowerCase(),password:$('portal-signup-password').value,options:{data:{full_name:$('portal-name').value.trim(),business_name:$('portal-business').value.trim()}}});if(res.error)throw res.error;if(!res.data.user)throw new Error('Supabase did not return a user for this signup. Please try again.');if(!res.data.session){msg('portal-signup-message','Signup request received, but email confirmation is required before you can enter the portal. Check your inbox (and spam folder) for a confirmation email. You can stay on this form; it will not send you back to Sign in.',true);return}show(res.data);msg('portal-client-message','Account created. Loading your workspace…',false);try{await load()}catch(loadError){msg('portal-client-message','Your account was created and you are signed in, but the workspace could not load: '+err(loadError),true)}}catch(e){msg('portal-signup-message',err(e),true)}finally{b.disabled=false}};
$('portal-signin-form').onsubmit=async function(e){e.preventDefault();var b=$('portal-signin-submit');b.disabled=true;msg('portal-signin-message','Signing in…',false);try{var res=await db.auth.signInWithPassword({email:$('portal-signin-email').value.trim().toLowerCase(),password:$('portal-signin-password').value});if(res.error)throw res.error;show(res.data);msg('portal-client-message','Loading your workspace…',false);try{await load()}catch(loadError){msg('portal-client-message','You are signed in, but your workspace could not load: '+err(loadError),true)}}catch(e){msg('portal-signin-message',err(e),true)}finally{b.disabled=false}};
async function signout(){await db.auth.signOut();show(null);setMode(false)}$('portal-signout').onclick=signout;$('portal-staff-signout').onclick=signout;
$('portal-copy-id').onclick=async function(){try{await navigator.clipboard.writeText(user.id);msg('portal-client-message','Account ID copied.',false)}catch(e){msg('portal-client-message','Select and copy the account ID shown above.',true)}};
var s=await db.auth.getSession();if(s.error){msg('portal-signin-message',err(s.error),true);return}if(s.data.session){show(s.data.session);try{await load()}catch(e){msg('portal-client-message',err(e),true)}}
}
function loadLibrary(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=init;s.onerror=function(){msg('portal-signin-message','Could not load the sign-in library. Check your connection and refresh the page.',true);msg('portal-signup-message','Could not load the sign-in library. Check your connection and refresh the page.',true)};document.head.appendChild(s)}
function boot(){bindAuthToggle();setMode(false);loadLibrary()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else{boot()}
})();