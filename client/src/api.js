export async function api(path, options={}){
  const response=await fetch(path,{headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
  let data;
  try{data=await response.json();}catch{data={success:false,message:"Invalid server response"};}
  if(!response.ok || data.success===false) throw new Error(data.message||`Request failed (${response.status})`);
  return data;
}