const menuToggle=document.querySelector(".menu-toggle");
const nav=document.querySelector(".nav-links");
menuToggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.setAttribute("aria-label",open?"Close navigation":"Open navigation")});
nav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuToggle?.setAttribute("aria-expanded","false")}));
document.querySelector("#year").textContent=new Date().getFullYear();

const dateInput=document.querySelector('input[name="preferredDate"]');
const timeSelect=document.querySelector('select[name="preferredTime"]');
const form=document.querySelector("#appointment-form");
const statusBox=document.querySelector("#form-status");
const submitButton=form.querySelector("button[type=submit]");
const timeHelp=document.querySelector("#time-help");
const clinicTimeZone="Asia/Kolkata";

function clinicDateParts(date=new Date()){
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:clinicTimeZone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
  const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return {year:Number(values.year),month:Number(values.month),day:Number(values.day),iso:values.year+"-"+values.month+"-"+values.day};
}
function addDays(iso,days){
  const [year,month,day]=iso.split("-").map(Number);
  return new Date(Date.UTC(year,month-1,day+days)).toISOString().slice(0,10);
}
function weekday(iso){
  const [year,month,day]=iso.split("-").map(Number);
  return new Date(Date.UTC(year,month-1,day)).getUTCDay();
}
function localMinutesNow(){
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:clinicTimeZone,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
  const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return Number(values.hour)*60+Number(values.minute);
}
function slotLabel(value){
  const [hour,minute]=value.split(":").map(Number);
  const suffix=hour>=12?"PM":"AM";
  const displayHour=hour%12||12;
  return displayHour+":"+String(minute).padStart(2,"0")+" "+suffix;
}
function buildSlots(){
  const slots=[];
  for(let minutes=9*60;minutes<=16*60+40;minutes+=20){
    slots.push(String(Math.floor(minutes/60)).padStart(2,"0")+":"+String(minutes%60).padStart(2,"0"));
  }
  return slots;
}
const allSlots=buildSlots();
function resetTimeOptions(message="Choose a date first"){
  timeSelect.replaceChildren(new Option(message,""));
  timeSelect.disabled=true;
}
function setDateLimits(){
  const today=clinicDateParts().iso;
  dateInput.min=today;
  dateInput.max=addDays(today,14);
  if(dateInput.value&&(dateInput.value<dateInput.min||dateInput.value>dateInput.max)){
    dateInput.value="";
    resetTimeOptions();
  }
}
setDateLimits();

document.querySelectorAll("[data-service]").forEach(link=>link.addEventListener("click",()=>{
  const select=document.querySelector('select[name="service"]');
  const option=[...select.options].find(item=>item.textContent===link.dataset.service);
  if(option)select.value=option.value;
}));

dateInput.addEventListener("change",async()=>{
  statusBox.className="form-status";
  statusBox.textContent="";
  const date=dateInput.value;
  resetTimeOptions();
  if(!date)return;
  const today=clinicDateParts().iso;
  if(date<today||date>addDays(today,14)){
    dateInput.value="";
    statusBox.className="form-status show error";
    statusBox.textContent="Please choose a date within the next 14 days.";
    return;
  }
  if([0,6].includes(weekday(date))){
    dateInput.value="";
    statusBox.className="form-status show error";
    statusBox.textContent="Appointments are available Monday through Friday only. Please choose a weekday.";
    return;
  }
  timeSelect.replaceChildren(new Option("Loading available times…",""));
  try{
    const response=await fetch("/api/appointments-availability?date="+encodeURIComponent(date),{headers:{"Accept":"application/json"},cache:"no-store"});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||"Could not load available times.");
    const available=new Set(data.availableTimes||[]);
    timeSelect.replaceChildren(new Option("Choose an available time",""));
    for(const slot of allSlots){
      const option=new Option(slotLabel(slot),slot);
      option.disabled=!available.has(slot);
      if(option.disabled)option.textContent=slotLabel(slot)+" — unavailable";
      timeSelect.add(option);
    }
    timeSelect.disabled=available.size===0;
    if(!available.size){
      timeSelect.replaceChildren(new Option("No times available on this date",""));
      timeSelect.disabled=true;
      timeHelp.textContent="Please select another weekday.";
    }else{
      timeHelp.textContent="Times are shown in the clinic's local time. Bookings are in 20-minute intervals.";
    }
  }catch(error){
    resetTimeOptions("Unable to load times");
    statusBox.className="form-status show error";
    statusBox.textContent=error.message||"Could not load available times. Please try again.";
  }
});

form.addEventListener("submit",async event=>{
  event.preventDefault();
  statusBox.className="form-status";
  statusBox.textContent="";
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form).entries());
  if(data.privacyConsent!=="on"){
    statusBox.className="form-status show error";
    statusBox.textContent="Please agree to the privacy note to continue.";
    return;
  }
  delete data.privacyConsent;
  submitButton.disabled=true;
  submitButton.querySelector(".submit-label").textContent="Booking slot…";
  try{
    const response=await fetch("/api/appointments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||"We couldn't send your request right now. Please try again.");
    statusBox.className="form-status show success";
    statusBox.textContent="Your appointment request has been received for "+dateInput.value+" at "+timeSelect.options[timeSelect.selectedIndex].text+". The clinic will contact you to confirm.";
    form.reset();
    setDateLimits();
    resetTimeOptions();
  }catch(error){
    statusBox.className="form-status show error";
    statusBox.textContent=error.message||"Something went wrong. Please try again later.";
    if(dateInput.value)dateInput.dispatchEvent(new Event("change"));
  }finally{
    submitButton.disabled=false;
    submitButton.querySelector(".submit-label").textContent="Send appointment request";
  }
});
